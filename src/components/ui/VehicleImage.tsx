"use client";

import Image, { type ImageProps } from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { resolveVehicleImageFallback } from "@/lib/vehicleImageFallbacks";
import { cn } from "@/lib/utils";

export type VehicleImageProps = Omit<ImageProps, "src" | "alt" | "onError"> & {
  src: ImageProps["src"];
  alt: string;
  slug?: string;
  category?: string;
  bodyType?: string;
  /** Size / rounding / positioning for the shimmer wrapper. */
  wrapperClassName?: string;
};

function srcToString(src: ImageProps["src"]): string {
  if (typeof src === "string") return src;
  if (typeof src === "object" && src && "src" in src) {
    return typeof src.src === "string" ? src.src : "";
  }
  return "";
}

/** Inline SVG shimmer used as next/image `blurDataURL`. */
const SHIMMER_BLUR_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciPjxzdG9wIHN0b3AtY29sb3I9IiNjYmQ1ZTEiIG9mZnNldD0iMjAlIi8+PHN0b3Agc3RvcC1jb2xvcj0iI2Y4ZmFmYyIgb2Zmc2V0PSI1MCUiLz48c3RvcCBzdG9wLWNvbG9yPSIjY2JkNWUxIiBvZmZzZXQ9IjcwJSIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSI3MDAiIGhlaWdodD0iNDc1IiBmaWxsPSIjZTJlOGYwIi8+PHJlY3QgaWQ9InIiIHdpZHRoPSI3MDAiIGhlaWdodD0iNDc1IiBmaWxsPSJ1cmwoI2cpIi8+PGFuaW1hdGUgaHJlZj0iI3IiIGF0dHJpYnV0ZU5hbWU9IngiIGZyb209Ii03MDAiIHRvPSI3MDAiIGR1cj0iMS4ycyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiLz48L3N2Zz4=";

/**
 * Drop-in `next/image` wrapper with Unsplash fallbacks and a skeleton pulse.
 * A missing local file or HTTP 404 swaps to a curated automotive still once;
 * `hasError` blocks any further onError loop.
 */
export function VehicleImage({
  src,
  alt,
  slug,
  category,
  bodyType,
  fill,
  className,
  wrapperClassName,
  onLoad,
  placeholder = "blur",
  blurDataURL = SHIMMER_BLUR_DATA_URL,
  sizes,
  ...rest
}: VehicleImageProps) {
  const fallbackSrc = useMemo(
    () => resolveVehicleImageFallback({ slug, category, bodyType }),
    [slug, category, bodyType],
  );

  const primarySrc = srcToString(src) || fallbackSrc;
  const [imgSrc, setImgSrc] = useState(primarySrc);
  const [hasError, setHasError] = useState(!srcToString(src));
  const [loaded, setLoaded] = useState(false);
  const hasErrorRef = useRef(!srcToString(src));

  useEffect(() => {
    const next = srcToString(src) || fallbackSrc;
    hasErrorRef.current = !srcToString(src);
    setImgSrc(next);
    setHasError(!srcToString(src));
    setLoaded(false);
  }, [src, fallbackSrc]);

  const handleError = useCallback(() => {
    if (hasErrorRef.current) {
      setLoaded(true);
      return;
    }
    hasErrorRef.current = true;
    setHasError(true);
    setLoaded(false);
    setImgSrc(fallbackSrc);
  }, [fallbackSrc]);

  const handleLoad: NonNullable<ImageProps["onLoad"]> = (event) => {
    setLoaded(true);
    onLoad?.(event);
  };

  return (
    <span
      className={cn(
        "overflow-hidden bg-slate-200 dark:bg-slate-800",
        fill
          ? wrapperClassName
            ? "relative block"
            : "absolute inset-0 block"
          : "relative inline-block",
        wrapperClassName,
      )}
      data-image-fallback={hasError ? "true" : "false"}
    >
      <Image
        key={imgSrc}
        {...rest}
        src={imgSrc}
        alt={alt}
        fill={fill}
        sizes={sizes}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        onError={handleError}
        onLoad={handleLoad}
        className={cn(fill && "object-cover", className)}
      />
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 z-[1] bg-slate-200/90 transition-opacity duration-500 dark:bg-slate-800/90",
          loaded ? "opacity-0" : "animate-pulse opacity-100",
        )}
      />
    </span>
  );
}
