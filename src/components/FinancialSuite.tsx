"use client";

import { motion } from "framer-motion";
import { Wallet } from "lucide-react";

import { EmiCalculatorWidget } from "@/components/EmiCalculatorWidget";
import { OnRoadPriceWidget } from "@/components/OnRoadPriceWidget";
import { useSelectedVehicle } from "@/components/providers/SelectedVehicleProvider";
import type { InsuranceRule, RtoTaxRate, RtoTaxRule, VehicleWithRelations } from "@/lib/catalogue/types";
import { cn } from "@/lib/utils";

export function FinancialSuite({
  vehicles,
  rtoRules,
  rtoRates,
  insuranceRules,
}: {
  vehicles: VehicleWithRelations[];
  rtoRules: RtoTaxRule[];
  rtoRates?: RtoTaxRate[];
  insuranceRules: InsuranceRule[];
}) {
  const { slug, setSlug } = useSelectedVehicle();

  return (
    <section
      id="money"
      aria-labelledby="money-heading"
      className="mx-auto w-full max-w-7xl scroll-mt-28 px-4 py-14 sm:px-6 sm:py-16 lg:px-8"
    >
      <div className="mb-7">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
          <Wallet className="size-3.5" aria-hidden />
          Complete cost transparency
        </span>
        <h2
          id="money-heading"
          className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl dark:text-white"
        >
          The money, with nothing hidden
        </h2>
        <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-300">
          Every fee on the invoice, explained in one sentence each — and a live
          EMI so you know the monthly number before a salesperson tells you.
        </p>
      </div>

      <div
        role="tablist"
        aria-label="Choose a vehicle to price"
        className="no-scrollbar -mx-1 mb-5 flex gap-1.5 overflow-x-auto px-1 pb-1"
      >
        {vehicles.map((vehicle) => {
          const active = vehicle.slug === slug;
          return (
            <button
              key={vehicle.slug}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setSlug(vehicle.slug)}
              className={cn(
                "relative shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                active
                  ? "border-transparent text-white dark:text-slate-900"
                  : "border-slate-200/80 bg-white/70 text-slate-600 hover:border-slate-300 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300",
              )}
            >
              {active ? (
                <motion.span
                  layoutId="moneyCarPill"
                  className="absolute inset-0 -z-10 rounded-full bg-slate-900 dark:bg-white"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              ) : null}
              {vehicle.name}
            </button>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <OnRoadPriceWidget rtoRules={rtoRules} rtoRates={rtoRates} insuranceRules={insuranceRules} />
        <EmiCalculatorWidget rtoRules={rtoRules} rtoRates={rtoRates} insuranceRules={insuranceRules} />
      </div>
    </section>
  );
}
