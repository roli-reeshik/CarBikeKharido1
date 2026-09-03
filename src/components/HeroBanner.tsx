"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Bike, Car, Recycle, Search } from "lucide-react";
import { useEffect, useState } from "react";

import { ExplainTooltip } from "@/components/ExplainTooltip";
import { VehicleImage } from "@/components/ui/VehicleImage";
import { requestCatalogLens } from "@/lib/catalogFocus";
import { cn } from "@/lib/utils";
import { getVehicleImage } from "@/utils/getVehicleImage";

type Segment = "new" | "used" | "bikes";
type FilterMode = "budget" | "brand";

const budgets = [
  { id: "under8", label: "Under ₹8 Lakh" },
  { id: "8to12", label: "₹8 – 12 Lakh" },
  { id: "12to20", label: "₹12 – 20 Lakh" },
  { id: "above20", label: "Above ₹20 Lakh" },
] as const;

const bodyTypes = [
  { id: "familySuv", label: "Family SUV" },
  { id: "cityAuto", label: "City Automatic" },
  { id: "seven", label: "7-Seater" },
  { id: "cng", label: "High-Mileage CNG" },
] as const;

const brands = [
  "Tata",
  "Maruti Suzuki",
  "Hyundai",
  "Mahindra",
  "Royal Enfield",
  "TVS",
  "Ola",
  "Ducati",
] as const;

const slides = [
  {
    id: "nexon",
    slug: "tata-nexon",
    bodyType: "Compact SUV",
    badge: "COMPACT SUV",
    name: "Tata Nexon",
    headline: "A 5-star family SUV that still makes sense on a city fuel budget",
    image: getVehicleImage("tata-nexon").src,
    alt: getVehicleImage("tata-nexon").alt,
    lens: "cars" as const,
  },
  {
    id: "creta",
    slug: "hyundai-creta",
    bodyType: "Midsize SUV",
    badge: "MIDSIZE SUV",
    name: "Hyundai Creta",
    headline: "Highway trips in quiet comfort — every RTO rupee explained",
    image: getVehicleImage("hyundai-creta").src,
    alt: getVehicleImage("hyundai-creta").alt,
    lens: "cars" as const,
  },
  {
    id: "classic",
    slug: "royal-enfield-classic-350",
    bodyType: "Cruiser",
    badge: "CRUISER FEATURED",
    name: "Royal Enfield Classic 350",
    headline: "Weekend rides you actually look forward to",
    image: getVehicleImage("royal-enfield-classic-350").src,
    alt: getVehicleImage("royal-enfield-classic-350").alt,
    lens: "bikes" as const,
  },
];

const SLIDE_MS = 7000;

interface HeroBannerProps {
  onAdvancedSearch: () => void;
  onSearch: (input: {
    segment: Segment;
    mode: FilterMode;
    budget: string;
    body: string;
    brand: string;
  }) => void;
}

