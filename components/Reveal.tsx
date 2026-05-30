"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** Delay in milliseconds. */
  delay?: number;
  className?: string;
  direction?: "up" | "down" | "left" | "right";
  once?: boolean;
  as?: "div" | "section" | "li" | "article";
};

/**
 * Scroll reveal via IntersectionObserver + CSS (see globals.css `.reveal`).
 * Reliable on first static-export load — unlike Framer mount/whileInView, which
 * could leave content stuck at its initial hidden state until a client re-mount.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
  direction = "up",
  once = true,
  as = "div",
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
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
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [once]);

  const Tag = as;

  return (
    <Tag
      // @ts-expect-error — ref typing across the small tag union is safe here.
      ref={ref}
      data-dir={direction}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`}
    >
      {children}
    </Tag>
  );
}
