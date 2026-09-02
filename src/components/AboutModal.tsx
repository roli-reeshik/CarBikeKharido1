"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Mail, MapPin, Phone, ShieldCheck, X } from "lucide-react";
import { useEffect } from "react";

import { siteConfig } from "@/lib/siteConfig";

export function AboutModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="about-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-lg rounded-2xl border border-slate-200/80 bg-white/95 p-6 shadow-lift backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/95"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="grid size-9 place-items-center rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900">
                  <ShieldCheck className="size-5" aria-hidden />
                </span>
                <div>
                  <h2
                    id="about-title"
                    className="text-lg font-semibold text-slate-900 dark:text-white"
                  >
                    {siteConfig.name}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {siteConfig.copyright}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close about"
                className="grid size-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {siteConfig.description}
            </p>

            <dl className="mt-5 space-y-3 text-sm">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Owner
                </dt>
                <dd className="text-slate-800 dark:text-slate-100">
                  {siteConfig.owner}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  {siteConfig.developer.role}
                </dt>
                <dd className="text-slate-800 dark:text-slate-100">
                  {siteConfig.developer.name}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Contact
                </dt>
                <dd className="mt-1 space-y-1.5">
                  <a
                    href={siteConfig.contact.mobileHref}
                    className="flex items-center gap-2 text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white"
                  >
                    <Phone className="size-4" aria-hidden />
                    {siteConfig.contact.mobile}
                  </a>
                  <a
                    href={siteConfig.contact.emailHref}
                    className="flex items-center gap-2 break-all text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white"
                  >
                    <Mail className="size-4" aria-hidden />
                    {siteConfig.contact.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Registered address
                </dt>
                <dd className="mt-1 flex gap-2 text-slate-700 dark:text-slate-200">
                  <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden />
                  <span>{siteConfig.address.full}</span>
                </dd>
              </div>
            </dl>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
