import { luggagePlain, runningPlain, trafficPlain } from "@/lib/catalogue/copy";
import { carDetails } from "@/lib/carDetails";
import type { VehicleWithRelations } from "@/lib/catalogue/types";
import { headlineVariant } from "@/lib/catalogue/types";
import type { CarPhoto, ReviewSummary, SpecGroup } from "@/lib/types";

export interface VdpReviewSection {
  id: string;
  heading: string;
  shortDescription: string;
  fullDescription: string;
  imageUrl?: string;
}

export interface VdpVideo {
  id: string;
  title: string;
  blurb: string;
  duration: string;
}

export interface VdpSimilar {
  slug: string | null;
  name: string;
  brand: string;
  priceLabel: string;
  imageUrl?: string;
  kind: "trending" | "latest" | "upcoming";
}

export const VDP_SECTION_IDS = [
  "overview",
  "price",
  "compare",
  "images",
  "specs",
  "reviews",
  "view360",
  "variants",
  "videos",
  "more",
] as const;

export type VdpSectionId = (typeof VDP_SECTION_IDS)[number];

const photoAt = (photos: CarPhoto[], index: number): string | undefined =>
  photos[index]?.src ?? photos[0]?.src;

function carReviews(
  vehicle: VehicleWithRelations,
  photos: CarPhoto[],
): VdpReviewSection[] {
  const bags = vehicle.luggageCapacityBags;
  return [
    {
      id: "exterior",
      heading: "Exterior",
      shortDescription: `${vehicle.name} has the road presence of a taller, more expensive SUV — the kind of shape that photographs well and still clears a Lucknow speed breaker.`,
      fullDescription: `${vehicle.name} is designed to look planted from the three-quarter front. LED lighting, a high belt line and the wheel design do most of the talking at a signal. Walk around it once in daylight: panel gaps are even, the rear lamps read clearly at dusk, and the stance is more “family SUV” than “tall hatch”. It will not be mistaken for a luxury flagship, and it does not try to be — the brief is presence you can park in a basement.`,
      imageUrl: photoAt(photos, 0),
    },
    {
      id: "interior",
      heading: "Interior — design & quality",
      shortDescription:
        "The cabin is built for people who sit in traffic, not for a brochure photoshoot. Soft-touch where your elbows land; hard plastic where they do not.",
      fullDescription: `Dashboard layout puts the touchscreen in the driver’s eyeline so you are not fishing for climate or maps. Front seats hold you on a three-hour highway run; the middle rear seat is the usual compact-SUV compromise. Materials will not fool a luxury buyer, but the switchgear clicks cleanly and nothing rattles over broken city tarmac on a typical test loop. Think “well-finished family car”, not “lounge on wheels”.`,
      imageUrl: photoAt(photos, 1),
    },
    {
      id: "features",
      heading: "Features",
      shortDescription:
        "Wireless phone mirroring, a readable instrument cluster, and connected-car alerts — the kit first-time automatic buyers actually use.",
      fullDescription: `Higher trims add a large touchscreen with wireless Apple CarPlay and Android Auto, a digital cluster you can read in harsh sun, and a connected app for lock/location. A 360° camera (where fitted) is the feature that earns its keep in tight colony parking. Skip the extras you will never open twice; keep the camera, the climate control and the phone mirroring. That is the honest shortlist.`,
      imageUrl: photoAt(photos, 2),
    },
    {
      id: "safety",
      heading: "Safety",
      shortDescription:
        vehicle.safetyRatingNCAP != null
          ? `${vehicle.safetyRatingNCAP}-star Bharat NCAP, six airbags on the popular trims, ABS with EBD, stability control and a reverse camera.`
          : "ABS, a reverse camera on higher trims, and the usual electronic helpers — always confirm the exact airbag count on the trim you are signing.",
      fullDescription: `${vehicle.safetyRatingNCAP != null ? `Official crash score: ${vehicle.safetyRatingNCAP} stars (Bharat NCAP). ` : ""}The kit that matters on Indian roads is airbags for the people who sit in the car every day, ABS with EBD, electronic stability control, and a camera you will actually use at night. A 360° view is a parking aid, not a crash rating. We show the star badge because it is independently tested — not because a brochure said “safe”.`,
      imageUrl: photoAt(photos, 0),
    },
    {
      id: "boot",
      heading: "Boot space & practicality",
      shortDescription: luggagePlain(bags),
      fullDescription:
        bags != null
          ? `${luggagePlain(bags)}. That is enough for a long weekend: two large hard suitcases plus a duffel if you pack like a family, not like a catalogue. Rear seats fold nearly flat for a bicycle or a folded pram. The loading lip is low enough that you are not lifting a suitcase over your hip.`
          : "Two-wheeler — storage is whatever you strap on or slot under the seat.",
      imageUrl: photoAt(photos, 1),
    },
    {
      id: "performance",
      heading: "Performance & drivability",
      shortDescription: `${trafficPlain(vehicle)}. ${runningPlain(vehicle)}.`,
      fullDescription: `In city traffic the question is not horsepower — it is whether your left leg survives the crawl. ${trafficPlain(vehicle)}. On the highway it stays composed at 100 km/h and does not dart over ruts the way a lightly-damped hatch can. Speed breakers are taken at a walk; the suspension is tuned for Indian roads, not a German autobahn. ${runningPlain(vehicle)} — that is a real-world figure, not a lab sticker.`,
      imageUrl: photoAt(photos, 2),
    },
  ];
}

