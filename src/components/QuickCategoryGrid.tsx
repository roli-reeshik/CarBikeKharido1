"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Fuel, ShieldCheck, TrafficCone, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { accent } from "@/lib/accents";
import { hasAutomatic, hasFuel } from "@/lib/catalogue/copy";
import type { VehicleWithRelations } from "@/lib/catalogue/types";
import { categoryTiles } from "@/lib/data";
import type { CategoryId } from "@/lib/types";
import { cn } from "@/lib/utils";

const categoryIcons: Record<CategoryId, LucideIcon> = {
  safety: ShieldCheck,
  cityAutomatic: TrafficCone,
  cheapToRun: Fuel,
  familyHauler: Users,
};

function matchingVehicles(
  id: CategoryId,
  vehicles: VehicleWithRelations[],
): VehicleWithRelations[] {
  switch (id) {
    case "safety":
      return vehicles.filter((vehicle) => (vehicle.safetyRatingNCAP ?? 0) >= 5);
    case "cityAutomatic":
      return vehicles.filter(hasAutomatic);
    case "cheapToRun":
      return vehicles.filter(
        (vehicle) =>
          vehicle.isElectric || hasFuel(vehicle, "CNG"),
      );
    case "familyHauler":
      return vehicles.filter(
        (vehicle) => (vehicle.luggageCapacityBags ?? 0) >= 3,
      );
  }
}

export function QuickCategoryGrid({
  vehicles,
}: {
  vehicles: VehicleWithRelations[];
}) {
  return (
    <section
      aria-labelledby="discover-heading"
      className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8"
    >
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2
            id="discover-heading"
            className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl dark:text-white"
          >
            Start from what you need
          </h2>
          <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-300">
            Four honest shortlists, sorted by the things people actually ask
            about in a showroom.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-white/70 px-3.5 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-200"
        >
          Browse all shortlists
          <ArrowUpRight className="size-4" aria-hidden />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[minmax(10.5rem,auto)]">
        {categoryTiles.map((tile, index) => {
          const Icon = categoryIcons[tile.id];
          const tone = accent(tile.accent);
          const matching = matchingVehicles(tile.id, vehicles);
          const isFeature = index === 0;

          return (
            <motion.article
              key={tile.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 30,
                delay: index * 0.06,
              }}
              whileHover={{ y: -4 }}
              className={cn(
                "group relative isolate flex cursor-pointer flex-col overflow-hidden rounded-2xl border bg-white/80 p-5 shadow-micro backdrop-blur-sm transition-shadow hover:shadow-lift dark:bg-slate-900/60",
                tone.border,
                tile.span,
              )}
            >
              <div
                aria-hidden
                className={cn(
                  "absolute inset-0 -z-10 bg-linear-to-br opacity-70 transition-opacity duration-300 group-hover:opacity-100",
                  tone.wash,
                )}
              />

              <div className="flex items-start justify-between gap-3">
                <span
                  className={cn(
                    "grid size-10 shrink-0 place-items-center rounded-xl",
                    tone.soft,
                  )}
                >
                  <Icon className="size-5" aria-hidden />
                </span>
                <span
                  className={cn(
                    "rounded-full px-2.5 py-1 text-[11px] font-semibold",
                    tone.soft,
                  )}
                >
                  {tile.tag}
                </span>
              </div>

              <h3
                className={cn(
                  "mt-4 font-semibold tracking-tight text-slate-900 dark:text-white",
                  isFeature ? "text-xl sm:text-2xl" : "text-base",
                )}
              >
                {tile.title}
              </h3>
              <p
                className={cn(
                  "mt-1.5 text-slate-600 dark:text-slate-300",
                  isFeature ? "max-w-md text-sm sm:text-base" : "text-sm",
                )}
              >
                {tile.subtitle}
              </p>

              <div className="mt-auto pt-4">
                {isFeature ? (
                  <ul className="mb-4 space-y-1.5">
                    {matching.slice(0, 3).map((vehicle) => (
                      <li
                        key={vehicle.id}
                        className="flex items-center justify-between gap-3 rounded-xl bg-white/70 px-3 py-2 text-sm dark:bg-slate-900/60"
                      >
                        <span className="font-medium text-slate-800 dark:text-slate-100">
                          {vehicle.name}
                        </span>
                        <span className="shrink-0 text-xs text-slate-500 dark:text-slate-400">
                          {vehicle.safetyRatingNCAP
                            ? `${vehicle.safetyRatingNCAP}-star`
                            : vehicle.bodyType}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : null}

                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-200">
                  {matching.length}{" "}
                  {matching.length === 1 ? "vehicle" : "vehicles"}
                  <ArrowUpRight
                    className={cn(
                      "size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
                      tone.text,
                    )}
                    aria-hidden
                  />
                </span>
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
