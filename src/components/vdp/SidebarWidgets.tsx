"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CalendarCheck, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import { vehiclePathBySlug } from "@/lib/routes";
import type { VdpSimilar } from "@/lib/vdpContent";
import { cn } from "@/lib/utils";

type SimilarTab = "trending" | "latest" | "upcoming";

export function SidebarWidgets({
  similar,
  sponsor,
}: {
  similar: VdpSimilar[];
  sponsor: { title: string; blurb: string; cta: string };
}) {
  const [tab, setTab] = useState<SimilarTab>("trending");
  const [phone, setPhone] = useState("");
  const [booked, setBooked] = useState(false);
  const [error, setError] = useState("");

  const visible = useMemo(
    () => similar.filter((item) => item.kind === tab).slice(0, 4),
    [similar, tab],
  );

  const submitDrive = (event: React.FormEvent) => {
    event.preventDefault();
    const digits = phone.replace(/\D/g, "").slice(-10);
    if (digits.length !== 10) {
      setError("Enter a 10-digit Indian mobile number.");
      return;
    }
    setError("");
    setBooked(true);
  };

  return (
    <aside className="space-y-5 lg:sticky lg:top-[8.5rem]">
      <section className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-micro dark:border-slate-800 dark:bg-slate-900/80">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
            Popular similar vehicles
          </h2>
          <a
            href="#compare"
            className="inline-flex items-center gap-0.5 text-xs font-medium text-orange-700 dark:text-amber-400"
          >
            View all
            <ArrowRight className="size-3.5" aria-hidden />
          </a>
        </div>
        <div
          role="tablist"
          className="mt-3 flex gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800"
        >
          {(
            [
              { id: "trending", label: "Trending" },
              { id: "latest", label: "Latest" },
              { id: "upcoming", label: "Upcoming" },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={tab === item.id}
              onClick={() => setTab(item.id)}
              className={cn(
                "flex-1 rounded-lg px-2 py-1.5 text-[11px] font-semibold",
                tab === item.id
                  ? "bg-white text-slate-900 shadow-micro dark:bg-slate-900 dark:text-white"
                  : "text-slate-500 dark:text-slate-400",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
        <ul className="mt-3 space-y-2">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((item) => (
              <motion.li
                key={`${tab}-${item.name}`}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                {item.slug ? (
                  <Link
                    href={vehiclePathBySlug(item.slug)}
                    className="flex items-center gap-3 rounded-xl p-2 hover:bg-slate-50 dark:hover:bg-slate-800/70"
                  >
                    <SimilarThumb item={item} />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-slate-900 dark:text-white">
                        {item.brand} {item.name.replace(item.brand, "").trim()}
                      </span>
                      <span className="block text-xs text-slate-500">{item.priceLabel}</span>
                    </span>
                  </Link>
                ) : (
                  <div className="flex items-center gap-3 rounded-xl p-2">
                    <SimilarThumb item={item} />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-slate-900 dark:text-white">
                        {item.brand} {item.name.replace(item.brand, "").trim()}
                      </span>
                      <span className="block text-xs text-slate-500">
                        {item.priceLabel} · Coming to the catalogue
                      </span>
                    </span>
                  </div>
                )}
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </section>

      <section className="rounded-2xl border border-orange-200/80 bg-linear-to-br from-orange-50 to-amber-50 p-5 shadow-micro dark:border-amber-500/20 dark:from-amber-500/10 dark:to-slate-900">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
          <CalendarCheck className="size-4 text-orange-600" aria-hidden />
          Doorstep test drive
        </h2>
        <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          A product specialist brings the vehicle to your building. No showroom
          hop, no obligation.
        </p>
        {booked ? (
          <p className="mt-4 rounded-xl bg-white/80 px-3 py-3 text-sm text-emerald-800 dark:bg-slate-900/60 dark:text-emerald-300">
            Booked. We will call {phone} within one working day.
          </p>
        ) : (
          <form onSubmit={submitDrive} className="mt-4 space-y-2">
            <label className="block">
              <span className="sr-only">Mobile number</span>
              <span className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 dark:border-slate-700 dark:bg-slate-950">
                <Phone className="size-4 text-slate-400" aria-hidden />
                <input
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  placeholder="10-digit mobile"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  className="w-full bg-transparent text-sm outline-none"
                />
              </span>
            </label>
            {error ? <p className="text-xs text-rose-600">{error}</p> : null}
            <button
              type="submit"
              className="w-full rounded-xl bg-linear-to-r from-orange-600 to-amber-600 py-2.5 text-sm font-bold text-white shadow-lg hover:from-orange-700 hover:to-amber-700"
            >
              Book Free Test Drive
            </button>
          </form>
        )}
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-900 text-white dark:border-slate-700">
        <div className="p-5">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-amber-300">
            Partner campaign
          </p>
          <h2 className="mt-1 text-sm font-semibold">{sponsor.title}</h2>
          <p className="mt-1 text-xs leading-relaxed text-slate-300">{sponsor.blurb}</p>
          <span className="mt-3 inline-flex text-xs font-medium text-amber-300">
            {sponsor.cta} →
          </span>
        </div>
      </section>
    </aside>
  );
}

function SimilarThumb({ item }: { item: VdpSimilar }) {
  return (
    <span className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
      {item.imageUrl ? (
        <Image src={item.imageUrl} alt="" fill sizes="48px" className="object-cover" />
      ) : (
        <span className="grid size-full place-items-center text-[10px] font-bold text-slate-400">
          {item.brand.slice(0, 2).toUpperCase()}
        </span>
      )}
    </span>
  );
}
