"use client";

import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";

import { PhotoCredit } from "@/components/ui/PhotoCredit";
import {
  HERO_ANGLE,
  TOTAL_ANGLES,
  buildImaginUrl,
  normaliseAngle,
} from "@/lib/imaginStudio";
import type { CarPhoto } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Horizontal pixels the pointer must travel to advance one of 32 frames. */
const PIXELS_PER_FRAME = 14;

interface Vehicle360ViewerProps {
  make: string;
  model: string;
  /** IMAGIN paint id for the selected colour. */
  paintCode?: string | null;
  alt: string;
  /** Shown when IMAGIN is not configured, or a frame fails to load. */
  fallbackPhotos: CarPhoto[];
  className?: string;
}

/**
 * Drag-to-spin 360° configurator.
 *
 * Frames come from IMAGIN.studio, which renders any angle of any paint colour on
 * demand. When no IMAGIN key is configured the component renders the OEM
 * press-kit photograph instead and hides the spin affordance, so the page is
 * never broken by a missing integration — it just offers less.
 *
 * Pointer events are used rather than separate mouse and touch handlers so the
 * same code path serves a mouse drag, a finger swipe and a stylus.
 */
export function Vehicle360Viewer({
  make,
  model,
  paintCode,
  alt,
  fallbackPhotos,
  className,
}: Vehicle360ViewerProps) {
  const [angle, setAngle] = useState(HERO_ANGLE);
  const [isDragging, setIsDragging] = useState(false);
  const [frameFailed, setFrameFailed] = useState(false);

  // Kept in refs because they change on every pointer move and must not drive
  // a re-render of their own.
  const dragStartX = useRef(0);
  const dragStartAngle = useRef(HERO_ANGLE);

  const frameUrl = buildImaginUrl({ make, model, paintCode, angle });
  const canSpin = frameUrl !== null && !frameFailed;

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!canSpin) return;
      event.currentTarget.setPointerCapture(event.pointerId);
      dragStartX.current = event.clientX;
      dragStartAngle.current = angle;
      setIsDragging(true);
    },
    [angle, canSpin],
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging) return;
      const travelled = event.clientX - dragStartX.current;
      setAngle(
        normaliseAngle(
          dragStartAngle.current + travelled / PIXELS_PER_FRAME,
        ),
      );
    },
    [isDragging],
  );

  const endDrag = useCallback(() => setIsDragging(false), []);

  /** Arrow keys step the rotation for keyboard and screen-reader users. */
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (!canSpin) return;
      if (event.key === "ArrowRight") {
        event.preventDefault();
        setAngle((current) => normaliseAngle(current + 1));
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        setAngle((current) => normaliseAngle(current - 1));
      }
    },
    [canSpin],
  );

  // --- Fallback: OEM press photography --------------------------------------
  if (!canSpin) {
    const photo = fallbackPhotos[0];
    if (!photo) return null;

    return (
      <figure className={className}>
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-100 dark:border-slate-800 dark:bg-slate-800">
          <Image
            src={photo.src}
            alt={alt}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-cover"
          />
          {photo.note ? (
            <p className="absolute inset-x-0 bottom-0 bg-slate-900/70 px-4 py-2 text-xs text-white backdrop-blur-sm">
              {photo.note}
            </p>
          ) : null}
        </div>
        <figcaption className="mt-2">
          <PhotoCredit photo={photo} />
        </figcaption>
      </figure>
    );
  }

  return (
    <figure className={className}>
      <div
        role="slider"
        tabIndex={0}
        aria-label={`Rotate the ${alt}`}
        aria-valuemin={1}
        aria-valuemax={TOTAL_ANGLES}
        aria-valuenow={angle}
        aria-valuetext={`Angle ${angle} of ${TOTAL_ANGLES}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onKeyDown={handleKeyDown}
        className={cn(
          "relative aspect-[16/10] w-full touch-none select-none overflow-hidden rounded-2xl border border-slate-200/80 bg-linear-to-br from-slate-50 to-slate-200 outline-offset-2 focus-visible:outline-2 focus-visible:outline-slate-900 dark:border-slate-800 dark:from-slate-900 dark:to-slate-800 dark:focus-visible:outline-white",
          isDragging ? "cursor-grabbing" : "cursor-grab",
        )}
      >
        <Image
          key={frameUrl}
          src={frameUrl}
          alt={`${alt}, angle ${angle} of ${TOTAL_ANGLES}`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 60vw"
          onError={() => setFrameFailed(true)}
          className="object-contain"
          // The renders are opaque PNGs from a CDN that already optimises them.
          unoptimized
        />

        <motion.p
          animate={{ opacity: isDragging ? 0 : 1 }}
          transition={{ duration: 0.2 }}
          className="pointer-events-none absolute inset-x-0 bottom-3 mx-auto flex w-fit items-center gap-1.5 rounded-full bg-slate-900/75 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm"
        >
          <RotateCcw className="size-3.5" aria-hidden />
          Drag to spin
        </motion.p>
      </div>

      <figcaption className="mt-2 text-[11px] text-slate-400">
        360° renders by{" "}
        <a
          href="https://imagin.studio/"
          target="_blank"
          rel="noreferrer noopener"
          className="underline decoration-dotted underline-offset-2"
        >
          IMAGIN.studio
        </a>
      </figcaption>
    </figure>
  );
}
