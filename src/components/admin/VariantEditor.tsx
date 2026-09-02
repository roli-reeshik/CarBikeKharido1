"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Loader2, Star } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { updateVariant, type ActionResult } from "@/lib/admin/actions";
import {
  variantUpdateSchema,
} from "@/lib/admin/schemas";
import type { Variant } from "@/lib/catalogue/types";
import { paiseToRupees } from "@/lib/money";
import { cn } from "@/lib/utils";

export function VariantEditor({
  variant,
  disabled,
}: {
  variant: Variant;
  disabled: boolean;
}) {
  const [result, setResult] = useState<ActionResult | null>(null);
  const form = useForm({
    resolver: zodResolver(variantUpdateSchema),
    defaultValues: {
      variantId: variant.id,
      exShowroomRupees: paiseToRupees(variant.exShowroomPricePence),
      isPopular: variant.isPopular,
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    const data = new FormData();
    data.set("variantId", values.variantId);
    data.set("exShowroomRupees", String(values.exShowroomRupees));
    if (values.isPopular) data.set("isPopular", "on");
    setResult(await updateVariant(null, data));
  });

  return (
    <form
      onSubmit={onSubmit}
      className="grid gap-3 border-b border-slate-100 py-3 last:border-0 sm:grid-cols-[minmax(0,1fr)_auto_auto_auto] sm:items-end dark:border-slate-800/70"
    >
      <input type="hidden" {...form.register("variantId")} />

      <div className="min-w-0">
        <span className="block truncate text-sm font-medium text-slate-900 dark:text-white">
          {variant.name}
        </span>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {variant.fuelType} · {variant.transmissionType.replace(/_/g, " ")}
          {variant.engineCc ? ` · ${variant.engineCc} cc` : ""}
        </span>
      </div>

      <label className="block">
        <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
          Ex-showroom ₹
        </span>
        <input
          type="number"
          min={1}
          step={1000}
          disabled={disabled}
          {...form.register("exShowroomRupees", { valueAsNumber: true })}
          className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm tabular-nums text-slate-900 disabled:opacity-50 sm:w-36 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
        />
      </label>

      <label className="flex items-center gap-2 pb-1.5 text-sm text-slate-700 dark:text-slate-200">
        <input
          type="checkbox"
          disabled={disabled}
          {...form.register("isPopular")}
          className="size-4 rounded border-slate-300 disabled:opacity-50 dark:border-slate-600"
        />
        <Star className="size-3.5 text-amber-500" aria-hidden />
        Most bought
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
