/** Joins class names, dropping falsy values. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Rounds to the nearest step, used by the custom sliders. */
export function snapToStep(value: number, step: number): number {
  return Math.round(value / step) * step;
}
