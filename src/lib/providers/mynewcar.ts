/**
 * MyNewCar India adapter — variant pricing and specifications.
 *
 * Two products are consumed (https://www.mynewcar.in/car-data-services):
 *   • Car Price API — per-variant ex-showroom → on-road, RTO fees, live offers,
 *     across 21 brands and 24 cities.
 *   • Car Specs API — dimensions, powertrain, efficiency, NCAP and ADAS ratings,
 *     and exterior/interior feature lists.
 *
 * Access is by commercial plan and the endpoint contract is not published, so
 * request shapes come from `providers/config.ts` and the response readers below
 * accept several plausible field spellings. Set MYNEWCAR_API_KEY to enable;
 * without it every function returns `null` and the caller uses sample data.
 */
import type { ColourOption, SpecGroup, Variant } from "../types";
import { authHeaders, isMynewcarEnabled, mynewcarConfig } from "./config";
import { fetchJson, pick, toNumber } from "./http";

export interface MynewcarQuery {
  brand: string;
  model: string;
  /** MyNewCar city slug; pricing is dealer-level and city-specific. */
  city?: string;
}

/** What the adapter can supply for a car, once a key is configured. */
export interface MynewcarCarData {
  variants: Variant[];
  colours: ColourOption[];
  specGroups: SpecGroup[];
}

type Payload = Record<string, unknown>;

/** Unwraps the common `{ data: … }` / `{ result: … }` envelopes. */
function unwrap(payload: Payload | null): Payload | null {
  if (!payload) return null;
  const inner = pick<Payload>(payload, ["data", "result", "response"]);
  return inner && typeof inner === "object" ? inner : payload;
}

function asArray(value: unknown): Payload[] {
  return Array.isArray(value) ? (value as Payload[]) : [];
}

function buildUrl(path: string, query: MynewcarQuery) {
  const params = new URLSearchParams({ brand: query.brand, model: query.model });
  if (query.city) params.set("city", query.city);
  return `${mynewcarConfig.baseUrl}${path}?${params}`;
}

function mapVariants(payload: Payload | null): Variant[] {
  const root = unwrap(payload);
  const rows = asArray(
    pick(root ?? {}, ["variants", "trims", "items", "prices"]) ?? root,
  );

  return rows.flatMap((row, index) => {
    const name = pick<string>(row, ["variant", "variantName", "trim", "name"]);
    const price = toNumber(
      pick(row, ["exShowroom", "exShowroomPrice", "ex_showroom_price", "price"]),
    );
    if (!name || !price) return [];

    const gearbox =
      pick<string>(row, ["transmission", "gearbox", "transmissionType"]) ??
      "Manual";
    const fuel = pick<string>(row, ["fuel", "fuelType", "fuel_type"]) ?? "Petrol";
    const features = pick<unknown>(row, ["features", "keyFeatures", "highlights"]);

    return [
      {
        id: pick<string>(row, ["variantId", "id", "slug"]) ?? `variant-${index}`,
        name,
        exShowroom: price,
        gearbox,
        fuel,
        headline: pick<string>(row, ["description", "summary"]) ?? "",
        keyKit: Array.isArray(features) ? features.map(String).slice(0, 6) : [],
      } satisfies Variant,
    ];
  });
}

function mapColours(payload: Payload | null): ColourOption[] {
  const root = unwrap(payload);
  const rows = asArray(pick(root ?? {}, ["colours", "colors", "colourOptions"]));

  return rows.flatMap((row, index) => {
    const name = pick<string>(row, ["name", "colour", "color", "colorName"]);
    if (!name) return [];

    const hex = pick<string>(row, ["hex", "hexCode", "colorCode", "swatch"]);
    const secondary = pick<string>(row, ["hexSecondary", "roofHex"]);

    return [
      {
        id: pick<string>(row, ["id", "slug"]) ?? `colour-${index}`,
        name,
        swatch: [hex ?? "#9ca3af", ...(secondary ? [secondary] : [])],
        premium: toNumber(pick(row, ["premium", "additionalCost"])),
      } satisfies ColourOption,
    ];
  });
}

/**
 * Folds the flat spec payload into the grouped structure the UI renders. Only
 * groups the vendor actually returned are emitted.
 */
function mapSpecGroups(payload: Payload | null): SpecGroup[] {
  const root = unwrap(payload);
  if (!root) return [];

  const groupPlan: { label: string; keys: string[] }[] = [
    {
      label: "Engine & gearbox",
      keys: ["engine", "displacement", "power", "torque", "transmission", "fuelType"],
    },
    {
      label: "Size & space",
      keys: ["length", "width", "height", "wheelbase", "bootSpace", "seatingCapacity"],
    },
    {
      label: "Efficiency",
      keys: ["mileage", "fuelTankCapacity", "range", "batteryCapacity"],
    },
    {
      label: "Safety",
      keys: ["ncapRating", "adasRating", "airbags", "abs", "esp", "camera"],
    },
  ];

  const specs =
    (pick<Payload>(root, ["specifications", "specs"]) as Payload | undefined) ??
    root;

  return groupPlan.flatMap((group) => {
    const items = group.keys.flatMap((key) => {
      const value = pick<unknown>(specs, [key, key.toLowerCase()]);
      if (value === undefined) return [];
      return [{ label: humanise(key), value: String(value) }];
    });

    return items.length > 0 ? [{ label: group.label, items }] : [];
  });
}

function humanise(key: string) {
  return key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (char) => char.toUpperCase());
}

/**
 * Pulls specs and pricing for one car in parallel. Returns `null` when the key
 * is absent or neither endpoint yielded usable rows.
 */
export async function fetchMynewcarData(
  query: MynewcarQuery,
): Promise<MynewcarCarData | null> {
  if (!isMynewcarEnabled()) return null;

  const headers = authHeaders(mynewcarConfig);
  const [specsPayload, pricePayload] = await Promise.all([
    fetchJson<Payload>(buildUrl(mynewcarConfig.specsPath, query), { headers }),
    fetchJson<Payload>(buildUrl(mynewcarConfig.pricePath, query), {
      headers,
      // Prices move with offers and RTO changes, so keep this short.
      revalidate: 60 * 30,
    }),
  ]);

  const variants = mapVariants(pricePayload);
  const colours = mapColours(specsPayload);
  const specGroups = mapSpecGroups(specsPayload);

  if (variants.length === 0 && specGroups.length === 0) return null;

  return { variants, colours, specGroups };
}
