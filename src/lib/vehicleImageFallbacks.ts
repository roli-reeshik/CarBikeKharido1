/**
 * Vehicle image fallbacks for CarBikeKharido.com.
 *
 * Primary source: local `.webp` files in `public/vehicles/`.
 * Secondary source: curated Unsplash CDN stills.
 *
 * When a vehicle image fails (404 / zero-byte), `VehicleImage` resolves a
 * fallback in this order:
 *   1. Direct model → local webp match
 *   2. Body-type / category → local webp of a known model in that category
 *   3. Unsplash CDN still for the body type
 */

const Q = "auto=format&fit=crop&w=1920&q=80";

function unsplash(photoId: string): string {
  return `https://images.unsplash.com/${photoId}?${Q}`;
}

// ---------------------------------------------------------------------------
// Category-aware LOCAL webp fallbacks
// ---------------------------------------------------------------------------

export const CATEGORY_FALLBACK_WEBP: Record<string, string> = {
  suv: "/vehicles/hyundai-creta.webp",
  sedan: "/vehicles/hyundai-verna.webp",
  hatchback: "/vehicles/maruti-swift.webp",
  electric: "/vehicles/tata-punch-ev.webp",
  commercial: "/vehicles/hyundai-prime-hb.webp",
  taxi: "/vehicles/hyundai-prime-hb.webp",
  bike: "/vehicles/royal-enfield-classic-350.webp",
  cruiser: "/vehicles/royal-enfield-classic-350.webp",
  scooter: "/vehicles/tvs-iqube.webp",
  superbike: "/vehicles/ducati-panigale-v4.webp",
  "sport bike": "/vehicles/tvs-apache-rtr.webp",
  mpv: "/vehicles/maruti-ertiga.webp",
  "off-road": "/vehicles/mahindra-thar.webp",
  crossover: "/vehicles/maruti-fronx.webp",
};

// ---------------------------------------------------------------------------
// Unsplash CDN fallbacks (ultimate fallback when local webp also fails)
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Direct model → webp map
// ---------------------------------------------------------------------------

export const MODEL_IMAGE_WEBP: Record<string, string> = {
  // Hyundai
  "hyundai-alcazar": "/vehicles/hyundai-alcazar.webp",
  "hyundai-creta": "/vehicles/hyundai-creta.webp",
  "hyundai-exter": "/vehicles/hyundai-exter.webp",
  "hyundai-verna": "/vehicles/hyundai-verna.webp",
  "hyundai-aura": "/vehicles/hyundai-aura.webp",
  "hyundai-i20": "/vehicles/hyundai-i20.webp",
  "hyundai-grand-i10-nios": "/vehicles/hyundai-grand-i10-nios.webp",
  "hyundai-ioniq-5": "/vehicles/hyundai-ioniq-5.webp",
  "hyundai-prime-hb": "/vehicles/hyundai-prime-hb.webp",
  // Tata
  "tata-nexon": "/vehicles/tata-nexon.webp",
  "tata-punch": "/vehicles/tata-punch.webp",
  "tata-harrier": "/vehicles/tata-harrier.webp",
  "tata-safari": "/vehicles/tata-safari.webp",
  "tata-curvv": "/vehicles/tata-curvv.webp",
  "tata-tigor": "/vehicles/tata-tigor.webp",
  "tata-tiago": "/vehicles/tata-tiago.webp",
  "tata-punch-ev": "/vehicles/tata-punch-ev.webp",
  "tata-nexon-ev": "/vehicles/tata-nexon-ev.webp",
  // Maruti Suzuki
  "maruti-brezza": "/vehicles/maruti-brezza.webp",
  "maruti-grand-vitara": "/vehicles/maruti-grand-vitara.webp",
  "maruti-fronx": "/vehicles/maruti-fronx.webp",
  "maruti-dzire": "/vehicles/maruti-dzire.webp",
  "maruti-ciaz": "/vehicles/maruti-ciaz.webp",
  "maruti-swift": "/vehicles/maruti-swift.webp",
  "maruti-baleno": "/vehicles/maruti-baleno.webp",
  "maruti-ertiga": "/vehicles/maruti-ertiga.webp",
  // Mahindra
  "mahindra-thar": "/vehicles/mahindra-thar.webp",
  "mahindra-scorpio-n": "/vehicles/mahindra-scorpio-n.webp",
  "mahindra-xuv-3xo": "/vehicles/mahindra-xuv-3xo.webp",
  "mahindra-xuv700": "/vehicles/mahindra-xuv700.webp",
  // Bikes
  "royal-enfield-classic-350": "/vehicles/royal-enfield-classic-350.webp",
  "royal-enfield-hunter-350": "/vehicles/royal-enfield-hunter-350.webp",
  "tvs-iqube": "/vehicles/tvs-iqube.webp",
  "tvs-apache-rtr": "/vehicles/tvs-apache-rtr.webp",
  "ola-s1": "/vehicles/ola-s1.webp",
  "ducati-panigale-v4": "/vehicles/ducati-panigale-v4.webp",
};

