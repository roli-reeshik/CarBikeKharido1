/**
 * Shared fetch helper for the vendor adapters.
 *
 * Every provider call is best-effort: if a key is missing, the vendor is down,
 * or the payload has an unexpected shape, the adapter returns `null` and the
 * caller falls back to bundled sample data. A pricing page that renders slightly
 * stale numbers is far better than one that 500s.
 */

export interface FetchJsonOptions {
  headers?: Record<string, string>;
  /** Seconds to cache the response for. Defaults to one hour. */
  revalidate?: number;
  timeoutMs?: number;
}

export async function fetchJson<T>(
  url: string,
  { headers = {}, revalidate = 3600, timeoutMs = 8000 }: FetchJsonOptions = {},
): Promise<T | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      headers: { Accept: "application/json", ...headers },
      signal: controller.signal,
      ...(process.env.NEXT_RUNTIME
        ? { next: { revalidate } }
        : { cache: "no-store" as RequestCache }),
    });

    if (!response.ok) {
      const snippet = (await response.text()).slice(0, 180).replace(/\s+/g, " ");
      warnOnce(url, `HTTP ${response.status}${snippet ? `: ${snippet}` : ""}`);
      return null;
    }

    return (await response.json()) as T;
  } catch (error) {
    const reason = error instanceof Error ? error.message : "unknown error";
    warnOnce(url, reason);
    return null;
  } finally {
    clearTimeout(timer);
  }
}

const warned = new Set<string>();

/**
 * Logs a provider failure once per endpoint per process, so a misconfigured or
 * unavailable vendor does not flood the server log on every request.
 */
function warnOnce(url: string, reason: string) {
  const key = `${new URL(url).origin}${new URL(url).pathname}`;
  if (warned.has(key)) return;
  warned.add(key);
  console.warn(`[providers] ${key} unavailable (${reason}); using fallback data.`);
}

/** Reads the first present key from an object, tolerating vendor naming drift. */
export function pick<T>(
  source: Record<string, unknown> | null | undefined,
  keys: string[],
): T | undefined {
  if (!source) return undefined;
  for (const key of keys) {
    const value = source[key];
    if (value !== undefined && value !== null && value !== "") return value as T;
  }
  return undefined;
}

/** Coerces vendor numerics, which arrive as both numbers and "₹8,49,000". */
export function toNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const digits = value.replace(/[^0-9.]/g, "");
    if (!digits) return undefined;
    const parsed = Number.parseFloat(digits);
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
}
