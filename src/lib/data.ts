import type {
  BudgetBand,
  Car,
  CategoryTile,
  City,
  PowertrainOption,
  PurposeOption,
  SearchSuggestion,
} from "./types";

const LAKH = 100_000;

export const cities: City[] = [
  {
    id: "delhi",
    name: "New Delhi",
    state: "Delhi",
    rto: "DL-01",
    roadTaxRate: 0.1,
    insuranceFactor: 1.08,
    evRoadTaxWaiver: true,
  },
  {
    id: "mumbai",
    name: "Mumbai",
    state: "Maharashtra",
    rto: "MH-01",
    roadTaxRate: 0.11,
    insuranceFactor: 1.15,
    evRoadTaxWaiver: true,
  },
  {
    id: "bengaluru",
    name: "Bengaluru",
    state: "Karnataka",
    rto: "KA-01",
    roadTaxRate: 0.15,
    insuranceFactor: 1.05,
    evRoadTaxWaiver: true,
  },
  {
    id: "pune",
    name: "Pune",
    state: "Maharashtra",
    rto: "MH-12",
    roadTaxRate: 0.11,
    insuranceFactor: 1.02,
    evRoadTaxWaiver: true,
  },
  {
    id: "hyderabad",
    name: "Hyderabad",
    state: "Telangana",
    rto: "TS-09",
    roadTaxRate: 0.13,
    insuranceFactor: 1.04,
    evRoadTaxWaiver: true,
  },
  {
    id: "chennai",
    name: "Chennai",
    state: "Tamil Nadu",
    rto: "TN-01",
    roadTaxRate: 0.12,
    insuranceFactor: 1.06,
    evRoadTaxWaiver: false,
  },
  {
    id: "ahmedabad",
    name: "Ahmedabad",
    state: "Gujarat",
    rto: "GJ-01",
    roadTaxRate: 0.06,
    insuranceFactor: 0.98,
    evRoadTaxWaiver: true,
  },
  {
    id: "kolkata",
    name: "Kolkata",
    state: "West Bengal",
    rto: "WB-02",
    roadTaxRate: 0.1,
    insuranceFactor: 1.03,
    evRoadTaxWaiver: false,
  },
  {
    id: "jaipur",
    name: "Jaipur",
    state: "Rajasthan",
    rto: "RJ-14",
    roadTaxRate: 0.08,
    insuranceFactor: 0.96,
    evRoadTaxWaiver: false,
  },
  {
    id: "gurugram",
    name: "Gurugram",
    state: "Haryana",
    rto: "HR-26",
    roadTaxRate: 0.08,
    insuranceFactor: 1.07,
    evRoadTaxWaiver: false,
  },
];

export const defaultCityId = "pune";

export const budgetBands: BudgetBand[] = [
  { id: "under8", label: "Under ₹8 Lakh", min: 0, max: 8 * LAKH },
  { id: "8to15", label: "₹8 – 15 Lakh", min: 8 * LAKH, max: 15 * LAKH },
  { id: "15to25", label: "₹15 – 25 Lakh", min: 15 * LAKH, max: 25 * LAKH },
  { id: "above25", label: "₹25 Lakh +", min: 25 * LAKH, max: Infinity },
];

export const purposeOptions: PurposeOption[] = [
  {
    id: "cityRun",
    label: "Daily City Run",
    blurb: "Short hops, tight parking, endless signals",
  },
  {
    id: "highway",
    label: "Highway Cruiser",
    blurb: "Long weekend drives at a steady pace",
  },
  {
    id: "largeFamily",
    label: "Large Family",
    blurb: "Six or more people, plus their bags",
  },
  {
    id: "firstCar",
    label: "First Car",
    blurb: "Easy to drive, easy to own, easy to park",
  },
];

export const powertrainOptions: PowertrainOption[] = [
  {
    id: "petrol",
    label: "Petrol",
    blurb: "Fuel available everywhere",
  },
  {
    id: "cng",
    label: "CNG / High Mileage",
    blurb: "Lowest running cost per kilometre",
  },
  {
    id: "ev",
    label: "Zero-Emission EV",
    blurb: "Charge at home, skip the fuel pump",
  },
];