/**
 * Legacy Unsplash model fallbacks — used when local webp is not available.
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

// ---------------------------------------------------------------------------
// Slug normalisation & aliases
// ---------------------------------------------------------------------------

const SLUG_ALIASES: Record<string, string> = {
  "xuv-3xo": "mahindra-xuv-3xo",
  "xuv 3xo": "mahindra-xuv-3xo",
  xuv3xo: "mahindra-xuv-3xo",
  xuv700: "mahindra-xuv700",
  "xuv-700": "mahindra-xuv700",
  "scorpio-n": "mahindra-scorpio-n",
  "scorpio n": "mahindra-scorpio-n",
  thar: "mahindra-thar",
  "thar roxx": "mahindra-thar",
  "mahindra thar": "mahindra-thar",
  punch: "tata-punch",
  "punch ev": "tata-punch-ev",
  "tata punch": "tata-punch",
  "tata-punch": "tata-punch",
  "nexon ev": "tata-nexon-ev",
  "tata-nexon-ev": "tata-nexon-ev",
  ertiga: "maruti-ertiga",
  "maruti ertiga": "maruti-ertiga",
  "suzuki ertiga": "maruti-ertiga",
  brezza: "maruti-brezza",
  "maruti brezza": "maruti-brezza",
  swift: "maruti-swift",
  baleno: "maruti-baleno",
  dzire: "maruti-dzire",
  ciaz: "maruti-ciaz",
  "grand vitara": "maruti-grand-vitara",
  fronx: "maruti-fronx",
  alcazar: "hyundai-alcazar",
  creta: "hyundai-creta",
  exter: "hyundai-exter",
  verna: "hyundai-verna",
  aura: "hyundai-aura",
  i20: "hyundai-i20",
  "grand i10 nios": "hyundai-grand-i10-nios",
  "ioniq 5": "hyundai-ioniq-5",
  "prime hb": "hyundai-prime-hb",
  harrier: "tata-harrier",
  safari: "tata-safari",
  curvv: "tata-curvv",
  tigor: "tata-tigor",
  tiago: "tata-tiago",
  "classic-350": "royal-enfield-classic-350",
  "classic 350": "royal-enfield-classic-350",
  "hunter-350": "royal-enfield-hunter-350",
  "hunter 350": "royal-enfield-hunter-350",
  iqube: "tvs-iqube",
  "tvs iqube": "tvs-iqube",
  "apache rtr": "tvs-apache-rtr",
  "tvs apache": "tvs-apache-rtr",
  s1: "ola-s1",
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
  if (/(cruiser|commuter|motorcycle|bike|two[- ]wheeler)/.test(haystack)) return "commuter-bike";
  if (/(off[- ]road|4x4|thar)/.test(haystack)) return "off-road";
  if (/(mpv|7[- ]?seat|people\s*carrier|minivan)/.test(haystack)) return "mpv";
  if (/(electric|ev\b|battery)/.test(haystack)) return "ev";
  if (/(sedan|saloon|compact sedan)/.test(haystack)) return "sedan";
  if (category?.toUpperCase() === "BIKE") return "commuter-bike";

  return "suv";
}

/**
 * Infer a category key from body type / category strings for local webp lookup.
 */
function inferCategoryWebpKey(bodyType?: string, category?: string): string {
  const haystack = `${bodyType ?? ""} ${category ?? ""}`.toLowerCase();

  if (/(super\s*bike|sportbike|track)/.test(haystack)) return "superbike";
  if (/(sport\s*bike|apache|rtr)/.test(haystack)) return "sport bike";
  if (/(scooter|iqube|s1)/.test(haystack)) return "scooter";
  if (/(cruiser|commuter|motorcycle|bike|two[- ]wheeler)/.test(haystack)) return "bike";
  if (/(taxi|commercial)/.test(haystack)) return "commercial";
  if (/(off[- ]road|4x4|thar)/.test(haystack)) return "off-road";
  if (/(mpv|7[- ]?seat|minivan)/.test(haystack)) return "mpv";
  if (/(electric|ev\b|battery)/.test(haystack)) return "electric";
  if (/(sedan|saloon)/.test(haystack)) return "sedan";
  if (/(hatchback|hatch)/.test(haystack)) return "hatchback";
  if (/(crossover)/.test(haystack)) return "crossover";
  if (category?.toUpperCase() === "BIKE") return "bike";

  return "suv";
}

/**
 * Resolve a fallback image for a vehicle. Prefers local `.webp` files, falls
 * back to Unsplash CDN stills.
 */
export function resolveVehicleImageFallback(input?: {
  slug?: string;
  category?: string;
  bodyType?: string;
}): string {
  const slug = normaliseFallbackSlug(input?.slug);

  // 1. Direct model → local webp
  if (slug && MODEL_IMAGE_WEBP[slug]) {
    return MODEL_IMAGE_WEBP[slug];
  }

  // 2. Category → local webp
  const catKey = inferCategoryWebpKey(input?.bodyType, input?.category);
  if (CATEGORY_FALLBACK_WEBP[catKey]) {
    return CATEGORY_FALLBACK_WEBP[catKey];
  }

  // 3. Direct model → Unsplash
  if (slug && MODEL_IMAGE_FALLBACKS[slug]) {
    return MODEL_IMAGE_FALLBACKS[slug];
  }

  // 4. Body type → Unsplash
  const key = inferBodyTypeFallbackKey(input?.bodyType, input?.category);
  return BODY_TYPE_FALLBACKS[key];
}
