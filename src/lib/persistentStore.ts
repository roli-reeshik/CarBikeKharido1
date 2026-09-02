"use client";

import { useCallback, useSyncExternalStore } from "react";

const listeners = new Map<string, Set<() => void>>();

function listenersFor(key: string): Set<() => void> {
  let set = listeners.get(key);
  if (!set) {
    set = new Set();
    listeners.set(key, set);
  }
  return set;
}

function emit(key: string): void {
  listenersFor(key).forEach((listener) => listener());
}

function readValue(key: string, fallback: string): string {
  try {
    return window.localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}

/**
 * False during SSR and the hydrating client render, true on the next microtask.
 * That extra tick is how we read localStorage without a markup mismatch.
 */
let hydrated = false;
const hydrateListeners = new Set<() => void>();

function subscribeHydrate(onStoreChange: () => void): () => void {
  hydrateListeners.add(onStoreChange);
  if (!hydrated && typeof window !== "undefined") {
    queueMicrotask(() => {
      if (hydrated) return;
      hydrated = true;
      hydrateListeners.forEach((listener) => listener());
    });
  }
  return () => {
    hydrateListeners.delete(onStoreChange);
  };
}

export function useHydrated(): boolean {
  return useSyncExternalStore(subscribeHydrate, () => hydrated, () => false);
}

/**
 * `localStorage`-backed state. The first paint always uses `fallback` so it
 * matches the server; the stored value is applied on the following microtask.
 */
export function usePersistentString(
  key: string,
  fallback: string,
): [string, (next: string) => void] {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const set = listenersFor(key);
      set.add(onStoreChange);

      const onStorage = (event: StorageEvent) => {
        if (event.key === key) onStoreChange();
      };
      window.addEventListener("storage", onStorage);

      return () => {
        set.delete(onStoreChange);
        window.removeEventListener("storage", onStorage);
      };
    },
    [key],
  );

  const getSnapshot = useCallback(
    () => (hydrated ? readValue(key, fallback) : fallback),
    [key, fallback],
  );
  const getServerSnapshot = useCallback(() => fallback, [fallback]);

  const stored = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const ready = useHydrated();
  const value = ready ? stored : fallback;

  const setValue = useCallback(
    (next: string) => {
      try {
        window.localStorage.setItem(key, next);
      } catch {
        // Private browsing or a full quota — fall through to the in-memory notify.
      }
      emit(key);
    },
    [key],
  );

  return [value, setValue];
}
