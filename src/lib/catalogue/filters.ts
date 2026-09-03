/**
 * Query-string catalogue filters used by `/cars` and `/bikes` listing pages
 * and by the header mega-menu.
 */
import { hasFuel } from "@/lib/catalogue/copy";
import {
  priceRangePaise,
  type VehicleType,
  type VehicleWithRelations,
} from "@/lib/catalogue/types";

export type CatalogSegment = "cars" | "bikes";

export interface CatalogQuery {
  body?: string;
  fuel?: string;
  brand?: string;
  popular?: string;
  kind?: string;
  city?: string;
  maxLakh?: string;
  view?: string;
  condition?: string;
  certified?: string;
}

export function catalogPath(
  segment: CatalogSegment,
  params: CatalogQuery = {},
): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value) search.set(key, value);
  }
  const query = search.toString();
  return `/${segment}${query ? `?${query}` : ""}#catalogue`;
}

export function parseCatalogQuery(
  raw: Record<string, string | string[] | undefined>,
): CatalogQuery {
  const pick = (key: keyof CatalogQuery): string | undefined => {
    const value = raw[key];
    if (Array.isArray(value)) return value[0];
    return value;
  };
  return {
    body: pick("body"),
    fuel: pick("fuel"),
    brand: pick("brand"),
    popular: pick("popular"),
    kind: pick("kind"),
    city: pick("city"),
    maxLakh: pick("maxLakh"),
    view: pick("view"),
    condition: pick("condition"),
    certified: pick("certified"),
  };
}

function bodyMatches(vehicle: VehicleWithRelations, body: string): boolean {
  const haystack = vehicle.bodyType.toLowerCase();
  switch (body) {
    case "suv":
      return /suv|crossover|off-road/.test(haystack);
    case "hatchback":
      return haystack.includes("hatch");
    case "sedan":
      return /sedan|saloon/.test(haystack);
    case "muv":
      return /mpv|7-seater|muv/.test(haystack);
    default:
      return haystack.includes(body.toLowerCase());
  }
}

function kindMatches(vehicle: VehicleWithRelations, kind: string): boolean {
  const haystack = vehicle.bodyType.toLowerCase();
  switch (kind) {
    case "commuter":
      return vehicle.type === "BIKE" && !/superbike|sport/.test(haystack);
    case "sports":
      return /superbike|sport/.test(haystack);
    case "cruiser":
      return haystack.includes("cruiser");
    case "scooter":
      return haystack.includes("scooter");
    default:
      return true;
  }
}

function brandMatches(vehicle: VehicleWithRelations, brand: string): boolean {
  const needle = brand.toLowerCase().replace(/-/g, " ");
  return vehicle.brand.toLowerCase().includes(needle);
}

export function filterCatalogue(
  vehicles: VehicleWithRelations[],
  segment: VehicleType,
  query: CatalogQuery,
): VehicleWithRelations[] {
  let pool = vehicles.filter((vehicle) => vehicle.type === segment);

  if (query.body) pool = pool.filter((vehicle) => bodyMatches(vehicle, query.body!));
  if (query.fuel === "ev") {
    pool = pool.filter((vehicle) => vehicle.isElectric || hasFuel(vehicle, "ELECTRIC"));
  } else if (query.fuel === "hybrid") {
    pool = pool.filter((vehicle) => hasFuel(vehicle, "HYBRID"));
  } else if (query.fuel === "cng") {
    pool = pool.filter((vehicle) => hasFuel(vehicle, "CNG"));
  }

  if (query.brand) pool = pool.filter((vehicle) => brandMatches(vehicle, query.brand!));
  if (query.kind) pool = pool.filter((vehicle) => kindMatches(vehicle, query.kind!));

  if (query.maxLakh) {
    const cap = Number(query.maxLakh) * 100_000 * 100;
    if (Number.isFinite(cap)) {
      pool = pool.filter((vehicle) => priceRangePaise(vehicle)[0] < cap);
    }
  }

  if (query.popular === "mileage") {
    pool = [...pool].sort(
      (a, b) => b.realMileageKmPerLitre - a.realMileageKmPerLitre,
    );
  } else if (query.popular === "luxury") {
    pool = pool.filter(
      (vehicle) =>
        /superbike|luxury/.test(vehicle.bodyType.toLowerCase()) ||
        priceRangePaise(vehicle)[1] >= 15_00_000 * 100,
    );
  } else if (query.popular === "top10") {
    pool = pool.slice(0, 10);
  }

  return pool;
}

