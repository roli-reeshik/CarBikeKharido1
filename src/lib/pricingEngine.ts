/**
 * On-road price engine for CarBikeKharido.com.
 *
 *   On-road = Ex-showroom
 *           + State RTO tax (banded by price, plus any cess and fixed fees)
 *           + Insurance  (1+3 for cars, 1+5 for bikes)
 *           + FASTag     (₹500, cars only)
 *           + TCS        (1% where ex-showroom exceeds ₹10 lakh)
 *           + Registration, number plate and dealer handling
 *
 * The function is deterministic and side-effect free: identical inputs always
 * produce an identical breakdown. Tax and insurance rules are passed in rather
 * than read from a module-level constant, so the same code path serves live
 * database rows, the bundled fallback tables, and unit tests.
 *
 * Every line carries a plain-English explanation. A buyer should never see a
 * number on this site without being able to find out what it is for.
 */
import { percentOf, rupeesToPaise } from "./money";
import type {
  FuelType,
  InsuranceRule,
  RtoTaxRate,
  RtoTaxRule,
  VehicleType,
} from "./catalogue/types";

/** FASTag is a windscreen toll tag, so it applies to cars and not to bikes. */
export const FASTAG_PAISE = rupeesToPaise(500);
/** Section 206C(1F) collects 1% at source on motor vehicles above ₹10 lakh. */
export const TCS_THRESHOLD_PAISE = rupeesToPaise(10_00_000);
export const TCS_RATE_PERCENT = 1;

const REGISTRATION_PAISE: Record<VehicleType, number> = {
  CAR: rupeesToPaise(1_500),
  BIKE: rupeesToPaise(500),
};

const HANDLING_PAISE: Record<VehicleType, number> = {
  CAR: rupeesToPaise(5_500),
  BIKE: rupeesToPaise(1_800),
};

/** Bundled policy term: 1 year own damage plus N years third party. */
const THIRD_PARTY_YEARS: Record<VehicleType, number> = { CAR: 3, BIKE: 5 };

export interface PricingInput {
  exShowroomPaise: number;
  vehicleType: VehicleType;
  fuelType: FuelType;
  /** Null for electric vehicles, which have no displacement. */
  engineCc: number | null;
  stateCode: string;
  /** Display only — RTO tax is set at state level, not city level. */
  cityName?: string;
}

export interface PricingLine {
  id: string;
  label: string;
  amountPaise: number;
  /** Collapsible explanation written for a first-time buyer. */
  explanation: string;
  /** Short flag shown beside the amount, e.g. "Refundable". */
  note?: string;
  /** Marks charges the buyer can negotiate away or decline. */
  negotiable?: boolean;
}

export interface OnRoadQuote {
  lines: PricingLine[];
  totalPaise: number;
  stateCode: string;
  cityName?: string;
  /** True when no tax band matched and the national default was used. */
  usedFallbackTaxRule: boolean;
}

export interface PricingRules {
  rtoRules: RtoTaxRule[];
  insuranceRules: InsuranceRule[];
  /** City-level rates. When a row matches, it wins over a state-wide band. */
  rtoRates?: RtoTaxRate[];
}

/**
 * Picks the tax band for a vehicle. A rule naming the vehicle's fuel type wins
 * over a rule that applies to all fuels, which is how EV exemptions and CNG
 * rebates are expressed without duplicating every price band in a state.
 */
export function selectRtoRule(
  rules: RtoTaxRule[],
  { stateCode, vehicleType, fuelType, exShowroomPaise }: PricingInput,
): RtoTaxRule | undefined {
  const candidates = rules.filter(
    (rule) =>
      rule.stateCode === stateCode &&
      rule.vehicleType === vehicleType &&
      exShowroomPaise >= rule.priceMin &&
      exShowroomPaise < rule.priceMax &&
      (rule.fuelType === null || rule.fuelType === fuelType),
  );

  return (
    candidates.find((rule) => rule.fuelType === fuelType) ??
    candidates.find((rule) => rule.fuelType === null)
  );
}

/**
 * City-specific tax row. Fuel must match exactly — that is how Lucknow EV
 * exemption and Mumbai petrol slabs stay on different rows.
 */
export function selectRtoRate(
  rates: RtoTaxRate[] | undefined,
  { stateCode, vehicleType, fuelType, cityName }: PricingInput,
): RtoTaxRate | undefined {
  if (!rates?.length || !cityName) return undefined;
  const city = cityName.trim().toLowerCase();
  return (
    rates.find(
      (rate) =>
        rate.city.toLowerCase() === city &&
        rate.vehicleType === vehicleType &&
        rate.fuelType === fuelType,
    ) ??
    rates.find(
      (rate) =>
        rate.stateCode === stateCode &&
        rate.city.toLowerCase() === city &&
        rate.vehicleType === vehicleType &&
        rate.fuelType === fuelType,
    )
  );
}

