"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  Cog,
  Fuel,
  Heart,
  IndianRupee,
  Luggage,
  ShieldCheck,
  Users,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { useSelectedVehicle } from "@/components/providers/SelectedVehicleProvider";
import { CarImage } from "@/components/ui/CarImage";
import { StarRating } from "@/components/ui/StarRating";
import { accent } from "@/lib/accents";
import {
  gearboxTag,
  luggagePlain,
  runningPlain,
  trafficPlain,
  vehicleAccent,
} from "@/lib/catalogue/copy";
import {
  headlineVariant,
  priceRangePaise,
  type VehicleWithRelations,
} from "@/lib/catalogue/types";
import { formatPaiseRange } from "@/lib/money";
import { vehiclePath } from "@/lib/routes";
import { cn } from "@/lib/utils";

function MetricChip({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200/70 bg-slate-50/70 p-2.5 dark:border-slate-800 dark:bg-slate-800/40">
      <span className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
        <Icon className="size-3.5" aria-hidden />
        {label}
      </span>
      <span className="mt-1 block text-sm font-medium leading-snug text-slate-800 dark:text-slate-100">
        {value}
      </span>
    </div>
  );
}

interface VehicleCardProps {
  vehicle: VehicleWithRelations;
  index?: number;
}

export function VehicleCard({ vehicle, index = 0 }: VehicleCardProps) {
  const { openPriceBreakdown } = useSelectedVehicle();
  const tone = accent(vehicleAccent(vehicle.slug));
  const headline = headlineVariant(vehicle);
  const href = vehiclePath(vehicle);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12, scale: 0.98 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 30,
        delay: index * 0.05,
      }}
      whileHover={{ y: -4 }}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white/85 shadow-micro backdrop-blur-sm transition-shadow duration-300 hover:shadow-lift dark:border-slate-800 dark:bg-slate-900/70"
    >
      <div className="relative">
        <Link href={href} aria-label={`See full details for the ${vehicle.name}`}>
          <CarImage
            carId={vehicle.slug}
            alt={vehicle.name}
            bodyStyle={vehicle.bodyType}
            accentKey={vehicleAccent(vehicle.slug)}
            priority={index < 3}
            className="h-44 sm:h-48"
          />
        </Link>

        {vehicle.safetyRatingNCAP != null ? (
          <span
            className={cn(
              "absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold shadow-micro backdrop-blur-sm dark:bg-slate-900/85",
              vehicle.safetyRatingNCAP >= 5
                ? "text-emerald-700 dark:text-emerald-300"
                : vehicle.safetyRatingNCAP >= 4
                  ? "text-amber-700 dark:text-amber-300"
                  : "text-slate-600 dark:text-slate-300",
            )}
          >
            <ShieldCheck className="size-3.5" aria-hidden />
            <StarRating stars={vehicle.safetyRatingNCAP} size={11} />
            <span className="hidden sm:inline">Bharat NCAP</span>
          </span>
        ) : (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-slate-600 shadow-micro backdrop-blur-sm dark:bg-slate-900/85 dark:text-slate-300">
            {vehicle.bodyType}
          </span>
        )}

        <button
          type="button"
          aria-label={`Save the ${vehicle.name}`}
          className="absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-white/90 text-slate-500 shadow-micro backdrop-blur-sm transition-colors hover:text-rose-600 dark:bg-slate-900/85 dark:text-slate-300"
        >
          <Heart className="size-4" aria-hidden />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold text-slate-900 sm:text-lg dark:text-white">
              <Link
                href={href}
                className="rounded-sm outline-offset-4 transition-colors hover:text-slate-600 focus-visible:outline-2 focus-visible:outline-slate-900 dark:hover:text-slate-300 dark:focus-visible:outline-white"
              >
                {vehicle.name}
              </Link>
            </h3>
            <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
              {headline.name} · {headline.seatingCapacity} seats
            </p>
          </div>
          <div className="shrink-0 text-right">
            <span className="block text-sm font-semibold text-slate-900 dark:text-white">
              {formatPaiseRange(priceRangePaise(vehicle))}
            </span>
            <span className="block text-[11px] text-slate-400">ex-showroom</span>
          </div>
        </div>

        <span
          className={cn(
            "mt-3 inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
            tone.soft,
          )}
        >
          Best for: {vehicle.bestForHeadline}
        </span>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <MetricChip
            icon={Luggage}
            label="Luggage"
            value={luggagePlain(vehicle.luggageCapacityBags)}
          />
          <MetricChip
            icon={vehicle.isElectric ? Zap : Fuel}
            label="Running cost"
            value={runningPlain(vehicle)}
          />
          <MetricChip
            icon={Cog}
            label="Gearbox"
            value={gearboxTag(headline.transmissionType)}
          />
          <MetricChip icon={Users} label="In traffic" value={trafficPlain(vehicle)} />
        </div>

        <div className="mt-5 grid gap-2 pt-1 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => openPriceBreakdown(vehicle.slug)}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-800 transition-colors hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
          >
            <IndianRupee className="size-4 shrink-0" aria-hidden />
            On-Road Price
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-3 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
          >
            <CalendarCheck className="size-4 shrink-0" aria-hidden />
            Free Test Drive
          </button>
        </div>
        <Link
          href={href}
          className="group/link mt-2 inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          Specs, variants, colours &amp; on-road price
          <ArrowRight
            className="size-4 transition-transform group-hover/link:translate-x-0.5"
            aria-hidden
          />
        </Link>
      </div>
    </motion.article>
  );
}
