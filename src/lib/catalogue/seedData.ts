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
  InsuranceRule,
  RtoTaxRule,
  ServiceCity,
  VehicleImage,
  VehicleWithRelations,
} from "./types";

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

export const vehicles: VehicleWithRelations[] = [
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
];

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
