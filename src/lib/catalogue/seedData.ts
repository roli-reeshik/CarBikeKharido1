/**
 * Canonical seed dataset for CarBikeKharido.com.
 *
 * This is the single source of truth for both `prisma/seed.ts` (which writes it
 * to PostgreSQL) and `catalogue/repository.ts` (which serves it directly when no
 * database is attached). Keeping one copy means the demo and the seeded
 * production database can never drift apart.
 *
 * Prices are in paise and are researched approximations of Indian ex-showroom
 * prices. Road tax percentages follow published state slabs; confirm against the
 * current notification before relying on them commercially.
 */
import { rupeesToPaise as inr } from "../money";
import type {
  FuelType,
  InsuranceRule,
  RtoTaxRate,
  RtoTaxRule,
  ServiceCity,
  VehicleImage,
  VehicleType,
  VehicleWithRelations,
} from "./types";
import { imageTypeToCategory, imagesFromLocalMedia } from "./types";

export const serviceCities: ServiceCity[] = [
  { id: "lucknow", name: "Lucknow", stateCode: "UP", stateName: "Uttar Pradesh", rto: "UP-32" },
  { id: "noida", name: "Noida", stateCode: "UP", stateName: "Uttar Pradesh", rto: "UP-16" },
  { id: "new-delhi", name: "New Delhi", stateCode: "DL", stateName: "Delhi", rto: "DL-01" },
  { id: "mumbai", name: "Mumbai", stateCode: "MH", stateName: "Maharashtra", rto: "MH-01" },
  { id: "pune", name: "Pune", stateCode: "MH", stateName: "Maharashtra", rto: "MH-12" },
  { id: "bengaluru", name: "Bengaluru", stateCode: "KA", stateName: "Karnataka", rto: "KA-01" },
];

export const defaultCityId = "lucknow";

export function getServiceCity(id: string): ServiceCity {
  return serviceCities.find((city) => city.id === id) ?? serviceCities[0];
}

/** Press-kit photographs downloaded into `public/vehicles/` by the fetch script. */
function kit(vehicleId: string, slug: string, files: string[]): VehicleImage[] {
  return files.map((file, index) => ({
    id: `img-${slug}-${index + 1}`,
    vehicleId,
    url: `/vehicles/${file}`,
    type: (index === 0 ? "HERO_CUTOUT" : "PRESS_EDITORIAL") as VehicleImage["type"],
    caption: null,
  }));
}

// ---------------------------------------------------------------------------
// Vehicles
// ---------------------------------------------------------------------------

const IMAGIN_TOKENS: Record<string, { make: string; model: string }> = {
  "tata-nexon": { make: "tata", model: "nexon" },
  "maruti-fronx": { make: "suzuki", model: "fronx" },
  "hyundai-creta": { make: "hyundai", model: "creta" },
  "mahindra-xuv-3xo": { make: "mahindra", model: "xuv300" },
  "mahindra-thar": { make: "mahindra", model: "thar" },
  "tata-punch-ev": { make: "tata", model: "punch" },
  "maruti-ertiga": { make: "suzuki", model: "ertiga" },
  "royal-enfield-classic-350": { make: "royal-enfield", model: "classic" },
  "tvs-iqube": { make: "tvs", model: "iqube" },
  "ola-s1": { make: "ola", model: "s1" },
  "ducati-panigale-v4": { make: "ducati", model: "panigale" },
};

function realMileageLine(
  type: VehicleType,
  isElectric: boolean,
  km: number,
): string {
  if (isElectric) {
    const paisePerKm = type === "BIKE" ? 25 : 80;
    return `${km.toFixed(1)} km/unit (₹${(paisePerKm / 100).toFixed(2)}/km)`;
  }
  const rupeesPerLitre = type === "BIKE" ? 105 : 102;
  const perKm = rupeesPerLitre / km;
  return `${km.toFixed(1)} km/l (₹${perKm.toFixed(1)}/km)`;
}

type RawColor = {
  id: string;
  vehicleId: string;
  name: string;
  hexCode: string;
  imaginStudioColorCode: string | null;
  oemPaintName: string | null;
};

type RawVehicle = Omit<
  VehicleWithRelations,
  | "imaginMake"
  | "imaginModel"
  | "bootSpaceLuggage"
  | "realMileage"
  | "localMedia"
  | "reviewSections"
  | "colors"
> & { colors: RawColor[] };

function finaliseVehicle(raw: RawVehicle): VehicleWithRelations {
  const tokens = IMAGIN_TOKENS[raw.slug] ?? {
    make: raw.brand.toLowerCase().replace(/\s+/g, "-"),
    model: raw.name.replace(raw.brand, "").trim().toLowerCase().replace(/\s+/g, "-"),
  };
  const colors = raw.colors.map((color) => ({
    ...color,
    imaginColorCode: color.imaginStudioColorCode,
    imaginStudioColorCode: color.imaginStudioColorCode,
  }));
  const localMedia = raw.images.map((image, index) => ({
    id: image.id.replace(/^img-/, "media-"),
    vehicleId: image.vehicleId,
    localPath: image.url,
    category: imageTypeToCategory(image.type),
    isHero: index === 0,
    caption: image.caption,
  }));

  return {
    ...raw,
    imaginMake: tokens.make,
    imaginModel: tokens.model,
    bootSpaceLuggage:
      raw.luggageCapacityBags == null
        ? null
        : `Fits ${raw.luggageCapacityBags} Large Suitcases`,
    realMileage: realMileageLine(
      raw.type,
      raw.isElectric,
      raw.realMileageKmPerLitre,
    ),
    colors,
    localMedia,
    reviewSections: [],
    images: imagesFromLocalMedia(localMedia),
  };
}

