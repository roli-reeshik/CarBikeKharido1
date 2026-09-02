"use client";

import { useEffect, useState } from "react";
import { useMotionValueEvent, useSpring } from "framer-motion";

import { cn } from "@/lib/utils";

interface AnimatedNumberProps {
  value: number;
  /** Turns the in-flight spring value into display text. */
  format?: (value: number) => string;
  className?: string;
  stiffness?: number;
  damping?: number;
}

/**
 * Spring-driven number ticker. Every intermediate value is formatted, so the
 * digits roll rather than snapping to the final figure.
 */
export function AnimatedNumber({
  value,
  format = (next) => Math.round(next).toString(),
  className,
  stiffness = 140,
  damping = 22,
}: AnimatedNumberProps) {
  const spring = useSpring(value, { stiffness, damping, mass: 0.8 });
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  useMotionValueEvent(spring, "change", (latest) => setDisplay(latest));

  return (
    <span className={cn("tabular-nums", className)}>{format(display)}</span>
  );
}
