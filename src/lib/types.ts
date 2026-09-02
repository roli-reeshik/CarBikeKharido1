export type Accent = "emerald" | "blue" | "amber" | "indigo" | "violet" | "rose";

export type BudgetId = "under8" | "8to15" | "15to25" | "above25";

export type PurposeId = "cityRun" | "highway" | "largeFamily" | "firstCar";

export type PowertrainId = "petrol" | "cng" | "ev" | "diesel";

export type CategoryId = "safety" | "cityAutomatic" | "cheapToRun" | "familyHauler";

export interface BudgetBand {
  id: BudgetId;
  label: string;
  /** Inclusive lower bound in rupees. */
  min: number;
  /** Exclusive upper bound in rupees; `Infinity` for the top band. */
  max: number;
}

export interface PurposeOption {
  id: PurposeId;
  label: string;
  /** One-line plain-English promise shown under the label. */
  blurb: string;
}

export interface PowertrainOption {
  id: PowertrainId;
  label: string;
  blurb: string;
}

export interface City {
  id: string;
  name: string;
  state: string;
  /** Primary RTO code, e.g. "MH-01". */
  rto: string;
  /** Lifetime road tax as a share of ex-showroom price. */
  roadTaxRate: number;
  /** Multiplier on the baseline insurance quote to reflect local claim risk. */
  insuranceFactor: number;
  /** Several states waive road tax entirely on battery-electric cars. */
  evRoadTaxWaiver: boolean;
}

/** A single plain-English verdict used by the comparison table. */
export interface CompareVerdict {
  /** Layman summary, e.g. "Very relaxed — no clutch at all". */
  verdict: string;
  /** 0-100, drives the bar length and the "better pick" highlight. */
  score: number;
  /** Optional supporting sentence, still jargon-free. */
  detail?: string;
}

export interface CompareProfile {
  traffic: CompareVerdict;
  rearLegroom: CompareVerdict;
  bootForTrips: CompareVerdict;
  safetyKit: CompareVerdict;
  runningCost: CompareVerdict;
}

export interface Car {
  id: string;
  brand: string;
  model: string;
  /** Variant the headline numbers refer to. */
  variant: string;
  bodyStyle: string;
  seats: number;
  accent: Accent;

  /** Ex-showroom price of the variant quoted above, in rupees. */
  exShowroom: number;
  /** Full ex-showroom range across the line-up, in rupees. */
  priceRange: [number, number];
  budgetBand: BudgetId;

  safety: {
    stars: number;
    agency: "Bharat NCAP" | "Global NCAP";
    /** Layman gloss, e.g. "Top marks for protecting adults in a crash". */
    plain: string;
  };

  luggage: {
    /** Kept for reference only — never rendered raw. */
    litres: number;
    plain: string;
  };

  running: {
    /** Real-world figure, not the certified claim. */
    realWorld: string;
    costPerKm: number;
    plain: string;
  };

  gearbox: {
    /** Short chip text, e.g. "Smooth Automatic" or "AMT". */
    tag: string;
    plain: string;
  };

  bestFor: string;
  highlights: string[];
  powertrains: PowertrainId[];
  purposes: PurposeId[];
  categories: CategoryId[];
  compare: CompareProfile;
}

export interface CategoryTile {
  id: CategoryId;
  title: string;
  /** Layman one-liner. */
  subtitle: string;
  tag: string;
  accent: Accent;
  /** Bento span classes. */
  span: string;
}

/**
 * One photograph of a car, plus everything needed to credit it. Populated by
 * `scripts/fetch-car-photos.mjs` from Wikimedia Commons, or by the EVOX Images
 * adapter when a licence key is configured.
 */
export interface CarPhoto {
  src: string;
  width: number;
  height: number;
  /** Original file name / asset id, used as a stable key. */
  title: string;
  author: string;
  /** Short licence name, e.g. "CC BY-SA 4.0", "CC0", or "Licensed (EVOX)". */
  licence: string;
  licenceUrl: string;
  /** Page the file came from, for the credit link. */
  sourceUrl: string;
  /**
   * Disclosure shown over the image when the photograph is not exactly the
   * variant being described, e.g. a petrol car standing in for its EV twin.
   */
  note?: string;
}

/**
 * Where a record came from. Rendered as a provenance badge so it is always
 * obvious whether a number is live vendor data or illustrative sample content.
 */
export type DataSource =
  | "mynewcar"
  | "rapidapi"
  | "evox"
  | "imagin"
  | "commons"
  | "sample";

/** One block of the specification table, e.g. "Engine & gearbox". */
export interface SpecGroup {
  label: string;
  items: {
    label: string;
    value: string;
    /** Jargon-free gloss shown beneath the raw figure. */
    plain?: string;
  }[];
}

export interface Variant {
  id: string;
  name: string;
  exShowroom: number;
  gearbox: string;
  fuel: string;
  /** Plain-English summary of what this variant adds over the one below it. */
  headline: string;
  keyKit: string[];
  /** Flags the trim that gives most kit per rupee. */
  isValuePick?: boolean;
}

export interface ColourOption {
  id: string;
  name: string;
  /** One CSS colour, or two to render a dual-tone split swatch. */
  swatch: string[];
  /** Extra cost over the standard shade, in rupees. */
  premium?: number;
}

export interface OwnerQuote {
  author: string;
  city: string;
  /** How long they have owned it, in months. */
  months: number;
  rating: number;
  text: string;
}

export interface ReviewSummary {
  ownerRating: number;
  ownerCount: number;
  expertRating: number;
  loved: string[];
  watchOut: string[];
  quotes: OwnerQuote[];
}

/** A competing car in the same segment, framed in plain English. */
export interface Rival {
  /** Set when the rival is also in our own catalogue, enabling a deep link. */
  carId?: string;
  brand: string;
  model: string;
  priceFrom: number;
  stars: number;
  oneLiner: string;
  /** Where the rival beats the car being viewed. */
  edge: string;
  /** Where the car being viewed beats the rival. */
  gap: string;
}

export interface CarDetail {
  overview: string;
  specGroups: SpecGroup[];
  variants: Variant[];
  colours: ColourOption[];
  reviews: ReviewSummary;
  rivals: Rival[];
}

export interface SearchSuggestion {
  id: string;
  label: string;
  /** Grouping shown in the dropdown. */
  kind: "Car" | "Bike" | "Intent" | "City";
  hint: string;
}