const rawVehicles: RawVehicle[] = [
  {
    id: "veh-tata-nexon",
    slug: "tata-nexon",
    name: "Tata Nexon",
    type: "CAR",
    brand: "Tata",
    bodyType: "Compact SUV",
    safetyRatingNCAP: 5,
    isElectric: false,
    luggageCapacityBags: 3,
    realMileageKmPerLitre: 13.8,
    bestForHeadline: "Families who put crash safety first",
    variants: [
      { id: "var-nexon-smart", vehicleId: "veh-tata-nexon", name: "Smart+", fuelType: "PETROL", transmissionType: "MANUAL", exShowroomPricePence: inr(8_00_000), engineCc: 1199, seatingCapacity: 5, isPopular: false },
      { id: "var-nexon-pure", vehicleId: "veh-tata-nexon", name: "Pure+ S", fuelType: "PETROL", transmissionType: "MANUAL", exShowroomPricePence: inr(9_70_000), engineCc: 1199, seatingCapacity: 5, isPopular: false },
      { id: "var-nexon-creative", vehicleId: "veh-tata-nexon", name: "Creative+ S", fuelType: "PETROL", transmissionType: "MANUAL", exShowroomPricePence: inr(11_30_000), engineCc: 1199, seatingCapacity: 5, isPopular: true },
      { id: "var-nexon-creative-at", vehicleId: "veh-tata-nexon", name: "Creative+ S Automatic", fuelType: "PETROL", transmissionType: "AUTO_TORQUE_CONVERTER", exShowroomPricePence: inr(12_40_000), engineCc: 1199, seatingCapacity: 5, isPopular: false },
    ],
    colors: [
      { id: "col-nexon-ocean", vehicleId: "veh-tata-nexon", name: "Creative Ocean", hexCode: "#1c4f8b", imaginStudioColorCode: "blue", oemPaintName: "Creative Ocean" },
      { id: "col-nexon-grey", vehicleId: "veh-tata-nexon", name: "Pure Grey", hexCode: "#5b6067", imaginStudioColorCode: "grey", oemPaintName: "Pure Grey" },
      { id: "col-nexon-red", vehicleId: "veh-tata-nexon", name: "Flame Red", hexCode: "#b81f24", imaginStudioColorCode: "red", oemPaintName: "Flame Red" },
      { id: "col-nexon-white", vehicleId: "veh-tata-nexon", name: "Pristine White", hexCode: "#f1f3f5", imaginStudioColorCode: "white", oemPaintName: "Pristine White" },
    ],
    images: kit("veh-tata-nexon", "tata-nexon", [
      "tata-nexon-1.jpg",
      "tata-nexon-2.jpg",
      "tata-nexon-3.jpg",
    ]),
  },
  {
    id: "veh-maruti-fronx",
    slug: "maruti-fronx",
    name: "Maruti Suzuki Fronx",
    type: "CAR",
    brand: "Maruti Suzuki",
    bodyType: "Crossover",
    safetyRatingNCAP: 4,
    isElectric: false,
    luggageCapacityBags: 2,
    realMileageKmPerLitre: 24.0,
    bestForHeadline: "Long daily commutes on a tight fuel budget",
    variants: [
      { id: "var-fronx-sigma", vehicleId: "veh-maruti-fronx", name: "Sigma", fuelType: "PETROL", transmissionType: "MANUAL", exShowroomPricePence: inr(7_50_000), engineCc: 1197, seatingCapacity: 5, isPopular: false },
      { id: "var-fronx-delta-cng", vehicleId: "veh-maruti-fronx", name: "Delta+ CNG", fuelType: "CNG", transmissionType: "MANUAL", exShowroomPricePence: inr(9_20_000), engineCc: 1197, seatingCapacity: 5, isPopular: true },
      { id: "var-fronx-zeta", vehicleId: "veh-maruti-fronx", name: "Zeta Turbo", fuelType: "PETROL", transmissionType: "MANUAL", exShowroomPricePence: inr(10_60_000), engineCc: 998, seatingCapacity: 5, isPopular: false },
      { id: "var-fronx-alpha-at", vehicleId: "veh-maruti-fronx", name: "Alpha Turbo Automatic", fuelType: "PETROL", transmissionType: "AUTO_TORQUE_CONVERTER", exShowroomPricePence: inr(13_10_000), engineCc: 998, seatingCapacity: 5, isPopular: false },
    ],
    colors: [
      { id: "col-fronx-blue", vehicleId: "veh-maruti-fronx", name: "Nexa Blue", hexCode: "#1e3f8f", imaginStudioColorCode: "blue", oemPaintName: "Nexa Blue" },
      { id: "col-fronx-brown", vehicleId: "veh-maruti-fronx", name: "Earthen Brown", hexCode: "#6b4a35", imaginStudioColorCode: "brown", oemPaintName: "Earthen Brown" },
      { id: "col-fronx-silver", vehicleId: "veh-maruti-fronx", name: "Splendid Silver", hexCode: "#b6bbc0", imaginStudioColorCode: "silver", oemPaintName: "Splendid Silver" },
      { id: "col-fronx-white", vehicleId: "veh-maruti-fronx", name: "Arctic White", hexCode: "#f4f6f7", imaginStudioColorCode: "white", oemPaintName: "Arctic White" },
    ],
    images: kit("veh-maruti-fronx", "maruti-fronx", [
      "maruti-fronx-1.jpg",
      "maruti-fronx-2.jpg",
      "maruti-fronx-3.png",
    ]),
  },
  {
    id: "veh-hyundai-creta",
    slug: "hyundai-creta",
    name: "Hyundai Creta",
    type: "CAR",
    brand: "Hyundai",
    bodyType: "Midsize SUV",
    safetyRatingNCAP: 5,
    isElectric: false,
    luggageCapacityBags: 4,
    realMileageKmPerLitre: 12.5,
    bestForHeadline: "Highway trips in quiet comfort",
    variants: [
      { id: "var-creta-e", vehicleId: "veh-hyundai-creta", name: "E", fuelType: "PETROL", transmissionType: "MANUAL", exShowroomPricePence: inr(11_10_000), engineCc: 1497, seatingCapacity: 5, isPopular: false },
      { id: "var-creta-s", vehicleId: "veh-hyundai-creta", name: "S+", fuelType: "PETROL", transmissionType: "MANUAL", exShowroomPricePence: inr(14_20_000), engineCc: 1497, seatingCapacity: 5, isPopular: false },
      { id: "var-creta-sx", vehicleId: "veh-hyundai-creta", name: "SX Tech", fuelType: "PETROL", transmissionType: "MANUAL", exShowroomPricePence: inr(16_90_000), engineCc: 1497, seatingCapacity: 5, isPopular: true },
      { id: "var-creta-sx-at", vehicleId: "veh-hyundai-creta", name: "SX Tech Automatic", fuelType: "PETROL", transmissionType: "AUTO_TORQUE_CONVERTER", exShowroomPricePence: inr(18_60_000), engineCc: 1497, seatingCapacity: 5, isPopular: false },
    ],
    colors: [
      { id: "col-creta-white", vehicleId: "veh-hyundai-creta", name: "Atlas White", hexCode: "#f2f4f6", imaginStudioColorCode: "white", oemPaintName: "Atlas White" },
      { id: "col-creta-black", vehicleId: "veh-hyundai-creta", name: "Abyss Black", hexCode: "#14161a", imaginStudioColorCode: "black", oemPaintName: "Abyss Black" },
      { id: "col-creta-grey", vehicleId: "veh-hyundai-creta", name: "Titan Grey Matte", hexCode: "#71767c", imaginStudioColorCode: "grey", oemPaintName: "Titan Grey Matte" },
      { id: "col-creta-khaki", vehicleId: "veh-hyundai-creta", name: "Ranger Khaki", hexCode: "#7c7551", imaginStudioColorCode: "green", oemPaintName: "Ranger Khaki" },
    ],
    images: kit("veh-hyundai-creta", "hyundai-creta", [
      "hyundai-creta-1.png",
      "hyundai-creta-2.png",
      "hyundai-creta-3.jpg",
    ]),
  },
  {
    id: "veh-mahindra-xuv-3xo",
    slug: "mahindra-xuv-3xo",
    name: "Mahindra XUV 3XO",
    type: "CAR",
    brand: "Mahindra",
    bodyType: "Compact SUV",
    safetyRatingNCAP: 5,
    isElectric: false,
    luggageCapacityBags: 3,
    realMileageKmPerLitre: 13.2,
    bestForHeadline: "A loaded feature list at a compact-SUV price",
    variants: [
      { id: "var-3xo-mx1", vehicleId: "veh-mahindra-xuv-3xo", name: "MX1", fuelType: "PETROL", transmissionType: "MANUAL", exShowroomPricePence: inr(7_99_000), engineCc: 1197, seatingCapacity: 5, isPopular: false },
      { id: "var-3xo-mx3", vehicleId: "veh-mahindra-xuv-3xo", name: "MX3 Pro", fuelType: "PETROL", transmissionType: "MANUAL", exShowroomPricePence: inr(9_90_000), engineCc: 1197, seatingCapacity: 5, isPopular: false },
      { id: "var-3xo-ax5l", vehicleId: "veh-mahindra-xuv-3xo", name: "AX5 L", fuelType: "PETROL", transmissionType: "MANUAL", exShowroomPricePence: inr(12_20_000), engineCc: 1197, seatingCapacity: 5, isPopular: true },
      { id: "var-3xo-ax5l-at", vehicleId: "veh-mahindra-xuv-3xo", name: "AX5 L Automatic", fuelType: "PETROL", transmissionType: "AUTO_TORQUE_CONVERTER", exShowroomPricePence: inr(13_50_000), engineCc: 1197, seatingCapacity: 5, isPopular: false },
    ],
    colors: [
      { id: "col-3xo-white", vehicleId: "veh-mahindra-xuv-3xo", name: "Everest White", hexCode: "#f3f5f6", imaginStudioColorCode: "white", oemPaintName: "Everest White" },
      { id: "col-3xo-grey", vehicleId: "veh-mahindra-xuv-3xo", name: "Galaxy Grey", hexCode: "#63686e", imaginStudioColorCode: "grey", oemPaintName: "Galaxy Grey" },
      { id: "col-3xo-red", vehicleId: "veh-mahindra-xuv-3xo", name: "Tango Red", hexCode: "#b5202a", imaginStudioColorCode: "red", oemPaintName: "Tango Red" },
      { id: "col-3xo-yellow", vehicleId: "veh-mahindra-xuv-3xo", name: "Citrine Yellow", hexCode: "#d8a318", imaginStudioColorCode: "yellow", oemPaintName: "Citrine Yellow" },
    ],
    images: kit("veh-mahindra-xuv-3xo", "mahindra-xuv-3xo", [
      "mahindra-xuv-3xo-1.jpg",
      "mahindra-xuv-3xo-2.jpg",
      "mahindra-xuv-3xo-3.jpg",
    ]),
  },
  {
    id: "veh-mahindra-thar",
    slug: "mahindra-thar",
    name: "Mahindra Thar ROXX",
    type: "CAR",
    brand: "Mahindra",
    bodyType: "Off-road SUV",
    safetyRatingNCAP: 5,
    isElectric: false,
    luggageCapacityBags: 3,
    realMileageKmPerLitre: 11.0,
    bestForHeadline: "Weekends off the tarmac without giving up a proper cabin",
    variants: [
      { id: "var-thar-mx1", vehicleId: "veh-mahindra-thar", name: "MX1 Petrol", fuelType: "PETROL", transmissionType: "MANUAL", exShowroomPricePence: inr(12_99_000), engineCc: 1997, seatingCapacity: 5, isPopular: false },
      { id: "var-thar-ax5", vehicleId: "veh-mahindra-thar", name: "AX5 Petrol", fuelType: "PETROL", transmissionType: "MANUAL", exShowroomPricePence: inr(15_49_000), engineCc: 1997, seatingCapacity: 5, isPopular: false },
      { id: "var-thar-ax7l", vehicleId: "veh-mahindra-thar", name: "AX7 L Diesel Automatic", fuelType: "DIESEL", transmissionType: "AUTO_TORQUE_CONVERTER", exShowroomPricePence: inr(18_99_000), engineCc: 2184, seatingCapacity: 5, isPopular: true },
      { id: "var-thar-ax7l-4wd", vehicleId: "veh-mahindra-thar", name: "AX7 L Diesel 4WD Automatic", fuelType: "DIESEL", transmissionType: "AUTO_TORQUE_CONVERTER", exShowroomPricePence: inr(21_49_000), engineCc: 2184, seatingCapacity: 5, isPopular: false },
    ],
    colors: [
      { id: "col-thar-white", vehicleId: "veh-mahindra-thar", name: "Everest White", hexCode: "#f3f5f6", imaginStudioColorCode: "white", oemPaintName: "Everest White" },
      { id: "col-thar-black", vehicleId: "veh-mahindra-thar", name: "Napoli Black", hexCode: "#14161a", imaginStudioColorCode: "black", oemPaintName: "Napoli Black" },
      { id: "col-thar-red", vehicleId: "veh-mahindra-thar", name: "Deep Forest", hexCode: "#3d4a38", imaginStudioColorCode: "green", oemPaintName: "Deep Forest" },
      { id: "col-thar-stealth", vehicleId: "veh-mahindra-thar", name: "Stealth Black", hexCode: "#2a2c2e", imaginStudioColorCode: "black", oemPaintName: "Stealth Black" },
    ],
    images: kit("veh-mahindra-thar", "mahindra-thar", [
      "mahindra-thar-1.jpg",
      "mahindra-thar-2.jpg",
    ]),
  },
  {
    id: "veh-tata-punch-ev",
    slug: "tata-punch-ev",
    name: "Tata Punch EV",
    type: "CAR",
    brand: "Tata",
    bodyType: "Electric SUV",
    safetyRatingNCAP: 5,
    isElectric: true,
    luggageCapacityBags: 3,
    realMileageKmPerLitre: 8.5,
    bestForHeadline: "City owners who can charge at home overnight",
    variants: [
      { id: "var-punch-smart", vehicleId: "veh-tata-punch-ev", name: "Smart", fuelType: "ELECTRIC", transmissionType: "EV", exShowroomPricePence: inr(10_00_000), engineCc: null, seatingCapacity: 5, isPopular: false },
      { id: "var-punch-adventure", vehicleId: "veh-tata-punch-ev", name: "Adventure", fuelType: "ELECTRIC", transmissionType: "EV", exShowroomPricePence: inr(11_50_000), engineCc: null, seatingCapacity: 5, isPopular: false },
      { id: "var-punch-empowered", vehicleId: "veh-tata-punch-ev", name: "Empowered Long Range", fuelType: "ELECTRIC", transmissionType: "EV", exShowroomPricePence: inr(12_50_000), engineCc: null, seatingCapacity: 5, isPopular: true },
      { id: "var-punch-empowered-plus", vehicleId: "veh-tata-punch-ev", name: "Empowered+ Long Range", fuelType: "ELECTRIC", transmissionType: "EV", exShowroomPricePence: inr(13_20_000), engineCc: null, seatingCapacity: 5, isPopular: false },
    ],
    colors: [
      { id: "col-punch-oxide", vehicleId: "veh-tata-punch-ev", name: "Empowered Oxide", hexCode: "#8a6a44", imaginStudioColorCode: "brown", oemPaintName: "Empowered Oxide" },
      { id: "col-punch-white", vehicleId: "veh-tata-punch-ev", name: "Pristine White", hexCode: "#f2f4f5", imaginStudioColorCode: "white", oemPaintName: "Pristine White" },
      { id: "col-punch-grey", vehicleId: "veh-tata-punch-ev", name: "Daytona Grey", hexCode: "#5f646a", imaginStudioColorCode: "grey", oemPaintName: "Daytona Grey" },
      { id: "col-punch-red", vehicleId: "veh-tata-punch-ev", name: "Fearless Red", hexCode: "#a81f2b", imaginStudioColorCode: "red", oemPaintName: "Fearless Red" },
    ],
    images: kit("veh-tata-punch-ev", "tata-punch-ev", [
      "tata-punch-ev-1.png",
      "tata-punch-ev-2.png",
      "tata-punch-ev-3.jpg",
    ]),
  },
  {
    id: "veh-maruti-ertiga",
    slug: "maruti-ertiga",
    name: "Maruti Suzuki Ertiga",
    type: "CAR",
    brand: "Maruti Suzuki",
    bodyType: "7-Seater MPV",
    safetyRatingNCAP: 3,
    isElectric: false,
    luggageCapacityBags: 2,
    realMileageKmPerLitre: 22.0,
    bestForHeadline: "Seven people and a small monthly fuel bill",
    variants: [
      { id: "var-ertiga-lxi", vehicleId: "veh-maruti-ertiga", name: "LXi", fuelType: "PETROL", transmissionType: "MANUAL", exShowroomPricePence: inr(8_80_000), engineCc: 1462, seatingCapacity: 7, isPopular: false },
      { id: "var-ertiga-vxi-cng", vehicleId: "veh-maruti-ertiga", name: "VXi CNG", fuelType: "CNG", transmissionType: "MANUAL", exShowroomPricePence: inr(10_70_000), engineCc: 1462, seatingCapacity: 7, isPopular: true },
      { id: "var-ertiga-zxi", vehicleId: "veh-maruti-ertiga", name: "ZXi+", fuelType: "PETROL", transmissionType: "MANUAL", exShowroomPricePence: inr(12_20_000), engineCc: 1462, seatingCapacity: 7, isPopular: false },
      { id: "var-ertiga-zxi-cng", vehicleId: "veh-maruti-ertiga", name: "ZXi+ CNG", fuelType: "CNG", transmissionType: "MANUAL", exShowroomPricePence: inr(12_90_000), engineCc: 1462, seatingCapacity: 7, isPopular: false },
    ],
    colors: [
      { id: "col-ertiga-white", vehicleId: "veh-maruti-ertiga", name: "Pearl Arctic White", hexCode: "#f3f5f6", imaginStudioColorCode: "white", oemPaintName: "Pearl Arctic White" },
      { id: "col-ertiga-silver", vehicleId: "veh-maruti-ertiga", name: "Splendid Silver", hexCode: "#b4b9be", imaginStudioColorCode: "silver", oemPaintName: "Splendid Silver" },
      { id: "col-ertiga-grey", vehicleId: "veh-maruti-ertiga", name: "Magma Grey", hexCode: "#5d6268", imaginStudioColorCode: "grey", oemPaintName: "Magma Grey" },
      { id: "col-ertiga-red", vehicleId: "veh-maruti-ertiga", name: "Auburn Red", hexCode: "#8c2b2f", imaginStudioColorCode: "red", oemPaintName: "Auburn Red" },
    ],
    images: kit("veh-maruti-ertiga", "maruti-ertiga", [
      "maruti-ertiga-1.jpg",
      "maruti-ertiga-2.jpg",
      "maruti-ertiga-3.jpg",
    ]),
  },

  // --- Two-wheelers -------------------------------------------------------
  {
    id: "veh-royal-enfield-classic-350",
    slug: "royal-enfield-classic-350",
    name: "Royal Enfield Classic 350",
    type: "BIKE",
    brand: "Royal Enfield",
    bodyType: "Cruiser",
    safetyRatingNCAP: null,
    isElectric: false,
    luggageCapacityBags: null,
    realMileageKmPerLitre: 35.0,
    bestForHeadline: "Weekend rides you actually look forward to",
    variants: [
      { id: "var-classic-halcyon", vehicleId: "veh-royal-enfield-classic-350", name: "Halcyon", fuelType: "PETROL", transmissionType: "MANUAL", exShowroomPricePence: inr(1_93_000), engineCc: 349, seatingCapacity: 2, isPopular: false },
      { id: "var-classic-signals", vehicleId: "veh-royal-enfield-classic-350", name: "Signals", fuelType: "PETROL", transmissionType: "MANUAL", exShowroomPricePence: inr(2_05_000), engineCc: 349, seatingCapacity: 2, isPopular: true },
      { id: "var-classic-dark", vehicleId: "veh-royal-enfield-classic-350", name: "Dark", fuelType: "PETROL", transmissionType: "MANUAL", exShowroomPricePence: inr(2_15_000), engineCc: 349, seatingCapacity: 2, isPopular: false },
      { id: "var-classic-chrome", vehicleId: "veh-royal-enfield-classic-350", name: "Chrome", fuelType: "PETROL", transmissionType: "MANUAL", exShowroomPricePence: inr(2_30_000), engineCc: 349, seatingCapacity: 2, isPopular: false },
    ],
    colors: [
      { id: "col-classic-green", vehicleId: "veh-royal-enfield-classic-350", name: "Halcyon Green", hexCode: "#4a5d4e", imaginStudioColorCode: null, oemPaintName: "Halcyon Green" },
      { id: "col-classic-red", vehicleId: "veh-royal-enfield-classic-350", name: "Madras Red", hexCode: "#8f2b2b", imaginStudioColorCode: null, oemPaintName: "Madras Red" },
      { id: "col-classic-blue", vehicleId: "veh-royal-enfield-classic-350", name: "Jodhpur Blue", hexCode: "#2f4b7c", imaginStudioColorCode: null, oemPaintName: "Jodhpur Blue" },
      { id: "col-classic-chrome", vehicleId: "veh-royal-enfield-classic-350", name: "Chrome Bronze", hexCode: "#8a6a44", imaginStudioColorCode: null, oemPaintName: "Chrome Bronze" },
    ],
    images: kit("veh-royal-enfield-classic-350", "royal-enfield-classic-350", [
      "royal-enfield-classic-350-1.jpg",
      "royal-enfield-classic-350-2.jpg",
      "royal-enfield-classic-350-3.jpg",
    ]),
  },
  {
    id: "veh-tvs-iqube",
    slug: "tvs-iqube",
    name: "TVS iQube",
    type: "BIKE",
    brand: "TVS",
    bodyType: "Electric Scooter",
    safetyRatingNCAP: null,
    isElectric: true,
    luggageCapacityBags: null,
    // For electric vehicles this column carries equivalent km per kWh, so the
    // same field stays meaningful across petrol and battery powertrains.
    realMileageKmPerLitre: 32.0,
    bestForHeadline: "City commuting at about 25 paise a kilometre",
    variants: [
      { id: "var-iqube-22", vehicleId: "veh-tvs-iqube", name: "iQube 2.2 kWh", fuelType: "ELECTRIC", transmissionType: "EV", exShowroomPricePence: inr(94_000), engineCc: null, seatingCapacity: 2, isPopular: false },
      { id: "var-iqube-34", vehicleId: "veh-tvs-iqube", name: "iQube 3.4 kWh", fuelType: "ELECTRIC", transmissionType: "EV", exShowroomPricePence: inr(1_17_000), engineCc: null, seatingCapacity: 2, isPopular: true },
      { id: "var-iqube-s", vehicleId: "veh-tvs-iqube", name: "iQube S", fuelType: "ELECTRIC", transmissionType: "EV", exShowroomPricePence: inr(1_25_000), engineCc: null, seatingCapacity: 2, isPopular: false },
      { id: "var-iqube-st", vehicleId: "veh-tvs-iqube", name: "iQube ST", fuelType: "ELECTRIC", transmissionType: "EV", exShowroomPricePence: inr(1_45_000), engineCc: null, seatingCapacity: 2, isPopular: false },
    ],
    colors: [
      { id: "col-iqube-white", vehicleId: "veh-tvs-iqube", name: "Pearl White", hexCode: "#f2f4f5", imaginStudioColorCode: null, oemPaintName: "Pearl White" },
      { id: "col-iqube-grey", vehicleId: "veh-tvs-iqube", name: "Titanium Grey", hexCode: "#6a6f75", imaginStudioColorCode: null, oemPaintName: "Titanium Grey" },
      { id: "col-iqube-red", vehicleId: "veh-tvs-iqube", name: "Lucid Red", hexCode: "#a5232c", imaginStudioColorCode: null, oemPaintName: "Lucid Red" },
      { id: "col-iqube-blue", vehicleId: "veh-tvs-iqube", name: "Starlight Blue", hexCode: "#26456f", imaginStudioColorCode: null, oemPaintName: "Starlight Blue" },
    ],
    images: kit("veh-tvs-iqube", "tvs-iqube", ["tvs-iqube-1.jpg"]),
  },
  {
    id: "veh-ola-s1",
    slug: "ola-s1",
    name: "Ola S1",
    type: "BIKE",
    brand: "Ola",
    bodyType: "Electric Scooter",
    safetyRatingNCAP: null,
    isElectric: true,
    luggageCapacityBags: null,
    realMileageKmPerLitre: 28.0,
    bestForHeadline: "A city scooter you charge at home, not at a pump",
    variants: [
      { id: "var-ola-s1x", vehicleId: "veh-ola-s1", name: "S1 X", fuelType: "ELECTRIC", transmissionType: "EV", exShowroomPricePence: inr(80_000), engineCc: null, seatingCapacity: 2, isPopular: false },
      { id: "var-ola-s1-air", vehicleId: "veh-ola-s1", name: "S1 Air", fuelType: "ELECTRIC", transmissionType: "EV", exShowroomPricePence: inr(90_000), engineCc: null, seatingCapacity: 2, isPopular: false },
      { id: "var-ola-s1-pro", vehicleId: "veh-ola-s1", name: "S1 Pro", fuelType: "ELECTRIC", transmissionType: "EV", exShowroomPricePence: inr(1_15_000), engineCc: null, seatingCapacity: 2, isPopular: true },
      { id: "var-ola-s1-pro-plus", vehicleId: "veh-ola-s1", name: "S1 Pro+", fuelType: "ELECTRIC", transmissionType: "EV", exShowroomPricePence: inr(1_40_000), engineCc: null, seatingCapacity: 2, isPopular: false },
    ],
    colors: [
      { id: "col-ola-white", vehicleId: "veh-ola-s1", name: "Porcelain White", hexCode: "#f4f6f7", imaginStudioColorCode: null, oemPaintName: "Porcelain White" },
      { id: "col-ola-blue", vehicleId: "veh-ola-s1", name: "Midnight Blue", hexCode: "#1c3558", imaginStudioColorCode: null, oemPaintName: "Midnight Blue" },
      { id: "col-ola-black", vehicleId: "veh-ola-s1", name: "Jet Black", hexCode: "#16181c", imaginStudioColorCode: null, oemPaintName: "Jet Black" },
      { id: "col-ola-silver", vehicleId: "veh-ola-s1", name: "Liquid Silver", hexCode: "#b8bec4", imaginStudioColorCode: null, oemPaintName: "Liquid Silver" },
    ],
    images: kit("veh-ola-s1", "ola-s1", ["ola-s1-1.jpg", "ola-s1-2.jpg"]),
  },
  {
    id: "veh-ducati-panigale-v4",
    slug: "ducati-panigale-v4",
    name: "Ducati Panigale V4",
    type: "BIKE",
    brand: "Ducati",
    bodyType: "Superbike",
    safetyRatingNCAP: null,
    isElectric: false,
    luggageCapacityBags: null,
    realMileageKmPerLitre: 14.0,
    bestForHeadline: "A track-bred superbike you can still ride to the cafe",
    variants: [
      { id: "var-panigale-v4", vehicleId: "veh-ducati-panigale-v4", name: "Panigale V4", fuelType: "PETROL", transmissionType: "MANUAL", exShowroomPricePence: inr(27_50_000), engineCc: 1103, seatingCapacity: 2, isPopular: false },
      { id: "var-panigale-v4s", vehicleId: "veh-ducati-panigale-v4", name: "Panigale V4 S", fuelType: "PETROL", transmissionType: "MANUAL", exShowroomPricePence: inr(33_50_000), engineCc: 1103, seatingCapacity: 2, isPopular: true },
      { id: "var-panigale-v4s-corse", vehicleId: "veh-ducati-panigale-v4", name: "Panigale V4 S Corse", fuelType: "PETROL", transmissionType: "MANUAL", exShowroomPricePence: inr(36_00_000), engineCc: 1103, seatingCapacity: 2, isPopular: false },
    ],
    colors: [
      { id: "col-panigale-red", vehicleId: "veh-ducati-panigale-v4", name: "Ducati Red", hexCode: "#c8102e", imaginStudioColorCode: "red", oemPaintName: "Ducati Red" },
      { id: "col-panigale-stealth", vehicleId: "veh-ducati-panigale-v4", name: "Dark Stealth", hexCode: "#1a1c1f", imaginStudioColorCode: "black", oemPaintName: "Dark Stealth" },
    ],
    images: kit("veh-ducati-panigale-v4", "ducati-panigale-v4", [
      "ducati-panigale-v4-1.jpg",
      "ducati-panigale-v4-2.jpg",
    ]),
  },

  // --- Hyundai expanded line-up -------------------------------------------
  {
    id: "veh-hyundai-alcazar",
    slug: "hyundai-alcazar",
    name: "Hyundai Alcazar",
    type: "CAR",
    brand: "Hyundai",
    bodyType: "Midsize SUV",
    safetyRatingNCAP: 5,
    isElectric: false,
    luggageCapacityBags: 4,
    realMileageKmPerLitre: 14.5,
    bestForHeadline: "A 6/7-seater SUV that still handles city parking",
    variants: [
      { id: "var-alcazar-exec", vehicleId: "veh-hyundai-alcazar", name: "Executive", fuelType: "PETROL", transmissionType: "MANUAL", exShowroomPricePence: inr(14_50_700), engineCc: 1482, seatingCapacity: 7, isPopular: false },
      { id: "var-alcazar-plat", vehicleId: "veh-hyundai-alcazar", name: "Platinum", fuelType: "DIESEL", transmissionType: "AUTO_TORQUE_CONVERTER", exShowroomPricePence: inr(20_10_000), engineCc: 1493, seatingCapacity: 7, isPopular: true },
    ],
    colors: [
      { id: "col-alcazar-white", vehicleId: "veh-hyundai-alcazar", name: "Atlas White", hexCode: "#f2f4f6", imaginStudioColorCode: "white", oemPaintName: "Atlas White" },
      { id: "col-alcazar-black", vehicleId: "veh-hyundai-alcazar", name: "Phantom Black", hexCode: "#14161a", imaginStudioColorCode: "black", oemPaintName: "Phantom Black" },
    ],
    images: kit("veh-hyundai-alcazar", "hyundai-alcazar", ["hyundai-alcazar.webp"]),
  },
  {
    id: "veh-hyundai-exter",
    slug: "hyundai-exter",
    name: "Hyundai Exter",
    type: "CAR",
    brand: "Hyundai",
    bodyType: "Compact SUV",
    safetyRatingNCAP: 3,
    isElectric: false,
    luggageCapacityBags: 2,
    realMileageKmPerLitre: 19.2,
    bestForHeadline: "A city-friendly micro SUV with a loaded feature list",
    variants: [
      { id: "var-exter-ex", vehicleId: "veh-hyundai-exter", name: "EX", fuelType: "PETROL", transmissionType: "MANUAL", exShowroomPricePence: inr(6_13_000), engineCc: 1197, seatingCapacity: 5, isPopular: false },
      { id: "var-exter-sx", vehicleId: "veh-hyundai-exter", name: "SX(O)", fuelType: "PETROL", transmissionType: "AUTO_AMT", exShowroomPricePence: inr(10_38_000), engineCc: 1197, seatingCapacity: 5, isPopular: true },
    ],
    colors: [
      { id: "col-exter-red", vehicleId: "veh-hyundai-exter", name: "Fiery Red", hexCode: "#c8102e", imaginStudioColorCode: "red", oemPaintName: "Fiery Red" },
      { id: "col-exter-white", vehicleId: "veh-hyundai-exter", name: "Atlas White", hexCode: "#f2f4f6", imaginStudioColorCode: "white", oemPaintName: "Atlas White" },
    ],
    images: kit("veh-hyundai-exter", "hyundai-exter", ["hyundai-exter.webp"]),
  },
  {
    id: "veh-hyundai-verna",
    slug: "hyundai-verna",
    name: "Hyundai Verna",
    type: "CAR",
    brand: "Hyundai",
    bodyType: "Sedan",
    safetyRatingNCAP: 5,
    isElectric: false,
    luggageCapacityBags: 4,
    realMileageKmPerLitre: 17.5,
    bestForHeadline: "A premium sedan with highway stability and feature-rich cabin",
    variants: [
      { id: "var-verna-ex", vehicleId: "veh-hyundai-verna", name: "EX", fuelType: "PETROL", transmissionType: "MANUAL", exShowroomPricePence: inr(11_00_000), engineCc: 1497, seatingCapacity: 5, isPopular: false },
      { id: "var-verna-sx-turbo", vehicleId: "veh-hyundai-verna", name: "SX(O) Turbo DCT", fuelType: "PETROL", transmissionType: "AUTO_TORQUE_CONVERTER", exShowroomPricePence: inr(17_38_000), engineCc: 1482, seatingCapacity: 5, isPopular: true },
    ],
    colors: [
      { id: "col-verna-blue", vehicleId: "veh-hyundai-verna", name: "Typhoon Silver", hexCode: "#b6bbc0", imaginStudioColorCode: "silver", oemPaintName: "Typhoon Silver" },
      { id: "col-verna-black", vehicleId: "veh-hyundai-verna", name: "Abyss Black", hexCode: "#14161a", imaginStudioColorCode: "black", oemPaintName: "Abyss Black" },
    ],
    images: kit("veh-hyundai-verna", "hyundai-verna", ["hyundai-verna.webp"]),
  },
  {
    id: "veh-hyundai-aura",
    slug: "hyundai-aura",
    name: "Hyundai Aura",
    type: "CAR",
    brand: "Hyundai",
    bodyType: "Compact Sedan",
    safetyRatingNCAP: 2,
    isElectric: false,
    luggageCapacityBags: 3,
    realMileageKmPerLitre: 21.0,
    bestForHeadline: "A compact sedan for daily commuting with great fuel economy",
    variants: [
      { id: "var-aura-e", vehicleId: "veh-hyundai-aura", name: "E", fuelType: "PETROL", transmissionType: "MANUAL", exShowroomPricePence: inr(6_49_000), engineCc: 1197, seatingCapacity: 5, isPopular: false },
      { id: "var-aura-sx-cng", vehicleId: "veh-hyundai-aura", name: "SX+ CNG", fuelType: "CNG", transmissionType: "MANUAL", exShowroomPricePence: inr(8_89_000), engineCc: 1197, seatingCapacity: 5, isPopular: true },
    ],
    colors: [
      { id: "col-aura-white", vehicleId: "veh-hyundai-aura", name: "Polar White", hexCode: "#f3f5f6", imaginStudioColorCode: "white", oemPaintName: "Polar White" },
    ],
    images: kit("veh-hyundai-aura", "hyundai-aura", ["hyundai-aura.webp"]),
  },
  {
    id: "veh-hyundai-i20",
    slug: "hyundai-i20",
    name: "Hyundai i20",
    type: "CAR",
    brand: "Hyundai",
    bodyType: "Premium Hatchback",
    safetyRatingNCAP: 3,
    isElectric: false,
    luggageCapacityBags: 2,
    realMileageKmPerLitre: 18.0,
    bestForHeadline: "A premium hatchback with sporty looks and a feature-rich cabin",
    variants: [
      { id: "var-i20-magna", vehicleId: "veh-hyundai-i20", name: "Magna", fuelType: "PETROL", transmissionType: "MANUAL", exShowroomPricePence: inr(7_04_000), engineCc: 1197, seatingCapacity: 5, isPopular: false },
      { id: "var-i20-asta-turbo", vehicleId: "veh-hyundai-i20", name: "Asta(O) Turbo DCT", fuelType: "PETROL", transmissionType: "AUTO_TORQUE_CONVERTER", exShowroomPricePence: inr(11_50_000), engineCc: 998, seatingCapacity: 5, isPopular: true },
    ],
    colors: [
      { id: "col-i20-red", vehicleId: "veh-hyundai-i20", name: "Fiery Red", hexCode: "#c8102e", imaginStudioColorCode: "red", oemPaintName: "Fiery Red" },
      { id: "col-i20-blue", vehicleId: "veh-hyundai-i20", name: "Starry Night", hexCode: "#1a2c5b", imaginStudioColorCode: "blue", oemPaintName: "Starry Night" },
    ],
    images: kit("veh-hyundai-i20", "hyundai-i20", ["hyundai-i20.webp"]),
  },
  {
    id: "veh-hyundai-grand-i10-nios",
    slug: "hyundai-grand-i10-nios",
    name: "Hyundai Grand i10 NIOS",
    type: "CAR",
    brand: "Hyundai",
    bodyType: "Hatchback",
    safetyRatingNCAP: 2,
    isElectric: false,
    luggageCapacityBags: 2,
    realMileageKmPerLitre: 20.7,
    bestForHeadline: "An affordable hatchback with a spacious cabin and CNG option",
    variants: [
      { id: "var-gi10-era", vehicleId: "veh-hyundai-grand-i10-nios", name: "Era", fuelType: "PETROL", transmissionType: "MANUAL", exShowroomPricePence: inr(5_73_000), engineCc: 1197, seatingCapacity: 5, isPopular: false },
      { id: "var-gi10-sportz-cng", vehicleId: "veh-hyundai-grand-i10-nios", name: "Sportz CNG", fuelType: "CNG", transmissionType: "MANUAL", exShowroomPricePence: inr(7_76_000), engineCc: 1197, seatingCapacity: 5, isPopular: true },
    ],
    colors: [
      { id: "col-gi10-silver", vehicleId: "veh-hyundai-grand-i10-nios", name: "Typhoon Silver", hexCode: "#b6bbc0", imaginStudioColorCode: "silver", oemPaintName: "Typhoon Silver" },
    ],
    images: kit("veh-hyundai-grand-i10-nios", "hyundai-grand-i10-nios", ["hyundai-grand-i10-nios.webp"]),
  },
  {
    id: "veh-hyundai-ioniq-5",
    slug: "hyundai-ioniq-5",
    name: "Hyundai IONIQ 5",
    type: "CAR",
    brand: "Hyundai",
    bodyType: "Electric SUV",
    safetyRatingNCAP: 5,
    isElectric: true,
    luggageCapacityBags: 4,
    realMileageKmPerLitre: 6.2,
    bestForHeadline: "A futuristic EV crossover with ultra-fast 800V charging",
    variants: [
      { id: "var-ioniq5-ins", vehicleId: "veh-hyundai-ioniq-5", name: "Inspiration", fuelType: "ELECTRIC", transmissionType: "EV", exShowroomPricePence: inr(44_95_000), engineCc: null, seatingCapacity: 5, isPopular: true },
    ],
    colors: [
      { id: "col-ioniq5-white", vehicleId: "veh-hyundai-ioniq-5", name: "Atlas White", hexCode: "#f2f4f6", imaginStudioColorCode: "white", oemPaintName: "Atlas White" },
      { id: "col-ioniq5-grey", vehicleId: "veh-hyundai-ioniq-5", name: "Gravity Gold Matte", hexCode: "#8a7f6b", imaginStudioColorCode: null, oemPaintName: "Gravity Gold Matte" },
    ],
    images: kit("veh-hyundai-ioniq-5", "hyundai-ioniq-5", ["hyundai-ioniq-5.webp"]),
  },
  {
    id: "veh-hyundai-prime-hb",
    slug: "hyundai-prime-hb",
    name: "Hyundai Prime HB",
    type: "CAR",
    brand: "Hyundai",
    bodyType: "Taxi / Commercial",
    safetyRatingNCAP: null,
    isElectric: false,
    luggageCapacityBags: 3,
    realMileageKmPerLitre: 24.0,
    bestForHeadline: "A purpose-built commercial hatchback for fleet operators",
    variants: [
      { id: "var-prime-hb-base", vehicleId: "veh-hyundai-prime-hb", name: "Base CNG", fuelType: "CNG", transmissionType: "MANUAL", exShowroomPricePence: inr(6_30_000), engineCc: 1197, seatingCapacity: 5, isPopular: true },
    ],
    colors: [
      { id: "col-prime-white", vehicleId: "veh-hyundai-prime-hb", name: "Polar White", hexCode: "#f3f5f6", imaginStudioColorCode: "white", oemPaintName: "Polar White" },
    ],
    images: kit("veh-hyundai-prime-hb", "hyundai-prime-hb", ["hyundai-prime-hb.webp"]),
  },

  // --- Tata expanded line-up ----------------------------------------------
  {
    id: "veh-tata-punch",
    slug: "tata-punch",
    name: "Tata Punch",
    type: "CAR",
    brand: "Tata",
    bodyType: "Compact SUV",
    safetyRatingNCAP: 5,
    isElectric: false,
    luggageCapacityBags: 2,
    realMileageKmPerLitre: 18.8,
    bestForHeadline: "The safest micro-SUV in India with a fun personality",
    variants: [
      { id: "var-punch-pure", vehicleId: "veh-tata-punch", name: "Pure", fuelType: "PETROL", transmissionType: "MANUAL", exShowroomPricePence: inr(6_13_000), engineCc: 1199, seatingCapacity: 5, isPopular: false },
      { id: "var-punch-creative-amt", vehicleId: "veh-tata-punch", name: "Creative+ AMT", fuelType: "PETROL", transmissionType: "AUTO_AMT", exShowroomPricePence: inr(9_54_000), engineCc: 1199, seatingCapacity: 5, isPopular: true },
    ],
    colors: [
      { id: "col-punch-orange", vehicleId: "veh-tata-punch", name: "Tornado Blue", hexCode: "#2a5caa", imaginStudioColorCode: "blue", oemPaintName: "Tornado Blue" },
      { id: "col-punch-white2", vehicleId: "veh-tata-punch", name: "Orcus White", hexCode: "#f2f4f5", imaginStudioColorCode: "white", oemPaintName: "Orcus White" },
    ],
    images: kit("veh-tata-punch", "tata-punch", ["tata-punch.webp"]),
  },
  {
    id: "veh-tata-harrier",
    slug: "tata-harrier",
    name: "Tata Harrier",
    type: "CAR",
    brand: "Tata",
    bodyType: "Midsize SUV",
    safetyRatingNCAP: 5,
    isElectric: false,
    luggageCapacityBags: 4,
    realMileageKmPerLitre: 14.6,
    bestForHeadline: "A highway cruiser built on Land Rover's D8 platform",
    variants: [
      { id: "var-harrier-smart", vehicleId: "veh-tata-harrier", name: "Smart+", fuelType: "DIESEL", transmissionType: "MANUAL", exShowroomPricePence: inr(15_50_000), engineCc: 1956, seatingCapacity: 5, isPopular: false },
      { id: "var-harrier-fearless-at", vehicleId: "veh-tata-harrier", name: "Fearless+ AT", fuelType: "DIESEL", transmissionType: "AUTO_TORQUE_CONVERTER", exShowroomPricePence: inr(24_70_000), engineCc: 1956, seatingCapacity: 5, isPopular: true },
    ],
    colors: [
      { id: "col-harrier-white", vehicleId: "veh-tata-harrier", name: "Orcus White", hexCode: "#f2f4f5", imaginStudioColorCode: "white", oemPaintName: "Orcus White" },
      { id: "col-harrier-red", vehicleId: "veh-tata-harrier", name: "Coral Red", hexCode: "#b5202a", imaginStudioColorCode: "red", oemPaintName: "Coral Red" },
    ],
    images: kit("veh-tata-harrier", "tata-harrier", ["tata-harrier.webp"]),
  },
  {
    id: "veh-tata-safari",
    slug: "tata-safari",
    name: "Tata Safari",
    type: "CAR",
    brand: "Tata",
    bodyType: "Full-size SUV",
    safetyRatingNCAP: 5,
    isElectric: false,
    luggageCapacityBags: 5,
    realMileageKmPerLitre: 14.0,
    bestForHeadline: "A spacious 7-seater flagship for family road trips",
    variants: [
      { id: "var-safari-smart", vehicleId: "veh-tata-safari", name: "Smart+", fuelType: "DIESEL", transmissionType: "MANUAL", exShowroomPricePence: inr(16_19_000), engineCc: 1956, seatingCapacity: 7, isPopular: false },
      { id: "var-safari-accomplished-at", vehicleId: "veh-tata-safari", name: "Accomplished+ AT", fuelType: "DIESEL", transmissionType: "AUTO_TORQUE_CONVERTER", exShowroomPricePence: inr(26_40_000), engineCc: 1956, seatingCapacity: 7, isPopular: true },
    ],
    colors: [
      { id: "col-safari-green", vehicleId: "veh-tata-safari", name: "Cosmic Gold", hexCode: "#8a7f6b", imaginStudioColorCode: null, oemPaintName: "Cosmic Gold" },
      { id: "col-safari-white", vehicleId: "veh-tata-safari", name: "Orcus White", hexCode: "#f2f4f5", imaginStudioColorCode: "white", oemPaintName: "Orcus White" },
    ],
    images: kit("veh-tata-safari", "tata-safari", ["tata-safari.webp"]),
  },
  {
    id: "veh-tata-curvv",
    slug: "tata-curvv",
    name: "Tata Curvv",
    type: "CAR",
    brand: "Tata",
    bodyType: "Sedan",
    safetyRatingNCAP: 5,
    isElectric: false,
    luggageCapacityBags: 3,
    realMileageKmPerLitre: 18.5,
    bestForHeadline: "A coupe-SUV with sedan comfort and crossover practicality",
    variants: [
      { id: "var-curvv-smart", vehicleId: "veh-tata-curvv", name: "Smart+", fuelType: "PETROL", transmissionType: "MANUAL", exShowroomPricePence: inr(10_00_000), engineCc: 1199, seatingCapacity: 5, isPopular: false },
      { id: "var-curvv-accomplished-diesel", vehicleId: "veh-tata-curvv", name: "Accomplished+ Diesel AT", fuelType: "DIESEL", transmissionType: "AUTO_TORQUE_CONVERTER", exShowroomPricePence: inr(19_60_000), engineCc: 1497, seatingCapacity: 5, isPopular: true },
    ],
    colors: [
      { id: "col-curvv-blue", vehicleId: "veh-tata-curvv", name: "Virtual Sunrise", hexCode: "#e85d00", imaginStudioColorCode: null, oemPaintName: "Virtual Sunrise" },
    ],
    images: kit("veh-tata-curvv", "tata-curvv", ["tata-curvv.webp"]),
  },
  {
    id: "veh-tata-tigor",
    slug: "tata-tigor",
    name: "Tata Tigor",
    type: "CAR",
    brand: "Tata",
    bodyType: "Compact Sedan",
    safetyRatingNCAP: 4,
    isElectric: false,
    luggageCapacityBags: 3,
    realMileageKmPerLitre: 19.0,
    bestForHeadline: "An affordable sedan with a stylish design and decent boot",
    variants: [
      { id: "var-tigor-xe", vehicleId: "veh-tata-tigor", name: "XE", fuelType: "PETROL", transmissionType: "MANUAL", exShowroomPricePence: inr(6_00_000), engineCc: 1199, seatingCapacity: 5, isPopular: false },
      { id: "var-tigor-xz-cng", vehicleId: "veh-tata-tigor", name: "XZ+ CNG", fuelType: "CNG", transmissionType: "MANUAL", exShowroomPricePence: inr(8_90_000), engineCc: 1199, seatingCapacity: 5, isPopular: true },
    ],
    colors: [
      { id: "col-tigor-white", vehicleId: "veh-tata-tigor", name: "Pearlescent White", hexCode: "#f2f4f5", imaginStudioColorCode: "white", oemPaintName: "Pearlescent White" },
    ],
    images: kit("veh-tata-tigor", "tata-tigor", ["tata-tigor.webp"]),
  },
  {
    id: "veh-tata-tiago",
    slug: "tata-tiago",
    name: "Tata Tiago",
    type: "CAR",
    brand: "Tata",
    bodyType: "Hatchback",
    safetyRatingNCAP: 4,
    isElectric: false,
    luggageCapacityBags: 2,
    realMileageKmPerLitre: 20.1,
    bestForHeadline: "An entry-level hatchback with a 4-star safety rating",
    variants: [
      { id: "var-tiago-xe", vehicleId: "veh-tata-tiago", name: "XE", fuelType: "PETROL", transmissionType: "MANUAL", exShowroomPricePence: inr(5_00_000), engineCc: 1199, seatingCapacity: 5, isPopular: false },
      { id: "var-tiago-xz-cng", vehicleId: "veh-tata-tiago", name: "XZ+ CNG AMT", fuelType: "CNG", transmissionType: "AUTO_AMT", exShowroomPricePence: inr(7_74_000), engineCc: 1199, seatingCapacity: 5, isPopular: true },
    ],
    colors: [
      { id: "col-tiago-blue", vehicleId: "veh-tata-tiago", name: "Daytona Grey", hexCode: "#5f646a", imaginStudioColorCode: "grey", oemPaintName: "Daytona Grey" },
    ],
    images: kit("veh-tata-tiago", "tata-tiago", ["tata-tiago.webp"]),
  },
  {
    id: "veh-tata-nexon-ev",
    slug: "tata-nexon-ev",
    name: "Tata Nexon EV",
    type: "CAR",
    brand: "Tata",
    bodyType: "Electric SUV",
    safetyRatingNCAP: 5,
    isElectric: true,
    luggageCapacityBags: 3,
    realMileageKmPerLitre: 7.5,
    bestForHeadline: "India's best-selling electric SUV with over 400 km range",
    variants: [
      { id: "var-nexon-ev-creative", vehicleId: "veh-tata-nexon-ev", name: "Creative+", fuelType: "ELECTRIC", transmissionType: "EV", exShowroomPricePence: inr(14_50_000), engineCc: null, seatingCapacity: 5, isPopular: false },
      { id: "var-nexon-ev-empowered-lr", vehicleId: "veh-tata-nexon-ev", name: "Empowered+ Long Range", fuelType: "ELECTRIC", transmissionType: "EV", exShowroomPricePence: inr(17_50_000), engineCc: null, seatingCapacity: 5, isPopular: true },
    ],
    colors: [
      { id: "col-nexon-ev-teal", vehicleId: "veh-tata-nexon-ev", name: "Pristine White", hexCode: "#f2f4f5", imaginStudioColorCode: "white", oemPaintName: "Pristine White" },
      { id: "col-nexon-ev-blue", vehicleId: "veh-tata-nexon-ev", name: "Fearless Purple", hexCode: "#5a3b8a", imaginStudioColorCode: null, oemPaintName: "Fearless Purple" },
    ],
    images: kit("veh-tata-nexon-ev", "tata-nexon-ev", ["tata-nexon-ev.webp"]),
  },

  // --- Maruti Suzuki expanded line-up -------------------------------------
  {
    id: "veh-maruti-brezza",
    slug: "maruti-brezza",
    name: "Maruti Suzuki Brezza",
    type: "CAR",
    brand: "Maruti Suzuki",
    bodyType: "Compact SUV",
    safetyRatingNCAP: 4,
    isElectric: false,
    luggageCapacityBags: 3,
    realMileageKmPerLitre: 19.8,
    bestForHeadline: "India's best-selling compact SUV with legendary Maruti reliability",
    variants: [
      { id: "var-brezza-lxi", vehicleId: "veh-maruti-brezza", name: "LXi", fuelType: "PETROL", transmissionType: "MANUAL", exShowroomPricePence: inr(8_34_000), engineCc: 1462, seatingCapacity: 5, isPopular: false },
      { id: "var-brezza-zxi-at", vehicleId: "veh-maruti-brezza", name: "ZXi+ AT", fuelType: "PETROL", transmissionType: "AUTO_TORQUE_CONVERTER", exShowroomPricePence: inr(14_14_000), engineCc: 1462, seatingCapacity: 5, isPopular: true },
    ],
    colors: [
      { id: "col-brezza-blue", vehicleId: "veh-maruti-brezza", name: "Brave Khakhi", hexCode: "#6b6a45", imaginStudioColorCode: null, oemPaintName: "Brave Khakhi" },
    ],
    images: kit("veh-maruti-brezza", "maruti-brezza", ["maruti-brezza.webp"]),
  },
  {
    id: "veh-maruti-grand-vitara",
    slug: "maruti-grand-vitara",
    name: "Maruti Suzuki Grand Vitara",
    type: "CAR",
    brand: "Maruti Suzuki",
    bodyType: "Midsize SUV",
    safetyRatingNCAP: 5,
    isElectric: false,
    luggageCapacityBags: 3,
    realMileageKmPerLitre: 21.1,
    bestForHeadline: "A strong hybrid SUV that gives 27 km/l in the real world",
    variants: [
      { id: "var-gv-sigma", vehicleId: "veh-maruti-grand-vitara", name: "Sigma", fuelType: "PETROL", transmissionType: "MANUAL", exShowroomPricePence: inr(11_00_000), engineCc: 1462, seatingCapacity: 5, isPopular: false },
      { id: "var-gv-alpha-hybrid", vehicleId: "veh-maruti-grand-vitara", name: "Alpha+ Strong Hybrid", fuelType: "HYBRID", transmissionType: "AUTO_TORQUE_CONVERTER", exShowroomPricePence: inr(19_64_000), engineCc: 1490, seatingCapacity: 5, isPopular: true },
    ],
    colors: [
      { id: "col-gv-white", vehicleId: "veh-maruti-grand-vitara", name: "Arctic White", hexCode: "#f4f6f7", imaginStudioColorCode: "white", oemPaintName: "Arctic White" },
    ],
    images: kit("veh-maruti-grand-vitara", "maruti-grand-vitara", ["maruti-grand-vitara.webp"]),
  },
  {
    id: "veh-maruti-dzire",
    slug: "maruti-dzire",
    name: "Maruti Suzuki Dzire",
    type: "CAR",
    brand: "Maruti Suzuki",
    bodyType: "Compact Sedan",
    safetyRatingNCAP: 5,
    isElectric: false,
    luggageCapacityBags: 3,
    realMileageKmPerLitre: 24.1,
    bestForHeadline: "India's favourite sedan — frugal, spacious, sensible",
    variants: [
      { id: "var-dzire-lxi", vehicleId: "veh-maruti-dzire", name: "LXi", fuelType: "PETROL", transmissionType: "MANUAL", exShowroomPricePence: inr(6_79_000), engineCc: 1197, seatingCapacity: 5, isPopular: false },
      { id: "var-dzire-zxi-amt", vehicleId: "veh-maruti-dzire", name: "ZXi+ AMT", fuelType: "PETROL", transmissionType: "AUTO_AMT", exShowroomPricePence: inr(9_99_000), engineCc: 1197, seatingCapacity: 5, isPopular: true },
    ],
    colors: [
      { id: "col-dzire-silver", vehicleId: "veh-maruti-dzire", name: "Silky Silver", hexCode: "#b6bbc0", imaginStudioColorCode: "silver", oemPaintName: "Silky Silver" },
    ],
    images: kit("veh-maruti-dzire", "maruti-dzire", ["maruti-dzire.webp"]),
  },
  {
    id: "veh-maruti-ciaz",
    slug: "maruti-ciaz",
    name: "Maruti Suzuki Ciaz",
    type: "CAR",
    brand: "Maruti Suzuki",
    bodyType: "Sedan",
    safetyRatingNCAP: 3,
    isElectric: false,
    luggageCapacityBags: 4,
    realMileageKmPerLitre: 20.0,
    bestForHeadline: "A spacious mid-size sedan with an enormous boot",
    variants: [
      { id: "var-ciaz-sigma", vehicleId: "veh-maruti-ciaz", name: "Sigma", fuelType: "PETROL", transmissionType: "MANUAL", exShowroomPricePence: inr(9_30_000), engineCc: 1462, seatingCapacity: 5, isPopular: false },
      { id: "var-ciaz-alpha-at", vehicleId: "veh-maruti-ciaz", name: "Alpha AT", fuelType: "PETROL", transmissionType: "AUTO_TORQUE_CONVERTER", exShowroomPricePence: inr(12_30_000), engineCc: 1462, seatingCapacity: 5, isPopular: true },
    ],
    colors: [
      { id: "col-ciaz-grey", vehicleId: "veh-maruti-ciaz", name: "Magma Grey", hexCode: "#5d6268", imaginStudioColorCode: "grey", oemPaintName: "Magma Grey" },
    ],
    images: kit("veh-maruti-ciaz", "maruti-ciaz", ["maruti-ciaz.webp"]),
  },
  {
    id: "veh-maruti-swift",
    slug: "maruti-swift",
    name: "Maruti Suzuki Swift",
    type: "CAR",
    brand: "Maruti Suzuki",
    bodyType: "Hatchback",
    safetyRatingNCAP: 1,
    isElectric: false,
    luggageCapacityBags: 2,
    realMileageKmPerLitre: 22.3,
    bestForHeadline: "The nimble hatchback that defined a generation of city drivers",
    variants: [
      { id: "var-swift-lxi", vehicleId: "veh-maruti-swift", name: "LXi", fuelType: "PETROL", transmissionType: "MANUAL", exShowroomPricePence: inr(6_49_000), engineCc: 1197, seatingCapacity: 5, isPopular: false },
      { id: "var-swift-zxi-amt", vehicleId: "veh-maruti-swift", name: "ZXi+ AMT", fuelType: "PETROL", transmissionType: "AUTO_AMT", exShowroomPricePence: inr(9_29_000), engineCc: 1197, seatingCapacity: 5, isPopular: true },
    ],
    colors: [
      { id: "col-swift-red", vehicleId: "veh-maruti-swift", name: "Solid Fire Red", hexCode: "#c8102e", imaginStudioColorCode: "red", oemPaintName: "Solid Fire Red" },
      { id: "col-swift-blue", vehicleId: "veh-maruti-swift", name: "Luster Blue", hexCode: "#2a5caa", imaginStudioColorCode: "blue", oemPaintName: "Luster Blue" },
    ],
    images: kit("veh-maruti-swift", "maruti-swift", ["maruti-swift.webp"]),
  },
  {
    id: "veh-maruti-baleno",
    slug: "maruti-baleno",
    name: "Maruti Suzuki Baleno",
    type: "CAR",
    brand: "Maruti Suzuki",
    bodyType: "Premium Hatchback",
    safetyRatingNCAP: 3,
    isElectric: false,
    luggageCapacityBags: 2,
    realMileageKmPerLitre: 22.4,
    bestForHeadline: "A premium hatchback with a spacious cabin and feature-rich dashboard",
    variants: [
      { id: "var-baleno-sigma", vehicleId: "veh-maruti-baleno", name: "Sigma", fuelType: "PETROL", transmissionType: "MANUAL", exShowroomPricePence: inr(6_66_000), engineCc: 1197, seatingCapacity: 5, isPopular: false },
      { id: "var-baleno-alpha-amt", vehicleId: "veh-maruti-baleno", name: "Alpha AMT", fuelType: "PETROL", transmissionType: "AUTO_AMT", exShowroomPricePence: inr(9_83_000), engineCc: 1197, seatingCapacity: 5, isPopular: true },
    ],
    colors: [
      { id: "col-baleno-blue", vehicleId: "veh-maruti-baleno", name: "Luxe Beige", hexCode: "#c8b896", imaginStudioColorCode: null, oemPaintName: "Luxe Beige" },
    ],
    images: kit("veh-maruti-baleno", "maruti-baleno", ["maruti-baleno.webp"]),
  },

  // --- Mahindra expanded line-up ------------------------------------------
  {
    id: "veh-mahindra-scorpio-n",
    slug: "mahindra-scorpio-n",
    name: "Mahindra Scorpio-N",
    type: "CAR",
    brand: "Mahindra",
    bodyType: "Full-size SUV",
    safetyRatingNCAP: 5,
    isElectric: false,
    luggageCapacityBags: 4,
    realMileageKmPerLitre: 12.5,
    bestForHeadline: "A rugged body-on-frame SUV with 4WD and 5-star safety",
    variants: [
      { id: "var-scorpio-z4", vehicleId: "veh-mahindra-scorpio-n", name: "Z4", fuelType: "PETROL", transmissionType: "MANUAL", exShowroomPricePence: inr(13_85_000), engineCc: 1997, seatingCapacity: 7, isPopular: false },
      { id: "var-scorpio-z8l-4wd", vehicleId: "veh-mahindra-scorpio-n", name: "Z8 L Diesel 4WD AT", fuelType: "DIESEL", transmissionType: "AUTO_TORQUE_CONVERTER", exShowroomPricePence: inr(24_54_000), engineCc: 2184, seatingCapacity: 7, isPopular: true },
    ],
    colors: [
      { id: "col-scorpio-red", vehicleId: "veh-mahindra-scorpio-n", name: "Red Rage", hexCode: "#b5202a", imaginStudioColorCode: "red", oemPaintName: "Red Rage" },
      { id: "col-scorpio-white", vehicleId: "veh-mahindra-scorpio-n", name: "Everest White", hexCode: "#f3f5f6", imaginStudioColorCode: "white", oemPaintName: "Everest White" },
    ],
    images: kit("veh-mahindra-scorpio-n", "mahindra-scorpio-n", ["mahindra-scorpio-n.webp"]),
  },
  {
    id: "veh-mahindra-xuv700",
    slug: "mahindra-xuv700",
    name: "Mahindra XUV700",
    type: "CAR",
    brand: "Mahindra",
    bodyType: "Midsize SUV",
    safetyRatingNCAP: 5,
    isElectric: false,
    luggageCapacityBags: 4,
    realMileageKmPerLitre: 13.2,
    bestForHeadline: "A tech-loaded flagship SUV with ADAS and panoramic sunroof",
    variants: [
      { id: "var-xuv700-mx", vehicleId: "veh-mahindra-xuv700", name: "MX", fuelType: "PETROL", transmissionType: "MANUAL", exShowroomPricePence: inr(13_99_000), engineCc: 1997, seatingCapacity: 5, isPopular: false },
      { id: "var-xuv700-ax7l-at", vehicleId: "veh-mahindra-xuv700", name: "AX7 L Diesel AWD AT", fuelType: "DIESEL", transmissionType: "AUTO_TORQUE_CONVERTER", exShowroomPricePence: inr(27_49_000), engineCc: 2184, seatingCapacity: 7, isPopular: true },
    ],
    colors: [
      { id: "col-xuv700-red", vehicleId: "veh-mahindra-xuv700", name: "Midnight Black", hexCode: "#14161a", imaginStudioColorCode: "black", oemPaintName: "Midnight Black" },
      { id: "col-xuv700-white", vehicleId: "veh-mahindra-xuv700", name: "Everest White", hexCode: "#f3f5f6", imaginStudioColorCode: "white", oemPaintName: "Everest White" },
    ],
    images: kit("veh-mahindra-xuv700", "mahindra-xuv700", ["mahindra-xuv700.webp"]),
  },

  // --- Bikes expanded line-up ---------------------------------------------
  {
    id: "veh-royal-enfield-hunter-350",
    slug: "royal-enfield-hunter-350",
    name: "Royal Enfield Hunter 350",
    type: "BIKE",
    brand: "Royal Enfield",
    bodyType: "Cruiser",
    safetyRatingNCAP: null,
    isElectric: false,
    luggageCapacityBags: null,
    realMileageKmPerLitre: 36.2,
    bestForHeadline: "A sporty roadster for young riders who want RE DNA",
    variants: [
      { id: "var-hunter-retro", vehicleId: "veh-royal-enfield-hunter-350", name: "Retro", fuelType: "PETROL", transmissionType: "MANUAL", exShowroomPricePence: inr(1_50_000), engineCc: 349, seatingCapacity: 2, isPopular: false },
      { id: "var-hunter-metro", vehicleId: "veh-royal-enfield-hunter-350", name: "Metro", fuelType: "PETROL", transmissionType: "MANUAL", exShowroomPricePence: inr(1_70_000), engineCc: 349, seatingCapacity: 2, isPopular: true },
    ],
    colors: [
      { id: "col-hunter-rebel", vehicleId: "veh-royal-enfield-hunter-350", name: "Rebel Red", hexCode: "#c8102e", imaginStudioColorCode: null, oemPaintName: "Rebel Red" },
      { id: "col-hunter-black", vehicleId: "veh-royal-enfield-hunter-350", name: "Dapper Black", hexCode: "#14161a", imaginStudioColorCode: null, oemPaintName: "Dapper Black" },
    ],
    images: kit("veh-royal-enfield-hunter-350", "royal-enfield-hunter-350", ["royal-enfield-hunter-350.webp"]),
  },
  {
    id: "veh-tvs-apache-rtr",
    slug: "tvs-apache-rtr",
    name: "TVS Apache RTR",
    type: "BIKE",
    brand: "TVS",
    bodyType: "Sport Bike",
    safetyRatingNCAP: null,
    isElectric: false,
    luggageCapacityBags: null,
    realMileageKmPerLitre: 40.0,
    bestForHeadline: "A sporty commuter that's equally fun on weekend twisties",
    variants: [
      { id: "var-apache-160-4v", vehicleId: "veh-tvs-apache-rtr", name: "RTR 160 4V", fuelType: "PETROL", transmissionType: "MANUAL", exShowroomPricePence: inr(1_17_000), engineCc: 159, seatingCapacity: 2, isPopular: false },
      { id: "var-apache-200-4v", vehicleId: "veh-tvs-apache-rtr", name: "RTR 200 4V", fuelType: "PETROL", transmissionType: "MANUAL", exShowroomPricePence: inr(1_42_000), engineCc: 197, seatingCapacity: 2, isPopular: true },
    ],
    colors: [
      { id: "col-apache-red", vehicleId: "veh-tvs-apache-rtr", name: "Racing Red", hexCode: "#c8102e", imaginStudioColorCode: null, oemPaintName: "Racing Red" },
      { id: "col-apache-black", vehicleId: "veh-tvs-apache-rtr", name: "Matte Black", hexCode: "#1a1a1a", imaginStudioColorCode: null, oemPaintName: "Matte Black" },
    ],
    images: kit("veh-tvs-apache-rtr", "tvs-apache-rtr", ["tvs-apache-rtr.webp"]),
  },
];

