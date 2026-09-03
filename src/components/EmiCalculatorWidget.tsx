"use client";

import { useCallback, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Calculator, PiggyBank, TrendingUp } from "lucide-react";

import { useCity } from "@/components/providers/CityProvider";
import { useSelectedVehicle } from "@/components/providers/SelectedVehicleProvider";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { RangeSlider } from "@/components/ui/RangeSlider";
import { headlineVariant } from "@/lib/catalogue/types";
import type { InsuranceRule, RtoTaxRate, RtoTaxRule } from "@/lib/catalogue/types";
import { calculateEmi, formatCompactRupees, formatRupees } from "@/lib/finance";
import { paiseToRupees } from "@/lib/money";
import { calculateOnRoadPrice } from "@/lib/pricingEngine";
import { clamp } from "@/lib/utils";

const LOAN_STEP = 10_000;
const MIN_LOAN = 1_00_000;

const RING_RADIUS = 46;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

/** Donut showing how much of the total repayment is interest. */
function SplitRing({ principalShare }: { principalShare: number }) {
  return (
    <svg viewBox="0 0 120 120" className="size-32 shrink-0 -rotate-90">
      <circle
        cx="60"
        cy="60"
        r={RING_RADIUS}
        fill="none"
        strokeWidth="14"
        className="stroke-amber-400/80"
      />
      <motion.circle
        cx="60"
        cy="60"
        r={RING_RADIUS}
        fill="none"
        strokeWidth="14"
        strokeLinecap="round"
        strokeDasharray={RING_CIRCUMFERENCE}
        className="stroke-blue-600 dark:stroke-blue-500"
        initial={false}
        animate={{
          strokeDashoffset: RING_CIRCUMFERENCE * (1 - principalShare),
        }}
        transition={{ type: "spring", stiffness: 160, damping: 26 }}
      />
    </svg>
  );
}

