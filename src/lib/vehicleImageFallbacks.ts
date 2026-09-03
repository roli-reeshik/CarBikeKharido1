/**
 * High-definition Unsplash fallbacks for vehicle photography.
 *
 * Local files in `public/vehicles/` are the preferred source. When a path is
 * missing on the deployment (404 / zero-byte), `VehicleImage` swaps to one of
 * these curated CDN frames so cards and carousels never render a broken image.
 */

const Q = "auto=format&fit=crop&w=1920&q=80";

function unsplash(photoId: string): string {
  return `https://images.unsplash.com/${photoId}?${Q}`;
}

/** Body-type defaults used when a model is not in the curated map. */
export const BODY_TYPE_FALLBACKS = {
  suv: unsplash("photo-1533473359331-0135ef1b58bf"),
  sedan: unsplash("photo-1549317661-bd32c8ce0db2"),
  ev: unsplash("photo-1593941707882-a5bba14938c7"),
  "commuter-bike": unsplash("photo-1558981806-ec527fa84c39"),
  superbike: unsplash("photo-1568772585407-9361f9bf3a87"),
  mpv: unsplash("photo-1464219789935-c2d9d9aba644"),
  scooter: unsplash("photo-1619767886558-efdc259cde1a"),
  "off-road": unsplash("photo-1606611013016-969c19ba27bb"),
} as const;

export type BodyTypeFallbackKey = keyof typeof BODY_TYPE_FALLBACKS;

/**
 * Direct model → HD automotive stills. Keys are catalogue slugs (and short
 * aliases resolved in `resolveVehicleImageFallback`).
 */
export const MODEL_IMAGE_FALLBACKS: Record<string, string> = {
  "mahindra-xuv-3xo": unsplash("photo-1533473359331-0135ef1b58bf"),
  "mahindra-thar": unsplash("photo-1606611013016-969c19ba27bb"),
  "tata-punch-ev": unsplash("photo-1617788138017-80ad40651399"),
  "maruti-ertiga": unsplash("photo-1464219789935-c2d9d9aba644"),
  "royal-enfield-classic-350": unsplash("photo-1558981806-ec527fa84c39"),
  "tvs-iqube": unsplash("photo-1619767886558-efdc259cde1a"),
  "ola-s1": unsplash("photo-1558618666-fcd25c85cd64"),
  "ducati-panigale-v4": unsplash("photo-1568772585407-9361f9bf3a87"),
};

const SLUG_ALIASES: Record<string, string> = {
  "xuv-3xo": "mahindra-xuv-3xo",
  "xuv 3xo": "mahindra-xuv-3xo",
  xuv3xo: "mahindra-xuv-3xo",
  thar: "mahindra-thar",
  "thar roxx": "mahindra-thar",
  "mahindra thar": "mahindra-thar",
  punch: "tata-punch-ev",
  "punch ev": "tata-punch-ev",
  "tata punch": "tata-punch-ev",
  "tata-punch": "tata-punch-ev",
  ertiga: "maruti-ertiga",
  "maruti ertiga": "maruti-ertiga",
  "suzuki ertiga": "maruti-ertiga",
  "classic-350": "royal-enfield-classic-350",
  "classic 350": "royal-enfield-classic-350",
  iqube: "tvs-iqube",
  "tvs iqube": "tvs-iqube",
  "s1": "ola-s1",
  "ola s1": "ola-s1",
  "ola-s1-pro": "ola-s1",
  panigale: "ducati-panigale-v4",
  "panigale-v4": "ducati-panigale-v4",
  "ducati panigale": "ducati-panigale-v4",
};

export function normaliseFallbackSlug(raw: string | undefined): string {
  if (!raw) return "";
  const key = raw.trim().toLowerCase().replace(/[_]+/g, "-").replace(/\s+/g, " ");
  const dashed = key.replace(/\s+/g, "-");
  return SLUG_ALIASES[key] ?? SLUG_ALIASES[dashed] ?? dashed;
}

export function inferBodyTypeFallbackKey(
  bodyType?: string,
  category?: string,
): BodyTypeFallbackKey {
  const haystack = `${bodyType ?? ""} ${category ?? ""}`.toLowerCase();

  if (/(super\s*bike|sportbike|track\s*bike)/.test(haystack)) return "superbike";
  if (/(scooter|iqube|s1)/.test(haystack)) return "scooter";
  if (/(cruiser|commuter|motorcycle|bike|two[- ]wheeler)/.test(haystack)) {
    return "commuter-bike";
  }
  if (/(off[- ]road|4x4|thar)/.test(haystack)) return "off-road";
  if (/(mpv|7[- ]?seat|people\s*carrier|minivan)/.test(haystack)) return "mpv";
  if (/(electric|ev\b|battery)/.test(haystack)) return "ev";
  if (/(sedan|saloon)/.test(haystack)) return "sedan";
  if (category?.toUpperCase() === "BIKE") return "commuter-bike";

  return "suv";
}

export function resolveVehicleImageFallback(input?: {
  slug?: string;
  category?: string;
  bodyType?: string;
}): string {
  const slug = normaliseFallbackSlug(input?.slug);
  if (slug && MODEL_IMAGE_FALLBACKS[slug]) {
    return MODEL_IMAGE_FALLBACKS[slug];
  }

  const key = inferBodyTypeFallbackKey(input?.bodyType, input?.category);
  return BODY_TYPE_FALLBACKS[key];
}
