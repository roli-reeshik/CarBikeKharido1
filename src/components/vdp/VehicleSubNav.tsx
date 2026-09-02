"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, GitCompare } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { vehiclePathBySlug } from "@/lib/routes";
import { cn } from "@/lib/utils";

export interface SubNavCompareItem {
  slug: string;
  label: string;
}

const tabs = [
  { id: "overview", labelKey: "model" as const },
  { id: "price", label: "Price" },
  { id: "compare", label: "Compare", dropdown: true },
  { id: "images", label: "Images" },
  { id: "specs", label: "Specs" },
  { id: "reviews", label: "User Reviews" },
  { id: "view360", label: "360 View" },
  { id: "variants", label: "Variants" },
  { id: "videos", label: "Videos" },
  { id: "more", label: "More", dropdown: true },
] as const;

const moreLinks = [
  { id: "more-brochure", href: "#more", label: "Download brochure" },
  { id: "more-emi", href: "#more", label: "EMI calculator" },
  { id: "more-dealer", href: "#more", label: "Find a dealer" },
];

const spring = { type: "spring", stiffness: 380, damping: 32 } as const;

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function VehicleSubNav({
  modelName,
  compareWith,
}: {
  modelName: string;
  compareWith: SubNavCompareItem[];
}) {
  const [active, setActive] = useState("overview");
  const [openMenu, setOpenMenu] = useState<"compare" | "more" | null>(null);

  useEffect(() => {
    const ids = tabs.map((tab) => tab.id);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: [0.15, 0.4] },
    );
    ids.forEach((id) => {
      const node = document.getElementById(id);
      if (node) observer.observe(node);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="sticky top-[4.25rem] z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-md lg:top-[6.75rem] dark:border-slate-800 dark:bg-slate-950/90">
      <nav aria-label="On this page" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ul className="no-scrollbar flex items-center gap-0.5 overflow-x-auto py-1.5">
          {tabs.map((tab) => {
            const label = "labelKey" in tab ? modelName : tab.label;
            const isOn = active === tab.id;
            const hasMenu = "dropdown" in tab && tab.dropdown;

            return (
              <li key={tab.id} className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    if (hasMenu) {
                      setOpenMenu((current) =>
                        current === tab.id ? null : (tab.id as "compare" | "more"),
                      );
                      return;
                    }
                    setOpenMenu(null);
                    setActive(tab.id);
                    scrollToSection(tab.id);
                  }}
                  className={cn(
                    "relative inline-flex items-center gap-1 whitespace-nowrap px-3 py-2 text-sm font-medium transition-colors",
                    isOn
                      ? "text-orange-700 dark:text-amber-400"
                      : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200",
                  )}
                >
                  {label}
                  {hasMenu ? (
                    <ChevronDown className="size-3.5" aria-hidden />
                  ) : null}
                  {isOn ? (
                    <motion.span
                      layoutId="activeSubTab"
                      className="absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full bg-orange-600 dark:bg-amber-400"
                      transition={spring}
                    />
                  ) : null}
                </button>

                <AnimatePresence>
                  {hasMenu && openMenu === tab.id ? (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={spring}
                      className="absolute left-0 top-full z-40 mt-1 min-w-56 rounded-xl border border-slate-200/80 bg-white/95 p-2 shadow-lift backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/95"
                    >
                      {tab.id === "compare" ? (
                        <ul className="space-y-0.5">
                          {compareWith.map((item) => (
                            <li key={item.slug}>
                              <Link
                                href={vehiclePathBySlug(item.slug)}
                                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                                onClick={() => setOpenMenu(null)}
                              >
                                <GitCompare className="size-3.5 text-slate-400" aria-hidden />
                                Compare with {item.label}
                              </Link>
                            </li>
                          ))}
                          <li>
                            <button
                              type="button"
                              onClick={() => {
                                setOpenMenu(null);
                                scrollToSection("compare");
                              }}
                              className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-orange-700 hover:bg-orange-50 dark:text-amber-400 dark:hover:bg-amber-500/10"
                            >
                              Open full comparison
                            </button>
                          </li>
                        </ul>
                      ) : (
                        <ul className="space-y-0.5">
                          {moreLinks.map((item) => (
                            <li key={item.id}>
                              <a
                                href={item.href}
                                onClick={(event) => {
                                  event.preventDefault();
                                  setOpenMenu(null);
                                  scrollToSection("more");
                                }}
                                className="block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                              >
                                {item.label}
                              </a>
                            </li>
                          ))}
                        </ul>
                      )}
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
