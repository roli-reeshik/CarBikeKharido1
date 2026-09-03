"use client";

import { motion } from "framer-motion";
import { ArrowRight, Bike, Car } from "lucide-react";
import { useState } from "react";

import { VehicleImage } from "@/components/ui/VehicleImage";
import { cn } from "@/lib/utils";
import { getVehicleImage } from "@/utils/getVehicleImage";

export type ShowcaseKind = "CAR" | "BIKE";

const splitSpring = { type: "spring", stiffness: 200, damping: 25 } as const;

const carPhoto = getVehicleImage("hyundai-creta");
const bikePhoto = getVehicleImage("ducati-panigale-v4");

const panels = {
  CAR: {
    slug: "hyundai-creta",
    bodyType: "Midsize SUV",
    image: carPhoto.src,
    alt: carPhoto.alt,
    badge: "Cars",
    BadgeIcon: Car,
    headline: "Browse every car",
    subtext: "SUVs, automatics, family haulers — tap through to the full list.",
    cta: "See all cars",
    accent: "from-blue-500/30",
    object: "object-[center_55%]",
  },
  BIKE: {
    slug: "ducati-panigale-v4",
    bodyType: "Superbike",
    image: bikePhoto.src,
    alt: bikePhoto.alt,
    badge: "Two-wheelers",
    BadgeIcon: Bike,
    headline: "Browse every bike",
    subtext: "Cruisers, commuters and EV scooters — priced the same honest way.",
    cta: "See all two-wheelers",
    accent: "from-rose-500/30",
    object: "object-center",
  },
} as const;

interface HeroShowcaseProps {
  onSelect: (kind: ShowcaseKind) => void;
}

/**
 * Full-bleed 50/50 car vs bike panels. The whole half is the hit target.
 */
export function HeroShowcase({ onSelect }: HeroShowcaseProps) {
  const [hovered, setHovered] = useState<ShowcaseKind | null>(null);

  return (
    <div
      className="relative isolate flex min-h-0 flex-col overflow-hidden bg-slate-950 lg:h-[min(72vh,760px)] lg:flex-row"
      onMouseLeave={() => setHovered(null)}
    >
      <ShowcasePanel
        kind="CAR"
        hovered={hovered}
        divider
        onHover={setHovered}
        onSelect={() => onSelect("CAR")}
      />
      <ShowcasePanel
        kind="BIKE"
        hovered={hovered}
        onHover={setHovered}
        onSelect={() => onSelect("BIKE")}
      />
    </div>
  );
}

function ShowcasePanel({
  kind,
  hovered,
  divider,
  onHover,
  onSelect,
}: {
  kind: ShowcaseKind;
  hovered: ShowcaseKind | null;
  divider?: boolean;
  onHover: (kind: ShowcaseKind) => void;
  onSelect: () => void;
}) {
  const copy = panels[kind];
  const BadgeIcon = copy.BadgeIcon;
  const active = hovered === kind;

  return (
    <motion.button
      type="button"
      layout
      transition={splitSpring}
      onMouseEnter={() => onHover(kind)}
      onFocus={() => onHover(kind)}
      onClick={onSelect}
      aria-label={copy.cta}
      className={cn(
        "group relative isolate min-h-[320px] w-full overflow-hidden text-left lg:h-full",
        !hovered && "lg:w-1/2",
        hovered === kind && "lg:w-[58%]",
        hovered && hovered !== kind && "lg:w-[42%]",
        divider && "lg:border-r lg:border-white/10",
      )}
    >
      <motion.div
        className="absolute inset-0"
        initial={false}
        animate={{ scale: active ? 1.06 : 1 }}
        transition={splitSpring}
      >
        <VehicleImage
          src={copy.image}
          alt={copy.alt}
          fill
          priority
          quality={90}
          slug={copy.slug}
          category={kind}
          bodyType={copy.bodyType}
          sizes="(max-width: 1023px) 100vw, 58vw"
          className={cn("object-cover", copy.object)}
        />
      </motion.div>

      <div
        aria-hidden
        className={cn(
          "absolute inset-0 bg-linear-to-t from-black/80 via-black/35 to-black/10",
          copy.accent,
        )}
      />

      <div className="relative z-10 flex h-full min-h-[320px] flex-col justify-end p-6 sm:p-8 lg:min-h-0 lg:p-10">
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold tracking-wide text-white/90 backdrop-blur-md">
          <BadgeIcon className="size-3.5" aria-hidden />
          {copy.badge}
        </span>
        <h2 className="mt-4 max-w-lg text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          {copy.headline}
        </h2>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-white/75 sm:text-base">
          {copy.subtext}
        </p>
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-white">
          {copy.cta}
          <ArrowRight
            className="size-4 transition-transform group-hover:translate-x-0.5"
            aria-hidden
          />
        </span>
      </div>
    </motion.button>
  );
}
