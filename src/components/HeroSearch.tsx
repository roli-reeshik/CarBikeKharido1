"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BatteryCharging,
  Bike,
  Car,
  Fuel,
  Gauge,
  IndianRupee,
  Sparkles,
  Wallet,
} from "lucide-react";

import { GuidedMatcherModal } from "@/components/GuidedMatcherModal";
import { HeroBanner } from "@/components/HeroBanner";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { hasFuel } from "@/lib/catalogue/copy";
import { requestCatalogLens } from "@/lib/catalogFocus";
import {
  priceRangePaise,
  type FuelType,
  type VehicleType,
  type VehicleWithRelations,
} from "@/lib/catalogue/types";
import {
  budgetBands,
  powertrainOptions,
  purposeOptions,
} from "@/lib/data";
import { paiseToRupees } from "@/lib/money";
import type { BudgetId, PowertrainId, PurposeId } from "@/lib/types";
import { cn } from "@/lib/utils";

const powertrainIcons: Record<PowertrainId, typeof Fuel> = {
  petrol: Fuel,
  cng: Gauge,
  ev: BatteryCharging,
  diesel: Fuel,
};

const springy = { type: "spring", stiffness: 400, damping: 28 } as const;

type KindFilter = VehicleType | "ALL";

/** Shared pill button for the three intent rows. */
function IntentPill({
  selected,
  onClick,
  title,
  subtitle,
  icon,
}: {
  selected: boolean;
  onClick: () => void;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.97 }}
      transition={springy}
      className={cn(
        "relative flex-1 rounded-2xl border px-3.5 py-3 text-left transition-colors",
        selected
          ? "border-blue-400 bg-blue-50/80 dark:border-blue-500/60 dark:bg-blue-500/10"
          : "border-slate-200/80 bg-white/70 hover:border-blue-300 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-blue-500/40",
      )}
    >
      <span className="flex items-center gap-2">
        {icon ? (
          <span
            className={cn(
              "shrink-0",
              selected
                ? "text-blue-600 dark:text-blue-400"
                : "text-slate-400 dark:text-slate-500",
            )}
          >
            {icon}
          </span>
        ) : null}
        <span className="text-sm font-semibold text-slate-900 dark:text-white">
          {title}
        </span>
      </span>
      {subtitle ? (
        <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">
          {subtitle}
        </span>
      ) : null}
    </motion.button>
  );
}

function FieldLabel({ step, children }: { step: number; children: string }) {
  return (
    <div className="mb-2.5 flex items-center gap-2">
      <span className="grid size-5 place-items-center rounded-full bg-slate-900 text-[10px] font-bold text-white dark:bg-white dark:text-slate-900">
        {step}
      </span>
      <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
        {children}
      </span>
    </div>
  );
}

const powertrainToFuel: Record<PowertrainId, FuelType> = {
  petrol: "PETROL",
  cng: "CNG",
  ev: "ELECTRIC",
  diesel: "DIESEL",
};

