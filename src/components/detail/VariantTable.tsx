"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Cog, Fuel, Sparkles } from "lucide-react";
import { useState } from "react";

import { formatRupees } from "@/lib/finance";
import type { Variant } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Variant line-up as an expandable list. Each row shows the price and what the
 * trim adds in plain English; expanding reveals the equipment that arrives
 * with it, so buyers can see exactly what their money buys.
 */
export function VariantTable({ variants }: { variants: Variant[] }) {
  const [open, setOpen] = useState<string | null>(
    variants.find((variant) => variant.isValuePick)?.id ?? null,
  );

  return (
    <ul className="space-y-2.5">
      {variants.map((variant) => {
        const isOpen = open === variant.id;

        return (
          <li
            key={variant.id}
            className={cn(
              "overflow-hidden rounded-2xl border transition-colors",
              variant.isValuePick
                ? "border-emerald-300/80 bg-emerald-50/50 dark:border-emerald-800/70 dark:bg-emerald-950/20"
                : "border-slate-200/80 bg-white/70 dark:border-slate-800 dark:bg-slate-900/50",
            )}
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : variant.id)}
              aria-expanded={isOpen}
              className="flex w-full items-start gap-3 p-4 text-left"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {variant.name}
                  </span>
                  {variant.isValuePick ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2 py-0.5 text-[11px] font-semibold text-white">
                      <Sparkles className="size-3" aria-hidden />
                      Best value
                    </span>
                  ) : null}
                </div>

                <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {variant.headline}
                </p>

                <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                  <span className="inline-flex items-center gap-1">
                    <Cog className="size-3.5" aria-hidden />
                    {variant.gearbox}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Fuel className="size-3.5" aria-hidden />
                    {variant.fuel}
                  </span>
                </p>
              </div>

              <div className="shrink-0 text-right">
                <span className="block text-sm font-semibold text-slate-900 dark:text-white">
                  {formatRupees(variant.exShowroom)}
                </span>
                <span className="block text-[11px] text-slate-400">ex-showroom</span>
                <ChevronDown
                  className={cn(
                    "mt-1 ml-auto size-4 text-slate-400 transition-transform",
                    isOpen && "rotate-180",
                  )}
                  aria-hidden
                />
              </div>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && variant.keyKit.length > 0 ? (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <ul className="grid gap-2 border-t border-slate-200/70 px-4 py-3 sm:grid-cols-2 dark:border-slate-800">
                    {variant.keyKit.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-200"
                      >
                        <Check
                          className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400"
                          aria-hidden
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
