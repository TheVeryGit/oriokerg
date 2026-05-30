"use client";

import {
  AnimatePresence,
  m,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef, useState } from "react";

type Step = { title: string; text: string };

type StepsScrollerProps = {
  title: string;
  steps: Step[];
};

const EASE = [0.22, 1, 0.36, 1] as const;

function Eyebrow() {
  return (
    <span className="inline-flex items-center gap-2 text-sm uppercase tracking-luxe text-emerald-soft">
      <span className="h-px w-8 bg-emerald-soft/60" />
      Просто
    </span>
  );
}

/** Static stacked steps — used on mobile and when reduced-motion is on.
 *  Always fully visible (no scroll dependency). */
function StaticSteps({ title, steps }: StepsScrollerProps) {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <Eyebrow />
      <h2 className="mt-4 font-serif text-display font-semibold">{title}</h2>
      <ol className="mt-12 grid gap-10 sm:grid-cols-2">
        {steps.map((step, index) => (
          <li key={step.title}>
            <span className="font-serif text-6xl font-semibold text-gold-gradient">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-3 text-lg font-medium">{step.title}</h3>
            <p className="mt-2 text-sm leading-7 text-ink-foreground/70">
              {step.text}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function StepsScroller({ title, steps }: StepsScrollerProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const railScale = useTransform(scrollYProgress, [0, 1], [0.04, 1]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const idx = Math.min(steps.length - 1, Math.max(0, Math.floor(v * steps.length)));
    setActive(idx);
  });

  if (reduce) {
    return (
      <section className="relative overflow-hidden bg-ink text-ink-foreground">
        <StaticSteps title={title} steps={steps} />
      </section>
    );
  }

  return (
    <section ref={ref} className="relative bg-ink text-ink-foreground">
      {/* Mobile: simple stacked steps (no scroll-jacking) */}
      <div className="lg:hidden">
        <StaticSteps title={title} steps={steps} />
      </div>

      {/* Desktop: pinned scroll-driven stepper */}
      <div className="hidden lg:block lg:h-[280vh]">
        <div className="sticky top-0 flex h-screen items-center overflow-hidden">
          <div className="mx-auto grid w-full max-w-7xl grid-cols-[0.9fr_1.1fr] items-center gap-16 px-8">
            {/* Left: giant animated numeral + progress rail */}
            <div className="relative flex items-center gap-8">
              <div className="relative h-full self-stretch">
                <div className="absolute left-0 top-1/2 h-56 w-px -translate-y-1/2 bg-ink-foreground/15">
                  <m.div
                    style={{ scaleY: railScale }}
                    className="absolute inset-0 origin-top bg-gradient-to-b from-emerald-soft to-accent-soft"
                  />
                </div>
              </div>

              <div className="relative h-[clamp(5rem,16vw,11rem)] flex-1">
                <AnimatePresence initial={false}>
                  <m.span
                    key={active}
                    initial={{ opacity: 0, scale: 0.6, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 1.35, y: -30 }}
                    transition={{ duration: 0.55, ease: EASE }}
                    className="absolute inset-0 block font-serif text-display-lg font-semibold text-gold-gradient"
                  >
                    {String(active + 1).padStart(2, "0")}
                  </m.span>
                </AnimatePresence>
              </div>
            </div>

            {/* Right: title, active step copy, and step list */}
            <div>
              <Eyebrow />
              <h2 className="mt-4 font-serif text-display font-semibold">{title}</h2>

              <div className="relative mt-8 h-28">
                <AnimatePresence initial={false}>
                  <m.div
                    key={active}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -18 }}
                    transition={{ duration: 0.45, ease: EASE }}
                    className="absolute inset-0"
                  >
                    <h3 className="font-serif text-3xl font-semibold text-accent-soft">
                      {steps[active]?.title}
                    </h3>
                    <p className="mt-3 max-w-md text-ink-foreground/75">
                      {steps[active]?.text}
                    </p>
                  </m.div>
                </AnimatePresence>
              </div>

              <ul className="mt-10 flex flex-col gap-3 border-t border-ink-foreground/10 pt-6">
                {steps.map((step, index) => {
                  const isActive = index === active;
                  return (
                    <li
                      key={step.title}
                      className={`flex items-center gap-4 transition-all duration-500 ${
                        isActive ? "opacity-100" : "opacity-45"
                      }`}
                    >
                      <span
                        className={`font-serif text-lg tabular-nums transition-colors duration-500 ${
                          isActive ? "text-accent-soft" : "text-ink-foreground/60"
                        }`}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={`origin-left text-sm transition-all duration-500 ${
                          isActive
                            ? "scale-105 font-medium text-ink-foreground"
                            : "text-ink-foreground/70"
                        }`}
                      >
                        {step.title}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
