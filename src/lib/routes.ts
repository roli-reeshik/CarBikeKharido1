import type { VehicleType } from "@/lib/catalogue/types";

const KNOWN_BIKES = new Set([
  "royal-enfield-classic-350",
  "royal-enfield-hunter-350",
  "tvs-iqube",
  "tvs-apache-rtr",
  "ola-s1",
  "ducati-panigale-v4",
]);

/** Canonical public URL for a catalogue vehicle. */
export function vehiclePath(vehicle: { type: VehicleType; slug: string }): string {
  return vehicle.type === "BIKE" ? `/bikes/${vehicle.slug}` : `/cars/${vehicle.slug}`;
}

/** Resolve a slug when the type is not already in hand (search, rivals). */
export function vehiclePathBySlug(slug: string, type?: VehicleType): string {
  if (type === "BIKE" || KNOWN_BIKES.has(slug)) return `/bikes/${slug}`;
  return `/cars/${slug}`;
}
