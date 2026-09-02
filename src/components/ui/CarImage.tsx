"use client";

import Image from "next/image";
import { useState } from "react";

import { CarVisual } from "@/components/ui/CarVisual";
import { carPhotos } from "@/lib/vehiclePhotos.generated";
import type { Accent, CarPhoto } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Returns the photo set for a car, or an empty array when we have none. */
export function photosFor(carId: string): CarPhoto[] {
  return carPhotos[carId] ?? [];
}

interface CarImageProps {
  carId: string;
  alt: string;
  bodyStyle: string;
  accentKey: Accent;
  className?: string;
  /** Index into the car's photo set. Defaults to the lead photo. */
  photoIndex?: number;
  sizes?: string;
  priority?: boolean;
  /** Renders the disclosure note over the image when the photo carries one. */
  showNote?: boolean;
}

/**
 * A real photograph of the car, falling back to the illustrated silhouette when
 * no photo is available for that model or the file fails to load.
 */
export function CarImage({
  carId,
  alt,
  bodyStyle,
  accentKey,
  className,
  photoIndex = 0,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  priority = false,
  showNote = true,
}: CarImageProps) {
  const [failed, setFailed] = useState(false);
  const photo = photosFor(carId)[photoIndex];

  if (!photo || failed) {
    return (
      <CarVisual
        bodyStyle={bodyStyle}
        accentKey={accentKey}
        caption={bodyStyle}
        className={className}
      />
    );
  }

  return (
    <div className={cn("relative overflow-hidden bg-slate-100 dark:bg-slate-800", className)}>
      <Image
        src={photo.src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        onError={() => setFailed(true)}
        className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
      />

      {showNote && photo.note ? (
        <p className="absolute inset-x-0 bottom-0 bg-slate-900/70 px-3 py-1.5 text-[11px] leading-snug text-white backdrop-blur-sm">
          {photo.note}
        </p>
      ) : null}
    </div>
  );
}
