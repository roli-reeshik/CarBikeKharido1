"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { updateRtoRule, type ActionResult } from "@/lib/admin/actions";
import { rtoUpdateSchema } from "@/lib/admin/schemas";
import type { RtoTaxRule } from "@/lib/catalogue/types";
import { formatPaiseCompact, paiseToRupees } from "@/lib/money";
import { cn } from "@/lib/utils";

export function RtoRuleEditor({
  rule,
  disabled,
}: {
  rule: RtoTaxRule;
  disabled: boolean;
}) {
  const [result, setResult] = useState<ActionResult | null>(null);
  const form = useForm({
    resolver: zodResolver(rtoUpdateSchema),
    defaultValues: {
      ruleId: rule.id,
      taxPercentage: rule.taxPercentage,
      cessPercentage: rule.cessPercentage,
      fixedFeeRupees: paiseToRupees(rule.fixedFee),
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    const data = new FormData();
    data.set("ruleId", values.ruleId);
    data.set("taxPercentage", String(values.taxPercentage));
    data.set("cessPercentage", String(values.cessPercentage));
    data.set("fixedFeeRupees", String(values.fixedFeeRupees));
    setResult(await updateRtoRule(null, data));
  });

  return (
    <form
      onSubmit={onSubmit}
      className="grid gap-3 border-b border-slate-100 py-3 last:border-0 sm:grid-cols-[minmax(0,1.4fr)_repeat(3,auto)_auto] sm:items-end dark:border-slate-800/70"
    >
      <input type="hidden" {...form.register("ruleId")} />

      <div className="min-w-0">
        <span className="block text-sm font-medium text-slate-900 dark:text-white">
          {formatPaiseCompact(rule.priceMin)} – {formatPaiseCompact(rule.priceMax)}
        </span>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {rule.vehicleType === "CAR" ? "Cars" : "Bikes"}
          {rule.fuelType ? ` · ${rule.fuelType} only` : " · all fuels"}
        </span>
      </div>

      <label className="block">
        <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
          Tax %
        </span>
        <input
          type="number"
          min={0}
          max={100}
          step={0.01}
          disabled={disabled}
          {...form.register("taxPercentage", { valueAsNumber: true })}
          className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm tabular-nums text-slate-900 disabled:opacity-50 sm:w-24 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
        />
      </label>

      <label className="block">
        <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
          Cess %
        </span>
        <input
          type="number"
          min={0}
          max={100}
          step={0.01}
          disabled={disabled}
          {...form.register("cessPercentage", { valueAsNumber: true })}
          className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm tabular-nums text-slate-900 disabled:opacity-50 sm:w-24 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
        />
      </label>

      <label className="block">
        <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
          Fixed ₹
        </span>
        <input
          type="number"
          min={0}
          step={50}
          disabled={disabled}
          {...form.register("fixedFeeRupees", { valueAsNumber: true })}
          className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm tabular-nums text-slate-900 disabled:opacity-50 sm:w-24 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
        />
      </label>

      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={disabled || form.formState.isSubmitting}
          className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-slate-700 disabled:opacity-50 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
        >
          {form.formState.isSubmitting ? (
            <Loader2 className="size-3.5 animate-spin" aria-hidden />
          ) : (
            <Check className="size-3.5" aria-hidden />
          )}
          Save
        </button>

        {result ? (
          <span
            role="status"
            className={cn(
              "text-xs",
              result.ok
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-rose-600 dark:text-rose-400",
            )}
          >
            {result.message}
          </span>
        ) : null}
      </div>
    </form>
  );
}