export function catalogueHeading(
  segment: VehicleType,
  query: CatalogQuery,
): { title: string; caption: string } {
  const cars = segment === "CAR";

  if (query.view === "reviews") {
    return {
      title: "Expert drive reviews",
      caption:
        "Plain-English first drives. Open a card for the full road test, owner notes and on-road price.",
    };
  }
  if (query.view === "guides") {
    return {
      title: "Car buying guides",
      caption:
        "Start from a real nameplate — luggage, traffic manners and the invoice, not a brochure slogan.",
    };
  }
  if (query.view === "videos") {
    return {
      title: cars ? "Video walkarounds" : "Two-wheeler walkarounds",
      caption:
        "First-drive films and owner diaries on each vehicle page. Pick a card to watch.",
    };
  }
  if (query.condition === "used") {
    return {
      title: query.body === "suv" ? "Used SUVs" : "Used cars",
      caption: query.city
        ? `Certified pre-owned stock is being listed for ${query.city.replace(/-/g, " ")}. Until then, these are the new alternatives we can price on-road today.`
        : "Certified pre-owned inventory is coming. These are the new cars we can already quote honestly.",
    };
  }
  if (query.body === "suv") {
    return { title: "SUVs", caption: "Family crossovers, compact SUVs and off-road 4x4s." };
  }
  if (query.body === "hatchback") {
    return { title: "Hatchbacks", caption: "City cars with a boot that still swallows a weekend bag." };
  }
  if (query.body === "sedan") {
    return { title: "Sedans", caption: "Boot-separate saloons for highway miles." };
  }
  if (query.body === "muv") {
    return { title: "MUVs & 7-seaters", caption: "Third row that adults will actually sit in." };
  }
  if (query.fuel === "ev") {
    return { title: "Electric cars", caption: "Battery-electric nameplates with real range and running cost." };
  }
  if (query.fuel === "hybrid") {
    return { title: "Hybrid cars", caption: "Petrol-electric drivetrains — when we list them, they appear here." };
  }
  if (query.fuel === "cng") {
    return { title: "CNG cars", caption: "Factory gas kits, priced with the same on-road maths." };
  }
  if (query.popular === "mileage") {
    return { title: "Best mileage cars", caption: "Ranked by real-world km per litre or per unit." };
  }
  if (query.popular === "luxury") {
    return { title: "Luxury cars", caption: "The top of this catalogue by price and presence." };
  }
  if (query.popular === "top10") {
    return { title: "Top 10 cars", caption: "The cars buyers on CarBikeKharido.com shortlist first." };
  }
  if (query.kind === "commuter") {
    return { title: "Commuter bikes", caption: "Daily two-wheelers — scooters and relaxed cruisers." };
  }
  if (query.kind === "sports") {
    return { title: "Sports bikes", caption: "Superbikes built for a track day, priced like everything else here." };
  }
  if (query.kind === "cruiser") {
    return { title: "Cruisers", caption: "Upright, weekend-ready roadsters." };
  }
  if (query.kind === "scooter") {
    return { title: "Electric scooters", caption: "Plug-in commuters with honest range figures." };
  }
  if (query.brand) {
    const label = query.brand.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
    return {
      title: label,
      caption: `Every ${label} nameplate currently in the CarBikeKharido.com catalogue.`,
    };
  }

  return cars
    ? {
        title: "New cars",
        caption: "SUVs, automatics and family haulers — every rupee on the invoice explained.",
      }
    : {
        title: "New bikes & two-wheelers",
        caption: "Cruisers, commuters and EV scooters, priced the same honest way.",
      };
}
