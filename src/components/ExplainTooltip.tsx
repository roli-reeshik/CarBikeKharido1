"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import { cn } from "@/lib/utils";

/**
 * Dotted-underline term that reveals a one-sentence layman definition.
 */
export function ExplainTooltip({
  term,
  meaning,
  className,
}: {
  term: string;
  meaning: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <span
      className={cn("relative inline-flex", className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      <button
        type="button"
        className="cursor-help border-b border-dotted border-slate-400 text-inherit"
        aria-describedby={open ? `explain-${term}` : undefined}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        {term}
      </button>
      <AnimatePresence>
        {open ? (
          <motion.span
            id={`explain-${term}`}
            role="tooltip"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            className="absolute bottom-full left-1/2 z-50 mb-2 w-56 -translate-x-1/2 rounded-xl border border-slate-200/80 bg-white/95 px-3 py-2 text-left text-xs leading-relaxed text-slate-600 shadow-lift backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/95 dark:text-slate-300"
          >
            {meaning}
          </motion.span>
        ) : null}
      </AnimatePresence>
    </span>
  );
}
