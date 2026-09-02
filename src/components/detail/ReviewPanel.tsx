import { AlertTriangle, Quote, ThumbsUp } from "lucide-react";

import { StarRating } from "@/components/ui/StarRating";
import type { ReviewSummary } from "@/lib/types";

/**
 * Owner sentiment, split into what people consistently praise and what they
 * consistently regret. The "watch out" column is deliberately as prominent as
 * the praise — a buyer's guide that only lists positives is not useful.
 */
export function ReviewPanel({ reviews }: { reviews: ReviewSummary }) {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-x-8 gap-y-4 rounded-2xl border border-slate-200/80 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-900/50">
        <div>
          <span className="flex items-baseline gap-2">
            <span className="text-3xl font-semibold text-slate-900 dark:text-white">
              {reviews.ownerRating.toFixed(1)}
            </span>
            <StarRating stars={Math.round(reviews.ownerRating)} size={14} />
          </span>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            From {reviews.ownerCount.toLocaleString("en-IN")} owners
          </p>
        </div>

        <div>
          <span className="flex items-baseline gap-2">
            <span className="text-3xl font-semibold text-slate-900 dark:text-white">
              {reviews.expertRating.toFixed(1)}
            </span>
            <StarRating stars={Math.round(reviews.expertRating)} size={14} />
          </span>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Road-test average
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <section className="rounded-2xl border border-emerald-200/70 bg-emerald-50/50 p-4 dark:border-emerald-900/60 dark:bg-emerald-950/20">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-emerald-800 dark:text-emerald-300">
            <ThumbsUp className="size-4" aria-hidden />
            What owners love
          </h3>
          <ul className="mt-3 space-y-2">
            {reviews.loved.map((item) => (
              <li
                key={item}
                className="text-sm leading-relaxed text-slate-700 dark:text-slate-200"
              >
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-amber-200/70 bg-amber-50/50 p-4 dark:border-amber-900/60 dark:bg-amber-950/20">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-amber-800 dark:text-amber-300">
            <AlertTriangle className="size-4" aria-hidden />
            What to watch out for
          </h3>
          <ul className="mt-3 space-y-2">
            {reviews.watchOut.map((item) => (
              <li
                key={item}
                className="text-sm leading-relaxed text-slate-700 dark:text-slate-200"
              >
                {item}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {reviews.quotes.map((quote) => (
          <blockquote
            key={quote.author}
            className="rounded-2xl border border-slate-200/80 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-900/50"
          >
            <Quote className="size-5 text-slate-300 dark:text-slate-600" aria-hidden />
            <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
              {quote.text}
            </p>
            <footer className="mt-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <StarRating stars={quote.rating} size={11} />
              <cite className="font-medium not-italic text-slate-700 dark:text-slate-300">
                {quote.author}
              </cite>
              · {quote.city} · {quote.months} months in
            </footer>
          </blockquote>
        ))}
      </div>
    </div>
  );
}