/** Matches the IRDAI displacement band. Electric vehicles use the 0cc band. */
export function selectInsuranceRule(
  rules: InsuranceRule[],
  vehicleType: VehicleType,
  engineCc: number | null,
): InsuranceRule | undefined {
  const cc = engineCc ?? 0;
  return rules.find(
    (rule) =>
      rule.vehicleType === vehicleType &&
      cc >= rule.engineCcMin &&
      cc <= rule.engineCcMax,
  );
}

function describeCityTax(
  rate: RtoTaxRate,
  input: PricingInput,
  isExempt: boolean,
): string {
  if (isExempt) {
    return `${input.cityName ?? rate.city} charges no road tax on electric vehicles, so this line is zero. A petrol equivalent in the same city would pay ${rate.taxPercent === 0 ? "several percent" : `${rate.taxPercent}%`} of its ex-showroom price here.`;
  }
  const cess =
    rate.fixedCess > 0
      ? ` A flat cess of ₹${Math.round(rate.fixedCess / 100)} is added on top.`
      : "";
  return `A one-time tax paid to the ${rate.city} RTO (${rate.stateCode}), charged at ${rate.taxPercent}% of the ex-showroom price for ${rate.fuelType.toLowerCase()} ${rate.vehicleType === "CAR" ? "cars" : "two-wheelers"}.${cess} This is why the same vehicle costs different amounts in Lucknow and Bengaluru.`;
}

function describeRoadTax(
  rule: RtoTaxRule | undefined,
  input: PricingInput,
  isExempt: boolean,
): string {
  if (isExempt) {
    return `${input.stateCode} charges no road tax on electric vehicles, so this line is zero. A petrol equivalent in the same state would pay several percent of its ex-showroom price here.`;
  }
  if (!rule) {
    return "We do not yet hold a published tax slab for this state, so this is a national average. Confirm the exact figure with your dealer before you pay.";
  }

  const cess = Number(rule.cessPercentage);
  const cessNote =
    cess > 0 ? ` A further ${cess}% state cess is added on top.` : "";

  return `A one-time tax paid to the ${input.stateCode} transport department, charged at ${rule.taxPercentage}% of the ex-showroom price for vehicles in this price band.${cessNote} This is the single biggest reason the same vehicle costs different amounts in different states.`;
}

/**
 * Builds the itemised on-road quote. Pure: no I/O, no clock, no randomness.
 */
