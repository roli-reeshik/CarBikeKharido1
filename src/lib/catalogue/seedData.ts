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