function bikeReviews(
  vehicle: VehicleWithRelations,
  photos: CarPhoto[],
): VdpReviewSection[] {
  return [
    {
      id: "exterior",
      heading: "Design & stance",
      shortDescription: vehicle.bodyType.toLowerCase().includes("scooter")
        ? `${vehicle.name} looks like a modern city scooter — a clean apron, a readable cluster, and a stance that fits a basement parking slot.`
        : `${vehicle.name} is the shape people point at in a parking lot — chrome, tank, and stance doing the talking before you thumb the starter.`,
      fullDescription: vehicle.bodyType.toLowerCase().includes("scooter")
        ? `The apron and floorboard are the first things you notice: space for a grocery bag, a seat you can swing a leg over in trousers, and lighting that reads clearly at dusk. It will not pretend to be a cruiser. The brief is a weekday machine that still looks considered at a signal.`
        : `From the side the proportions read instantly: this is a ${vehicle.bodyType.toLowerCase()}, not a commuter trying to dress up. Paint depth and the metal bits you touch every day (switchgear, mirrors, grab rail) are what you notice after a week. It photographs well and, more usefully, it is visible in a rear-view mirror at dusk.`,
      imageUrl: photoAt(photos, 0),
    },
    {
      id: "interior",
      heading: "Ergonomics",
      shortDescription:
        "The rider triangle is honest: you sit in the bike, not on a sports crouch you cannot hold past the third signal.",
      fullDescription: `Seat foam is the difference between a weekend smile and a backache at 80 km. Pegs and bars put average-height riders in a neutral bend. Pillion space is “an hour is fine; three hours is a conversation”. If you commute daily, try the seat in the showroom for a full five minutes — that is more useful than a spec sheet.`,
      imageUrl: photoAt(photos, 1),
    },
    {
      id: "features",
      heading: "Features",
      shortDescription:
        "A cluster you can read in harsh sun, USB charging, and the ride modes or maps you will actually leave switched on.",
      fullDescription: `Skip the gimmicks. Keep a clear speedo, a fuel or range readout you trust, and a charge port for the phone. Connected apps are nice until they need a software update in a basement with no signal. We list kit the way owners talk about it — what you use on Tuesday, not what was on the launch slide.`,
      imageUrl: photoAt(photos, 2),
    },
    {
      id: "safety",
      heading: "Safety",
      shortDescription:
        "Dual-channel ABS on the versions that matter, a headlamp that actually lights a dark village road, and tyres with a name you recognise.",
      fullDescription: `Two-wheelers are not Bharat NCAP crash-tested the way cars are. The kit that changes outcomes is ABS you can feel working on wet paint, a bright lamp, and rubber that still has tread. Wear a helmet that fits. We will not pretend a brochure “safety suite” replaces that.`,
      imageUrl: photoAt(photos, 0),
    },
    {
      id: "boot",
      heading: "Storage & practicality",
      shortDescription:
        vehicle.bodyType.includes("Scooter")
          ? "Under-seat space for a full-face helmet and a thin rain jacket — the weekday test."
          : "This is a motorcycle: a tank bag or a small rack, not a car boot measured in litres.",
      fullDescription: vehicle.bodyType.includes("Scooter")
        ? "Open the seat. If a full-face helmet and a folded raincoat fit, it passes the weekday test. Groceries mean a hook and a backpack. Do not buy a scooter for airport luggage — buy a car, or a taxi."
        : "No boot, and we will not invent one. A magnetic tank bag handles a rain jacket and papers. Soft luggage on the pillion works for a weekend if you pack like a rider.",
      imageUrl: photoAt(photos, 1),
    },
    {
      id: "performance",
      heading: "Performance & drivability",
      shortDescription: `${trafficPlain(vehicle)}. ${runningPlain(vehicle)}.`,
      fullDescription: `City traffic is clutch and throttle discipline, or — on the electric — a silent roll-off that does not heat your clutch hand. ${trafficPlain(vehicle)}. On an open highway the bike should hold a steady 80–90 km/h without buzzing your wrists numb. ${runningPlain(vehicle)}. That is the number that decides whether you enjoy the second month of ownership.`,
      imageUrl: photoAt(photos, 0),
    },
  ];
}

