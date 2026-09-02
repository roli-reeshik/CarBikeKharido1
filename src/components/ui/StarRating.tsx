"use client";

import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

interface StarRatingProps {
  stars: number;
  total?: number;
  size?: number;
  className?: string;
}

export function StarRating({
  stars,
  total = 5,
  size = 13,
  className,
}: StarRatingProps) {
  return (
    <span
      className={cn("inline-flex items-center gap-0.5", className)}
      role="img"
      aria-label={`${stars} out of ${total} stars for crash safety`}
    >
      {Array.from({ length: total }, (_, index) => (
        <Star
          key={index}
          width={size}
          height={size}
          aria-hidden
          className={index < stars ? "fill-current" : "opacity-30"}
        />
      ))}
    </span>
  );
}
