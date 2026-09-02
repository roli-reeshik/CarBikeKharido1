"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Flame } from "lucide-react";

import { VehicleCard } from "@/components/VehicleCard";
import { hasAutomatic } from "@/lib/catalogue/copy";
import {
  headlineVariant,
  type VehicleWithRelations,
} from "@/lib/catalogue/types";
import { CATALOG_LENS_EVENT } from "@/lib/catalogFocus";
import { siteConfig } from "@/lib/siteConfig";
import { cn } from "@/lib/utils";

interface Lens {
  id: string;
  label: string;
  caption: string;
  apply: (pool: VehicleWithRelations[]) => VehicleWithRelations[];
}

const lenses: Lens[] = [
  {
    id: "trending",
    label: "Trending now",
    caption: `What buyers on ${siteConfig.name} are shortlisting this week.`,
    apply: (pool) => pool,
  },
  {
    id: "cars",
    label: "Cars",
    caption: "Four wheels only — SUVs, automatics and family haulers.",
    apply: (pool) => pool.filter((vehicle) => vehicle.type === "CAR"),
  },
  {
    id: "safest",
    label: "Safest picks",
    caption: "Only cars that scored top marks in an official crash test.",
    apply: (pool) =>
      pool
        .filter((vehicle) => (vehicle.safetyRatingNCAP ?? 0) >= 5)
        .sort(
          (a, b) => (b.safetyRatingNCAP ?? 0) - (a.safetyRatingNCAP ?? 0),
        ),
  },
  {
    id: "cheapest",
    label: "Cheapest to run",
    caption: "Ranked by real-world mileage — the higher, the cheaper per kilometre.",
    apply: (pool) =>
      [...pool].sort(
        (a, b) => b.realMileageKmPerLitre - a.realMileageKmPerLitre,
      ),
  },
  {
    id: "noClutch",
    label: "No clutch needed",
    caption: "Nothing to shift, nothing to press — built for a traffic crawl.",
    apply: (pool) => pool.filter(hasAutomatic),
  },
  {
    id: "bikes",
    label: "Bikes & scooters",
    caption: "Two-wheelers, priced the same honest way as the cars.",
    apply: (pool) => pool.filter((vehicle) => vehicle.type === "BIKE"),
  },
  {
    id: "family",
    label: "Room for everyone",
    caption: "Rear space and luggage room for a full car of people.",
    apply: (pool) =>
      [...pool]
        .filter((vehicle) => vehicle.type === "CAR")
        .sort(
          (a, b) =>
            (b.luggageCapacityBags ?? 0) - (a.luggageCapacityBags ?? 0) ||
            headlineVariant(b).seatingCapacity - headlineVariant(a).seatingCapacity,
        ),
  },
];

export function TrendingVehicles({
  vehicles,
}: {
  vehicles: VehicleWithRelations[];
}) {
  const [activeId, setActiveId] = useState(lenses[0].id);
  const activeLens = lenses.find((lens) => lens.id === activeId) ?? lenses[0];

  useEffect(() => {
    const onLens = (event: Event) => {
      const id = (event as CustomEvent<string>).detail;
      if (lenses.some((lens) => lens.id === id)) setActiveId(id);
    };
    window.addEventListener(CATALOG_LENS_EVENT, onLens);
    return () => window.removeEventListener(CATALOG_LENS_EVENT, onLens);
  }, []);
  const visible = useMemo(
    () => activeLens.apply(vehicles),
    [activeLens, vehicles],
  );

  return (
    <section
      id="trending"
      aria-labelledby="trending-heading"
      className="scroll-mt-28 border-y border-slate-200/70 bg-slate-50/60 dark:border-slate-800/80 dark:bg-slate-950/40"
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">
              <Flame className="size-3.5" aria-hidden />
              Popular this week
            </span>
            <h2
              id="trending-heading"
              className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl dark:text-white"
            >
              Vehicles people are actually buying
            </h2>
            <motion.p
              key={activeLens.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="mt-2 max-w-2xl text-slate-600 dark:text-slate-300"
            >
              {activeLens.caption}
            </motion.p>
          </div>
        </div>

        <div
          role="tablist"
          aria-label="Sort the shortlist"
          className="no-scrollbar -mx-1 mb-6 flex gap-1.5 overflow-x-auto px-1 pb-1"
        >
          {lenses.map((lens) => {
            const active = lens.id === activeId;
            return (
              <button
                key={lens.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveId(lens.id)}
                className={cn(
                  "relative shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "border-transparent text-white dark:text-slate-900"
                    : "border-slate-200/80 bg-white/70 text-slate-600 hover:border-slate-300 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300",
                )}
              >
                {active ? (
                  <motion.span
                    layoutId="trendingPill"
                    className="absolute inset-0 -z-10 rounded-full bg-slate-900 dark:bg-white"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                ) : null}
                {lens.label}
              </button>
            );
          })}
        </div>

        <motion.div
          layout
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((vehicle, index) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                index={index}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