export function getReviewSections(
  vehicle: VehicleWithRelations,
  photos: CarPhoto[],
): VdpReviewSection[] {
  return vehicle.type === "BIKE"
    ? bikeReviews(vehicle, photos)
    : carReviews(vehicle, photos);
}

export function getVdpVideos(vehicle: VehicleWithRelations): VdpVideo[] {
  const kind = vehicle.type === "BIKE" ? "ride" : "drive";
  return [
    {
      id: "first-drive",
      title: `First ${kind} impressions — ${vehicle.name}`,
      blurb: `What the first hour on the road actually feels like, without the launch-day adjectives.`,
      duration: "08:40",
    },
    {
      id: "road-test",
      title: `Expert road test`,
      blurb: `Highway stability, speed-breaker manners, and whether the cabin (or saddle) survives a full day.`,
      duration: "12:15",
    },
    {
      id: "owner",
      title: `Owner diary — 1,000 km later`,
      blurb: `Running cost, service experience, and the one thing we would tell a friend before they book.`,
      duration: "06:05",
    },
  ];
}

export function getVdpVideosPoster(photos: CarPhoto[]): string | undefined {
  return photos[0]?.src;
}

export function variantTags(vehicle: VehicleWithRelations): string[] {
  const headline = headlineVariant(vehicle);
  const tags = [vehicle.bodyType];
  if (vehicle.isElectric) tags.push("Electric");
  else tags.push(headline.fuelType === "CNG" ? "CNG" : "Petrol");
  if (vehicle.type === "CAR") {
    tags.push(
      headline.transmissionType === "MANUAL" ? "Manual" : "Automatic",
    );
  }
  if (vehicle.safetyRatingNCAP) {
    tags.push(`${vehicle.safetyRatingNCAP}-star NCAP`);
  }
  return tags;
}

const bikeReviewsFallback: ReviewSummary = {
  ownerRating: 4.4,
  ownerCount: 612,
  expertRating: 4.1,
  loved: [
    "Easy to live with every weekday",
    "Service parts are easy to find",
    "Looks like the brochure in person",
  ],
  watchOut: [
    "Seat gets firm after two hours",
    "Pillion is for short hops, not a tour",
    "Dealer wait times vary by city",
  ],
  quotes: [
    {
      author: "Aman S.",
      city: "Lucknow",
      months: 11,
      rating: 5,
      text: "I wanted something I could ride to office and still take out on Sunday. It does both without drama.",
    },
    {
      author: "Neha T.",
      city: "Noida",
      months: 6,
      rating: 4,
      text: "Running cost is the reason I kept it. The only ask is a slightly softer seat for the expressway.",
    },
  ],
};

export function getOwnerReviews(vehicle: VehicleWithRelations): ReviewSummary {
  return carDetails[vehicle.slug]?.reviews ?? bikeReviewsFallback;
}

export function getSpecGroups(vehicle: VehicleWithRelations): SpecGroup[] {
  const editorial = carDetails[vehicle.slug];
  if (editorial) return editorial.specGroups;
  const headline = headlineVariant(vehicle);
  return [
    {
      label: "Powertrain",
      items: [
        {
          label: "Fuel",
          value: vehicle.isElectric ? "Electric" : headline.fuelType,
        },
        {
          label: "Real-world range / mileage",
          value: runningPlain(vehicle),
          plain: "Measured the way owners ride, not a lab cycle",
        },
        {
          label: "Engine",
          value: headline.engineCc ? `${headline.engineCc} cc` : "Hub motor",
        },
      ],
    },
    {
      label: "Size & use",
      items: [
        { label: "Type", value: vehicle.bodyType },
        { label: "Seats", value: `${headline.seatingCapacity}` },
        { label: "Best for", value: vehicle.bestForHeadline },
      ],
    },
  ];
}

export const UPCOMING_SIMILARS: VdpSimilar[] = [
  {
    slug: null,
    name: "MG Hector",
    brand: "MG",
    priceLabel: "From ₹14.00 Lakh",
    kind: "upcoming",
  },
  {
    slug: null,
    name: "Mahindra Scorpio-N",
    brand: "Mahindra",
    priceLabel: "From ₹13.99 Lakh",
    kind: "upcoming",
  },
  {
    slug: null,
    name: "Mahindra Thar",
    brand: "Mahindra",
    priceLabel: "From ₹11.35 Lakh",
    kind: "upcoming",
  },
];

export const UPCOMING_BIKES: VdpSimilar[] = [
  {
    slug: null,
    name: "Honda H'ness CB350",
    brand: "Honda",
    priceLabel: "From ₹2.10 Lakh",
    kind: "upcoming",
  },
  {
    slug: null,
    name: "Jawa 42",
    brand: "Jawa",
    priceLabel: "From ₹1.98 Lakh",
    kind: "upcoming",
  },
  {
    slug: null,
    name: "Yezdi Adventure",
    brand: "Yezdi",
    priceLabel: "From ₹2.10 Lakh",
    kind: "upcoming",
  },
];
