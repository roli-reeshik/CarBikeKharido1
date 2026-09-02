/**
 * Application-side mirror of the Prisma models.
 *
 * These exist so the whole app can be typed and rendered without importing the
 * generated Prisma client — which matters because the site must build and run
 * with no database attached (see `catalogue/repository.ts`). Money fields are
 * plain numbers of paise here; the repository converts Prisma's BigInt columns
 * at the boundary. Decimal columns become numbers for the same reason.
 */

export type VehicleType = "CAR" | "BIKE";
export type FuelType = "PETROL" | "DIESEL" | "CNG" | "ELECTRIC" | "HYBRID";
export type TransmissionType =
  | "MANUAL"
  | "AUTO_AMT"
  | "AUTO_TORQUE_CONVERTER"
  | "EV";
export type ImageType =
  | "HERO_CUTOUT"
  | "STUDIO_360"
  | "PRESS_EDITORIAL"
  | "INTERIOR";

export interface Variant {
  id: string;
  vehicleId: string;
  name: string;
  fuelType: FuelType;
  transmissionType: TransmissionType;
  /** Ex-showroom price in paise. */
  exShowroomPricePence: number;
  engineCc: number | null;
  seatingCapacity: number;
  isPopular: boolean;
}

export interface Color {
  id: string;
  vehicleId: string;
  name: string;
  hexCode: string;
  imaginStudioColorCode: string | null;
  oemPaintName: string | null;
}

export interface VehicleImage {
  id: string;
  vehicleId: string;
  url: string;
  type: ImageType;
  caption: string | null;
}

export interface Vehicle {
  id: string;
  slug: string;
  name: string;
  type: VehicleType;
  brand: string;
  bodyType: string;
  /** Null for bikes, which are not crash-rated in India. */
  safetyRatingNCAP: number | null;
  isElectric: boolean;
  /** Null for bikes. */
  luggageCapacityBags: number | null;
  realMileageKmPerLitre: number;
  bestForHeadline: string;
}

/** A vehicle with everything the cards and detail pages need. */
export interface VehicleWithRelations extends Vehicle {
  variants: Variant[];
  colors: Color[];
  images: VehicleImage[];
}

export interface RtoTaxRule {
  id: string;
  stateCode: string;
  vehicleType: VehicleType;
  /** Null applies to every fuel type; a specific fuel type takes precedence. */
  fuelType: FuelType | null;
  /** Inclusive lower bound, in paise. */
  priceMin: number;
  /** Exclusive upper bound, in paise. */
  priceMax: number;
  taxPercentage: number;
  cessPercentage: number;
  /** Flat charges in paise. */
  fixedFee: number;
}

export interface InsuranceRule {
  id: string;
  vehicleType: VehicleType;
  engineCcMin: number;
  engineCcMax: number;
  baseThirdParty1Yr: number;
  ownDamagePercentage: number;
  mandatoryCpaFee: number;
}

/** A selectable delivery location. Road tax is set per state, not per city. */
export interface ServiceCity {
  id: string;
  name: string;
  stateCode: string;
  stateName: string;
  /** Primary RTO code shown in the picker, e.g. "UP-32". */
  rto: string;
}

/** Cheapest variant in a line-up, used for "from ₹x" pricing. */
export function entryVariant(vehicle: VehicleWithRelations): Variant {
  return vehicle.variants.reduce((cheapest, variant) =>
    variant.exShowroomPricePence < cheapest.exShowroomPricePence
      ? variant
      : cheapest,
  );
}

/** The variant we quote by default: the popular one, else the cheapest. */
export function headlineVariant(vehicle: VehicleWithRelations): Variant {
  return vehicle.variants.find((variant) => variant.isPopular) ?? entryVariant(vehicle);
}

export function priceRangePaise(
  vehicle: VehicleWithRelations,
): [number, number] {
  const prices = vehicle.variants.map((variant) => variant.exShowroomPricePence);
  return [Math.min(...prices), Math.max(...prices)];
}
