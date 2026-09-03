"use client";

import { VehicleImage } from "@/components/ui/VehicleImage";
import type { Accent, CarPhoto } from "@/lib/types";
import { cn } from "@/lib/utils";
import { toCarPhotos } from "@/utils/getVehicleImage";

/** Returns the photo set for a car, or an empty array when we have none. */
export function photosFor(carId: string): CarPhoto[] {
  return toCarPhotos(carId);
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
 * Photograph of a catalogue vehicle. Missing or zero-byte local files fall
 * through to the Unsplash map inside `VehicleImage` instead of a silhouette.
 */
export function CarImage({
  carId,
  alt,
  bodyStyle,
  accentKey: _accentKey,
  className,
  photoIndex = 0,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  priority = false,
  showNote = true,
}: CarImageProps) {
  const photo = photosFor(carId)[photoIndex];

  return (
    <div className={cn("relative overflow-hidden bg-slate-100 dark:bg-slate-800", className)}>
      <VehicleImage
        src={photo?.src ?? ""}
        alt={alt}
        fill
        slug={carId}
        bodyType={bodyStyle}
        sizes={sizes}
        priority={priority}
        className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
      />

      {showNote && photo?.note ? (
        <p className="absolute inset-x-0 bottom-0 z-[2] bg-slate-900/70 px-3 py-1.5 text-[11px] leading-snug text-white backdrop-blur-sm">
          {photo.note}
        </p>
      ) : null}
    </div>
  );
}
