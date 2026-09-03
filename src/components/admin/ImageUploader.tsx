"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { addVehicleImage, type ActionResult } from "@/lib/admin/actions";
import { imageSchema, type ImageInput } from "@/lib/admin/schemas";
import { cn } from "@/lib/utils";

export function ImageUploader({
  vehicleId,
  disabled,
}: {
  vehicleId: string;
  disabled: boolean;
}) {
  const [result, setResult] = useState<ActionResult | null>(null);
  const form = useForm<ImageInput>({
    resolver: zodResolver(imageSchema),
    defaultValues: {
      vehicleId,
      url: "",
      type: "PRESS_EDITORIAL",
      caption: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    const data = new FormData();
    data.set("vehicleId", values.vehicleId);
    data.set("url", values.url);
    data.set("type", values.type);
    if (values.caption) data.set("caption", values.caption);
    const outcome = await addVehicleImage(null, data);
    setResult(outcome);
    if (outcome.ok) form.reset({ ...values, url: "", caption: "" });
  });

  return (
    <form onSubmit={onSubmit} className="mt-4 rounded-xl border border-dashed border-slate-200 p-3 dark:border-slate-700">
      <p className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-400">
        <ImagePlus className="size-3.5" aria-hidden />
        Add a press-kit photo
      </p>
      <input type="hidden" {...form.register("vehicleId")} />
      <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto_auto]">
        <input
          type="text"
          placeholder="https://… or /vehicles/photo.jpg"
          disabled={disabled}
          {...form.register("url")}
          className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-900 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
        />
        <select
          disabled={disabled}
          {...form.register("type")}
          className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-900 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
        >
          <option value="HERO_CUTOUT">Hero cutout</option>
          <option value="PRESS_EDITORIAL">Press / editorial</option>
          <option value="STUDIO_360">Studio 360</option>
          <option value="INTERIOR">Interior</option>
        </select>
        <button
          type="submit"
          disabled={disabled || form.formState.isSubmitting}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-slate-900"
        >
          {form.formState.isSubmitting ? (
            <Loader2 className="size-3.5 animate-spin" aria-hidden />
          ) : (
            "Add"
          )}
        </button>
      </div>
      {form.formState.errors.url ? (
        <p className="mt-1.5 text-xs text-rose-600 dark:text-rose-400">
          {form.formState.errors.url.message}
        </p>
      ) : result ? (
        <p
          role="status"
          className={cn(
            "mt-1.5 text-xs",
            result.ok
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-rose-600 dark:text-rose-400",
          )}
        >
          {result.message}
        </p>
      ) : (
        <p className="mt-1.5 text-xs text-slate-400">
          Paste a local path such as /vehicles/creta-hero.webp or
          /uploads/vehicles/hyundai-creta/hero.webp. Files stay on this server.
        </p>
      )}
    </form>
  );
}
