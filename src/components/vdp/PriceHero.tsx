"use client";

import { MapPin } from "lucide-react";
import { useMemo } from "react";

import { useCity } from "@/components/providers/CityProvider";
import {
  entryVariant,
  priceRangePaise,
  type InsuranceRule,
  type RtoTaxRate,
  type RtoTaxRule,
  type VehicleWithRelations,
} from "@/lib/catalogue/types";
import { formatPaiseCompact } from "@/lib/money";
import { calculateOnRoadPrice } from "@/lib/pricingEngine";
import { variantTags } from "@/lib/vdpContent";

export function PriceHero({
  vehicle,
  rtoRules,
  rtoRates,
  insuranceRules,
}: {
  vehicle: VehicleWithRelations;
  rtoRules: RtoTaxRule[];
  rtoRates?: RtoTaxRate[];
  insuranceRules: InsuranceRule[];
}) {
  const { city } = useCity();
  const [exFrom, exTo] = priceRangePaise(vehicle);

  const onRoad = useMemo(() => {
    const cheap = entryVariant(vehicle);
    const top = vehicle.variants.reduce((a, b) =>
      a.exShowroomPricePence > b.exShowroomPricePence ? a : b,
    );
    const quote = (variant: typeof cheap) =>
      calculateOnRoadPrice(
        {
          exShowroomPaise: variant.exShowroomPricePence,
          vehicleType: vehicle.type,
          fuelType: variant.fuelType,
          engineCc: variant.engineCc,
          stateCode: city.stateCode,
          cityName: city.name,
        },
        { rtoRules, rtoRates, insuranceRules },
      ).totalPaise;
    return { from: quote(cheap), to: quote(top) };
  }, [vehicle, city, rtoRules, rtoRates, insuranceRules]);

  const tags = variantTags(vehicle);

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-micro dark:border-slate-800 dark:bg-slate-900/70">
      <p className="text-sm text-slate-500 dark:text-slate-400">
        {vehicle.brand}
      </p>
      <h1 className="mt-0.5 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
        {vehicle.name}
      </h1>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        {vehicle.bestForHeadline}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Ex-showroom
          </p>
          <p className="mt-0.5 text-lg font-semibold text-slate-900 dark:text-white">
            {formatPaiseCompact(exFrom)} – {formatPaiseCompact(exTo)}
          </p>
        </div>
        <div>
          <p className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-orange-700 dark:text-amber-400">
            <MapPin className="size-3" aria-hidden />
            On-road in {city.name} ({city.rto})
          </p>
          <p className="mt-0.5 text-lg font-semibold text-slate-900 dark:text-white">
            {formatPaiseCompact(onRoad.from)} – {formatPaiseCompact(onRoad.to)}
          </p>
        </div>
      </div>
    </div>
  );
}
