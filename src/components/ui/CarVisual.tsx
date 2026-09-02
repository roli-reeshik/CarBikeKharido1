"use client";

import { accent } from "@/lib/accents";
import type { Accent } from "@/lib/types";
import { cn } from "@/lib/utils";

type Silhouette = "suv" | "crossover" | "mpv";

const bodyPaths: Record<Silhouette, string> = {
  // Tall roof and a short bonnet.
  suv: "M12 80 L12 56 Q12 48 22 45 L54 38 L70 22 Q74 18 82 18 L152 18 Q162 18 168 23 L188 40 L214 46 Q228 49 228 58 L228 80 Z",
  // Lower, more raked greenhouse.
  crossover:
    "M12 80 L12 58 Q12 50 24 47 L58 41 L76 27 Q80 24 88 24 L146 24 Q156 24 162 29 L186 43 L214 48 Q228 51 228 59 L228 80 Z",
  // Long flat roof over three rows.
  mpv: "M10 80 L10 54 Q10 46 20 43 L44 36 L58 20 Q62 16 70 16 L166 16 Q176 16 182 21 L204 40 L218 45 Q230 48 230 57 L230 80 Z",
};

const glassPaths: Record<Silhouette, string[]> = {
  suv: ["M78 26 L92 26 L92 40 L67 40 Z", "M100 26 L148 26 L156 40 L100 40 Z"],
  crossover: [
    "M84 31 L96 31 L96 43 L72 43 Z",
    "M104 31 L146 31 L154 43 L104 43 Z",
  ],
  mpv: [
    "M54 24 L74 24 L74 38 L44 38 Z",
    "M82 24 L128 24 L128 38 L82 38 Z",
    "M136 24 L164 24 L172 38 L136 38 Z",
  ],
};

function silhouetteFor(bodyStyle: string): Silhouette {
  if (bodyStyle.includes("MPV")) return "mpv";
  if (bodyStyle.includes("Crossover")) return "crossover";
  return "suv";
}

interface CarVisualProps {
  bodyStyle: string;
  accentKey: Accent;
  /** Small text badge floated over the artwork, e.g. the body style. */
  caption?: string;
  className?: string;
}

/**
 * Placeholder artwork that stands in for photography. Swap this for a
 * `next/image` once real press shots are wired up — the surrounding card
 * already handles the hover zoom via the `group` class.
 */
export function CarVisual({
  bodyStyle,
  accentKey,
  caption,
  className,
}: CarVisualProps) {
  const tone = accent(accentKey);
  const shape = silhouetteFor(bodyStyle);

  return (
    <div
      className={cn(
        "relative isolate overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800/60",
        className,
      )}
    >
      <div
        aria-hidden
        className={cn(
          "absolute inset-0 bg-linear-to-br opacity-90",
          tone.wash,
        )}
      />
      <div
        aria-hidden
        className="absolute -bottom-16 left-1/2 h-40 w-3/4 -translate-x-1/2 rounded-[50%] bg-slate-900/10 blur-2xl dark:bg-black/40"
      />

      <svg
        viewBox="0 0 240 100"
        role="img"
        aria-label={`Illustration of a ${bodyStyle}`}
        className={cn(
          "relative h-full w-full transition-transform duration-500 ease-out group-hover:scale-[1.08]",
          tone.text,
        )}
      >
        <path d={bodyPaths[shape]} className="fill-current opacity-85" />
        {glassPaths[shape].map((path) => (
          <path key={path} d={path} className="fill-white/75 dark:fill-white/25" />
        ))}
        {[62, 178].map((cx) => (
          <g key={cx}>
            <circle cx={cx} cy={76} r={14} className="fill-slate-900/85" />
            <circle
              cx={cx}
              cy={76}
              r={6}
              className="fill-slate-100 dark:fill-slate-300"
            />
          </g>
        ))}
        <rect
          x={8}
          y={89}
          width={224}
          height={3}
          rx={1.5}
          className="fill-current opacity-20"
        />
      </svg>

      {caption ? (
        <span className="absolute bottom-3 left-3 rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-medium text-slate-700 backdrop-blur-sm dark:bg-slate-900/70 dark:text-slate-200">
          {caption}
        </span>
      ) : null}
    </div>
  );
}
