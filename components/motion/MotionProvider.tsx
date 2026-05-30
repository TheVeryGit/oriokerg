"use client";

import { LazyMotion, domAnimation } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Wraps the app in LazyMotion with the `domAnimation` feature bundle.
 * This loads only animation + gesture + whileInView features (~5kb) instead
 * of the full Framer Motion runtime — keeps the static export lean on mobile.
 * Always use the `m.*` components (not `motion.*`) downstream.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <LazyMotion features={domAnimation}>{children}</LazyMotion>;
}