export const categoryTiles: CategoryTile[] = [
  {
    id: "safety",
    title: "5-Star Bharat NCAP Safety",
    subtitle:
      "Cars that scored top marks for protecting the people inside them in a crash test.",
    tag: "Tested, not claimed",
    accent: "emerald",
    span: "sm:col-span-2 lg:col-span-2 lg:row-span-2",
  },
  {
    id: "cityAutomatic",
    title: "Bumper-to-Bumper City Automatics",
    subtitle: "No clutch, no left leg ache in a two-hour crawl home.",
    tag: "Clutch-free",
    accent: "blue",
    span: "sm:col-span-1 lg:col-span-2",
  },
  {
    id: "cheapToRun",
    title: "Pocket-Friendly Commuters",
    subtitle: "CNG and high-mileage petrol cars that sip fuel on a daily grind.",
    tag: "Under ₹3 / km",
    accent: "amber",
    span: "sm:col-span-1 lg:col-span-1",
  },
  {
    id: "familyHauler",
    title: "Spacious 6-7 Seater Family Haulers",
    subtitle: "Third row that adults will actually sit in, plus room for luggage.",
    tag: "Everyone fits",
    accent: "indigo",
    span: "sm:col-span-2 lg:col-span-1",
  },
];

export const cars: Car[] = [
  {
    id: "tata-nexon",
    brand: "Tata",
    model: "Nexon",
    variant: "Creative+ S Automatic",
    bodyStyle: "Compact SUV",
    seats: 5,
    accent: "emerald",
    exShowroom: 12_40_000,
    priceRange: [8_00_000, 15_60_000],
    budgetBand: "8to15",
    safety: {
      stars: 5,
      agency: "Bharat NCAP",
      plain: "Top marks for protecting both adults and children in a crash",
    },
    luggage: {
      litres: 382,
      plain: "Fits 3 large suitcases",
    },
    running: {
      realWorld: "13.8 km per litre in real traffic",
      costPerKm: 7.4,
      plain: "₹7.4 / km real running cost",
    },
    gearbox: {
      tag: "Smooth Automatic",
      plain: "Creeps forward on its own in traffic — no clutch, no jerk",
    },
    bestFor: "Families who put crash safety first",
    highlights: [
      "Feels planted at highway speeds",
      "Rear seat is comfortable for two adults",
      "Big touchscreen with wireless phone mirroring",
    ],
    powertrains: ["petrol", "diesel", "cng"],
    purposes: ["cityRun", "highway", "firstCar"],
    categories: ["safety", "cityAutomatic"],
    compare: {
      traffic: {
        verdict: "Very relaxed — creeps along on its own",
        score: 88,
        detail: "The proper automatic never jerks when you lift off the brake.",
      },
      rearLegroom: {
        verdict: "Comfortable for 2, tight for 3 adults",
        score: 72,
        detail: "The middle passenger sits over a slight floor hump.",
      },
      bootForTrips: {
        verdict: "3 large suitcases, or a week's luggage for four",
        score: 84,
      },
      safetyKit: {
        verdict: "6 airbags, blind-spot camera, 360° view",
        score: 95,
        detail: "5-star Bharat NCAP for adults and children.",
      },
      runningCost: {
        verdict: "About ₹7.4 for every kilometre you drive",
        score: 62,
      },
    },
  },
  {
    id: "maruti-fronx",
    brand: "Maruti Suzuki",
    model: "Fronx",
    variant: "Delta+ CNG",
    bodyStyle: "Crossover",
    seats: 5,
    accent: "amber",
    exShowroom: 9_20_000,
    priceRange: [7_50_000, 13_10_000],
    budgetBand: "8to15",
    safety: {
      stars: 4,
      agency: "Bharat NCAP",
      plain: "Strong adult protection, one step below the class best",
    },
    luggage: {
      litres: 308,
      plain: "Fits 2 large suitcases",
    },
    running: {
      realWorld: "24 km per kg of CNG on a daily commute",
      costPerKm: 3.1,
      plain: "₹3.1 / km real running cost",
    },
    gearbox: {
      tag: "Manual",
      plain: "You work the clutch, but the pedal is feather-light",
    },
    bestFor: "Long daily commutes on a tight fuel budget",
    highlights: [
      "Cheapest car here to run every day",
      "Turns into narrow lanes easily",
      "Maruti service centres almost everywhere",
    ],
    powertrains: ["petrol", "cng"],
    purposes: ["cityRun", "firstCar"],
    categories: ["cheapToRun"],
    compare: {
      traffic: {
        verdict: "Easy, but you still work the clutch",
        score: 64,
        detail: "Light steering and a soft clutch keep it from getting tiring.",
      },
      rearLegroom: {
        verdict: "Fine for 2 adults, snug for 3",
        score: 62,
      },
      bootForTrips: {
        verdict: "2 large suitcases — the CNG tank eats into the boot",
        score: 48,
        detail: "Weekend trips for four need a roof bag.",
      },
      safetyKit: {
        verdict: "6 airbags, reverse camera, hill-hold",
        score: 74,
        detail: "4-star Bharat NCAP for adults.",
      },
      runningCost: {
        verdict: "About ₹3.1 for every kilometre you drive",
        score: 96,
      },
    },
  },
  {
    id: "hyundai-creta",
    brand: "Hyundai",
    model: "Creta",
    variant: "SX Tech Automatic",
    bodyStyle: "Midsize SUV",
    seats: 5,
    accent: "blue",
    exShowroom: 18_60_000,
    priceRange: [11_10_000, 20_50_000],
    budgetBand: "15to25",
    safety: {
      stars: 5,
      agency: "Bharat NCAP",
      plain: "Top marks for protecting both adults and children in a crash",
    },
    luggage: {
      litres: 433,
      plain: "Fits 4 large suitcases",
    },
    running: {
      realWorld: "12.5 km per litre in real traffic",
      costPerKm: 8.2,
      plain: "₹8.2 / km real running cost",
    },
    gearbox: {
      tag: "Smooth Automatic",
      plain: "Shifts so softly you stop noticing it",
    },
    bestFor: "Highway trips in quiet comfort",
    highlights: [
      "Cabin stays quiet at 100 km/h",
      "Keeps a set distance from the car ahead on its own",
      "Ventilated front seats for May afternoons",
    ],
    powertrains: ["petrol", "diesel"],
    purposes: ["highway", "cityRun", "largeFamily"],
    categories: ["safety", "cityAutomatic"],
    compare: {
      traffic: {
        verdict: "Effortless — smoothest of the lot",
        score: 92,
        detail: "It can also hold its own distance in a slow-moving queue.",
      },
      rearLegroom: {
        verdict: "Three adults sit across without complaining",
        score: 90,
        detail: "Flat floor, reclining backrest.",
      },
      bootForTrips: {
        verdict: "4 large suitcases plus soft bags",
        score: 92,
      },
      safetyKit: {
        verdict: "6 airbags, 360° view, lane assist",
        score: 96,
        detail: "5-star Bharat NCAP for adults and children.",
      },
      runningCost: {
        verdict: "About ₹8.2 for every kilometre you drive",
        score: 54,
      },
    },
  },
  {
    id: "mahindra-xuv-3xo",
    brand: "Mahindra",
    model: "XUV 3XO",
    variant: "AX5 L Automatic",
    bodyStyle: "Compact SUV",
    seats: 5,
    accent: "rose",
    exShowroom: 13_50_000,
    priceRange: [7_99_000, 15_80_000],
    budgetBand: "8to15",
    safety: {
      stars: 5,
      agency: "Bharat NCAP",
      plain: "Top marks for adult protection, with a strong child score too",
    },
    luggage: {
      litres: 364,
      plain: "Fits 3 large suitcases",
    },
    running: {
      realWorld: "13.2 km per litre in real traffic",
      costPerKm: 7.7,
      plain: "₹7.7 / km real running cost",
    },
    gearbox: {
      tag: "Smooth Automatic",
      plain: "No clutch, and it holds itself on a slope",
    },
    bestFor: "A loaded feature list at a compact-SUV price",
    highlights: [
      "Panoramic sunroof on mid variants",
      "Feels eager when you need to overtake",
      "Twin screens and a Harman sound system",
    ],
    powertrains: ["petrol", "diesel"],
    purposes: ["cityRun", "highway", "firstCar"],
    categories: ["safety", "cityAutomatic"],
    compare: {
      traffic: {
        verdict: "Relaxed, with a firm brake pedal",
        score: 82,
      },
      rearLegroom: {
        verdict: "Good for 2 adults, three is a squeeze",
        score: 70,
      },
      bootForTrips: {
        verdict: "3 large suitcases for a family of four",
        score: 80,
      },
      safetyKit: {
        verdict: "6 airbags, blind-spot alert, front parking sensors",
        score: 93,
      },
      runningCost: {
        verdict: "About ₹7.7 for every kilometre you drive",
        score: 60,
      },
    },
  },
  {
    id: "tata-punch-ev",
    brand: "Tata",
    model: "Punch EV",
    variant: "Empowered+ Long Range",
    bodyStyle: "Electric SUV",
    seats: 5,
    accent: "violet",
    exShowroom: 13_20_000,
    priceRange: [10_00_000, 14_40_000],
    budgetBand: "8to15",
    safety: {
      stars: 5,
      agency: "Bharat NCAP",
      plain: "Top marks for protecting both adults and children in a crash",
    },
    luggage: {
      litres: 366,
      plain: "Fits 3 large suitcases",
    },
    running: {
      realWorld: "Around 320 km on a full home charge",
      costPerKm: 1.4,
      plain: "₹1.4 / km real running cost",
    },
    gearbox: {
      tag: "Single Speed",
      plain: "One pedal does almost everything — nothing to shift at all",
    },
    bestFor: "City owners who can charge at home overnight",
    highlights: [
      "Cheapest car here to run per kilometre",
      "Instant push away from a green light",
      "Charges to 80% in under an hour on a fast charger",
    ],
    powertrains: ["ev"],
    purposes: ["cityRun", "firstCar"],
    categories: ["safety", "cityAutomatic", "cheapToRun"],
    compare: {
      traffic: {
        verdict: "The most relaxed of all — one pedal driving",
        score: 96,
        detail: "Lift off the accelerator and it slows itself down.",
      },
      rearLegroom: {
        verdict: "Best for 2 adults; the cabin is narrow",
        score: 58,
      },
      bootForTrips: {
        verdict: "3 large suitcases, plus a small front storage box",
        score: 78,
      },
      safetyKit: {
        verdict: "6 airbags, 360° view, blind-spot camera",
        score: 94,
      },
      runningCost: {
        verdict: "About ₹1.4 for every kilometre you drive",
        score: 99,
      },
    },
  },
  {
    id: "maruti-ertiga",
    brand: "Maruti Suzuki",
    model: "Ertiga",
    variant: "ZXi+ CNG",
    bodyStyle: "7-Seater MPV",
    seats: 7,
    accent: "indigo",
    exShowroom: 12_90_000,
    priceRange: [8_80_000, 13_50_000],
    budgetBand: "8to15",
    safety: {
      stars: 3,
      agency: "Global NCAP",
      plain: "Adequate adult protection, but the weakest score in this list",
    },
    luggage: {
      litres: 209,
      plain: "Fits 2 large suitcases with all 7 seats up",
    },
    running: {
      realWorld: "22 km per kg of CNG with a full load",
      costPerKm: 3.4,
      plain: "₹3.4 / km real running cost",
    },
    gearbox: {
      tag: "Manual",
      plain: "Clutch is light, but you shift gears yourself",
    },
    bestFor: "Seven people and a small monthly fuel bill",
    highlights: [
      "Third row adults can sit in for an hour",
      "Middle row slides and reclines",
      "Cheapest way to move seven people",
    ],
    powertrains: ["petrol", "cng"],
    purposes: ["largeFamily", "highway"],
    categories: ["familyHauler", "cheapToRun"],
    compare: {
      traffic: {
        verdict: "Manageable, though it is a long car to thread",
        score: 56,
      },
      rearLegroom: {
        verdict: "Three adults in the middle row, in comfort",
        score: 94,
        detail: "The middle row slides back for extra knee room.",
      },
      bootForTrips: {
        verdict: "Only 2 suitcases with 7 seats up; fold row three for plenty",
        score: 52,
      },
      safetyKit: {
        verdict: "6 airbags and a reverse camera, but a 3-star score",
        score: 58,
      },
      runningCost: {
        verdict: "About ₹3.4 for every kilometre you drive",
        score: 92,
      },
    },
  },
];

