"use client";

import { useEffect, useSyncExternalStore, type RefObject } from "react";

/** Calls `onOutside` on a pointer press or focus move outside `ref`. */
export function useClickOutside<T extends HTMLElement>(
  ref: RefObject<T | null>,
  onOutside: () => void,
  active = true,
): void {
  useEffect(() => {
    if (!active) return;

    const handler = (event: MouseEvent | TouchEvent | FocusEvent) => {
      const node = ref.current;
      if (!node) return;
      if (event.target instanceof Node && !node.contains(event.target)) {
        onOutside();
      }
    };

    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    document.addEventListener("focusin", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
      document.removeEventListener("focusin", handler);
    };
  }, [ref, onOutside, active]);
}

/** Runs `onEscape` when Escape is pressed while `active`. */
export function useEscapeKey(onEscape: () => void, active = true): void {
  useEffect(() => {
    if (!active) return;

    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") onEscape();
    };

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onEscape, active]);
}

/** Subscribes to a CSS media query without a hydration mismatch. */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onStoreChange) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", onStoreChange);
      return () => media.removeEventListener("change", onStoreChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** Locks page scroll while a modal is open. */
export function useScrollLock(active: boolean): void {
  useEffect(() => {
    if (!active) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [active]);
}
