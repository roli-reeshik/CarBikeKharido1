"use client";

import { motion } from "framer-motion";
import { useState } from "react";

import { formatRupees } from "@/lib/finance";
import type { ColourOption } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Colour swatches. Two-entry swatches render as a diagonal split to show
 * dual-tone paint (body colour plus contrast roof).
 */
export function ColourPicker({
  colours,
  value,
  onChange,
}: {
  colours: ColourOption[];
  value?: string;
  onChange?: (id: string) => void;
}) {
  const [uncontrolled, setUncontrolled] = useState(colours[0]?.id);
  const active = value ?? uncontrolled;
  const selected = colours.find((colour) => colour.id === active) ?? colours[0];

  if (!selected) return null;

  const select = (id: string) => {
    setUncontrolled(id);
    onChange?.(id);
  };

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {colours.map((colour) => {
          const isActive = colour.id === selected.id;
          const [body, roof] = colour.swatch;

          return (
            <button
              key={colour.id}
              type="button"
              onClick={() => select(colour.id)}
              aria-label={colour.name}
              aria-pressed={isActive}
              title={colour.name}
              className={cn(
                "relative size-11 rounded-full ring-offset-2 transition-transform ring-offset-white hover:scale-105 dark:ring-offset-slate-950",
                isActive
                  ? "ring-2 ring-slate-900 dark:ring-white"
                  : "ring-1 ring-slate-300 dark:ring-slate-700",
              )}
            >
              <span
                className="absolute inset-0.5 overflow-hidden rounded-full"
                style={
                  roof
                    ? { background: `linear-gradient(135deg, ${body} 50%, ${roof} 50%)` }
                    : { backgroundColor: body }
                }
              />
            </button>
          );
        })}
      </div>

      <motion.p
        key={selected.id}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="mt-4 text-sm text-slate-700 dark:text-slate-200"
      >
        <span className="font-medium">{selected.name}</span>
        {selected.premium ? (
          <span className="text-slate-500 dark:text-slate-400">
            {" "}
            · adds {formatRupees(selected.premium)}
          </span>
        ) : (
          <span className="text-slate-500 dark:text-slate-400">
            {" "}
            · no extra cost
          </span>
        )}
      </motion.p>
    </div>
  );
}
