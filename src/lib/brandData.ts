/**
 * Brand metadata for the OEM-style Brand Showcase on CarBikeKharido.com.
 *
 * Each brand links to `/brands/[slug]` and groups catalogue vehicles by body
 * type so the showcase page can render category filter tabs and a studio
 * carousel without any database dependency.
 *
 * © VidyaLabs. All Rights Reserved. · Principal Developer: Rajesh Kumar
 */

import { vehicles as allVehicles } from "@/lib/catalogue/seedData";
import type { VehicleWithRelations } from "@/lib/catalogue/types";

// ---------------------------------------------------------------------------
// Brand definitions
// ---------------------------------------------------------------------------

export interface Brand {
  name: string;
  slug: string;
  /** SVG character fallback when no logo image is available. */
  logoInitials: string;
  /** Hex brand colour for accent / logo tint. */
  brandColor: string;
  tagline: string;
  type: "car" | "bike" | "both";
}

export const brands: Brand[] = [
  { name: "Hyundai", slug: "hyundai", logoInitials: "Hy", brandColor: "#002c5f", tagline: "Progress for Humanity", type: "car" },
  { name: "Tata Motors", slug: "tata", logoInitials: "Ta", brandColor: "#1c3c6e", tagline: "Connecting Aspirations", type: "car" },
  { name: "Maruti Suzuki", slug: "maruti-suzuki", logoInitials: "MS", brandColor: "#1e3a8a", tagline: "Way of Life", type: "car" },
  { name: "Mahindra", slug: "mahindra", logoInitials: "Ma", brandColor: "#c41e3a", tagline: "Rise", type: "car" },
  { name: "Kia", slug: "kia", logoInitials: "Ki", brandColor: "#05141f", tagline: "Movement that Inspires", type: "car" },
  { name: "Toyota", slug: "toyota", logoInitials: "To", brandColor: "#eb0a1e", tagline: "Let's Go Places", type: "car" },
  { name: "Honda", slug: "honda", logoInitials: "Ho", brandColor: "#cc0000", tagline: "The Power of Dreams", type: "both" },
  { name: "Royal Enfield", slug: "royal-enfield", logoInitials: "RE", brandColor: "#1a1a1a", tagline: "Pure Motorcycling", type: "bike" },
  { name: "TVS", slug: "tvs", logoInitials: "TV", brandColor: "#003d8f", tagline: "Powered by Innovation", type: "bike" },
  { name: "Ola Electric", slug: "ola-electric", logoInitials: "Ol", brandColor: "#00c853", tagline: "Endlessly Yours", type: "bike" },
  { name: "Ducati", slug: "ducati", logoInitials: "Du", brandColor: "#cc0000", tagline: "Dream Wilder", type: "bike" },
];

export function getBrand(slug: string): Brand | undefined {
  return brands.find((b) => b.slug === slug);
}

// ---------------------------------------------------------------------------
// Vehicle ↔ Brand mapping
// ---------------------------------------------------------------------------

/** Maps a catalogue brand string (e.g. "Maruti Suzuki") to the brand slug. */
const BRAND_NAME_TO_SLUG: Record<string, string> = {
  Hyundai: "hyundai",
  Tata: "tata",
  "Maruti Suzuki": "maruti-suzuki",
  Mahindra: "mahindra",
  Kia: "kia",
  Toyota: "toyota",
  Honda: "honda",
  "Royal Enfield": "royal-enfield",
  TVS: "tvs",
  Ola: "ola-electric",
  Ducati: "ducati",
};

export function brandSlugFromVehicle(vehicle: VehicleWithRelations): string {
  return BRAND_NAME_TO_SLUG[vehicle.brand] ?? vehicle.brand.toLowerCase().replace(/\s+/g, "-");
}

/** All catalogue vehicles that belong to a given brand slug. */
export function getVehiclesForBrand(brandSlug: string): VehicleWithRelations[] {
  return allVehicles.filter((v) => brandSlugFromVehicle(v) === brandSlug);
}

// ---------------------------------------------------------------------------
// Category tabs for the showcase carousel
// ---------------------------------------------------------------------------

export type VehicleCategory =
  | "All"
  | "SUV"
  | "Sedan"
  | "Hatchback"
  | "Electric"
  | "MPV"
  | "Off-Road"
  | "Crossover"
  | "Cruiser"
  | "Scooter"
  | "Superbike"
  | "Sport Bike"
  | "Taxi / Commercial";

const BODY_TO_CATEGORY: Record<string, VehicleCategory> = {
  "Compact SUV": "SUV",
  "Midsize SUV": "SUV",
  "Full-size SUV": "SUV",
  "Off-road SUV": "Off-Road",
  Crossover: "Crossover",
  "Electric SUV": "Electric",
  "Electric Sedan": "Electric",
  "Electric Scooter": "Electric",
  "7-Seater MPV": "MPV",
  Sedan: "Sedan",
  "Compact Sedan": "Sedan",
  "Premium Sedan": "Sedan",
  Hatchback: "Hatchback",
  "Premium Hatchback": "Hatchback",
  Cruiser: "Cruiser",
  Superbike: "Superbike",
  "Sport Bike": "Sport Bike",
  "Taxi / Commercial": "Taxi / Commercial",
  Taxi: "Taxi / Commercial",
  Commercial: "Taxi / Commercial",
};

export function categoryForVehicle(vehicle: VehicleWithRelations): VehicleCategory {
  if (vehicle.isElectric) return "Electric";
  return BODY_TO_CATEGORY[vehicle.bodyType] ?? "SUV";
}

/** Unique categories present in a brand's line-up, with "All" prepended. */
export function categoriesForBrand(vehicles: VehicleWithRelations[]): VehicleCategory[] {
  const set = new Set(vehicles.map(categoryForVehicle));
  return ["All", ...Array.from(set).sort()] as VehicleCategory[];
}

/** Filter vehicles by category; "All" returns the full list. */
export function filterByCategory(
  vehicles: VehicleWithRelations[],
  cat: VehicleCategory,
): VehicleWithRelations[] {
  if (cat === "All") return vehicles;
  return vehicles.filter((v) => categoryForVehicle(v) === cat);
}
