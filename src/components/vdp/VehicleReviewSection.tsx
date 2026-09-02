"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  Fuel,
  Luggage,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import type { VdpReviewSection } from "@/lib/vdpContent";
import { cn } from "@/lib/utils";

const icons = {
  exterior: Star,
  interior: Sparkles,
  features: Sparkles,
  safety: ShieldCheck,
  boot: Luggage,
  performance: Fuel,
} as const;

export function VehicleReviewSection({
  section,
}: {
  section: VdpReviewSection;
}) {
  const [open, setOpen] = useState(false);
  const Icon = icons[section.id as keyof typeof icons] ?? Sparkles;

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 dark:border-slate-800 dark:bg-slate-900/60">
      <div className="grid gap-0 sm:grid-cols-[minmax(0,200px)_1fr]">
        {section.imageUrl ? (
          <div className="relative min-h-36 bg-slate-100 dark:bg-slate-800">
            <Image
              src={section.imageUrl}
              alt=""
              fill
              sizes="200px"
              className="object-cover"
            />
          </div>
        ) : null}
        <div className="p-5">
          <h3 className="flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-white">
            <Icon className="size-4 text-orange-600 dark:text-amber-400" aria-hidden />
            {section.heading}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {section.shortDescription}
          </p>
          <AnimatePresence initial={false}>
            {open ? (
              <motion.div
                key="full"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 320, damping: 34 }}
                className="overflow-hidden"
              >
                <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {section.fullDescription}
                </p>
              </motion.div>
            ) : null}
          </AnimatePresence>
          <button
            type="button"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
            className={cn(
              "mt-3 inline-flex items-center gap-1 text-sm font-medium text-orange-700 hover:underline dark:text-amber-400",
            )}
          >
            {open ? "Read less" : "Read more"}
            <ChevronDown
              className={cn("size-4 transition-transform", open && "rotate-180")}
              aria-hidden
            />
          </button>
        </div>
      </div>
    </article>
  );
}
