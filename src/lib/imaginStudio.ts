/**
 * IMAGIN.studio image CDN adapter.
 *
 * IMAGIN generates photoreal vehicle renders on demand from a make/model/paint
 * combination, which is how the 360° configurator shows a car in the exact
 * colour a buyer picked without us shooting or storing 32 photos per shade.
 *
 * Access is by `customer` key. Without one the whole module degrades: every
 * builder returns null and the UI falls back to the OEM press-kit gallery in
 * `public/vehicles/`. Set IMAGIN_CUSTOMER_KEY to enable.
 *
 * IMAGIN publishes a demo key (`hrjavascript-mastery`) that is rate-limited and
 * watermark-free for evaluation only. Do not ship it to production.
 */

/** IMAGIN renders a full rotation as 32 discrete angles, numbered 01 to 32. */
export const TOTAL_ANGLES = 32;

/** The angle that reads best as a hero: front three-quarter, nearside. */
export const HERO_ANGLE = 23;

const BASE_URL =
  process.env.NEXT_PUBLIC_IMAGIN_BASE_URL?.trim() ??
  "https://cdn.imagin.studio/getimage";

/**
 * Exposed to the browser because the 360° viewer builds URLs as the user drags;
 * round-tripping to the server for each frame would make the spin stutter.
 * IMAGIN keys are domain-locked on their side, which is what protects them.
 */
const customerKey =
  process.env.NEXT_PUBLIC_IMAGIN_CUSTOMER_KEY?.trim() ||
  process.env.NEXT_PUBLIC_IMAGIN_API_KEY?.trim();

export const isImaginEnabled = (): boolean => Boolean(customerKey);

export interface ImaginParams {
  make: string;
  model: string;
  /** IMAGIN paint id, e.g. "pspc0071". Falls back to a generic shade if absent. */
  paintCode?: string | null;
  /** 1-32. Values outside the range wrap, so dragging past the end continues. */
  angle?: number;
  /** Renders on a transparent background for compositing over page chrome. */
  transparent?: boolean;
  /** Output width in pixels; IMAGIN scales the render server-side. */
  width?: number;
  /** Model year, when the body shape changed and the default would be wrong. */
  modelYear?: number;
}

/** Wraps into 1..32 so a continuous drag rotates the vehicle indefinitely. */
export function normaliseAngle(angle: number): number {
  const wrapped = ((Math.round(angle) - 1) % TOTAL_ANGLES + TOTAL_ANGLES) % TOTAL_ANGLES;
  return wrapped + 1;
}

/**
 * Builds a CDN URL for one frame. Returns null when no key is configured, which
 * is the signal for callers to use their fallback imagery.
 */
export function buildImaginUrl({
  make,
  model,
  paintCode,
  angle = HERO_ANGLE,
  transparent = true,
  width = 1200,
  modelYear,
}: ImaginParams): string | null {
  if (!customerKey) return null;

  const params = new URLSearchParams({
    customer: customerKey,
    make: make.toLowerCase().replace(/\s+/g, "-"),
    modelFamily: model.toLowerCase().replace(/\s+/g, "-"),
    angle: String(normaliseAngle(angle)).padStart(2, "0"),
    width: String(width),
    // PNG is required for an alpha channel; JPEG would composite onto white.
    fileType: transparent ? "png" : "jpg",
    zoomType: "fullscreen",
    // Returns a neutral render instead of a 404 when a paint code is unknown.
    safeMode: "true",
  });

  if (paintCode) params.set("paintId", paintCode);
  if (modelYear) params.set("modelYear", String(modelYear));
  if (transparent) params.set("billingTag", "transparent");

  return `${BASE_URL}?${params}`;
}

/** Every frame of a full rotation, for preloading the spin. */
export function buildRotationUrls(
  params: Omit<ImaginParams, "angle">,
): string[] | null {
  if (!customerKey) return null;

  return Array.from({ length: TOTAL_ANGLES }, (_, index) =>
    buildImaginUrl({ ...params, angle: index + 1 }),
  ).filter((url): url is string => url !== null);
}
