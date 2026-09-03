/**
 * Application-side mirror of the Prisma models.
 * CarBikeKharido.com · © VidyaLabs. All Rights Reserved.
 * Principal Developer: Rajesh Kumar
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
export type MediaCategory =
  | "HERO"
  | "EXTERIOR"
  | "INTERIOR"
  | "PRACTICALITY"
  | "STUDIO_360";

/** @deprecated Prefer MediaCategory. Kept so older gallery code still type-checks. */
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

export interface VehicleColor {
  id: string;
  vehicleId: string;
  name: string;
  hexCode: string;
  imaginColorCode: string | null;
  oemPaintName: string | null;
  /** Alias of imaginColorCode — older 360 / gallery callers still read this. */
  imaginStudioColorCode: string | null;
}

/** @deprecated Prefer VehicleColor. */
export type Color = VehicleColor;

export interface LocalMedia {
  id: string;
  vehicleId: string;
  /** Public path, e.g. "/uploads/vehicles/hyundai-creta/hero.webp" */
  localPath: string;
  category: MediaCategory;
  isHero: boolean;
  caption: string | null;
}

/** Derived gallery row so existing VDP / resolver code can keep reading `images`. */
export interface VehicleImage {
  id: string;
  vehicleId: string;
  url: string;
  type: ImageType;
  caption: string | null;
}

export interface VehicleReviewSection {
  id: string;
  vehicleId: string;
  sectionKey: string;
  title: string;
  shortSummary: string;
  fullReview: string;
  imagePath: string | null;
}

export interface Vehicle {
  id: string;
  slug: string;
  name: string;
  type: VehicleType;
  brand: string;
  bodyType: string;
  imaginMake: string | null;
  imaginModel: string | null;
  /** Null for bikes, which are not crash-rated in India. */
  safetyRatingNCAP: number | null;
  isElectric: boolean;
  /** Null for bikes. */
  luggageCapacityBags: number | null;
  bootSpaceLuggage: string | null;
  realMileageKmPerLitre: number;
  realMileage: string | null;
  bestForHeadline: string;
}

/** A vehicle with everything the cards and detail pages need. */
export interface VehicleWithRelations extends Vehicle {
  variants: Variant[];
  colors: VehicleColor[];
  localMedia: LocalMedia[];
  reviewSections: VehicleReviewSection[];
  /** Derived from localMedia for existing gallery callers. */
  images: VehicleImage[];
}

export interface RtoTaxRate {
  id: string;
  stateCode: string;
  city: string;
  vehicleType: VehicleType;
  fuelType: FuelType;
  taxPercent: number;
  /** Flat cess in paise. */
  fixedCess: number;
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

export function mediaToImageType(category: MediaCategory): ImageType {
  switch (category) {
    case "HERO":
      return "HERO_CUTOUT";
    case "STUDIO_360":
      return "STUDIO_360";
    case "INTERIOR":
      return "INTERIOR";
    default:
      return "PRESS_EDITORIAL";
  }
}

export function imageTypeToCategory(type: ImageType): MediaCategory {
  switch (type) {
    case "HERO_CUTOUT":
      return "HERO";
    case "STUDIO_360":
      return "STUDIO_360";
    case "INTERIOR":
      return "INTERIOR";
    default:
      return "EXTERIOR";
  }
}

export function imagesFromLocalMedia(media: LocalMedia[]): VehicleImage[] {
  return media.map((item) => ({
    id: item.id,
    vehicleId: item.vehicleId,
    url: item.localPath,
    type: mediaToImageType(item.category),
    caption: item.caption,
  }));
}
