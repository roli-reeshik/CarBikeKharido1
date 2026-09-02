import type { Accent } from "./types";

/**
 * Tailwind cannot see class names built by string concatenation, so every accent
 * variant is written out in full here and looked up by key.
 */
export interface AccentStyle {
  /** Coloured text for icons and figures. */
  text: string;
  /** Soft translucent fill for chips and icon wells. */
  soft: string;
  /** Border that pairs with `soft`. */
  border: string;
  /** Filled button / badge surface. */
  solid: string;
  /** Background wash for card headers and hero glows. */
  wash: string;
  /** Progress-bar fill. */
  bar: string;
  /** Focus ring colour for selected states. */
  ring: string;
}

export const accentStyles: Record<Accent, AccentStyle> = {
  emerald: {
    text: "text-emerald-600 dark:text-emerald-400",
    soft: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
    border: "border-emerald-200/80 dark:border-emerald-500/25",
    solid: "bg-emerald-600 text-white hover:bg-emerald-500",
    wash: "from-emerald-500/15 via-emerald-400/5 to-transparent",
    bar: "bg-emerald-500",
    ring: "ring-emerald-500/40",
  },
  blue: {
    text: "text-blue-600 dark:text-blue-400",
    soft: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300",
    border: "border-blue-200/80 dark:border-blue-500/25",
    solid: "bg-blue-600 text-white hover:bg-blue-500",
    wash: "from-blue-500/15 via-blue-400/5 to-transparent",
    bar: "bg-blue-500",
    ring: "ring-blue-500/40",
  },
  amber: {
    text: "text-amber-600 dark:text-amber-400",
    soft: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
    border: "border-amber-200/80 dark:border-amber-500/25",
    solid: "bg-amber-500 text-white hover:bg-amber-400",
    wash: "from-amber-500/15 via-amber-400/5 to-transparent",
    bar: "bg-amber-500",
    ring: "ring-amber-500/40",
  },
  indigo: {
    text: "text-indigo-600 dark:text-indigo-400",
    soft: "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300",
    border: "border-indigo-200/80 dark:border-indigo-500/25",
    solid: "bg-indigo-600 text-white hover:bg-indigo-500",
    wash: "from-indigo-500/15 via-indigo-400/5 to-transparent",
    bar: "bg-indigo-500",
    ring: "ring-indigo-500/40",
  },
  violet: {
    text: "text-violet-600 dark:text-violet-400",
    soft: "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300",
    border: "border-violet-200/80 dark:border-violet-500/25",
    solid: "bg-violet-600 text-white hover:bg-violet-500",
    wash: "from-violet-500/15 via-violet-400/5 to-transparent",
    bar: "bg-violet-500",
    ring: "ring-violet-500/40",
  },
  rose: {
    text: "text-rose-600 dark:text-rose-400",
    soft: "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300",
    border: "border-rose-200/80 dark:border-rose-500/25",
    solid: "bg-rose-600 text-white hover:bg-rose-500",
    wash: "from-rose-500/15 via-rose-400/5 to-transparent",
    bar: "bg-rose-500",
    ring: "ring-rose-500/40",
  },
};

export function accent(key: Accent): AccentStyle {
  return accentStyles[key];
}
