"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import { brands } from "@/lib/brandData";
import { cn } from "@/lib/utils";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
};

/**
 * Homepage brand emblem grid. Each tile navigates to `/brands/[slug]`.
 */
export function BrandLogoGrid() {
  return (
    <section
      aria-labelledby="brands-heading"
      className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8"
    >
      <div className="mb-8 text-center">
        <h2
          id="brands-heading"
          className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl dark:text-white"
        >
          Explore by brand
        </h2>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          Pick a maker. See every model, price and on-road cost in one place.
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-6"
      >
        {brands.map((brand) => (
          <motion.div key={brand.slug} variants={itemVariants}>
            <Link
              href={`/brands/${brand.slug}`}
              aria-label={`View all ${brand.name} vehicles`}
              className={cn(
                "group flex flex-col items-center justify-center gap-2 rounded-2xl border border-slate-200/80 bg-white/80 p-4 shadow-micro backdrop-blur-sm transition-all duration-200",
                "hover:border-slate-300 hover:shadow-lift hover:-translate-y-0.5",
                "dark:border-slate-800 dark:bg-slate-900/70 dark:hover:border-slate-700",
              )}
            >
              <span
                className="grid size-14 place-items-center rounded-xl text-lg font-bold text-white sm:size-16 sm:text-xl"
                style={{ backgroundColor: brand.brandColor }}
                aria-hidden
              >
                {brand.logoInitials}
              </span>
              <span className="mt-1 text-center text-xs font-semibold text-slate-700 sm:text-sm dark:text-slate-200">
                {brand.name}
              </span>
              <span className="hidden text-[10px] text-slate-400 sm:block dark:text-slate-500">
                {brand.tagline}
              </span>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
