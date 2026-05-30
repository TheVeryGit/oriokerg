"use client";

import { m, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** Delay in milliseconds (kept for backwards-compatible call sites). */
  delay?: number;
  className?: string;
  /** Initial offset in px along the chosen axis. */
  distance?: number;
  direction?: "up" | "down" | "left" | "right";
  once?: boolean;
  as?: "div" | "section" | "li" | "article";
};

const EASE = [0.22, 1, 0.36, 1] as const;

export function Reveal({
  children,
  delay = 0,
  className = "",
  distance = 26,
  direction = "up",
  once = true,
  as = "div",
}: RevealProps) {
  const reduce = useReducedMotion();

  const offset =
    direction === "up"
      ? { y: distance }
      : direction === "down"
        ? { y: -distance }
        : direction === "left"
          ? { x: distance }
          : { x: -distance };

  const MotionTag = m[as];

  if (reduce) {
    return <MotionTag className={className}>{children}</MotionTag>;
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.7, delay: delay / 1000, ease: EASE }}
    >
      {children}
    </MotionTag>
  );
}
