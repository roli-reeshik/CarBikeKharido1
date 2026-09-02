"use client";

import { useEffect, useId } from "react";
import { useSpring, useTransform, motion } from "framer-motion";

import { accent } from "@/lib/accents";
import type { Accent } from "@/lib/types";
import { cn } from "@/lib/utils";

interface RangeSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  /** Renders the current value next to the label. */
  formatValue: (value: number) => string;
  /** Captions under the two ends of the track. */
  minLabel?: string;
  maxLabel?: string;
  accentKey?: Accent;
}

/**
 * A native range input kept invisible on top of a custom track, so the control
 * animates with a spring while keeping full keyboard and screen-reader support.
 */
export function RangeSlider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  formatValue,
  minLabel,
  maxLabel,
  accentKey = "blue",
}: RangeSliderProps) {
  const id = useId();
  const tone = accent(accentKey);
  const percent = ((value - min) / (max - min)) * 100;

  const springPercent = useSpring(percent, {
    stiffness: 320,
    damping: 30,
    mass: 0.5,
  });

  useEffect(() => {
    springPercent.set(percent);
  }, [percent, springPercent]);

  const offset = useTransform(springPercent, (next) => `${next}%`);

  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between gap-3">
        <label
          htmlFor={id}
          className="text-sm font-medium text-slate-600 dark:text-slate-300"
        >
          {label}
        </label>
        <span
          className={cn(
            "text-sm font-semibold tabular-nums sm:text-base",
            tone.text,
          )}
        >
          {formatValue(value)}
        </span>
      </div>

      <div className="relative py-2.5">
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700/60">
          <motion.div
            className={cn("h-full rounded-full", tone.bar)}
            style={{ width: offset }}
          />
        </div>

        <motion.div
          aria-hidden
          className="pointer-events-none absolute top-1/2 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-slate-900 shadow-lift dark:border-slate-900 dark:bg-white"
          style={{ left: offset }}
        />

        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          aria-label={label}
          aria-valuetext={formatValue(value)}
          className="absolute inset-0 h-full w-full cursor-grab appearance-none bg-transparent opacity-0 active:cursor-grabbing"
        />
      </div>

      {(minLabel ?? maxLabel) ? (
        <div className="flex justify-between text-xs text-slate-400 dark:text-slate-500">
          <span>{minLabel}</span>
          <span>{maxLabel}</span>
        </div>
      ) : null}
    </div>
  );
}
