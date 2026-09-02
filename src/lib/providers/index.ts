/**
 * Resolution layer: turns a car in our catalogue into photos and detail data,
 * preferring live vendor data and degrading gracefully to bundled content.
 *
 *   Photos : EVOX Images  → Wikimedia Commons (public/cars) → SVG illustration
 *   Detail : MyNewCar API → bundled sample content
 *
 * Every resolved record carries the `source` it came from so the UI can label
 * provenance honestly instead of implying sample numbers are live.
 */
import { carPhotos } from "../vehiclePhotos.generated";
import { carDetails } from "../carDetails";
import type { Car, CarDetail, CarPhoto, DataSource } from "../types";
import { fetchEvoxPhotos } from "./evox";
import { fetchMynewcarData } from "./mynewcar";

export interface ResolvedPhotos {
  photos: CarPhoto[];
  source: DataSource;
}

export interface ResolvedDetail extends CarDetail {
  source: DataSource;
  /** True when pricing/spec rows came from the vendor rather than samples. */
  live: boolean;
}

/** Model year used when querying EVOX for the current car. */
const MODEL_YEAR = 2025;

export async function resolvePhotos(car: Car): Promise<ResolvedPhotos> {
  const evox = await fetchEvoxPhotos({
    year: MODEL_YEAR,
    make: car.brand,
    model: car.model,
  });
  if (evox.length > 0) return { photos: evox, source: "evox" };

  const local = carPhotos[car.id] ?? [];
  if (local.length > 0) return { photos: local, source: "commons" };

  return { photos: [], source: "sample" };
}

export async function resolveDetail(
  car: Car,
  cityId?: string,
): Promise<ResolvedDetail> {
  const sample = carDetails[car.id];
  const vendor = await fetchMynewcarData({
    brand: car.brand,
    model: car.model,
    city: cityId,
  });

  if (!vendor) return { ...sample, source: "sample", live: false };

  // Merge rather than replace: MyNewCar supplies pricing, specs and colours,
  // while the plain-English overview, owner reviews and rival framing are ours.
  return {
    ...sample,
    variants: vendor.variants.length > 0 ? vendor.variants : sample.variants,
    colours: vendor.colours.length > 0 ? vendor.colours : sample.colours,
    specGroups:
      vendor.specGroups.length > 0 ? vendor.specGroups : sample.specGroups,
    source: "mynewcar",
    live: true,
  };
}

/** Human-readable label for the provenance badge. */
export const sourceLabels: Record<DataSource, string> = {
  mynewcar: "Live data — MyNewCar India",
  rapidapi: "Technical specs — API Ninjas via RapidAPI",
  evox: "Photography — EVOX Images (licensed)",
  imagin: "Studio render — IMAGIN.studio",
  commons: "Photography — Wikimedia Commons",
  sample: "Illustrative sample data",
};
