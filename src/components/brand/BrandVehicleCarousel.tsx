"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Cog, Fuel, IndianRupee } from "lucide-react";
import Link from "next/link";
import { useCallback, useState } from "react";

import { VehicleImage } from "@/components/ui/VehicleImage";
import {
  categoriesForBrand,
  categoryForVehicle,
  filterByCategory,
  type VehicleCategory,
} from "@/lib/brandData";
import { gearboxTag } from "@/lib/catalogue/copy";
import {
  headlineVariant,
  priceRangePaise,
  type VehicleWithRelations,
} from "@/lib/catalogue/types";
import { formatPaiseRange } from "@/lib/money";
import { vehiclePath } from "@/lib/routes";
import { getVehicleImage } from "@/utils/getVehicleImage";
import { cn } from "@/lib/utils";

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
};

const springTransition = { type: "spring" as const, stiffness: 300, damping: 30 };

interface BrandVehicleCarouselProps {
  vehicles: VehicleWithRelations[];
}

export function BrandVehicleCarousel({ vehicles }: BrandVehicleCarouselProps) {
  const categories = categoriesForBrand(vehicles);
  const [activeCat, setActiveCat] = useState<VehicleCategory>("All");
  const filtered = filterByCategory(vehicles, activeCat);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const safeIndex = filtered.length > 0 ? index % filtered.length : 0;
  const current = filtered[safeIndex];

  const go = useCallback(
    (dir: 1 | -1) => {
      if (filtered.length === 0) return;
      setDirection(dir);
      setIndex((prev) => (prev + dir + filtered.length) % filtered.length);
    },
    [filtered.length],
  );

  const switchCategory = (cat: VehicleCategory) => {
    setActiveCat(cat);
    setIndex(0);
    setDirection(0);
  };

  if (!current) {
    return (
      <p className="py-20 text-center text-sm text-slate-500">
        No vehicles in this category yet.
      </p>
    );
  }

  const headline = headlineVariant(current);
  const image = getVehicleImage(current.slug);
  const href = vehiclePath(current);
  const engineLabel =
    headline.engineCc != null ? `${(headline.engineCc / 1000).toFixed(1)}L` : "Electric";

  return (
    <div className="space-y-8">
      {/* ---- Category tabs ---- */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => switchCategory(cat)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-colors",
              activeCat === cat
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700",
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ---- Studio slide ---- */}
      <div className="relative flex items-center justify-center">
        {/* Prev arrow */}
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous vehicle"
          className="absolute left-0 z-10 grid size-11 place-items-center rounded-full border border-slate-200 bg-white/90 text-slate-600 shadow-micro backdrop-blur transition-colors hover:bg-slate-100 sm:left-2 sm:size-12 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-300"
        >
          <ChevronLeft className="size-5" aria-hidden />
        </button>

        <div className="w-full max-w-2xl overflow-hidden px-12">
          <AnimatePresence mode="popLayout" custom={direction}>
            <motion.div
              key={current.slug + activeCat}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={springTransition}
              className="flex flex-col items-center"
            >
              <Link
                href={href}
                aria-label={`View details and on-road price for ${current.name}`}
                className="relative block aspect-[16/10] w-full max-w-xl overflow-hidden rounded-2xl"
              >
                <VehicleImage
                  src={image.src}
                  alt={current.name}
                  fill
                  slug={current.slug}
                  category={current.type}
                  bodyType={current.bodyType}
                  sizes="(max-width: 768px) 90vw, 640px"
                  className="object-cover"
                  priority
                />
              </Link>

              <h3 className="mt-5 text-center text-xl font-semibold text-slate-900 sm:text-2xl dark:text-white">
                {current.name}
              </h3>
              <p className="mt-1 text-center text-sm text-slate-500 dark:text-slate-400">
                {current.bestForHeadline}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Next arrow */}
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next vehicle"
          className="absolute right-0 z-10 grid size-11 place-items-center rounded-full border border-slate-200 bg-white/90 text-slate-600 shadow-micro backdrop-blur transition-colors hover:bg-slate-100 sm:right-2 sm:size-12 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-300"
        >
          <ChevronRight className="size-5" aria-hidden />
        </button>
      </div>

      {/* ---- Quick spec strip ---- */}
      <div className="mx-auto grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
        <Link
          href={href}
          className="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white/70 p-3 text-sm font-medium text-slate-800 transition-colors hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-200"
        >
          <ArrowRight className="size-4 text-blue-600 dark:text-blue-400" aria-hidden />
          <span className="truncate">{current.name}</span>
        </Link>
        <div className="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white/70 p-3 text-sm dark:border-slate-800 dark:bg-slate-900/60">
          <IndianRupee className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden />
          <span className="truncate font-medium text-slate-800 dark:text-slate-200">
            {formatPaiseRange(priceRangePaise(current))}
          </span>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white/70 p-3 text-sm dark:border-slate-800 dark:bg-slate-900/60">
          <Fuel className="size-4 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden />
          <span className="truncate text-slate-700 dark:text-slate-300">{engineLabel}</span>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white/70 p-3 text-sm dark:border-slate-800 dark:bg-slate-900/60">
          <Cog className="size-4 shrink-0 text-violet-600 dark:text-violet-400" aria-hidden />
          <span className="truncate text-slate-700 dark:text-slate-300">
            {gearboxTag(headline.transmissionType)}
          </span>
        </div>
      </div>
    </div>
  );
}
