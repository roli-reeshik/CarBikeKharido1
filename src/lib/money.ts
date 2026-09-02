/**
 * Currency handling for CarBikeKharido.com.
 *
 * Every amount in the system is an integer number of paise. Floats are never
 * used for money: 0.1 + 0.2 !== 0.3 in IEEE-754, and on a ₹15 lakh on-road
 * calculation with a dozen line items that drift becomes visible to the buyer.
 *
 * A number is safe here: the most expensive vehicle we would ever list, ₹5
 * crore, is 5e10 paise, four orders of magnitude below Number.MAX_SAFE_INTEGER
 * (9.007e15). Prisma returns BigInt for these columns, so conversion happens at
 * the repository boundary and nowhere else.
 */

export const PAISE_PER_RUPEE = 100;

export const rupeesToPaise = (rupees: number): number =>
  Math.round(rupees * PAISE_PER_RUPEE);

export const paiseToRupees = (paise: number): number => paise / PAISE_PER_RUPEE;

/** Narrows a Prisma BigInt column to the safe integer range used internally. */
export function bigIntToPaise(value: bigint): number {
  if (value > BigInt(Number.MAX_SAFE_INTEGER)) {
    throw new RangeError(`Amount ${value} exceeds the safe integer range`);
  }
  return Number(value);
}

/** Applies a percentage to a paise amount, rounding to the nearest paisa. */
export function percentOf(paise: number, percentage: number): number {
  return Math.round((paise * percentage) / 100);
}

const inrFormatter = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 0,
});

/** 1_24_00_000 paise -> "₹1,24,000" */
export function formatPaise(paise: number): string {
  return `₹${inrFormatter.format(Math.round(paiseToRupees(paise)))}`;
}

/** 12_40_000_00 paise -> "₹12.40 Lakh" */
export function formatPaiseCompact(paise: number): string {
  const rupees = paiseToRupees(paise);
  if (rupees >= 1_00_00_000) return `₹${(rupees / 1_00_00_000).toFixed(2)} Crore`;
  if (rupees >= 1_00_000) return `₹${(rupees / 1_00_000).toFixed(2)} Lakh`;
  return formatPaise(paise);
}

/** Compact range for a line-up, e.g. "₹8.00 Lakh – ₹15.60 Lakh". */
export function formatPaiseRange([from, to]: [number, number]): string {
  if (from === to) return formatPaiseCompact(from);
  return `${formatPaiseCompact(from)} – ${formatPaiseCompact(to)}`;
}
