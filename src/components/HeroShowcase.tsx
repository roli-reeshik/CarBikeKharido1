"use client";

import { motion } from "framer-motion";
import { ArrowRight, Bike, Car, Gauge, IndianRupee } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { cn } from "@/lib/utils";

export type ShowcaseKind = "CAR" | "BIKE";

const splitSpring = { type: "spring", stiffness: 200, damping: 25 } as const;

const panels = {
  CAR: {
    image: "/vehicles/hyundai-creta-1.png",
    alt: "2024 Hyundai Creta, three-quarter front view",
    badge: "Explore 4-Wheelers",
    BadgeIcon: Car,
    headline: "Find Your Perfect Car",
    subtext:
      "Family SUVs, City Automatics, EVs & Hatchbacks — tailored to your real budget.",
    primary: "Search & Buy Cars",
    secondary: "Filter by Budget / On-Road Price",
    accent: "from-blue-500/25",
  },
  BIKE: {
    image: "/vehicles/royal-enfield-classic-350-1.jpg",
    alt: "Royal Enfield Classic 350, three-quarter view",
    badge: "Explore 2-Wheelers",
    BadgeIcon: Bike,
    headline: "Find Your Dream Bike",
    subtext: "Daily Commuters, Tourers, Cruisers & Performance Superbikes.",
    primary: "Search & Buy Bikes",
    secondary: "Explore Superbikes & EV Scooters",
    accent: "from-rose-500/25",
  },
} as const;

interface HeroShowcaseProps {
  onBrowseCatalog: (kind: ShowcaseKind) => void;
  onOpenFinder: (kind: ShowcaseKind, preset?: "budget" | "superbike") => void;
}

/**
 * Full-bleed 50/50 car vs bike showcase. Width classes stay identical on the
 * server and the first client paint (`hovered` starts null). Hover then
 * springs the active half to 58% via Framer Motion layout.
 */
export function HeroShowcase({
  onBrowseCatalog,
  onOpenFinder,
}: HeroShowcaseProps) {
  const [hovered, setHovered] = useState<ShowcaseKind | null>(null);

  return (
    <div
      className="relative isolate flex min-h-0 flex-col overflow-hidden bg-slate-950 lg:h-[min(86vh,880px)] lg:flex-row"
      onMouseLeave={() => setHovered(null)}
    >
      <ShowcasePanel
        kind="CAR"
        hovered={hovered}
        divider
        onHover={setHovered}
        onPrimary={() => onBrowseCatalog("CAR")}
        onSecondary={() => onOpenFinder("CAR", "budget")}
      />
      <ShowcasePanel
        kind="BIKE"
        hovered={hovered}
        onHover={setHovered}
        onPrimary={() => onBrowseCatalog("BIKE")}
        onSecondary={() => onOpenFinder("BIKE", "superbike")}
      />
    </div>
  );
}

function ShowcasePanel({
  kind,
  hovered,
  divider,
  onHover,
  onPrimary,
  onSecondary,
}: {
  kind: ShowcaseKind;
  hovered: ShowcaseKind | null;
  divider?: boolean;
  onHover: (kind: ShowcaseKind) => void;
  onPrimary: () => void;
  onSecondary: () => void;
}) {
  const copy = panels[kind];
  const BadgeIcon = copy.BadgeIcon;
  const active = hovered === kind;

  return (
    <motion.article
      layout
      transition={splitSpring}
      onMouseEnter={() => onHover(kind)}
      onFocusCapture={() => onHover(kind)}
      className={cn(
        "relative isolate min-h-[400px] w-full overflow-hidden lg:h-full",
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
        <Image
          src={copy.image}
          alt={copy.alt}
          fill
          priority
          sizes="(max-width: 1023px) 100vw, 58vw"
          className="object-cover object-center"
        />
      </motion.div>

      <div
        aria-hidden
        className={cn(
          "absolute inset-0 bg-linear-to-t from-black/85 via-black/40 to-transparent",
          copy.accent,
        )}
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-linear-to-r from-black/35 via-transparent to-black/20"
      />

      <div className="relative z-10 flex h-full min-h-[400px] flex-col justify-end p-6 sm:p-8 lg:min-h-0 lg:p-10 xl:p-14">
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold tracking-wide text-white/90 shadow-micro backdrop-blur-md">
          <BadgeIcon className="size-3.5" aria-hidden />
          {copy.badge}
        </span>

        <h2 className="mt-4 max-w-lg text-3xl font-semibold tracking-tight text-white sm:text-4xl xl:text-5xl">
          {copy.headline}
        </h2>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-white/75 sm:text-base">
          {copy.subtext}
        </p>

        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
          <button
            type="button"
            onClick={onPrimary}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-100"
          >
            {copy.primary}
            <ArrowRight className="size-4" aria-hidden />
          </button>
          <button
            type="button"
            onClick={onSecondary}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-medium text-white backdrop-blur-md transition-colors hover:border-white/40 hover:bg-white/15"
          >
            {kind === "CAR" ? (
              <IndianRupee className="size-4" aria-hidden />
            ) : (
              <Gauge className="size-4" aria-hidden />
            )}
            {copy.secondary}
          </button>
        </div>
      </div>
    </motion.article>
  );
}