export const quickSearchPills: string[] = [
  "Under 10 Lakh",
  "5-Star Safety",
  "Automatic SUVs",
  "7-Seater CNG",
  "Best EV for city",
];

export const navCategories = [
  { id: "cars", label: "New Cars" },
  { id: "suvs", label: "SUVs" },
  { id: "electric", label: "Electric" },
  { id: "bikes", label: "Bikes" },
  { id: "used", label: "Used" },
] as const;

export const searchSuggestions: SearchSuggestion[] = [
  ...cars.map<SearchSuggestion>((car) => ({
    id: car.id,
    label: `${car.brand} ${car.model}`,
    kind: "Car",
    hint: `${car.bodyStyle} · ${car.safety.stars}-star safety`,
  })),
  {
    id: "intent-safe-family",
    label: "Safest car for a family of five",
    kind: "Intent",
    hint: "5-star crash rating, 6 airbags",
  },
  {
    id: "intent-cheap-commute",
    label: "Cheapest car to run daily",
    kind: "Intent",
    hint: "Under ₹3.5 per kilometre",
  },
  {
    id: "intent-no-clutch",
    label: "No-clutch car for traffic",
    kind: "Intent",
    hint: "Automatic and single-speed options",
  },
  {
    id: "intent-seven-seat",
    label: "Seven seats under ₹15 lakh",
    kind: "Intent",
    hint: "Third row adults can use",
  },
  ...cities.slice(0, 4).map<SearchSuggestion>((city) => ({
    id: `city-${city.id}`,
    label: `On-road prices in ${city.name}`,
    kind: "City",
    hint: `${city.rto} · road tax ${Math.round(city.roadTaxRate * 100)}%`,
  })),
];

export function getCar(id: string): Car {
  const found = cars.find((car) => car.id === id);
  if (!found) throw new Error(`Unknown car id: ${id}`);
  return found;
}

export function getCity(id: string): City {
  return cities.find((city) => city.id === id) ?? cities[0];
}
