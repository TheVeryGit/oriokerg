"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

type StaggerProps = {
  children: ReactNode;
  className?: string;
  /** Kept for API compatibility; cadence is handled in CSS (globals.css). */
  step?: number;
  once?: boolean;
};

/**
 * Staggered reveal of direct children via IntersectionObserver + CSS
 * (see globals.css `.stagger`). Reliable on first static-export load.
 */
export function Stagger({ children, className = "", once = true }: StaggerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [once]);

  return (
    <div ref={ref} className={`stagger ${visible ? "is-visible" : ""} ${className}`}>
      {children}
    </div>
  );
}

type StaggerItemProps = {
  children: ReactNode;
  className?: string;
  /** Kept for API compatibility. */
  distance?: number;
};

export function StaggerItem({ children, className = "" }: StaggerItemProps) {
  return <div className={className}>{children}</div>;
}
