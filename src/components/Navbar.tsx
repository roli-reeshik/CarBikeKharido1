"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { Heart, Menu, ShieldCheck, X } from "lucide-react";

import { AboutModal } from "@/components/AboutModal";
import { CitySelector } from "@/components/CitySelector";
import { GlobalSearch, type GlobalSearchHandle } from "@/components/GlobalSearch";
import { MegaMenu, MobileMegaAccordion } from "@/components/MegaMenu";
import { ThemeToggle } from "@/components/ThemeToggle";
import { siteConfig } from "@/lib/siteConfig";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const searchRef = useRef<GlobalSearchHandle>(null);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/85 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/85">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 py-3 lg:gap-5">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2"
            aria-label={`${siteConfig.name} home`}
          >
            <span className="sr-only">{siteConfig.name} home</span>
            <span className="grid size-9 place-items-center rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900">
              <ShieldCheck className="size-5" aria-hidden />
            </span>
            <span className="hidden text-[17px] font-semibold tracking-tight text-slate-900 sm:block dark:text-white">
              {siteConfig.wordmark.lead}
              <span className="text-blue-600 dark:text-blue-400">
                {siteConfig.wordmark.accent}
              </span>
              <span className="hidden text-slate-400 lg:inline dark:text-slate-500">
                {siteConfig.wordmark.suffix}
              </span>
            </span>
          </Link>

          <GlobalSearch
            ref={searchRef}
            showPills={false}
            className="hidden min-w-0 flex-1 lg:block"
          />

          <div className="ml-auto flex items-center gap-2">
            <CitySelector
              variant="pill"
              className="w-auto max-w-[9.5rem] shrink-0 sm:max-w-none"
            />

            <button
              type="button"
              className="hidden size-9 place-items-center rounded-xl border border-slate-200/80 bg-white/70 text-slate-600 transition-colors hover:border-slate-300 hover:text-rose-600 sm:grid dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300"
              aria-label="Saved cars"
            >
              <Heart className="size-4" aria-hidden />
              <span className="sr-only">Saved cars</span>
            </button>

            <ThemeToggle />

            <button
              type="button"
              onClick={() => setAboutOpen(true)}
              className="hidden rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 sm:block dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              About
            </button>

            <button
              type="button"
              className="hidden rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700 sm:block dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
            >
              Sign in
            </button>

            <button
              type="button"
              onClick={() => setMenuOpen((value) => !value)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="grid size-9 place-items-center rounded-xl border border-slate-200/80 bg-white/70 text-slate-600 lg:hidden dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300"
            >
              {menuOpen ? (
                <X className="size-4" aria-hidden />
              ) : (
                <Menu className="size-4" aria-hidden />
              )}
            </button>
          </div>
        </div>

        <div className="relative hidden pb-2 lg:block">
          <MegaMenu />
        </div>

        <AnimatePresence initial={false}>
          {menuOpen ? (
            <motion.div
              id="mobile-menu"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="overflow-hidden lg:hidden"
            >
              <div className="space-y-3 border-t border-slate-200/70 py-4 dark:border-slate-800/80">
                <CitySelector variant="pill" className="sm:hidden" />
                <GlobalSearch />
                <MobileMegaAccordion onNavigate={() => setMenuOpen(false)} />
                <button
                  type="button"
                  onClick={() => {
                    setAboutOpen(true);
                    setMenuOpen(false);
                  }}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 dark:border-slate-800 dark:text-slate-200"
                >
                  About {siteConfig.name}
                </button>
                <button
                  type="button"
                  className="w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white sm:hidden dark:bg-white dark:text-slate-900"
                >
                  Sign in
                </button>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <AboutModal open={aboutOpen} onClose={() => setAboutOpen(false)} />
    </header>
  );
}
