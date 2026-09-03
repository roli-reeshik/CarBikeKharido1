"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Fuel,
  Luggage,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";

import Link from "next/link";

import { CarImage } from "@/components/ui/CarImage";
import { accent } from "@/lib/accents";
import {
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
import { useEscapeKey, useScrollLock } from "@/lib/hooks";
import { formatPaiseRange, paiseToRupees } from "@/lib/money";
import { vehiclePath } from "@/lib/routes";
import { cn } from "@/lib/utils";

type OccupantsAnswer = "solo" | "couple" | "family" | "crowd";
type TerrainAnswer = "city" | "highway" | "mixed" | "rough";
type PriorityAnswer = "running" | "safety" | "budget" | "comfort";

interface Answers {
  occupants?: OccupantsAnswer;
  terrain?: TerrainAnswer;
  priority?: PriorityAnswer;
}

interface Option<T extends string> {
  id: T;
  label: string;
  hint: string;
}

const occupantsOptions: Option<OccupantsAnswer>[] = [
  { id: "solo", label: "Mostly just me", hint: "One or two people, most days" },
  { id: "couple", label: "Me and one other", hint: "Rear seat is for luggage" },
  { id: "family", label: "Family of four", hint: "Two adults, two kids" },
  { id: "crowd", label: "Six or more", hint: "Parents and in-laws travel too" },
];

const terrainOptions: Option<TerrainAnswer>[] = [
  { id: "city", label: "Stuck in city traffic", hint: "Short trips, lots of signals" },
  { id: "highway", label: "Long highway runs", hint: "Weekend drives out of town" },
  { id: "mixed", label: "A bit of both", hint: "Weekday city, weekend highway" },
  { id: "rough", label: "Broken or village roads", hint: "Potholes and speed breakers" },
];

const priorityOptions: Option<PriorityAnswer>[] = [
  { id: "running", label: "Keeping the fuel bill low", hint: "Cost per kilometre matters most" },
  { id: "safety", label: "Protecting my family", hint: "Crash rating comes first" },
  { id: "budget", label: "The smallest monthly EMI", hint: "Lowest price I can live with" },
  { id: "comfort", label: "Comfort and equipment", hint: "Nice to sit in every day" },
];

const steps = [
  {
    key: "occupants" as const,
    question: "Who usually travels with you?",
    caption: "This decides how many seats and how much luggage room you really need.",
    options: occupantsOptions,
  },
  {
    key: "terrain" as const,
    question: "Where do you drive most?",
    caption: "A car that shines on the highway can be tiring in a two-hour crawl.",
    options: terrainOptions,
  },
  {
    key: "priority" as const,
    question: "What matters most to you?",
    caption: "We use this to break the tie between two otherwise close cars.",
    options: priorityOptions,
  },
];

interface Match {
  vehicle: VehicleWithRelations;
  reasons: string[];
}

function pickMatch(
  answers: Answers,
  vehicles: VehicleWithRelations[],
): Match | null {
  if (vehicles.length === 0) return null;

  const scored = vehicles.map((vehicle) => {
    let score = 0;
    const headline = headlineVariant(vehicle);
    const [from] = priceRangePaise(vehicle).map(paiseToRupees) as [number, number];

    if (answers.occupants === "crowd") {
      score += headline.seatingCapacity >= 7 ? 45 : vehicle.type === "CAR" ? 8 : -20;
    } else if (answers.occupants === "family") {
      score += (vehicle.luggageCapacityBags ?? 0) * 8;
      score += headline.seatingCapacity * 6;
    } else {
      score += from < 14_00_000 ? 12 : 0;
      if (answers.occupants === "solo" && vehicle.type === "BIKE") score += 18;
    }

    if (answers.terrain === "city") {
      score += headline.transmissionType === "MANUAL" ? 8 : 28;
      if (vehicle.isElectric) score += 10;
    } else if (answers.terrain === "highway") {
      score += vehicle.bodyType.includes("Midsize") ? 28 : 8;
      score += (vehicle.luggageCapacityBags ?? 0) * 4;
    } else if (answers.terrain === "mixed") {
      score += 14;
      if (vehicle.type === "CAR") score += 8;
    } else {
      score += vehicle.bodyType.includes("SUV") ? 26 : 4;
    }

    if (answers.priority === "running") {
      score += vehicle.realMileageKmPerLitre * 1.2;
    } else if (answers.priority === "safety") {
      score += (vehicle.safetyRatingNCAP ?? 0) * 8;
    } else if (answers.priority === "budget") {
      score += (1 - from / 20_00_000) * 40;
    } else {
      score += vehicle.bodyType.includes("Midsize") ? 20 : 10;
    }

    return { vehicle, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const winner = scored[0].vehicle;
  const headline = headlineVariant(winner);
  const reasons: string[] = [];

  if (answers.occupants === "crowd") {
    reasons.push(`Seats ${headline.seatingCapacity}.`);
  } else {
    reasons.push(luggagePlain(winner.luggageCapacityBags, winner.bootSpaceLuggage) + ".");
  }

  if (answers.terrain === "city") {
    reasons.push(`In traffic: ${trafficPlain(winner).toLowerCase()}.`);
  } else if (answers.terrain === "highway") {
    reasons.push(winner.bestForHeadline + ".");
  } else if (answers.terrain === "rough") {
    reasons.push(`A ${winner.bodyType.toLowerCase()} with the ground clearance for bad roads.`);
  } else {
    reasons.push(`${trafficPlain(winner)}.`);
  }

  if (answers.priority === "running") {
    reasons.push(runningPlain(winner) + ".");
  } else if (answers.priority === "safety") {
    reasons.push(
      winner.safetyRatingNCAP
        ? `${winner.safetyRatingNCAP}-star Bharat NCAP crash rating.`
        : "Two-wheelers are not crash-rated in India — ride gear matters more.",
    );
  } else if (answers.priority === "budget") {
    reasons.push(`The range starts at ${formatPaiseRange(priceRangePaise(winner))} ex-showroom.`);
  } else {
    reasons.push(winner.bestForHeadline + ".");
  }

  return { vehicle: winner, reasons };
}

interface GuidedMatcherModalProps {
  open: boolean;
  onClose: () => void;
  vehicles: VehicleWithRelations[];
}

/** Three-step conversational questionnaire that ends on a single recommendation. */
export function GuidedMatcherModal({
  open,
  onClose,
  vehicles,
}: GuidedMatcherModalProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});

  useEscapeKey(onClose, open);
  useScrollLock(open);

  const showResult = stepIndex === steps.length;
  const match = useMemo(
    () => (showResult ? pickMatch(answers, vehicles) : null),
    [showResult, answers, vehicles],
  );

  const reset = () => {
    setStepIndex(0);
    setAnswers({});
  };

  const handleClose = () => {
    onClose();
    // Let the exit animation finish before wiping the answers.
    window.setTimeout(reset, 250);
  };

  const progress = (Math.min(stepIndex, steps.length) / steps.length) * 100;
  const step = steps[Math.min(stepIndex, steps.length - 1)];
  const currentAnswer = answers[step.key];

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label="Help me choose a car"
        >
          <button
            type="button"
            aria-label="Close"
            onClick={handleClose}
            className="absolute inset-0 cursor-default bg-slate-900/50 backdrop-blur-sm"
          />

          <motion.div
            initial={{ y: 40, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 30, scale: 0.98, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative z-10 flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl border border-slate-200/80 bg-white shadow-lift sm:rounded-3xl dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-5 dark:border-slate-800">
              <div className="flex items-start gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300">
                  <Sparkles className="size-4.5" aria-hidden />
                </span>
                <div>
                  <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                    Help me choose
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {showResult
                      ? "Here is the car that fits what you described."
                      : `Question ${stepIndex + 1} of ${steps.length} — no jargon, promise.`}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close"
                className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>

            <div className="h-1 w-full bg-slate-100 dark:bg-slate-800">
              <motion.div
                className="h-full bg-violet-500"
                animate={{ width: `${showResult ? 100 : progress}%` }}
                transition={{ type: "spring", stiffness: 260, damping: 30 }}
              />
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-5">
              <AnimatePresence mode="wait" initial={false}>
                {showResult && match ? (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -24 }}
                    transition={{ type: "spring", stiffness: 320, damping: 32 }}
                    className="space-y-5"
                  >
                    <div
                      className={cn(
                        "overflow-hidden rounded-2xl border",
                        accent(vehicleAccent(match.vehicle.slug)).border,
                      )}
                    >
                      <div className="group">
                        <CarImage
                          carId={match.vehicle.slug}
                          alt={match.vehicle.name}
                          bodyStyle={match.vehicle.bodyType}
                          accentKey={vehicleAccent(match.vehicle.slug)}
                          className="h-40"
                          showNote={false}
                        />
                      </div>
                      <div className="space-y-3 p-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={cn(
                              "rounded-full px-2.5 py-1 text-xs font-semibold",
                              accent(vehicleAccent(match.vehicle.slug)).soft,
                            )}
                          >
                            Your best match
                          </span>
                          {match.vehicle.safetyRatingNCAP != null ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                              <ShieldCheck className="size-3" aria-hidden />
                              {match.vehicle.safetyRatingNCAP}-star Bharat NCAP
                            </span>
                          ) : null}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                            {match.vehicle.name}
                          </h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {formatPaiseRange(priceRangePaise(match.vehicle))}{" "}
                            ex-showroom · {match.vehicle.bodyType}
                          </p>
                        </div>

                        <ul className="space-y-2">
                          {match.reasons.map((reason) => (
                            <li
                              key={reason}
                              className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300"
                            >
                              <Check
                                className="mt-0.5 size-4 shrink-0 text-emerald-500"
                                aria-hidden
                              />
                              <span>{reason}</span>
                            </li>
                          ))}
                        </ul>

                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <span className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
                            <Luggage className="size-3.5 shrink-0" aria-hidden />
                            {luggagePlain(match.vehicle.luggageCapacityBags, match.vehicle.bootSpaceLuggage)}
                          </span>
                          <span className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
                            <Fuel className="size-3.5 shrink-0" aria-hidden />
                            {runningPlain(match.vehicle)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key={step.key}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -24 }}
                    transition={{ type: "spring", stiffness: 320, damping: 32 }}
                    className="space-y-4"
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                        {step.question}
                      </h3>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {step.caption}
                      </p>
                    </div>

                    <div className="grid gap-2.5 sm:grid-cols-2">
                      {step.options.map((option) => {
                        const selected = currentAnswer === option.id;
                        return (
                          <motion.button
                            key={option.id}
                            type="button"
                            whileHover={{ y: -3 }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ type: "spring", stiffness: 400, damping: 26 }}
                            onClick={() => {
                              setAnswers((current) => ({
                                ...current,
                                [step.key]: option.id,
                              }));
                              window.setTimeout(
                                () => setStepIndex((index) => index + 1),
                                180,
                              );
                            }}
                            aria-pressed={selected}
                            className={cn(
                              "rounded-2xl border p-4 text-left transition-colors",
                              selected
                                ? "border-violet-400 bg-violet-50 dark:border-violet-500/60 dark:bg-violet-500/10"
                                : "border-slate-200/80 bg-white hover:border-violet-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-violet-500/40",
                            )}
                          >
                            <span className="block text-sm font-semibold text-slate-900 dark:text-white">
                              {option.label}
                            </span>
                            <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">
                              {option.hint}
                            </span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-slate-100 p-4 dark:border-slate-800">
              <button
                type="button"
                onClick={() =>
                  stepIndex === 0 ? handleClose() : setStepIndex((index) => index - 1)
                }
                className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                <ArrowLeft className="size-4" aria-hidden />
                {stepIndex === 0 ? "Cancel" : "Back"}
              </button>

              {showResult ? (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={reset}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    <RotateCcw className="size-4" aria-hidden />
                    Start over
                  </button>
                  <Link
                    href={match ? vehiclePath(match.vehicle) : "/"}
                    onClick={handleClose}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-500"
                  >
                    See full details
                    <ArrowRight className="size-4" aria-hidden />
                  </Link>
                </div>
              ) : (
                <button
                  type="button"
                  disabled={!currentAnswer}
                  onClick={() => setStepIndex((index) => index + 1)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors enabled:hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-slate-900 dark:enabled:hover:bg-slate-200"
                >
                  {stepIndex === steps.length - 1 ? "Show my match" : "Next"}
                  <ArrowRight className="size-4" aria-hidden />
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
