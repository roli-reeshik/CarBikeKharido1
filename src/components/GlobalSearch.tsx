"use client";

import { useImperativeHandle, useMemo, useRef, useState, type Ref } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CornerDownLeft, Search, Sparkles, X } from "lucide-react";
import { useRouter } from "next/navigation";

import { quickSearchPills } from "@/lib/data";
import { serviceCities, vehicles } from "@/lib/catalogue/seedData";
import { useClickOutside, useEscapeKey } from "@/lib/hooks";
import { vehiclePathBySlug } from "@/lib/routes";
import type { SearchSuggestion } from "@/lib/types";
import { cn } from "@/lib/utils";

const kindStyles: Record<SearchSuggestion["kind"], string> = {
  Car: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300",
  Bike: "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300",
  Intent: "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300",
  City: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
};

const searchSuggestions: SearchSuggestion[] = [
  ...vehicles.map((vehicle) => ({
    id: vehicle.slug,
    label: vehicle.name,
    kind: (vehicle.type === "BIKE" ? "Bike" : "Car") as SearchSuggestion["kind"],
    hint: vehicle.bestForHeadline,
  })),
  {
    id: "intent-safe-family",
    label: "Safest car for a family of five",
    kind: "Intent",
    hint: "5-star crash rating",
  },
  {
    id: "intent-cheap-commute",
    label: "Cheapest vehicle to run daily",
    kind: "Intent",
    hint: "CNG and electric first",
  },
  {
    id: "intent-no-clutch",
    label: "No-clutch car for traffic",
    kind: "Intent",
    hint: "Automatic and single-speed options",
  },
  ...serviceCities.slice(0, 4).map((city) => ({
    id: `city-${city.id}`,
    label: `On-road prices in ${city.name}`,
    kind: "City" as const,
    hint: `${city.rto} · ${city.stateName}`,
  })),
];

/**
 * Lets a pill rendered elsewhere (the navbar rail) drop a term into this field
 * and open the suggestions, without either side mirroring the other's state.
 */
export interface GlobalSearchHandle {
  applyTerm: (term: string) => void;
}

interface GlobalSearchProps {
  className?: string;
  placeholder?: string;
  /** Set to false when the quick pills are rendered outside this component. */
  showPills?: boolean;
  ref?: Ref<GlobalSearchHandle>;
}

/** Auto-suggest search with keyboard navigation and intent-style shortcuts. */
export function GlobalSearch({
  className,
  placeholder = "Search a car or bike, or describe what you need",
  showPills = true,
  ref,
}: GlobalSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    applyTerm: (term: string) => {
      setQuery(term);
      setActiveIndex(0);
      setOpen(true);
      inputRef.current?.focus();
    },
  }));

  useClickOutside(containerRef, () => setOpen(false), open);
  useEscapeKey(() => setOpen(false), open);

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const pool = needle
      ? searchSuggestions.filter((item) =>
          `${item.label} ${item.hint}`.toLowerCase().includes(needle),
        )
      : searchSuggestions;
    return pool.slice(0, 7);
  }, [query]);

  const commit = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.label);
    setOpen(false);
    inputRef.current?.blur();
    if (suggestion.kind === "Car" || suggestion.kind === "Bike") {
      router.push(vehiclePathBySlug(suggestion.id, suggestion.kind === "Bike" ? "BIKE" : "CAR"));
    } else if (suggestion.kind === "City") {
      document
        .getElementById("money")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      document
        .getElementById("trending")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || results.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % results.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => (index - 1 + results.length) % results.length);
    } else if (event.key === "Enter") {
      event.preventDefault();
      commit(results[Math.min(activeIndex, results.length - 1)]);
    }
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div
        className={cn(
          "flex items-center gap-2 rounded-2xl border bg-white/80 px-3.5 py-2.5 transition-all duration-200 dark:bg-slate-900/70",
          open
            ? "border-blue-400/70 ring-4 ring-blue-500/10 dark:border-blue-500/60"
            : "border-slate-200/80 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700",
        )}
      >
        <Search className="size-4 shrink-0 text-slate-400" aria-hidden />
        <input
          ref={inputRef}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveIndex(0);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          role="combobox"
          aria-expanded={open}
          aria-controls="global-search-results"
          aria-autocomplete="list"
          aria-label="Search cars or describe what you need"
          className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-100"
        />
        {query ? (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            aria-label="Clear search"
            className="rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
          >
            <X className="size-3.5" aria-hidden />
          </button>
        ) : (
          <kbd className="hidden shrink-0 rounded-md border border-slate-200 px-1.5 py-0.5 text-[10px] font-medium text-slate-400 lg:block dark:border-slate-700">
            /
          </kbd>
        )}
      </div>

      {showPills ? (
        <div className="no-scrollbar mt-2 flex gap-2 overflow-x-auto">
          {quickSearchPills.map((pill) => (
            <motion.button
              key={pill}
              type="button"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              onClick={() => {
                setQuery(pill);
                setOpen(true);
                inputRef.current?.focus();
              }}
              className="shrink-0 rounded-full border border-slate-200/80 bg-white/70 px-3 py-1 text-xs font-medium text-slate-600 transition-colors hover:border-blue-300 hover:text-blue-700 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:border-blue-500/50 dark:hover:text-blue-300"
            >
              {pill}
            </motion.button>
          ))}
        </div>
      ) : null}

      <AnimatePresence>
        {open ? (
          <motion.div
            id="global-search-results"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
            className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 shadow-lift backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/95"
          >
            {results.length > 0 ? (
              <ul role="listbox" className="max-h-80 overflow-y-auto p-2">
                {results.map((item, index) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={index === activeIndex}
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => commit(item)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
                        index === activeIndex
                          ? "bg-slate-100 dark:bg-slate-800/80"
                          : "hover:bg-slate-50 dark:hover:bg-slate-800/50",
                      )}
                    >
                      <span
                        className={cn(
                          "shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                          kindStyles[item.kind],
                        )}
                      >
                        {item.kind}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                          {item.label}
                        </span>
                        <span className="block truncate text-xs text-slate-500 dark:text-slate-400">
                          {item.hint}
                        </span>
                      </span>
                      {index === activeIndex ? (
                        <CornerDownLeft
                          className="size-3.5 shrink-0 text-slate-400"
                          aria-hidden
                        />
                      ) : null}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex items-start gap-3 p-4">
                <Sparkles
                  className="mt-0.5 size-4 shrink-0 text-violet-500"
                  aria-hidden
                />
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Nothing matched “{query}”. Try describing the need instead —
                  “safe car for a family of five” works.
                </p>
              </div>
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
