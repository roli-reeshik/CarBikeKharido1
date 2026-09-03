"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeftRight,
  Check,
  Fuel,
  Luggage,
  ShieldCheck,
  TrafficCone,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { CarImage } from "@/components/ui/CarImage";
import { StarRating } from "@/components/ui/StarRating";
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
import { formatPaiseRange } from "@/lib/money";
import { cn } from "@/lib/utils";

type CompareKey =
  | "traffic"
  | "rearLegroom"
  | "bootForTrips"
  | "safetyKit"
  | "runningCost";

interface CompareRow {
  key: CompareKey;
  label: string;
  icon: LucideIcon;
}

const rows: CompareRow[] = [
  { key: "traffic", label: "Heavy traffic driving", icon: TrafficCone },
  { key: "rearLegroom", label: "3 adults in the back seat", icon: Users },
  { key: "bootForTrips", label: "Boot space for a family trip", icon: Luggage },
  { key: "safetyKit", label: "Crash safety", icon: ShieldCheck },
  { key: "runningCost", label: "Real running cost", icon: Fuel },
];

function profile(vehicle: VehicleWithRelations) {
  const headline = headlineVariant(vehicle);
  const auto = headline.transmissionType !== "MANUAL";
  const bags = vehicle.luggageCapacityBags ?? 0;
  const stars = vehicle.safetyRatingNCAP ?? 0;

  return {
    traffic: {
      verdict: trafficPlain(vehicle),
      score: auto ? 88 : vehicle.type === "BIKE" ? 70 : 48,
    },
    rearLegroom: {
      verdict:
        headline.seatingCapacity >= 5
          ? "Three adults fit — the middle one sits over a floor hump"
          : `${headline.seatingCapacity} seats — not a family car`,
      score: headline.seatingCapacity * 14,
    },
    bootForTrips: {
      verdict: luggagePlain(vehicle.luggageCapacityBags, vehicle.bootSpaceLuggage),
      score: bags * 22,
    },
    safetyKit: {
      verdict: stars
        ? `${stars}-star Bharat NCAP`
        : "Not crash-rated (two-wheeler)",
      score: stars * 19,
    },
    runningCost: {
      verdict: runningPlain(vehicle),
      score: Math.min(100, vehicle.realMileageKmPerLitre * 2.8),
    },
  };
}

function VehiclePicker({
  label,
  value,
  exclude,
  onChange,
  vehicles,
}: {
  label: string;
  value: string;
  exclude: string;
  onChange: (id: string) => void;
  vehicles: VehicleWithRelations[];
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-slate-200/80 bg-white px-3 py-2 text-sm font-medium text-slate-900 transition-colors hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
      >
        {vehicles
          .filter((vehicle) => vehicle.slug !== exclude)
          .map((vehicle) => (
            <option key={vehicle.slug} value={vehicle.slug}>
              {vehicle.name}
            </option>
          ))}
      </select>
    </label>
  );
}

function VehicleHeader({ vehicle }: { vehicle: VehicleWithRelations }) {
  return (
    <div className="group">
      <CarImage
        carId={vehicle.slug}
        alt={vehicle.name}
        bodyStyle={vehicle.bodyType}
        accentKey={vehicleAccent(vehicle.slug)}
        className="h-24 sm:h-28"
        showNote={false}
      />
      <p className="mt-2 truncate text-sm font-semibold text-slate-900 dark:text-white">
        {vehicle.name}
      </p>
      <p className="truncate text-xs text-slate-500 dark:text-slate-400">
        {formatPaiseRange(priceRangePaise(vehicle))}
      </p>
      {vehicle.safetyRatingNCAP != null ? (
        <StarRating
          stars={vehicle.safetyRatingNCAP}
          size={11}
          className="mt-1 text-amber-500"
        />
      ) : null}
    </div>
  );
}

function VerdictCell({
  verdict,
  isBetter,
}: {
  verdict: { verdict: string; score: number };
  isBetter: boolean;
}) {
  return (
    <td className="align-top p-2.5 sm:p-3">
      <div
        className={cn(
          "h-full rounded-xl border p-3 transition-colors",
          isBetter
            ? "border-emerald-300 bg-emerald-50/70 dark:border-emerald-500/40 dark:bg-emerald-500/10"
            : "border-slate-200/70 bg-white dark:border-slate-800 dark:bg-slate-900/60",
        )}
      >
        {isBetter ? (
          <span className="mb-1.5 inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
            <Check className="size-2.5" aria-hidden />
            Better pick
          </span>
        ) : null}

        <p className="text-sm font-medium leading-snug text-slate-800 dark:text-slate-100">
          {verdict.verdict}
        </p>

        <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <motion.div
            className={cn(
              "h-full rounded-full",
              isBetter ? "bg-emerald-500" : "bg-slate-400 dark:bg-slate-600",
            )}
            animate={{ width: `${verdict.score}%` }}
            transition={{ type: "spring", stiffness: 200, damping: 28 }}
          />
        </div>
      </div>
    </td>
  );
}

