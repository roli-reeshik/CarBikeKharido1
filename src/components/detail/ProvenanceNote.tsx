import { Database, Info } from "lucide-react";

import { sourceLabels } from "@/lib/providers";
import type { DataSource } from "@/lib/types";

/**
 * States plainly where the numbers on the page came from. When no vendor key is
 * configured the figures are researched approximations, and saying so is more
 * useful than letting sample data masquerade as a live quote.
 */
export function ProvenanceNote({
  dataSource,
  photoSource,
}: {
  dataSource: DataSource;
  photoSource: DataSource;
}) {
  const isLive = dataSource === "mynewcar" || dataSource === "rapidapi";

  return (
    <aside className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 text-xs leading-relaxed text-slate-500 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-400">
      <p className="flex items-center gap-2 font-medium text-slate-700 dark:text-slate-200">
        <Database className="size-3.5" aria-hidden />
        {sourceLabels[dataSource]}
      </p>

      <p className="mt-2 flex items-start gap-2">
        <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden />
        <span>
          {dataSource === "rapidapi"
            ? "Technical specifications below include API Ninjas rows (via RapidAPI). Economy figures from that feed are US EPA conversions, not Indian ARAI stickers. On-road prices are still calculated by our own engine."
            : isLive
              ? "Prices and specifications are pulled live from MyNewCar India and vary by city and dealer. Confirm the final figure with the dealership before you pay."
              : "Prices, specifications and owner sentiment on this page are researched approximations for demonstration, and the owner quotes are illustrative rather than real submissions. Add a RapidAPI or MyNewCar key to enrich live technical rows."}{" "}
          {sourceLabels[photoSource]}.
        </span>
      </p>
    </aside>
  );
}