export const vehicles: VehicleWithRelations[] = rawVehicles.map(finaliseVehicle);

// ---------------------------------------------------------------------------
// State road tax slabs
//
// Percentages follow each state's published motor vehicle tax notification.
// A row with an explicit fuelType overrides the catch-all row for that band,
// which is how the electric-vehicle exemptions below are expressed.
// ---------------------------------------------------------------------------

const CRORE = inr(1_00_00_000);

function band(
  id: string,
  stateCode: string,
  vehicleType: "CAR" | "BIKE",
  minRupees: number,
  maxRupees: number,
  taxPercentage: number,
  extra: Partial<RtoTaxRule> = {},
): RtoTaxRule {
  return {
    id,
    stateCode,
    vehicleType,
    fuelType: null,
    priceMin: inr(minRupees),
    priceMax: maxRupees === Infinity ? CRORE : inr(maxRupees),
    taxPercentage,
    cessPercentage: 0,
    fixedFee: 0,
    ...extra,
  };
}

/** Electric vehicles are exempt from road tax in all four launch states. */
function evExemption(
  id: string,
  stateCode: string,
  vehicleType: "CAR" | "BIKE",
): RtoTaxRule {
  return {
    id,
    stateCode,
    vehicleType,
    fuelType: "ELECTRIC",
    priceMin: 0,
    priceMax: CRORE,
    taxPercentage: 0,
    cessPercentage: 0,
    fixedFee: 0,
  };
}