export function calculateOnRoadPrice(
  input: PricingInput,
  { rtoRules, insuranceRules, rtoRates }: PricingRules,
): OnRoadQuote {
  const { exShowroomPaise, vehicleType, fuelType, engineCc } = input;

  const lines: PricingLine[] = [
    {
      id: "exShowroom",
      label: "Ex-showroom price",
      amountPaise: exShowroomPaise,
      explanation:
        "The price of the vehicle itself, including GST. This is the number brands advertise, and it is the same across the country.",
    },
  ];

  // --- Road tax -----------------------------------------------------------
  const cityRate = selectRtoRate(rtoRates, input);
  const rule = cityRate ? undefined : selectRtoRule(rtoRules, input);
  const taxPercent = cityRate
    ? Number(cityRate.taxPercent)
    : rule
      ? Number(rule.taxPercentage)
      : 8;
  const cessPercent = cityRate ? 0 : rule ? Number(rule.cessPercentage) : 0;
  const fixedFee = cityRate ? cityRate.fixedCess : rule ? rule.fixedFee : 0;
  const isExempt = fuelType === "ELECTRIC" && taxPercent === 0;

  // Falling back to a national average is better than refusing to quote, but
  // the caller is told so it can surface the caveat.
  const usedFallbackTaxRule = !cityRate && !rule;

  const roadTax =
    percentOf(exShowroomPaise, taxPercent) +
    percentOf(exShowroomPaise, cessPercent) +
    fixedFee;

  const taxLabelCity = input.cityName ? ` — ${input.cityName}` : "";
  lines.push({
    id: "roadTax",
    label: `State road tax (${input.stateCode}${taxLabelCity})`,
    amountPaise: roadTax,
    explanation: cityRate
      ? describeCityTax(cityRate, input, isExempt)
      : describeRoadTax(rule, input, isExempt),
    note: isExempt ? "Waived for electric vehicles in this city" : undefined,
  });

  // --- Insurance ----------------------------------------------------------
  const insuranceRule = selectInsuranceRule(insuranceRules, vehicleType, engineCc);
  const years = THIRD_PARTY_YEARS[vehicleType];

  let insurance = 0;
  if (insuranceRule) {
    const thirdParty = insuranceRule.baseThirdParty1Yr * years;
    const ownDamage = percentOf(
      exShowroomPaise,
      Number(insuranceRule.ownDamagePercentage),
    );
    insurance = thirdParty + ownDamage + insuranceRule.mandatoryCpaFee;
  }

  lines.push({
    id: "insurance",
    label: `Insurance (1+${years})`,
    amountPaise: insurance,
    explanation: `A bundled new-vehicle policy. "1+${years}" means one year of own-damage cover for your ${vehicleType === "CAR" ? "car" : "bike"} plus ${years} years of third-party cover, which the law requires you to buy upfront. It also includes the compulsory personal accident cover for the owner-driver.`,
  });

  // --- Statutory and dealer charges --------------------------------------
  lines.push({
    id: "registration",
    label: "Registration & number plate",
    amountPaise: REGISTRATION_PAISE[vehicleType],
    explanation:
      "The RTO paperwork that puts the vehicle in your name, plus the tamper-proof high-security number plate fitted at the dealership.",
  });

  if (vehicleType === "CAR") {
    lines.push({
      id: "fastag",
      label: "FASTag",
      amountPaise: FASTAG_PAISE,
      explanation:
        "The windscreen sticker that pays highway tolls automatically. Mandatory on every new car, and the dealer fits it before delivery. Two-wheelers do not need one.",
    });
  }

  lines.push({
    id: "handling",
    label: "Logistics & handling",
    amountPaise: HANDLING_PAISE[vehicleType],
    explanation:
      "What the dealer charges to move the vehicle from the factory and prepare it for delivery. This one is negotiable — always ask, and be willing to walk.",
    negotiable: true,
  });

  // --- Tax collected at source -------------------------------------------
  if (exShowroomPaise > TCS_THRESHOLD_PAISE) {
    lines.push({
      id: "tcs",
      label: "Tax collected at source (TCS)",
      amountPaise: percentOf(exShowroomPaise, TCS_RATE_PERCENT),
      explanation:
        "1% is collected on any motor vehicle billed above ₹10 lakh. It is not an extra cost — you claim it back against your income tax when you file your return.",
      note: "Refundable against income tax",
    });
  }

  return {
    lines,
    totalPaise: lines.reduce((sum, line) => sum + line.amountPaise, 0),
    stateCode: input.stateCode,
    cityName: input.cityName,
    usedFallbackTaxRule,
  };
}

// ---------------------------------------------------------------------------
// RTO registration lookup
// ---------------------------------------------------------------------------

export interface RtoLookupResult {
  registrationNumber: string;
  ownerName?: string;
  makerModel?: string;
  fuelType?: string;
  registrationDate?: string;
  rtoName?: string;
  stateCode?: string;
}

/**
 * Looks up a registration number with an RTO data vendor (Surepass or
 * Zoop.one), used by the trade-in flow to pre-fill a seller's vehicle details.
 *
 * Both vendors are KYC-gated and charge per call, so this is a stub until
 * credentials exist: it returns `null` when `RTO_LOOKUP_API_KEY` is unset
 * rather than throwing, and the calling form falls back to manual entry.
 * Set RTO_LOOKUP_PROVIDER to "surepass" or "zoop" and supply the base URL from
 * your contract pack.
 */
export async function lookupRtoDetails(
  registrationNumber: string,
): Promise<RtoLookupResult | null> {
  const apiKey = process.env.RTO_LOOKUP_API_KEY?.trim();
  const baseUrl = process.env.RTO_LOOKUP_BASE_URL?.trim();
  if (!apiKey || !baseUrl) return null;

  const normalised = registrationNumber.replace(/\s+/g, "").toUpperCase();

  try {
    const response = await fetch(`${baseUrl}/rc/rc-full`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ id_number: normalised }),
      // Vehicle registration details are effectively static.
      next: { revalidate: 60 * 60 * 24 },
    });

    if (!response.ok) return null;
    const payload = (await response.json()) as {
      data?: Record<string, string>;
    };
    const data = payload.data;
    if (!data) return null;

    return {
      registrationNumber: normalised,
      ownerName: data.owner_name,
      makerModel: data.maker_model,
      fuelType: data.fuel_type,
      registrationDate: data.registration_date,
      rtoName: data.rto_name,
      stateCode: data.state_code,
    };
  } catch {
    // A vendor outage must never break the form.
    return null;
  }
}
