"use client";

import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, MapPin, Search } from "lucide-react";

import { useCity } from "@/components/providers/CityProvider";
import { serviceCities } from "@/lib/catalogue/seedData";
import { useClickOutside, useEscapeKey } from "@/lib/hooks";
import { cn } from "@/lib/utils";

/**
 * City + RTO picker. The choice is stored in `CityProvider`, so the on-road
 * price widget re-runs its maths the moment this changes.
 */
export function CitySelector({
  className,
  variant = "default",
}: {
  className?: string;
  variant?: "default" | "pill";
}) {
  const { city, cityId, setCityId } = useCity();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside(containerRef, () => setOpen(false), open);
  useEscapeKey(() => setOpen(false), open);

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return serviceCities;
    return serviceCities.filter((item) =>
      `${item.name} ${item.stateName} ${item.rto}`.toLowerCase().includes(needle),
    );
  }, [query]);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={`On-road city, currently ${city.name}`}
        className={cn(
          "flex w-full items-center gap-2 text-left transition-colors",
          variant === "pill"
            ? "rounded-full border border-orange-200/80 bg-orange-50/90 px-3 py-1.5 hover:border-orange-300 dark:border-amber-500/30 dark:bg-amber-500/10 dark:hover:border-amber-400/50"
            : "rounded-xl border border-slate-200/80 bg-white/70 px-3 py-2 hover:border-slate-300 hover:bg-white dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-slate-700",
        )}
      >
        <MapPin
          className={cn(
            "size-4 shrink-0",
            variant === "pill"
              ? "text-orange-600 dark:text-amber-400"
              : "text-blue-600 dark:text-blue-400",
          )}
          aria-hidden
        />
        <span className="min-w-0 flex-1">
          {variant === "pill" ? (
            <>
              <span className="block truncate text-xs font-semibold text-slate-900 dark:text-slate-100">
                {city.name} · {city.rto}
              </span>
              <span className="block text-[10px] font-medium uppercase tracking-wide text-orange-700 dark:text-amber-300">
                On-road city
              </span>
            </>
          ) : (
            <>
              <span className="block truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                {city.name}
              </span>
              <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                {city.rto} · {city.stateName}
              </span>
            </>
          )}
        </span>
        <ChevronDown
          aria-hidden
          className={cn(
            "size-4 shrink-0 text-slate-400 transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
            className={cn(
              "absolute z-50 mt-2 w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 shadow-lift backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/95",
              variant === "pill" ? "right-0 left-auto" : "left-0",
            )}
          >
            <div className="border-b border-slate-100 p-3 dark:border-slate-800">
              <p className="mb-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                Prices, road tax and insurance all change by city.
              </p>
              <div className="flex items-center gap-2 rounded-xl bg-slate-100/80 px-3 py-2 dark:bg-slate-800/70">
                <Search className="size-4 text-slate-400" aria-hidden />
                <input
                  autoFocus
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search city or RTO code"
                  aria-label="Search for a city"
                  className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-100"
                />
              </div>
            </div>

            <ul role="listbox" className="max-h-64 overflow-y-auto p-2">
              {results.map((item) => {
                const selected = item.id === cityId;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={selected}
                      onClick={() => {
                        setCityId(item.id);
                        setOpen(false);
                        setQuery("");
                      }}
                      className={cn(
                        "flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left transition-colors",
                        selected
                          ? "bg-blue-50 dark:bg-blue-500/10"
                          : "hover:bg-slate-100 dark:hover:bg-slate-800/70",
                      )}
                    >
                      <span>
                        <span className="block text-sm font-medium text-slate-900 dark:text-slate-100">
                          {item.name}
                        </span>
                        <span className="block text-xs text-slate-500 dark:text-slate-400">
                          {item.stateName} · {item.rto}
                        </span>
                      </span>
                      {selected ? (
                        <Check
                          className="size-4 shrink-0 text-blue-600 dark:text-blue-400"
                          aria-hidden
                        />
                      ) : (
                        <span className="shrink-0 text-xs text-slate-400">
                          {item.stateCode}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
              {results.length === 0 ? (
                <li className="px-3 py-6 text-center text-sm text-slate-500">
                  No city matches “{query}”.
                </li>
              ) : null}
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