export const rtoTaxRules: RtoTaxRule[] = [
  // Uttar Pradesh — the home state of the business.
  band("rto-up-car-1", "UP", "CAR", 0, 10_00_000, 8, { fixedFee: inr(1_500) }),
  band("rto-up-car-2", "UP", "CAR", 10_00_000, Infinity, 10, { fixedFee: inr(1_500) }),
  band("rto-up-bike-1", "UP", "BIKE", 0, 2_00_000, 7, { fixedFee: inr(300) }),
  band("rto-up-bike-2", "UP", "BIKE", 2_00_000, Infinity, 10, { fixedFee: inr(300) }),
  evExemption("rto-up-car-ev", "UP", "CAR"),
  evExemption("rto-up-bike-ev", "UP", "BIKE"),

  // Delhi — lowest car tax of the four, which is why grey-market registration
  // in Delhi is such a common (and illegal) workaround.
  band("rto-dl-car-1", "DL", "CAR", 0, 6_00_000, 4),
  band("rto-dl-car-2", "DL", "CAR", 6_00_000, 10_00_000, 7),
  band("rto-dl-car-3", "DL", "CAR", 10_00_000, Infinity, 10),
  band("rto-dl-bike-1", "DL", "BIKE", 0, 25_000, 2),
  band("rto-dl-bike-2", "DL", "BIKE", 25_000, Infinity, 4),
  evExemption("rto-dl-car-ev", "DL", "CAR"),
  evExemption("rto-dl-bike-ev", "DL", "BIKE"),

  // Maharashtra
  band("rto-mh-car-1", "MH", "CAR", 0, 10_00_000, 11),
  band("rto-mh-car-2", "MH", "CAR", 10_00_000, 20_00_000, 12),
  band("rto-mh-car-3", "MH", "CAR", 20_00_000, Infinity, 13),
  band("rto-mh-bike-1", "MH", "BIKE", 0, 1_00_000, 10),
  band("rto-mh-bike-2", "MH", "BIKE", 1_00_000, Infinity, 12),
  evExemption("rto-mh-car-ev", "MH", "CAR"),
  evExemption("rto-mh-bike-ev", "MH", "BIKE"),

  // Karnataka — the most expensive state in India to register a car, with an
  // infrastructure cess on top of the headline rate.
  band("rto-ka-car-1", "KA", "CAR", 0, 5_00_000, 13, { cessPercentage: 0.5 }),
  band("rto-ka-car-2", "KA", "CAR", 5_00_000, 10_00_000, 14, { cessPercentage: 0.5 }),
  band("rto-ka-car-3", "KA", "CAR", 10_00_000, 20_00_000, 17, { cessPercentage: 0.5 }),
  band("rto-ka-car-4", "KA", "CAR", 20_00_000, Infinity, 18, { cessPercentage: 0.5 }),
  band("rto-ka-bike-1", "KA", "BIKE", 0, 50_000, 10),
  band("rto-ka-bike-2", "KA", "BIKE", 50_000, 1_00_000, 12),
  band("rto-ka-bike-3", "KA", "BIKE", 1_00_000, Infinity, 18),
  evExemption("rto-ka-car-ev", "KA", "CAR"),
  evExemption("rto-ka-bike-ev", "KA", "BIKE"),
];

