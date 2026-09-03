"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Info, MapPin, ReceiptText } from "lucide-react";

import { useCity } from "@/components/providers/CityProvider";
import { useSelectedVehicle } from "@/components/providers/SelectedVehicleProvider";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { serviceCities } from "@/lib/catalogue/seedData";
import { headlineVariant } from "@/lib/catalogue/types";
import type { InsuranceRule, RtoTaxRate, RtoTaxRule } from "@/lib/catalogue/types";
import { formatPaise, paiseToRupees } from "@/lib/money";
import { calculateOnRoadPrice } from "@/lib/pricingEngine";
import { cn } from "@/lib/utils";

const quickCityIds = ["lucknow", "new-delhi", "mumbai", "bengaluru"];

export function OnRoadPriceWidget({
  rtoRules,
  rtoRates,
  insuranceRules,
}: {
  rtoRules: RtoTaxRule[];
  rtoRates?: RtoTaxRate[];
  insuranceRules: InsuranceRule[];
}) {
  const { city, cityId, setCityId } = useCity();
  const { vehicle } = useSelectedVehicle();
  const [openLine, setOpenLine] = useState<string | null>("roadTax");
  const headline = headlineVariant(vehicle);

  const quote = useMemo(
    () =>
      calculateOnRoadPrice(
        {
          exShowroomPaise: headline.exShowroomPricePence,
          vehicleType: vehicle.type,
          fuelType: headline.fuelType,
          engineCc: headline.engineCc,
          stateCode: city.stateCode,
          cityName: city.name,
        },
        { rtoRules, rtoRates, insuranceRules },
      ),
    [headline, vehicle.type, city, rtoRules, rtoRates, insuranceRules],
  );

  const extras = quote.totalPaise - headline.exShowroomPricePence;

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white/85 shadow-micro backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/70">
      <div className="border-b border-slate-100 p-5 dark:border-slate-800">
        <div className="flex items-start gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300">
            <ReceiptText className="size-4.5" aria-hidden />
          </span>
          <div className="min-w-0">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              What you actually pay at the showroom
            </h3>
            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
              {vehicle.name} {headline.name} · {city.name} ({city.rto})
            </p>
          </div>
        </div>

        <div className="no-scrollbar mt-4 flex items-center gap-2 overflow-x-auto">
          <MapPin className="size-3.5 shrink-0 text-slate-400" aria-hidden />
          {quickCityIds.map((id) => {
            const option = serviceCities.find((item) => item.id === id);
            if (!option) return null;
            const active = option.id === cityId;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setCityId(option.id)}
                aria-pressed={active}
                className={cn(
                  "shrink-0 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
                  active
                    ? "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-300"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300",
                )}
              >
                {option.name}
              </button>
            );
          })}
          <span className="shrink-0 text-xs text-slate-400">
            or pick any city up top
          </span>
        </div>
      </div>

      <div className="flex-1 p-5">
        <ul className="space-y-1.5">
          {quote.lines.map((line) => {
            const expanded = openLine === line.id;
            const share = (line.amountPaise / quote.totalPaise) * 100;

            return (
              <li key={line.id}>
                <button
                  type="button"
                  onClick={() => setOpenLine(expanded ? null : line.id)}
                  aria-expanded={expanded}
                  className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-800/40"
                >
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1.5 text-sm text-slate-700 dark:text-slate-200">
                      {line.label}
                      {line.note ? (
                        <span className="rounded-full bg-emerald-50 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                          {line.note}
                        </span>
                      ) : null}
                    </span>
                    <span className="mt-1 block h-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                      <motion.span
                        className="block h-full rounded-full bg-emerald-500/80"
                        initial={false}
                        animate={{ width: `${share}%` }}
                        transition={{ type: "spring", stiffness: 220, damping: 28 }}
                      />
                    </span>
                  </span>
                  <AnimatedNumber
                    value={paiseToRupees(line.amountPaise)}
                    format={(value) => formatPaise(value * 100)}
                    className="shrink-0 text-sm font-semibold tabular-nums text-slate-900 dark:text-white"
                  />
                  <ChevronDown
                    className={cn(
                      "size-4 shrink-0 text-slate-400 transition-transform",
                      expanded && "rotate-180",
                    )}
                    aria-hidden
                  />
                </button>
                <AnimatePresence initial={false}>
                  {expanded ? (
                    <motion.p
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden px-2 pb-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400"
                    >
                      <Info className="mr-1 inline size-3 align-text-top" aria-hidden />
                      {line.explanation}
                    </motion.p>
                  ) : null}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="border-t border-slate-100 bg-slate-50/70 p-5 dark:border-slate-800 dark:bg-slate-800/30">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              On-road in {city.name}
            </p>
            <AnimatedNumber
              value={paiseToRupees(quote.totalPaise)}
              format={(value) => formatPaise(value * 100)}
              className="mt-0.5 block text-2xl font-semibold text-slate-900 dark:text-white"
            />
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              of which {formatPaise(extras)} is tax, insurance and charges
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