function matchesPurpose(vehicle: VehicleWithRelations, purpose: PurposeId): boolean {
  const bags = vehicle.luggageCapacityBags ?? 0;
  switch (purpose) {
    case "cityRun":
      return (
        vehicle.type === "BIKE" ||
        vehicle.isElectric ||
        vehicle.bodyType.includes("Compact") ||
        vehicle.bodyType === "Crossover"
      );
    case "highway":
      return (
        vehicle.bodyType.includes("Midsize") ||
        vehicle.bodyType === "Cruiser" ||
        bags >= 3
      );
    case "largeFamily":
      return bags >= 3 && vehicle.type === "CAR";
    case "firstCar":
      return paiseToRupees(priceRangePaise(vehicle)[0]) < 15_00_000;
  }
}

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function HeroSearch({ vehicles }: { vehicles: VehicleWithRelations[] }) {
  const [kind, setKind] = useState<KindFilter>("ALL");
  const [budget, setBudget] = useState<BudgetId | null>("8to15");
  const [purpose, setPurpose] = useState<PurposeId | null>("cityRun");
  const [powertrain, setPowertrain] = useState<PowertrainId | null>(null);
  const [matcherOpen, setMatcherOpen] = useState(false);
  const [spotlight, setSpotlight] = useState(false);

  const matches = useMemo(() => {
    return vehicles.filter((vehicle) => {
      if (kind !== "ALL" && vehicle.type !== kind) return false;
      if (budget) {
        const band = budgetBands.find((item) => item.id === budget);
        if (band) {
          const [from, to] = priceRangePaise(vehicle).map(paiseToRupees) as [
            number,
            number,
          ];
          const overlaps = from < band.max && to >= band.min;
          if (!overlaps) return false;
        }
      }
      if (purpose && !matchesPurpose(vehicle, purpose)) return false;
      if (powertrain && !hasFuel(vehicle, powertrainToFuel[powertrain])) {
        return false;
      }
      return true;
    });
  }, [vehicles, kind, budget, purpose, powertrain]);

  const matcherPool =
    kind === "ALL" ? vehicles : vehicles.filter((vehicle) => vehicle.type === kind);

  const toggle = <T,>(current: T | null, next: T): T | null =>
    current === next ? null : next;

  const applyKindPreset = (next: KindFilter) => {
    setKind(next);
    if (next === "BIKE") {
      setBudget("under8");
      setPurpose("cityRun");
      setPowertrain(null);
    } else {
      setBudget("8to15");
      setPurpose("cityRun");
      setPowertrain(null);
    }
  };

  const openFinder = () => {
    setSpotlight(true);
    scrollToId("finder");
    window.setTimeout(() => setSpotlight(false), 2200);
  };

  const heroBudgetToBand: Record<string, BudgetId> = {
    under8: "under8",
    "8to12": "8to15",
    "12to20": "15to25",
    above20: "above25",
  };

  const onHeroSearch = ({
    segment,
    mode,
    budget: heroBudget,
    body,
  }: {
    segment: "new" | "used" | "bikes";
    mode: "budget" | "brand";
    budget: string;
    body: string;
    brand: string;
  }) => {
    if (segment === "bikes") {
      applyKindPreset("BIKE");
      requestCatalogLens("bikes");
    } else {
      applyKindPreset("CAR");
      setBudget(heroBudgetToBand[heroBudget] ?? "8to15");
      if (mode === "budget") {
        if (body === "cng") {
          setPowertrain("cng");
          setPurpose("cityRun");
        } else if (body === "seven" || body === "familySuv") {
          setPurpose("largeFamily");
          setPowertrain(null);
          requestCatalogLens("family");
          scrollToId("trending");
          return;
        } else {
          setPurpose("cityRun");
          setPowertrain(null);
        }
      }
      requestCatalogLens("cars");
    }
    scrollToId("trending");
  };

  const revealMatches = () => {
    requestCatalogLens(kind === "BIKE" ? "bikes" : kind === "CAR" ? "cars" : "trending");
    scrollToId("trending");
  };

  return (
    <section id="top" className="relative isolate">
      <h1 className="sr-only">
        Find your perfect car or dream bike on CarBikeKharido.com
      </h1>

      <HeroBanner onAdvancedSearch={openFinder} onSearch={onHeroSearch} />

      <div className="border-b border-slate-200/70 bg-slate-50/40 dark:border-slate-800/80 dark:bg-slate-950/40">
        <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
          <motion.div
            id="finder"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={cn(
              "scroll-mt-28 rounded-3xl border bg-white/90 p-5 shadow-lift backdrop-blur-xl sm:p-6 dark:bg-slate-900/80",
              spotlight
                ? "border-blue-400 ring-4 ring-blue-500/20 dark:border-blue-400 dark:ring-blue-400/20"
                : "border-slate-200/80 dark:border-slate-800",
            )}
          >
            <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Find your match in 3 taps
                </h2>
                <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                  Tell us the situation, not the specification.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMatcherOpen(true)}
                className="hidden shrink-0 items-center gap-1.5 rounded-xl border border-violet-200 bg-violet-50 px-3 py-2 text-sm font-medium text-violet-700 transition-colors hover:bg-violet-100 sm:inline-flex dark:border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-300 dark:hover:bg-violet-500/20"
              >
                <Sparkles className="size-4" aria-hidden />
                Help me choose
              </button>
            </div>

            <div
              role="tablist"
              aria-label="Vehicle type"
              className="mb-5 flex gap-1.5 rounded-2xl bg-slate-100 p-1 dark:bg-slate-800/70"
            >
              {(
                [
                  { id: "ALL", label: "Cars & bikes", icon: Sparkles },
                  { id: "CAR", label: "Cars", icon: Car },
                  { id: "BIKE", label: "Bikes", icon: Bike },
                ] as const
              ).map((option) => {
                const Icon = option.icon;
                const selected = kind === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    onClick={() => {
                      setKind(option.id);
                      if (option.id === "BIKE") setBudget("under8");
                      if (option.id === "CAR" && budget === "under8") {
                        setBudget("8to15");
                      }
                    }}
                    className={cn(
                      "inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                      selected
                        ? "bg-white text-slate-900 shadow-micro dark:bg-slate-900 dark:text-white"
                        : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200",
                    )}
                  >
                    <Icon className="size-3.5" aria-hidden />
                    {option.label}
                  </button>
                );
              })}
            </div>

            <div className="space-y-5">
              <fieldset>
                <legend className="sr-only">Budget</legend>
                <FieldLabel step={1}>What can you spend?</FieldLabel>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {budgetBands.map((band) => (
                    <IntentPill
                      key={band.id}
                      selected={budget === band.id}
                      onClick={() => setBudget(toggle(budget, band.id))}
                      title={band.label
                        .replace("Under ", "< ")
                        .replace(" Lakh", "L")
                        .replace(" +", "+")}
                      icon={<IndianRupee className="size-3.5" aria-hidden />}
                    />
                  ))}
                </div>
              </fieldset>

              <fieldset>
                <legend className="sr-only">How you will use it</legend>
                <FieldLabel step={2}>How will you use it?</FieldLabel>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {purposeOptions.map((option) => (
                    <IntentPill
                      key={option.id}
                      selected={purpose === option.id}
                      onClick={() => setPurpose(toggle(purpose, option.id))}
                      title={option.label}
                      subtitle={option.blurb}
                    />
                  ))}
                </div>
              </fieldset>

              <fieldset>
                <legend className="sr-only">What it should run on</legend>
                <FieldLabel step={3}>What should it run on?</FieldLabel>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                  {powertrainOptions.map((option) => {
                    const Icon = powertrainIcons[option.id];
                    return (
                      <IntentPill
                        key={option.id}
                        selected={powertrain === option.id}
                        onClick={() =>
                          setPowertrain(toggle(powertrain, option.id))
                        }
                        title={option.label}
                        subtitle={option.blurb}
                        icon={<Icon className="size-4" aria-hidden />}
                      />
                    );
                  })}
                </div>
              </fieldset>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-800/40">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  <AnimatedNumber
                    value={matches.length}
                    className="text-xl font-semibold text-slate-900 dark:text-white"
                  />{" "}
                  {matches.length === 1 ? "vehicle fits" : "vehicles fit"} what
                  you just described
                </p>
                <button
                  type="button"
                  disabled={matches.length === 0}
                  onClick={revealMatches}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors enabled:hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-slate-900 dark:enabled:hover:bg-slate-200"
                >
                  See them
                  <ArrowRight className="size-4" aria-hidden />
                </button>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <AnimatePresence mode="popLayout" initial={false}>
                  {matches.slice(0, 4).map((vehicle) => (
                    <motion.span
                      key={vehicle.id}
                      layout
                      initial={{ opacity: 0, scale: 0.86 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.86 }}
                      transition={springy}
                      className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                    >
                      <Wallet className="size-3 text-slate-400" aria-hidden />
                      {vehicle.name}
                    </motion.span>
                  ))}
                </AnimatePresence>
                {matches.length === 0 ? (
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Nothing fits all three. Try widening the budget or clearing
                    the fuel choice.
                  </span>
                ) : null}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setMatcherOpen(true)}
              className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-violet-200 bg-violet-50 px-3 py-2.5 text-sm font-medium text-violet-700 sm:hidden dark:border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-300"
            >
              <Sparkles className="size-4" aria-hidden />
              Not sure? Help me choose
            </button>
          </motion.div>
        </div>
      </div>

      <GuidedMatcherModal
        open={matcherOpen}
        onClose={() => setMatcherOpen(false)}
        vehicles={matcherPool}
      />
    </section>
  );
}