export function HeroBanner({ onAdvancedSearch, onSearch }: HeroBannerProps) {
  const [segment, setSegment] = useState<Segment>("new");
  const [mode, setMode] = useState<FilterMode>("budget");
  const [budget, setBudget] = useState("8to12");
  const [body, setBody] = useState("familySuv");
  const [brand, setBrand] = useState("Tata");
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(
      () => setSlide((index) => (index + 1) % slides.length),
      SLIDE_MS,
    );
    return () => window.clearInterval(timer);
  }, []);

  const current = slides[slide];

  return (
    <div className="relative isolate overflow-hidden bg-slate-950">
      <div className="relative min-h-[420px] lg:min-h-[620px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0"
          >
            <VehicleImage
              src={current.image}
              alt={current.alt}
              fill
              priority={slide === 0}
              sizes="100vw"
              slug={current.slug}
              bodyType={current.bodyType}
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/45 to-black/20" />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-black/20" />
          </motion.div>
        </AnimatePresence>

        <div className="relative mx-auto flex min-h-[420px] w-full max-w-7xl flex-col justify-end gap-8 px-4 py-8 sm:px-6 lg:min-h-[620px] lg:flex-row lg:items-center lg:justify-between lg:px-8 lg:py-14">
          <FinderCard
            segment={segment}
            mode={mode}
            budget={budget}
            body={body}
            brand={brand}
            onSegment={setSegment}
            onMode={setMode}
            onBudget={setBudget}
            onBody={setBody}
            onBrand={setBrand}
            onAdvancedSearch={onAdvancedSearch}
            onSearch={() =>
              onSearch({ segment, mode, budget, body, brand })
            }
          />

          <div className="max-w-xl text-white lg:self-end lg:pb-10">
            <span className="inline-flex rounded-full border border-amber-300/40 bg-amber-500/20 px-3 py-1 text-[11px] font-bold tracking-wide text-amber-100 backdrop-blur-md">
              {current.badge}
            </span>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">
              {current.headline}
            </h2>
            <button
              type="button"
              onClick={() => {
                requestCatalogLens(current.lens);
                document
                  .getElementById("money")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md transition-colors hover:bg-white/20"
            >
              Know More & View Price Breakdown
              <ArrowRight className="size-4" aria-hidden />
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 bg-black/40 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-7xl gap-2 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8">
          {slides.map((item, index) => {
            const active = index === slide;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSlide(index)}
                className={cn(
                  "min-w-40 flex-1 rounded-xl px-3 py-2 text-left transition-colors",
                  active ? "bg-white/10" : "hover:bg-white/5",
                )}
              >
                <span
                  className={cn(
                    "block text-xs font-semibold",
                    active ? "text-white" : "text-white/70",
                  )}
                >
                  {item.name}
                </span>
                <span className="mt-1.5 block h-1 overflow-hidden rounded-full bg-white/15">
                  {active ? (
                    <motion.span
                      key={`${item.id}-${slide}`}
                      className="block h-full rounded-full bg-amber-400"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: SLIDE_MS / 1000, ease: "linear" }}
                    />
                  ) : null}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function FinderCard({
  segment,
  mode,
  budget,
  body,
  brand,
  onSegment,
  onMode,
  onBudget,
  onBody,
  onBrand,
  onSearch,
  onAdvancedSearch,
}: {
  segment: Segment;
  mode: FilterMode;
  budget: string;
  body: string;
  brand: string;
  onSegment: (value: Segment) => void;
  onMode: (value: FilterMode) => void;
  onBudget: (value: string) => void;
  onBody: (value: string) => void;
  onBrand: (value: string) => void;
  onSearch: () => void;
  onAdvancedSearch: () => void;
}) {
  const segments: { id: Segment; label: string; icon: typeof Car }[] = [
    { id: "new", label: "New Car", icon: Car },
    { id: "used", label: "Used Car", icon: Recycle },
    { id: "bikes", label: "Bikes & Scooters", icon: Bike },
  ];

  return (
    <div className="w-full max-w-md rounded-2xl border border-slate-100 bg-white/95 p-6 shadow-2xl backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
        Find your right vehicle
      </h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Search the way a showroom assistant would — budget first, jargon never.
      </p>

      <div
        role="tablist"
        className="mt-4 flex gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800"
      >
        {segments.map((item) => {
          const Icon = item.icon;
          const selected = segment === item.id;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => onSegment(item.id)}
              className={cn(
                "relative flex flex-1 items-center justify-center gap-1 rounded-lg px-2 py-2 text-[11px] font-semibold sm:text-xs",
                selected
                  ? "text-slate-900 dark:text-white"
                  : "text-slate-500 dark:text-slate-400",
              )}
            >
              {selected ? (
                <motion.span
                  layoutId="finderSegment"
                  className="absolute inset-0 rounded-lg bg-white shadow-micro dark:bg-slate-900"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              ) : null}
              <span className="relative inline-flex items-center gap-1">
                <Icon className="size-3.5" aria-hidden />
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      <fieldset className="mt-4 flex gap-4 text-sm">
        <legend className="sr-only">Search by</legend>
        {(
          [
            { id: "budget", label: "By Budget" },
            { id: "brand", label: "By Brand" },
          ] as const
        ).map((option) => (
          <label
            key={option.id}
            className="inline-flex cursor-pointer items-center gap-2 text-slate-700 dark:text-slate-200"
          >
            <input
              type="radio"
              name="finder-mode"
              checked={mode === option.id}
              onChange={() => onMode(option.id)}
              className="accent-orange-600"
            />
            {option.label}
          </label>
        ))}
      </fieldset>

      <div className="mt-4 space-y-3">
        {mode === "budget" ? (
          <>
            <label className="block">
              <span className="text-xs font-medium text-slate-500">Select budget</span>
              <select
                value={budget}
                onChange={(event) => onBudget(event.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              >
                {budgets.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-medium text-slate-500">
                Body type / purpose
              </span>
              <select
                value={body}
                onChange={(event) => onBody(event.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              >
                {bodyTypes.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
          </>
        ) : (
          <label className="block">
            <span className="text-xs font-medium text-slate-500">Select brand</span>
            <select
              value={brand}
              onChange={(event) => onBrand(event.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            >
              {brands.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      <p className="mt-3 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
        Confused by{" "}
        <ExplainTooltip
          term="AMT"
          meaning="A basic automatic — no clutch, but you still feel a small pause between gears."
        />{" "}
        vs{" "}
        <ExplainTooltip
          term="torque converter"
          meaning="The buttery-smooth automatic — creeps forward in traffic with no clutch at all."
        />
        ? Hover the words.
      </p>

      <button
        type="button"
        onClick={onSearch}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-orange-600 to-amber-600 py-3.5 text-sm font-bold text-white shadow-lg transition-colors hover:from-orange-700 hover:to-amber-700"
      >
        <Search className="size-4" aria-hidden />
        Search vehicles
      </button>

      <button
        type="button"
        onClick={onAdvancedSearch}
        className="mt-3 inline-flex w-full items-center justify-center gap-1 text-sm font-medium text-orange-700 hover:underline dark:text-amber-400"
      >
        Advanced Intent Search
        <ArrowRight className="size-4" aria-hidden />
      </button>
    </div>
  );
}
