/**
 * Layman-facing copy derived from catalogue fields, so cards and the matcher
 * never have to invent their own phrasing.
 */
import type { Accent } from "../types";
import type {
  FuelType,
  TransmissionType,
  VehicleWithRelations,
} from "./types";
import { headlineVariant, priceRangePaise } from "./types";

const accents: Record<string, Accent> = {
  "tata-nexon": "emerald",
  "maruti-fronx": "blue",
  "hyundai-creta": "indigo",
  "mahindra-xuv-3xo": "amber",
  "royal-enfield-classic-350": "rose",
  "tvs-iqube": "violet",
};

export function vehicleAccent(slug: string): Accent {
  return accents[slug] ?? "blue";
}

export function luggagePlain(bags: number | null): string {
  if (bags == null) return "Two-wheeler — no boot";
  return `Fits ${bags} large suitcase${bags === 1 ? "" : "s"}`;
}

export function gearboxTag(type: TransmissionType): string {
  switch (type) {
    case "MANUAL":
      return "Manual";
    case "AUTO_AMT":
      return "AMT — no clutch";
    case "AUTO_TORQUE_CONVERTER":
      return "Smooth Automatic";
    case "EV":
      return "Single-speed";
  }
}

export function fuelLabel(fuel: FuelType): string {
  switch (fuel) {
    case "PETROL":
      return "Petrol";
    case "DIESEL":
      return "Diesel";
    case "CNG":
      return "CNG";
    case "ELECTRIC":
      return "Electric";
    case "HYBRID":
      return "Hybrid";
  }
}

export function runningPlain(vehicle: VehicleWithRelations): string {
  if (vehicle.isElectric) {
    return `About ${vehicle.realMileageKmPerLitre} km per unit`;
  }
  if (vehicle.variants.some((variant) => variant.fuelType === "CNG")) {
    return `${vehicle.realMileageKmPerLitre} km per kg in real traffic`;
  }
  return `${vehicle.realMileageKmPerLitre} km per litre in real traffic`;
}

export function trafficPlain(vehicle: VehicleWithRelations): string {
  const gearbox = headlineVariant(vehicle).transmissionType;
  if (gearbox === "EV") return "Silent crawl — no gears at all";
  if (gearbox === "AUTO_TORQUE_CONVERTER" || gearbox === "AUTO_AMT") {
    return "Creeps forward on its own — no clutch";
  }
  return "You'll be shifting in traffic";
}

export function imaginModelName(vehicle: VehicleWithRelations): string {
  return vehicle.name.replace(vehicle.brand, "").trim() || vehicle.name;
}

/** True when any variant in the line-up uses this fuel. */
export function hasFuel(vehicle: VehicleWithRelations, fuel: FuelType): boolean {
  return vehicle.variants.some((variant) => variant.fuelType === fuel);
}

export function hasAutomatic(vehicle: VehicleWithRelations): boolean {
  return vehicle.variants.some(
    (variant) => variant.transmissionType !== "MANUAL",
  );
}

export function entryPricePaise(vehicle: VehicleWithRelations): number {
  return priceRangePaise(vehicle)[0];
}