const CITY_TAX: Record<
  string,
  { car: number; bike: number; cess: number }
> = {
  Lucknow: { car: 8, bike: 7, cess: inr(1_500) },
  Noida: { car: 8, bike: 7, cess: inr(1_500) },
  "New Delhi": { car: 7, bike: 4, cess: 0 },
  Mumbai: { car: 12, bike: 10, cess: 0 },
  Pune: { car: 12, bike: 10, cess: 0 },
  Bengaluru: { car: 14, bike: 12, cess: inr(2_000) },
};

const CITY_FUELS: FuelType[] = ["PETROL", "DIESEL", "CNG", "ELECTRIC", "HYBRID"];

function cityRateId(
  city: string,
  vehicleType: VehicleType,
  fuel: FuelType,
): string {
  return `rate-${city.toLowerCase().replace(/\s+/g, "-")}-${vehicleType.toLowerCase()}-${fuel.toLowerCase()}`;
}

/** City-level rates the live quote engine prefers over a state-wide band. */
export const rtoTaxRates: RtoTaxRate[] = serviceCities.flatMap((city) => {
  const slab = CITY_TAX[city.name] ?? { car: 8, bike: 7, cess: 0 };
  return (["CAR", "BIKE"] as VehicleType[]).flatMap((vehicleType) =>
    CITY_FUELS.map((fuelType) => ({
      id: cityRateId(city.name, vehicleType, fuelType),
      stateCode: city.stateCode,
      city: city.name,
      vehicleType,
      fuelType,
      taxPercent: fuelType === "ELECTRIC" ? 0 : vehicleType === "CAR" ? slab.car : slab.bike,
      fixedCess: fuelType === "ELECTRIC" ? 0 : vehicleType === "CAR" ? slab.cess : Math.round(slab.cess / 5),
    })),
  );
});

