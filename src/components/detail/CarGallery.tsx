"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

import { CarVisual } from "@/components/ui/CarVisual";
import { PhotoCredit } from "@/components/ui/PhotoCredit";
import type { Accent, CarPhoto } from "@/lib/types";
import { cn } from "@/lib/utils";

interface CarGalleryProps {
  photos: CarPhoto[];
  alt: string;
  bodyStyle: string;
  accentKey: Accent;
}

/**
 * Hero gallery: one large photo with a thumbnail strip. Falls back to the
 * illustrated silhouette when we have no photography for the model.
 */
export function CarGallery({ photos, alt, bodyStyle, accentKey }: CarGalleryProps) {
  const [active, setActive] = useState(0);

  if (photos.length === 0) {
    return (
      <CarVisual
        bodyStyle={bodyStyle}
        accentKey={accentKey}
        caption={bodyStyle}
        className="aspect-[16/10] w-full rounded-2xl"
      />
    );
  }

  const photo = photos[Math.min(active, photos.length - 1)];

  return (
    <figure className="space-y-3">
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-100 dark:border-slate-800 dark:bg-slate-800">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            key={photo.src}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <Image
              src={photo.src}
              alt={alt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {photo.note ? (
          <p className="absolute inset-x-0 bottom-0 bg-slate-900/70 px-4 py-2 text-xs leading-snug text-white backdrop-blur-sm">
            {photo.note}
          </p>
        ) : null}
      </div>

      {photos.length > 1 ? (
        <div
          className="flex gap-2 overflow-x-auto no-scrollbar"
          role="tablist"
          aria-label={`${alt} photographs`}
        >
          {photos.map((item, index) => (
            <button
              key={item.src}
              type="button"
              role="tab"
              aria-selected={index === active}
              aria-label={`Photo ${index + 1} of ${photos.length}`}
              onClick={() => setActive(index)}
              className={cn(
                "relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border-2 transition-colors",
                index === active
                  ? "border-slate-900 dark:border-white"
                  : "border-transparent opacity-70 hover:opacity-100",
              )}
            >
              <Image
                src={item.src}
                alt=""
                fill
                sizes="96px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}

      <figcaption>
        <PhotoCredit photo={photo} />
      </figcaption>
    </figure>
  );
}
