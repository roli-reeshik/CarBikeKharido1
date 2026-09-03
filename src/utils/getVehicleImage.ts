/**
 * Image resolver for CarBikeKharido.com.
 *
 * API Ninjas (RapidAPI) returns technical rows only — never photographs.
 * This helper is the single place UI code asks “what picture do I show?”
 *
 *   Tier 1 — curated HD map (local Wikimedia files we verified and downloaded)
 *   Tier 2 — IMAGIN.studio CDN for nameplates we have not curated
 *   Tier 3 — guaranteed local fallback so next/image never 404s
 *
 * We do not scrape OEM / CarDekho press kits. Those files are copyrighted.
 */
import { carPhotos } from "@/lib/vehiclePhotos.generated";
import type { CarPhoto } from "@/lib/types";

export type ImageTier = 1 | 2 | 3;

export interface VehicleImageQuery {
  slug?: string;
  make?: string;
  brand?: string;
  model?: string;
  /** IMAGIN angle 01–32, or a short token like "23". */
  angle?: string;
}

export interface ResolvedVehicleImage {
  src: string;
  width: number;
  height: number;
  alt: string;
  tier: ImageTier;
  source: "curated" | "imagin" | "fallback";
  title: string;
}

const IMAGIN_BASE = "https://cdn.imagin.studio/getimage";
const IMAGIN_EVAL_KEY = "hrjavascript-ninja";

/** Last-resort local file — always present, never a remote 404. */
export const FALLBACK_VEHICLE_IMAGE = "/vehicles/tata-nexon-1.jpg";

/**
 * Slug aliases so callers can pass "nexon", "thar", or the full catalogue id.
 */
const SLUG_ALIASES: Record<string, string> = {
  nexon: "tata-nexon",
  "tata nexon": "tata-nexon",
  fronx: "maruti-fronx",
  "maruti fronx": "maruti-fronx",
  "suzuki fronx": "maruti-fronx",
  creta: "hyundai-creta",
  "hyundai creta": "hyundai-creta",
  "xuv-3xo": "mahindra-xuv-3xo",
  "xuv 3xo": "mahindra-xuv-3xo",
  "xuv3xo": "mahindra-xuv-3xo",
  thar: "mahindra-thar",
  "mahindra thar": "mahindra-thar",
  "panigale": "ducati-panigale-v4",
  "panigale-v4": "ducati-panigale-v4",
  "ducati panigale": "ducati-panigale-v4",
  "classic-350": "royal-enfield-classic-350",
  "classic 350": "royal-enfield-classic-350",
  iqube: "tvs-iqube",
  "tvs iqube": "tvs-iqube",
  "s1": "ola-s1",
  "ola s1": "ola-s1",
  "ola-s1-pro": "ola-s1",
  ertiga: "maruti-ertiga",
  "maruti ertiga": "maruti-ertiga",
  "suzuki ertiga": "maruti-ertiga",
  punch: "tata-punch-ev",
  "punch ev": "tata-punch-ev",
  "tata punch": "tata-punch-ev",
  "tata-punch": "tata-punch-ev",
};

/**
 * Tier 1 lead frames. Paths are local files in `public/vehicles/` so the
 * homepage and cards never depend on a remote CDN being up.
 */
const CURATED_LEAD: Record<string, { src: string; width: number; height: number; title: string }> =
  {
    "tata-nexon": {
      src: "/vehicles/tata-nexon-1.jpg",
      width: 1600,
      height: 900,
      title: "Tata Nexon — front three-quarter",
    },
    "maruti-fronx": {
      src: "/vehicles/maruti-fronx-1.jpg",
      width: 1600,
      height: 757,
      title: "Maruti Suzuki Fronx — studio / street front",
    },
    "hyundai-creta": {
      src: "/vehicles/hyundai-creta-1.png",
      width: 1600,
      height: 960,
      title: "Hyundai Creta — India studio front",
    },
    "mahindra-xuv-3xo": {
      src: "/vehicles/mahindra-xuv-3xo-1.jpg",
      width: 1600,
      height: 788,
      title: "Mahindra XUV 3XO — front three-quarter",
    },
    "mahindra-thar": {
      src: "/vehicles/mahindra-thar-1.jpg",
      width: 1600,
      height: 900,
      title: "Mahindra Thar — outdoor three-quarter",
    },
    "ducati-panigale-v4": {
      src: "/vehicles/ducati-panigale-v4-1.jpg",
      width: 1600,
      height: 900,
      title: "Ducati Panigale V4 — racing red",
    },
    "royal-enfield-classic-350": {
      src: "/vehicles/royal-enfield-classic-350-1.jpg",
      width: 1600,
      height: 1068,
      title: "Royal Enfield Classic 350 — three-quarter",
    },
    "tvs-iqube": {
      src: "/vehicles/tvs-iqube-1.jpg",
      width: 1600,
      height: 2133,
      title: "TVS iQube — electric scooter",
    },
    "ola-s1": {
      src: "/vehicles/ola-s1-1.jpg",
      width: 1600,
      height: 900,
      title: "Ola S1 — electric scooter",
    },
    "tata-punch-ev": {
      src: "/vehicles/tata-punch-ev-1.png",
      width: 1600,
      height: 900,
      title: "Tata Punch EV — compact electric SUV",
    },
    "maruti-ertiga": {
      src: "/vehicles/maruti-ertiga-1.jpg",
      width: 1600,
      height: 900,
      title: "Maruti Suzuki Ertiga — seven-seat MPV",
    },
  };

