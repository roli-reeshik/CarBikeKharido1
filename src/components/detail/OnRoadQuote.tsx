"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Info, MapPin, TicketPercent } from "lucide-react";
import { useMemo, useState } from "react";

import { useCity } from "@/components/providers/CityProvider";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import type {
  InsuranceRule,
  RtoTaxRule,
  ServiceCity,
  Variant,
  VehicleWithRelations,
} from "@/lib/catalogue/types";
import { formatPaise } from "@/lib/money";
import { calculateOnRoadPrice } from "@/lib/pricingEngine";
import { cn } from "@/lib/utils";

interface OnRoadQuoteProps {
  vehicle: VehicleWithRelations;
  cities: ServiceCity[];
  rtoRules: RtoTaxRule[];
  insuranceRules: InsuranceRule[];
  initialVariantId: string;
  initialCityId: string;
}

/**
 * Live on-road price breakdown.
 *
 * The pricing engine is pure and takes its rule tables as arguments, so the
 * server hands them down once and every recalculation happens in the browser.
 * Switching city or variant is then instant, with no round trip.
 */
export function OnRoadQuote({
  vehicle,
  cities,
  rtoRules,
  insuranceRules,
  initialVariantId,
  initialCityId,
}: OnRoadQuoteProps) {
  const [variantId, setVariantId] = useState(initialVariantId);
  const { cityId, setCityId } = useCity();
  const [openLine, setOpenLine] = useState<string | null>(null);

  const variant: Variant =
    vehicle.variants.find((item) => item.id === variantId) ?? vehicle.variants[0];
  const city =
    cities.find((item) => item.id === cityId) ??
    cities.find((item) => item.id === initialCityId) ??
    cities[0];

  const quote = useMemo(
    () =>
      calculateOnRoadPrice(
        {
          exShowroomPaise: variant.exShowroomPricePence,
          vehicleType: vehicle.type,
          fuelType: variant.fuelType,
          engineCc: variant.engineCc,
          stateCode: city.stateCode,
          cityName: city.name,
        },
        { rtoRules, insuranceRules },
      ),
    [variant, vehicle.type, city, rtoRules, insuranceRules],
  );

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/70 p-4 sm:p-5 dark:border-slate-800 dark:bg-slate-900/50">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
            Variant
          </span>
          <select
            value={variantId}
            onChange={(event) => setVariantId(event.target.value)}
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          >
            {vehicle.variants.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} — {formatPaise(item.exShowroomPricePence)}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
            <MapPin className="size-3.5" aria-hidden />
            Register in
          </span>
          <select
            value={cityId}
            onChange={(event) => setCityId(event.target.value)}
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          >
            {cities.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} ({item.rto})
              </option>
            ))}
          </select>
        </label>
      </div>

      <ul className="mt-5 space-y-1">
        {quote.lines.map((line) => {
          const isOpen = openLine === line.id;

          return (
            <li
              key={line.id}
              className="border-b border-slate-100 last:border-0 dark:border-slate-800/70"
            >
              <button
                type="button"
                onClick={() => setOpenLine(isOpen ? null : line.id)}
                aria-expanded={isOpen}
                className="flex w-full items-center gap-3 py-2.5 text-left"
              >
                <ChevronDown
                  className={cn(
                    "size-4 shrink-0 text-slate-400 transition-transform",
                    isOpen && "rotate-180",
                  )}
                  aria-hidden
                />
                <span className="min-w-0 flex-1 text-sm text-slate-700 dark:text-slate-200">
                  {line.label}
                  {line.note ? (
                    <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                      {line.note}
                    </span>
                  ) : null}
                  {line.negotiable ? (
                    <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                      <TicketPercent className="size-3" aria-hidden />
                      Negotiable
                    </span>
                  ) : null}
                </span>
                <span className="shrink-0 text-sm font-medium tabular-nums text-slate-900 dark:text-white">
                  {formatPaise(line.amountPaise)}
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen ? (
                  <motion.p
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    className="overflow-hidden pb-3 pl-7 pr-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400"
                  >
                    {line.explanation}
                  </motion.p>
                ) : null}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>

      <div className="mt-4 flex items-baseline justify-between gap-3 rounded-xl bg-slate-900 px-4 py-3.5 text-white dark:bg-white dark:text-slate-900">
        <span className="text-sm font-medium">
          On-road price in {city.name}
        </span>
        <span className="text-xl font-semibold sm:text-2xl">
          <AnimatedNumber
            value={quote.totalPaise}
            format={(value) => formatPaise(value)}
          />
        </span>
      </div>

      {quote.usedFallbackTaxRule ? (
        <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-amber-700 dark:text-amber-400">
          <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden />
          We do not hold a published tax slab for {city.stateName} at this price,
          so the road tax above is a national average. Confirm with your dealer.
        </p>
      ) : null}
    </div>
  );
}
