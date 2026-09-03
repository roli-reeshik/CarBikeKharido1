import { ArrowRight, Minus, Plus } from "lucide-react";
import Link from "next/link";

import { StarRating } from "@/components/ui/StarRating";
import { formatCompactRupees } from "@/lib/finance";
import { vehiclePathBySlug } from "@/lib/routes";
import type { Rival } from "@/lib/types";

/**
 * Same-segment rivals from other brands. Each card states where the rival wins
 * and where it loses, because "here are three other cars" on its own does not
 * help anybody decide.
 */
export function RivalGrid({ rivals, carName }: { rivals: Rival[]; carName: string }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {rivals.map((rival) => (
        <article
          key={`${rival.brand}-${rival.model}`}
          className="flex flex-col rounded-2xl border border-slate-200/80 bg-white/70 p-4 transition-shadow hover:shadow-micro dark:border-slate-800 dark:bg-slate-900/50"
        >
          <header>
            <h3 className="font-semibold text-slate-900 dark:text-white">
              {rival.brand} {rival.model}
            </h3>
            <p className="mt-1 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              {rival.stars > 0 ? <StarRating stars={rival.stars} size={11} /> : null}
              from {formatCompactRupees(rival.priceFrom)}
            </p>
          </header>

          <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {rival.oneLiner}
          </p>

          <dl className="mt-4 space-y-2.5 text-sm">
            <div className="flex gap-2">
              <dt className="sr-only">Where the {rival.model} is better</dt>
              <Plus
                className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400"
                aria-hidden
              />
              <dd className="leading-relaxed text-slate-700 dark:text-slate-200">
                {rival.edge}
              </dd>
            </div>
            <div className="flex gap-2">
              <dt className="sr-only">Where the {carName} is better</dt>
              <Minus
                className="mt-0.5 size-4 shrink-0 text-rose-500 dark:text-rose-400"
                aria-hidden
              />
              <dd className="leading-relaxed text-slate-700 dark:text-slate-200">
                {rival.gap}
              </dd>
            </div>
          </dl>

          {rival.carId ? (
            <Link
              href={vehiclePathBySlug(rival.carId)}
              aria-label={`View details and on-road price for ${rival.brand} ${rival.model}`}
              className="group mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-900 dark:text-white"
            >
              See full details
              <ArrowRight
                className="size-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden
              />
            </Link>
          ) : (
            <p className="mt-4 text-xs text-slate-400">Not yet in our catalogue</p>
          )}
        </article>
      ))}
    </div>
  );
}