// ---------------------------------------------------------------------------
// Insurance bands (IRDAI third-party tariff, approximate)
//
// Electric vehicles are matched on the 0cc band, since they have no engine
// displacement; IRDAI gives them a discounted third-party rate.
// ---------------------------------------------------------------------------

export const insuranceRules: InsuranceRule[] = [
  { id: "ins-car-ev", vehicleType: "CAR", engineCcMin: 0, engineCcMax: 0, baseThirdParty1Yr: inr(1_780), ownDamagePercentage: 3.0, mandatoryCpaFee: inr(330) },
  { id: "ins-car-small", vehicleType: "CAR", engineCcMin: 1, engineCcMax: 1000, baseThirdParty1Yr: inr(2_094), ownDamagePercentage: 3.0, mandatoryCpaFee: inr(330) },
  { id: "ins-car-mid", vehicleType: "CAR", engineCcMin: 1001, engineCcMax: 1500, baseThirdParty1Yr: inr(3_416), ownDamagePercentage: 3.2, mandatoryCpaFee: inr(330) },
  { id: "ins-car-large", vehicleType: "CAR", engineCcMin: 1501, engineCcMax: 9999, baseThirdParty1Yr: inr(7_897), ownDamagePercentage: 3.4, mandatoryCpaFee: inr(330) },

  { id: "ins-bike-ev", vehicleType: "BIKE", engineCcMin: 0, engineCcMax: 0, baseThirdParty1Yr: inr(457), ownDamagePercentage: 2.0, mandatoryCpaFee: inr(330) },
  { id: "ins-bike-small", vehicleType: "BIKE", engineCcMin: 1, engineCcMax: 150, baseThirdParty1Yr: inr(714), ownDamagePercentage: 2.2, mandatoryCpaFee: inr(330) },
  { id: "ins-bike-mid", vehicleType: "BIKE", engineCcMin: 151, engineCcMax: 350, baseThirdParty1Yr: inr(1_366), ownDamagePercentage: 2.5, mandatoryCpaFee: inr(330) },
  { id: "ins-bike-large", vehicleType: "BIKE", engineCcMin: 351, engineCcMax: 9999, baseThirdParty1Yr: inr(2_804), ownDamagePercentage: 3.0, mandatoryCpaFee: inr(330) },
];