export function EmiCalculatorWidget({
  rtoRules,
  rtoRates,
  insuranceRules,
}: {
  rtoRules: RtoTaxRule[];
  rtoRates?: RtoTaxRate[];
  insuranceRules: InsuranceRule[];
}) {
  const { city } = useCity();
  const { vehicle } = useSelectedVehicle();
  const headline = headlineVariant(vehicle);

  const onRoad = useMemo(() => {
    const quote = calculateOnRoadPrice(
      {
        exShowroomPaise: headline.exShowroomPricePence,
        vehicleType: vehicle.type,
        fuelType: headline.fuelType,
        engineCc: headline.engineCc,
        stateCode: city.stateCode,
        cityName: city.name,
      },
      { rtoRules, rtoRates, insuranceRules },
    );
    return paiseToRupees(quote.totalPaise);
  }, [headline, vehicle.type, city, rtoRules, rtoRates, insuranceRules]);

  const maxLoan = Math.ceil(onRoad / LOAN_STEP) * LOAN_STEP;
  const suggestedLoan = clamp(
    Math.round((onRoad * 0.85) / LOAN_STEP) * LOAN_STEP,
    MIN_LOAN,
    maxLoan,
  );

  const [tenureMonths, setTenureMonths] = useState(60);
  const [rate, setRate] = useState(9.2);

  /**
   * The loan is tagged with the car + city it was chosen for. When either
   * changes, the tag no longer matches and we fall back to 85% of the new
   * on-road price — no effect needed to re-seed it.
   */
  const seedKey = `${vehicle.slug}:${city.id}`;
  const [loanState, setLoanState] = useState({
    key: seedKey,
    value: suggestedLoan,
  });

  const loan =
    loanState.key === seedKey
      ? clamp(loanState.value, MIN_LOAN, maxLoan)
      : suggestedLoan;

  const setLoan = useCallback(
    (value: number) => setLoanState({ key: seedKey, value }),
    [seedKey],
  );

  const emi = useMemo(
    () => calculateEmi(loan, rate, tenureMonths),
    [loan, rate, tenureMonths],
  );

  const downPayment = Math.max(onRoad - loan, 0);
  const principalShare = 1 - emi.interestShare;

  const tenureLabel = (months: number) => {
    const years = Math.floor(months / 12);
    const rest = months % 12;
    if (rest === 0) return `${years} ${years === 1 ? "year" : "years"}`;
    return `${years}y ${rest}m`;
  };

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white/85 shadow-micro backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/70">
      <div className="border-b border-slate-100 p-5 dark:border-slate-800">
        <div className="flex items-start gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300">
            <Calculator className="size-4.5" aria-hidden />
          </span>
          <div className="min-w-0">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              What it costs you every month
            </h3>
            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
              Based on the {formatCompactRupees(onRoad)} on-road price in{" "}
              {city.name}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-6 p-5">
        <RangeSlider
          label="Loan amount"
          value={loan}
          min={MIN_LOAN}
          max={maxLoan}
          step={LOAN_STEP}
          onChange={setLoan}
          formatValue={formatCompactRupees}
          minLabel={formatCompactRupees(MIN_LOAN)}
          maxLabel={`${formatCompactRupees(maxLoan)} (full price)`}
          accentKey="blue"
        />

        <RangeSlider
          label="How long you want to pay"
          value={tenureMonths}
          min={12}
          max={84}
          step={6}
          onChange={setTenureMonths}
          formatValue={tenureLabel}
          minLabel="1 year"
          maxLabel="7 years"
          accentKey="indigo"
        />

        <RangeSlider
          label="Interest rate the bank offers"
          value={rate}
          min={7}
          max={16}
          step={0.05}
          onChange={setRate}
          formatValue={(value) => `${value.toFixed(2)}% a year`}
          minLabel="7%"
          maxLabel="16%"
          accentKey="amber"
        />

        <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/40">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm text-slate-500 dark:text-slate-400">
              Down payment you arrange yourself
            </span>
            <AnimatedNumber
              value={downPayment}
              format={formatRupees}
              className="text-sm font-semibold text-slate-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100 bg-slate-50/70 p-5 dark:border-slate-800 dark:bg-slate-800/30">
        <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
          <div className="relative grid place-items-center">
            <SplitRing principalShare={principalShare} />
            <div className="absolute inset-0 grid place-content-center text-center">
              <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                Interest
              </span>
              <AnimatedNumber
                value={emi.interestShare * 100}
                format={(value) => `${value.toFixed(0)}%`}
                className="text-lg font-semibold text-slate-900 dark:text-white"
              />
              <span className="text-[10px] text-slate-400">of what you repay</span>
            </div>
          </div>

          <div className="min-w-0 flex-1 text-center sm:text-left">
            <span className="text-sm text-slate-500 dark:text-slate-400">
              Your monthly EMI
            </span>
            <AnimatedNumber
              value={emi.monthly}
              format={formatRupees}
              stiffness={180}
              damping={24}
              className="mt-0.5 block text-3xl font-semibold text-slate-900 sm:text-4xl dark:text-white"
            />
            <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">
              for {tenureLabel(tenureMonths)}, at {rate.toFixed(2)}% a year
            </span>

            <dl className="mt-4 grid grid-cols-2 gap-2">
              <div className="rounded-xl border border-slate-200/70 bg-white p-2.5 text-left dark:border-slate-800 dark:bg-slate-900/70">
                <dt className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-slate-400">
                  <PiggyBank className="size-3.5" aria-hidden />
                  You borrowed
                </dt>
                <dd>
                  <AnimatedNumber
                    value={emi.principal}
                    format={formatCompactRupees}
                    className="mt-0.5 block text-sm font-semibold text-blue-600 dark:text-blue-400"
                  />
                </dd>
              </div>
              <div className="rounded-xl border border-slate-200/70 bg-white p-2.5 text-left dark:border-slate-800 dark:bg-slate-900/70">
                <dt className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-slate-400">
                  <TrendingUp className="size-3.5" aria-hidden />
                  Interest on top
                </dt>
                <dd>
                  <AnimatedNumber
                    value={emi.totalInterest}
                    format={formatCompactRupees}
                    className="mt-0.5 block text-sm font-semibold text-amber-600 dark:text-amber-400"
                  />
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <p className="mt-4 text-[11px] leading-relaxed text-slate-400">
          Over {tenureLabel(tenureMonths)} you repay{" "}
          {formatRupees(emi.totalPayable)} in total. Stretching the tenure lowers
          the monthly figure but raises this number.
        </p>
      </div>
    </div>
  );
}