export function QuickCompare({ vehicles }: { vehicles: VehicleWithRelations[] }) {
  const [leftId, setLeftId] = useState(vehicles[0]?.slug ?? "");
  const [rightId, setRightId] = useState(vehicles[2]?.slug ?? vehicles[1]?.slug ?? "");

  const left = vehicles.find((vehicle) => vehicle.slug === leftId) ?? vehicles[0];
  const right =
    vehicles.find((vehicle) => vehicle.slug === rightId) ?? vehicles[1] ?? vehicles[0];

  const leftProfile = profile(left);
  const rightProfile = profile(right);

  const swap = () => {
    setLeftId(rightId);
    setRightId(leftId);
  };

  const tally = useMemo(() => {
    let leftWins = 0;
    let rightWins = 0;
    for (const row of rows) {
      const a = leftProfile[row.key].score;
      const b = rightProfile[row.key].score;
      if (a > b) leftWins += 1;
      else if (b > a) rightWins += 1;
    }
    return { leftWins, rightWins };
  }, [leftProfile, rightProfile]);

  return (
    <section
      id="compare"
      aria-labelledby="compare-heading"
      className="scroll-mt-28 border-t border-slate-200/70 bg-slate-50/60 dark:border-slate-800/80 dark:bg-slate-950/40"
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="mb-7 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
            <ArrowLeftRight className="size-3.5" aria-hidden />
            Side by side
          </span>
          <h2
            id="compare-heading"
            className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl dark:text-white"
          >
            Compare two vehicles like a human
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Same five questions every buyer asks, answered in sentences instead
            of a spreadsheet.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/85 shadow-micro backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/70">
          <div className="grid gap-3 border-b border-slate-100 p-4 sm:grid-cols-[1fr_auto_1fr] sm:items-end dark:border-slate-800">
            <VehiclePicker
              label="First vehicle"
              value={leftId}
              exclude={rightId}
              onChange={setLeftId}
              vehicles={vehicles}
            />
            <motion.button
              type="button"
              onClick={swap}
              whileHover={{ rotate: 180 }}
              whileTap={{ scale: 0.92 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              aria-label="Swap the two vehicles"
              className="mx-auto grid size-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
            >
              <ArrowLeftRight className="size-4" aria-hidden />
            </motion.button>
            <VehiclePicker
              label="Second vehicle"
              value={rightId}
              exclude={leftId}
              onChange={setRightId}
              vehicles={vehicles}
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[36rem] border-collapse text-left">
              <caption className="sr-only">
                Plain-English comparison between the {left.name} and the{" "}
                {right.name}
              </caption>
              <thead>
                <tr>
                  <th scope="col" className="w-44 p-3 align-bottom sm:w-52">
                    <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      What you asked
                    </span>
                  </th>
                  <th scope="col" className="p-2.5 align-bottom sm:p-3">
                    <VehicleHeader vehicle={left} />
                  </th>
                  <th scope="col" className="p-2.5 align-bottom sm:p-3">
                    <VehicleHeader vehicle={right} />
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const leftScore = leftProfile[row.key].score;
                  const rightScore = rightProfile[row.key].score;
                  const Icon = row.icon;

                  return (
                    <tr
                      key={row.key}
                      className="border-t border-slate-100 dark:border-slate-800"
                    >
                      <th scope="row" className="p-3 align-top">
                        <span className="flex items-start gap-2">
                          <Icon
                            className="mt-0.5 size-4 shrink-0 text-slate-400"
                            aria-hidden
                          />
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                            {row.label}
                          </span>
                        </span>
                      </th>
                      <VerdictCell
                        verdict={leftProfile[row.key]}
                        isBetter={leftScore > rightScore}
                      />
                      <VerdictCell
                        verdict={rightProfile[row.key]}
                        isBetter={rightScore > leftScore}
                      />
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/30">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {tally.leftWins === tally.rightWins ? (
                <>It is genuinely a tie — pick the one you like sitting in.</>
              ) : (
                <>
                  The{" "}
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {tally.leftWins > tally.rightWins ? left.name : right.name}
                  </span>{" "}
                  wins {Math.max(tally.leftWins, tally.rightWins)} of the 5
                  questions.
                </>
              )}
            </p>
            <button
              type="button"
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
            >
              Book both test drives
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
