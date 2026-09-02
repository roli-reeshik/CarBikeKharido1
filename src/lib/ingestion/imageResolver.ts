/**
 * Picks the best photograph for a catalogue vehicle.
 *
 * Order (first hit wins):
 *   1. Live Wikimedia Commons, when it has a newer model-year than the bundle
 *   2. Bundled Wikimedia files in `public/vehicles/` (refreshed by `npm run fetch:photos`)
 *   3. Catalogue / database image rows
 *   4. EVOX (licensed, North America — usually misses Indian models)
 *   5. IMAGIN.studio render, when a customer key is set
 *
 * API Ninjas has no images. RapidAPI is never consulted here.
 */
import { fetchEvoxPhotos } from "@/lib/providers/evox";
import { isEvoxEnabled } from "@/lib/providers/config";
import { buildImaginUrl } from "@/lib/imaginStudio";
import type { VehicleWithRelations } from "@/lib/catalogue/types";
import type { CarPhoto, DataSource } from "@/lib/types";
import { carPhotos } from "@/lib/vehiclePhotos.generated";

export interface ResolvedVehicleMedia {
  photos: CarPhoto[];
  source: DataSource;
}

const COMMONS_API = "https://commons.wikimedia.org/w/api.php";
const UA =
  "CarBikeKharido/1.0 (https://carbikekharido.com; rkrajesh.pgi@gmail.com)";

function fromCatalogueImages(vehicle: VehicleWithRelations): CarPhoto[] {
  return vehicle.images.map((image, index) => ({
    src: image.url,
    width: 1600,
    height: 900,
    title: image.caption ?? `${vehicle.name} ${index + 1}`,
    author: "Catalogue",
    licence: image.url.startsWith("/vehicles/")
      ? "See photo credit on the page"
      : "Catalogue",
    licenceUrl: "",
    sourceUrl: image.url,
  }));
}

interface CommonsPage {
  title?: string;
  imageinfo?: Array<{
    mime?: string;
    width?: number;
    height?: number;
    thumburl?: string;
    url?: string;
    thumbwidth?: number;
    thumbheight?: number;
    descriptionurl?: string;
    extmetadata?: Record<string, { value?: string }>;
  }>;
}

function stripHtml(value: string | undefined): string {
  return String(value ?? "")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

async function searchCommons(vehicle: VehicleWithRelations): Promise<CarPhoto[]> {
  const query = `${vehicle.brand} ${vehicle.name}`;
  const url = `${COMMONS_API}?${new URLSearchParams({
    action: "query",
    generator: "search",
    gsrsearch: `${query} filetype:bitmap`,
    gsrnamespace: "6",
    gsrlimit: "6",
    prop: "imageinfo",
    iiprop: "url|extmetadata|size|mime",
    iiurlwidth: "1600",
    format: "json",
    formatversion: "2",
  })}`;

  try {
    const response = await fetch(url, {
      headers: { "User-Agent": UA, Accept: "application/json" },
      next: { revalidate: 60 * 60 * 24 },
    });
    if (!response.ok) return [];
    const json = (await response.json()) as { query?: { pages?: CommonsPage[] } };
    const pages = json.query?.pages ?? [];
    const token = vehicle.name.split(" ").pop()?.toLowerCase() ?? "";
    const avoid = vehicle.slug.includes("nexon")
      ? ["nexon ev", "ev "]
      : vehicle.slug.includes("creta")
        ? ["ix25", "solaris", "moscow"]
        : vehicle.slug.includes("classic")
          ? ["2010", "head light", "speedometer", "meteor", "bullet"]
          : [];

    return pages.flatMap((page) => {
      const info = page.imageinfo?.[0];
      if (!info) return [];
      if (!/^image\/(jpeg|png|webp)$/i.test(info.mime ?? "")) return [];
      if ((info.width ?? 0) < 800) return [];
      const title = (page.title ?? "").toLowerCase();
      if (avoid.some((needle) => title.includes(needle))) return [];
      if (token && !title.includes(token.replace(/[^a-z0-9]/g, ""))) {
        // Still accept if the distinctive model token appears with a space.
        if (token && !title.includes(token)) return [];
      }
      const src = (info.thumburl ?? info.url ?? "").split("?")[0];
      if (!src) return [];
      const meta = info.extmetadata ?? {};
      return [
        {
          src,
          width: info.thumbwidth ?? info.width ?? 1600,
          height: info.thumbheight ?? info.height ?? 900,
          title: (page.title ?? "").replace(/^File:/i, ""),
          author: stripHtml(meta.Artist?.value) || "Unknown",
          licence: stripHtml(meta.LicenseShortName?.value) || "CC",
          licenceUrl: stripHtml(meta.LicenseUrl?.value),
          sourceUrl: info.descriptionurl ?? src,
        } satisfies CarPhoto,
      ];
    });
  } catch {
    return [];
  }
}

function imaginPhoto(vehicle: VehicleWithRelations): CarPhoto | null {
  const paint = vehicle.colors[0]?.imaginStudioColorCode;
  const src = buildImaginUrl({
    make: vehicle.brand,
    model: vehicle.name.replace(vehicle.brand, "").trim() || vehicle.name,
    paintCode: paint,
    transparent: false,
    width: 1400,
  });
  if (!src) return null;
  return {
    src,
    width: 1400,
    height: 788,
    title: `${vehicle.name} studio render`,
    author: "IMAGIN.studio",
    licence: "Licensed (IMAGIN.studio)",
    licenceUrl: "https://www.imagin.studio",
    sourceUrl: src,
  };
}

function yearFromTitle(title: string | undefined): number {
  const match = title?.match(/\b(20\d{2})\b/);
  return match ? Number(match[1]) : 0;
}

function maxPhotoYear(photos: CarPhoto[]): number {
  return photos.reduce((max, photo) => Math.max(max, yearFromTitle(photo.title)), 0);
}

export async function resolveVehicleMedia(
  vehicle: VehicleWithRelations,
): Promise<ResolvedVehicleMedia> {
  const bundled = carPhotos[vehicle.slug] ?? [];
  const live = await searchCommons(vehicle);
  const bundledYear = maxPhotoYear(bundled);
  const newerLive = live.filter((photo) => {
    const year = yearFromTitle(photo.title);
    // Ignore undated or vintage files — "2010" is not a refresh of a 2023 kit.
    return year >= 2023 && year > bundledYear;
  });
  if (newerLive.length > 0) {
    return { photos: [...newerLive, ...bundled].slice(0, 3), source: "commons" };
  }
  if (bundled.length > 0) return { photos: bundled, source: "commons" };

  if (live.length > 0) return { photos: live.slice(0, 3), source: "commons" };

  const catalogue = fromCatalogueImages(vehicle);
  if (catalogue.length > 0) {
    return {
      photos: catalogue,
      source: catalogue[0].src.startsWith("/vehicles/") ? "commons" : "sample",
    };
  }

  if (isEvoxEnabled()) {
    const evox = await fetchEvoxPhotos({
      year: 2025,
      make: vehicle.brand,
      model: vehicle.name.replace(vehicle.brand, "").trim() || vehicle.name,
    });
    if (evox.length > 0) return { photos: evox, source: "evox" };
  }

  const imagin = imaginPhoto(vehicle);
  if (imagin) return { photos: [imagin], source: "imagin" };

  return { photos: [], source: "sample" };
}