function imaginCustomer(): string {
  return (
    process.env.NEXT_PUBLIC_IMAGIN_API_KEY?.trim() ||
    process.env.NEXT_PUBLIC_IMAGIN_CUSTOMER_KEY?.trim() ||
    IMAGIN_EVAL_KEY
  );
}

export function normaliseVehicleSlug(raw: string | undefined): string {
  if (!raw) return "";
  const key = raw.trim().toLowerCase().replace(/[_]+/g, "-");
  return SLUG_ALIASES[key] ?? key.replace(/\s+/g, "-");
}

function slugFromParts(query: VehicleImageQuery): string {
  if (query.slug) return normaliseVehicleSlug(query.slug);
  const brand = (query.brand ?? query.make ?? "").trim();
  const model = (query.model ?? "").trim();
  if (brand && model) {
    const joined = `${brand} ${model}`.toLowerCase();
    return SLUG_ALIASES[joined] ?? normaliseVehicleSlug(`${brand}-${model}`);
  }
  return normaliseVehicleSlug(model || brand);
}

/**
 * Industry-standard IMAGIN.studio URL builder (Tier 2).
 * Always returns a URL — the CDN's safeMode serves a neutral render on a miss
 * instead of a 404.
 */
export const generateImaginImageUrl = (
  make: string,
  model: string,
  angle?: string,
): string => {
  const url = new URL(IMAGIN_BASE);
  url.searchParams.append("customer", imaginCustomer());
  url.searchParams.append("make", make.toLowerCase().replace(/\s+/g, "-"));
  url.searchParams.append(
    "modelFamily",
    (model.split(" ")[0] || model).toLowerCase().replace(/\s+/g, "-"),
  );
  url.searchParams.append("zoomType", "fullscreen");
  url.searchParams.append("width", "1600");
  url.searchParams.append("fileType", "png");
  url.searchParams.append("safeMode", "true");
  if (angle) url.searchParams.append("angle", angle);
  return url.toString();
};

function curatedLead(slug: string): ResolvedVehicleImage | null {
  const lead = CURATED_LEAD[slug];
  if (!lead) return null;
  const fromBundle = carPhotos[slug]?.[0];
  return {
    src: fromBundle?.src ?? lead.src,
    width: fromBundle?.width ?? lead.width,
    height: fromBundle?.height ?? lead.height,
    alt: lead.title,
    tier: 1,
    source: "curated",
    title: fromBundle?.title ?? lead.title,
  };
}

function imaginFrame(query: VehicleImageQuery, slug: string): ResolvedVehicleImage {
  const make = query.make ?? query.brand ?? slug.split("-")[0] ?? "car";
  const model =
    query.model ??
    slug.replace(new RegExp(`^${make.toLowerCase().replace(/\s+/g, "-")}-`), "") ??
    slug;
  return {
    src: generateImaginImageUrl(make, model, query.angle),
    width: 1600,
    height: 900,
    alt: `${make} ${model}`.trim(),
    tier: 2,
    source: "imagin",
    title: "IMAGIN.studio render",
  };
}

function fallbackFrame(alt: string): ResolvedVehicleImage {
  return {
    src: FALLBACK_VEHICLE_IMAGE,
    width: 1600,
    height: 900,
    alt,
    tier: 3,
    source: "fallback",
    title: "Fallback vehicle photograph",
  };
}

/**
 * Resolve a single display image. Never returns an empty src.
 */
export function getVehicleImage(
  input: VehicleImageQuery | string,
): ResolvedVehicleImage {
  const query: VehicleImageQuery = typeof input === "string" ? { slug: input } : input;
  const slug = slugFromParts(query);
  const curated = curatedLead(slug);
  if (curated) return curated;

  const make = query.make ?? query.brand;
  const model = query.model;
  if (make && model) return imaginFrame(query, slug);

  return fallbackFrame(slug || "Vehicle");
}

/** Convenience helper for `next/image` `src` props. */
export function getVehicleImageSrc(input: VehicleImageQuery | string): string {
  return getVehicleImage(input).src;
}

/**
 * Full gallery for a slug: curated Commons set first, then a single IMAGIN
 * frame when we have make/model and no local files.
 */
export function getVehicleGallery(
  input: VehicleImageQuery | string,
): ResolvedVehicleImage[] {
  const query: VehicleImageQuery = typeof input === "string" ? { slug: input } : input;
  const slug = slugFromParts(query);
  const bundled = carPhotos[slug] ?? [];
  if (bundled.length > 0) {
    return bundled.map((photo) => ({
      src: photo.src,
      width: photo.width,
      height: photo.height,
      alt: photo.title,
      tier: 1 as const,
      source: "curated" as const,
      title: photo.title,
    }));
  }

  const lead = getVehicleImage(query);
  return [lead];
}

/** Shape expected by CarImage, CarGallery, and PhotoCredit. */
export function toCarPhotos(input: VehicleImageQuery | string): CarPhoto[] {
  const query: VehicleImageQuery = typeof input === "string" ? { slug: input } : input;
  const slug = slugFromParts(query);
  if (carPhotos[slug]?.length) return carPhotos[slug];

  const frames = getVehicleGallery(query);
  return frames.map((frame) => ({
    src: frame.src,
    width: frame.width,
    height: frame.height,
    title: frame.title,
    author: frame.source === "imagin" ? "IMAGIN.studio" : "CarBikeKharido",
    licence:
      frame.source === "imagin"
        ? "Licensed (IMAGIN.studio)"
        : "See photo credit on the page",
    licenceUrl: frame.source === "imagin" ? "https://www.imagin.studio" : "",
    sourceUrl: frame.src,
  }));
}
