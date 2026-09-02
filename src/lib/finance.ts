import type { Car, City } from "./types";

export interface PriceLine {
  id: string;
  /** Jargon-free label, e.g. "State road tax (RTO)". */
  label: string;
  amount: number;
  /** Collapsible explanation written for a first-time buyer. */
  explanation: string;
  /** Shown when the amount is zero or unusual. */
  note?: string;
}

export interface OnRoadBreakdown {
  lines: PriceLine[];
  total: number;
}

const FASTAG = 600;
const REGISTRATION = 1_500;
const HANDLING = 5_500;
/** Tax collected at source applies to cars billed above ₹10 lakh. */
const TCS_THRESHOLD = 10_00_000;
const TCS_RATE = 0.01;

const isElectric = (car: Car) =>
  car.powertrains.length === 1 && car.powertrains[0] === "ev";

export function buildOnRoadBreakdown(car: Car, city: City): OnRoadBreakdown {
  const exShowroom = car.exShowroom;

  const taxWaived = isElectric(car) && city.evRoadTaxWaiver;
  const roadTax = taxWaived ? 0 : Math.round(exShowroom * city.roadTaxRate);

  const insurance = Math.round(exShowroom * 0.032 * city.insuranceFactor);
  const tcs =
    exShowroom > TCS_THRESHOLD ? Math.round(exShowroom * TCS_RATE) : 0;

  const lines: PriceLine[] = [
    {
      id: "exShowroom",
      label: "Ex-showroom price",
      amount: exShowroom,
      explanation:
        "The price of the car itself, including GST. This is the number brands advertise, and it is the same across the country.",
    },
    {
      id: "roadTax",
      label: `State road tax (${city.rto})`,
      amount: roadTax,
      explanation: taxWaived
        ? `${city.state} charges no road tax on battery-electric cars, so this line is zero. Petrol and diesel cars in the same city pay about ${Math.round(
            city.roadTaxRate * 100,
          )}%.`
        : `A one-time tax paid to the ${city.state} transport department, charged at about ${Math.round(
            city.roadTaxRate * 100,
          )}% of the ex-showroom price. It is the single biggest reason the same car costs different amounts in different cities.`,
      note: taxWaived ? "Waived for electric cars in this state" : undefined,
    },
    {
      id: "insurance",
      label: "First-year insurance",
      amount: insurance,
      explanation:
        "A bundled policy: third-party cover (legally required) plus own-damage cover for your car. Premiums vary by city because repair costs and claim rates differ.",
    },
    {
      id: "registration",
      label: "Registration & number plate",
      amount: REGISTRATION,
      explanation:
        "The RTO paperwork that puts the car in your name, plus the tamper-proof number plate fitted at the dealership.",
    },
    {
      id: "fastag",
      label: "FASTag",
      amount: FASTAG,
      explanation:
        "The windscreen sticker that pays highway tolls automatically. Mandatory on every new car, and the dealer fits it before delivery.",
    },
    {
      id: "handling",
      label: "Logistics & handling",
      amount: HANDLING,
      explanation:
        "What the dealer charges to move the car from the factory and prepare it for delivery. This one is negotiable — always ask.",
    },
  ];

  if (tcs > 0) {
    lines.push({
      id: "tcs",
      label: "Tax collected at source (TCS)",
      amount: tcs,
      explanation:
        "1% is collected on cars billed above ₹10 lakh. It is not an extra cost — you claim it back against your income tax when you file your return.",
      note: "Refundable against income tax",
    });
  }

  return {
    lines,
    total: lines.reduce((sum, line) => sum + line.amount, 0),
  };
}

export interface EmiResult {
  monthly: number;
  totalPayable: number;
  totalInterest: number;
  principal: number;
  /** Interest as a share of everything paid back, 0-1. */
  interestShare: number;
}

export function calculateEmi(
  principal: number,
  annualRatePercent: number,
  tenureMonths: number,
): EmiResult {
  const safePrincipal = Math.max(principal, 0);
  const monthlyRate = annualRatePercent / 12 / 100;

  const monthly =
    monthlyRate === 0
      ? safePrincipal / tenureMonths
      : (safePrincipal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
        (Math.pow(1 + monthlyRate, tenureMonths) - 1);

  const totalPayable = monthly * tenureMonths;
  const totalInterest = totalPayable - safePrincipal;

  return {
    monthly: Math.round(monthly),
    totalPayable: Math.round(totalPayable),
    totalInterest: Math.round(totalInterest),
    principal: Math.round(safePrincipal),
    interestShare: totalPayable > 0 ? totalInterest / totalPayable : 0,
  };
}

const inrFormatter = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 0,
});

/** 1240000 -> "₹12,40,000" */
export function formatRupees(value: number): string {
  return `₹${inrFormatter.format(Math.round(value))}`;
}

/** 1240000 -> "₹12.40 Lakh"; 25000000 -> "₹2.50 Crore" */
export function formatCompactRupees(value: number): string {
  if (value >= 1_00_00_000) {
    return `₹${(value / 1_00_00_000).toFixed(2)} Crore`;
  }
  if (value >= 1_00_000) {
    return `₹${(value / 1_00_000).toFixed(2)} Lakh`;
  }
  return formatRupees(value);
}

/** Compact range for a car's line-up, e.g. "₹8.00 – 15.60 Lakh". */
export function formatPriceRange([from, to]: [number, number]): string {
  return `₹${(from / 1_00_000).toFixed(2)} – ${(to / 1_00_000).toFixed(2)} Lakh`;
}
