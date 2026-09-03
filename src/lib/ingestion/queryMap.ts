import type { VehicleType } from "@/lib/catalogue/types";

export interface RapidQueryAttempt {
  make: string;
  model: string;
  year?: string;
}

export interface RapidQueryPlan {
  type: VehicleType;
  /** Tried in order until API Ninjas returns at least one row. */
  attempts: RapidQueryAttempt[];
}

/**
 * Maps our catalogue slugs to API Ninjas search terms.
 *
 * The cars feed is EPA-oriented (mostly US/EU nameplates). Indian-only models
 * such as the Nexon or iQube often miss; the resolver then keeps editorial
 * specs instead of inventing a different vehicle.
 */
export const RAPID_QUERY_PLANS: Record<string, RapidQueryPlan> = {
  "tata-nexon": {
    type: "CAR",
    attempts: [{ make: "tata", model: "nexon" }],
  },
  "maruti-fronx": {
    type: "CAR",
    attempts: [
      { make: "suzuki", model: "fronx" },
      { make: "maruti", model: "fronx" },
    ],
  },
  "hyundai-creta": {
    type: "CAR",
    attempts: [{ make: "hyundai", model: "creta" }],
  },
  "mahindra-xuv-3xo": {
    type: "CAR",
    attempts: [
      { make: "mahindra", model: "xuv 3xo" },
      { make: "mahindra", model: "xuv3xo" },
    ],
  },
  "royal-enfield-classic-350": {
    type: "BIKE",
    attempts: [
      { make: "royal enfield", model: "classic 350" },
      { make: "royal enfield", model: "classic" },
    ],
  },
  "tvs-iqube": {
    type: "BIKE",
    attempts: [
      { make: "tvs", model: "iqube" },
      { make: "tvs", model: "i qube" },
    ],
  },
  "mahindra-thar": {
    type: "CAR",
    attempts: [
      { make: "mahindra", model: "thar" },
      { make: "mahindra", model: "thar roxx" },
    ],
  },
  "tata-punch-ev": {
    type: "CAR",
    attempts: [
      { make: "tata", model: "punch" },
      { make: "tata", model: "punch ev" },
    ],
  },
  "maruti-ertiga": {
    type: "CAR",
    attempts: [
      { make: "suzuki", model: "ertiga" },
      { make: "maruti", model: "ertiga" },
    ],
  },
  "ola-s1": {
    type: "BIKE",
    attempts: [
      { make: "ola", model: "s1" },
      { make: "ola", model: "s1 pro" },
    ],
  },
  "ducati-panigale-v4": {
    type: "BIKE",
    attempts: [
      { make: "ducati", model: "panigale v4" },
      { make: "ducati", model: "panigale" },
    ],
  },
};

export function queryPlanFor(
  slug: string,
  fallback: { type: VehicleType; brand: string; name: string },
): RapidQueryPlan {
  if (RAPID_QUERY_PLANS[slug]) return RAPID_QUERY_PLANS[slug];

  const model = fallback.name
    .replace(new RegExp(`^${fallback.brand}\\s*`, "i"), "")
    .trim();

  return {
    type: fallback.type,
    attempts: [{ make: fallback.brand.toLowerCase(), model: model.toLowerCase() }],
  };
}
