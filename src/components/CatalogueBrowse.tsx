"use client";

import { VehicleCard } from "@/components/VehicleCard";
import {
  catalogueHeading,
  filterCatalogue,
  type CatalogQuery,
} from "@/lib/catalogue/filters";
import type { VehicleType, VehicleWithRelations } from "@/lib/catalogue/types";

export function CatalogueBrowse({
  vehicles,
  segment,
  query,
}: {
  vehicles: VehicleWithRelations[];
  segment: VehicleType;
  query: CatalogQuery;
}) {
  const filtered = filterCatalogue(vehicles, segment, query);
  const fallback = vehicles.filter((vehicle) => vehicle.type === segment);
  const empty = filtered.length === 0;
  const visible = empty ? fallback : filtered;
  const copy = catalogueHeading(segment, query);

  return (
    <section
      id="catalogue"
      aria-labelledby="catalogue-heading"
      className="scroll-mt-28 border-y border-slate-200/70 bg-slate-50/60 dark:border-slate-800/80 dark:bg-slate-950/40"
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <h1
          id="catalogue-heading"
          className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl dark:text-white"
        >
          {copy.title}
        </h1>
        <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-300">
          {copy.caption}
        </p>
        {empty ? (
          <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200">
            Nothing in the live catalogue matches this filter yet. Showing every{" "}
            {segment === "CAR" ? "car" : "two-wheeler"} we can price on-road today.
          </p>
        ) : null}

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((vehicle, index) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
