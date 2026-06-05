"use client";

import { m, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Image from "next-export-optimize-images/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

type HeroProps = {
  title: string;
  subtitle: string;
  image: string;
  telegram: string;
};

const trustPoints = ["Документы WCF", "Прививки по возрасту", "Договор"];

/** Entrance is CSS (`animate-fade-up`, auto-plays on load — reliable on static
 *  export). Framer is used only for the scroll parallax, which is enhancement:
 *  if it never runs, the image is simply static and fully visible. */
function fade(delay: number): CSSProperties {
  return { animationDelay: `${delay}ms` };
}

/** Рендер заголовка с золотым курсивным акцентом: слово в *звёздочках*
 *  («…с *характером* и…») подсвечивается золотом. Без маркера — обычный текст. */
function renderTitle(title: string) {
  return title.split(/(\*[^*]+\*)/g).map((part, index) => {
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      return (
        <em
          key={index}
          className="font-medium italic text-gold-gradient"
        >
          {part.slice(1, -1)}
        </em>
      );
    }
    return <span key={index}>{part}</span>;
  });
}

export function Hero({ title, subtitle, image, telegram }: HeroProps) {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "14%"]);
  const decoY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "-30%"]);

  // Параллакс только на десктопе: на мобиле трансформы на скролле дают джанк.
  const [parallax, setParallax] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setParallax(mq.matches && !reduce);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [reduce]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden">
      <m.div
        aria-hidden="true"
        style={{ y: parallax ? decoY : 0 }}
        className="mobile-no-decor pointer-events-none absolute -left-24 top-6 h-72 w-72 rounded-full bg-accent/15 blur-3xl"
      />
      <m.div
        aria-hidden="true"
        style={{ y: parallax ? decoY : 0 }}
        className="mobile-no-decor pointer-events-none absolute right-0 top-44 h-80 w-80 rounded-full bg-accent-soft/20 blur-3xl"
      />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
        <div>
          <p style={fade(40)} className="kicker animate-fade-up">
            Элегантность · Интеллект · Безусловная любовь
          </p>

          <h1
            style={fade(120)}
            className="mt-6 animate-fade-up font-serif text-[2.75rem] font-semibold leading-[1.03] text-foreground text-balance sm:text-6xl lg:text-7xl"
          >
            {renderTitle(title)}
          </h1>

          <p
            style={fade(210)}
            className="mt-7 max-w-md animate-fade-up text-lg leading-8 text-muted text-pretty"
          >
            {subtitle}
          </p>

          <div style={fade(290)} className="mt-9 flex animate-fade-up flex-wrap gap-4">
            <Link
              href="/kittens"
              className="rounded-full bg-gradient-to-br from-accent to-accent-strong px-8 py-4 text-sm font-medium text-accent-foreground shadow-glow transition-transform duration-200 hover:-translate-y-0.5"
            >
              Посмотреть котят
            </Link>
            <a
              href={telegram}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-border-strong bg-card/60 px-8 py-4 text-sm text-foreground transition-colors hover:border-accent hover:text-accent"
            >
              Написать нам
            </a>
          </div>

          <div
            style={fade(370)}
            className="mt-9 flex animate-fade-up flex-wrap gap-x-7 gap-y-2 text-sm text-muted"
          >
            {trustPoints.map((point) => (
              <span key={point} className="inline-flex items-center gap-2">
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 text-emerald"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                {point}
              </span>
            ))}
          </div>
        </div>

        <div style={fade(160)} className="relative animate-fade-up">
          {/* Вертикальный «том» — журнальная деталь */}
          <span className="absolute -left-9 top-4 hidden rotate-180 text-[0.66rem] uppercase tracking-[0.4em] text-muted [writing-mode:vertical-rl] lg:block">
            OrioKerg — Vol. 01
          </span>
          {/* Золотые угловые скобки рамки */}
          <span
            aria-hidden="true"
            className="absolute -left-3 -top-3 z-10 hidden h-16 w-16 border-l border-t border-accent sm:block lg:h-20 lg:w-20"
          />
          <span
            aria-hidden="true"
            className="absolute -bottom-3 -right-3 z-10 hidden h-16 w-16 border-b border-r border-accent sm:block lg:h-20 lg:w-20"
          />
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg shadow-lift">
            <m.div style={{ y: parallax ? imageY : 0 }} className="absolute inset-0 -bottom-[14%]">
              <Image
                src={image}
                alt="Ориентальная кошка питомника OrioKerg"
                fill
                priority
                placeholder="blur"
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="animate-hero-zoom object-cover object-[50%_28%]"
              />
            </m.div>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent" />
          </div>

          <div
            style={fade(560)}
            className="absolute -bottom-5 left-5 flex animate-fade-up items-center gap-3 rounded-lg border border-border bg-card/90 px-5 py-4 shadow-lift backdrop-blur"
          >
            <div className="flex gap-0.5 text-accent">
              {Array.from({ length: 5 }).map((_, index) => (
                <svg
                  key={index}
                  viewBox="0 0 20 20"
                  className="h-4 w-4 fill-current"
                  aria-hidden="true"
                >
                  <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 15l-5.2 2.6 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
                </svg>
              ))}
            </div>
            <div className="text-sm">
              <p className="font-medium text-foreground">4.9 / 5</p>
              <p className="text-muted">120+ семей</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
