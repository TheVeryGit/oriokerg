import Image from "next-export-optimize-images/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { AgeBadge } from "@/components/AgeBadge";

export type AnimalCardBadge = {
  label: string;
  tone?: "gold" | "muted" | "sold" | "free";
};

export type AnimalCardPrice = {
  label?: string;
  value: string;
  /** "elite" — золотая капсула с иконкой ✦ (для цены «в разведение»). */
  tone?: "default" | "elite";
};

type AnimalCardProps = {
  name: string;
  photo?: string;
  subtitle?: string;
  /** Одна цена (строка) — для кошек и обратной совместимости. */
  price?: string | null;
  /** Несколько ценовых строк (напр. «В любимцы» / «В разведение») — для котят. */
  prices?: AnimalCardPrice[];
  badge?: AnimalCardBadge;
  meta?: string;
  href?: string;
  /** ISO-дата рождения (котята) — показывает бейдж возраста на фото. */
  birthDate?: string;
};

function CardShell({ href, children }: { href?: string; children: ReactNode }) {
  const className =
    "group relative flex flex-col overflow-hidden rounded-4xl border border-border bg-card shadow-soft transition-all duration-500 hover:-translate-y-2 hover:border-accent/40 hover:shadow-lift";

  if (href) {
    return (
      <Link href={href} className={`${className} cursor-pointer`}>
        {children}
      </Link>
    );
  }

  return <article className={className}>{children}</article>;
}

const badgeTone: Record<NonNullable<AnimalCardBadge["tone"]>, string> = {
  gold: "bg-accent text-accent-foreground",
  muted: "bg-card text-foreground",
  sold: "bg-ink text-ink-foreground",
  free: "bg-emerald text-ink-foreground",
};

export function AnimalCard({
  name,
  photo,
  subtitle,
  price,
  prices,
  badge,
  meta,
  href,
  birthDate,
}: AnimalCardProps) {
  const priceLines: AnimalCardPrice[] =
    prices && prices.length > 0
      ? prices
      : price
        ? [{ value: price }]
        : [];
  return (
    <CardShell href={href}>
      <div className="relative aspect-square overflow-hidden">
        {photo ? (
          <Image
            src={photo}
            alt={name}
            width={900}
            height={900}
            placeholder="blur"
            sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw"
            className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.08]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-accent/5 to-surface-2">
            <svg
              viewBox="0 0 24 24"
              className="h-14 w-14 text-accent/25"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 9c-3.5 0-6 2.6-6 5.3 0 1.6 1.3 2.7 3 2.7.9 0 1.7-.3 3-.3s2.1.3 3 .3c1.7 0 3-1.1 3-2.7C18 11.6 15.5 9 12 9Zm-6.5-.5A1.8 1.8 0 1 0 4 6.4a4 4 0 0 0 1.5 2.1Zm13 0A4 4 0 0 0 20 6.4a1.8 1.8 0 1 0-1.5 2.1ZM9 7.2A1.8 1.8 0 1 0 7.4 4 4 4 0 0 0 9 7.2Zm6 0A4 4 0 0 0 16.6 4 1.8 1.8 0 1 0 15 7.2Z" />
            </svg>
          </div>
        )}

        {/* Bottom scrim for depth */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/35 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        {badge ? (
          <span
            className={`absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-medium shadow-soft ${
              badgeTone[badge.tone ?? "gold"]
            }`}
          >
            {badge.label}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {/* Title row: имя + чип возраста справа */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-serif text-2xl font-semibold leading-tight text-foreground">
            {name}
          </h3>
          {birthDate ? (
            <AgeBadge
              birthDate={birthDate}
              className="mt-1 inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald/10 px-2.5 py-1 text-xs font-medium text-emerald"
            />
          ) : null}
        </div>

        {subtitle ? (
          <p className="mt-1 text-sm text-muted">{subtitle}</p>
        ) : null}

        {priceLines.length > 0 ? (
          <div className="mt-4 space-y-2">
            {priceLines.map((line, index) => {
              const elite = line.tone === "elite";
              return (
                <div
                  key={`${line.label ?? "price"}-${index}`}
                  className={`flex items-center justify-between gap-3 rounded-full px-4 py-2.5 text-sm ${
                    elite
                      ? "bg-gradient-to-r from-accent to-accent-strong text-accent-foreground shadow-glow"
                      : "border border-border bg-surface-2/40 text-foreground"
                  }`}
                >
                  <span
                    className={`inline-flex items-center gap-1.5 ${elite ? "" : "text-muted"}`}
                  >
                    {elite ? (
                      <svg
                        viewBox="0 0 24 24"
                        className="h-3.5 w-3.5"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M12 2 13.6 8.4 20 10l-6.4 1.6L12 18l-1.6-6.4L4 10l6.4-1.6L12 2Z" />
                      </svg>
                    ) : null}
                    {line.label ?? "Цена"}
                  </span>
                  <span
                    className={`font-semibold tabular-nums ${elite ? "" : "text-accent-strong"}`}
                  >
                    {line.value}
                  </span>
                </div>
              );
            })}
          </div>
        ) : null}

        {meta ? (
          <p className="mt-3 text-sm text-muted">{meta}</p>
        ) : null}

        {href ? (
          <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent transition-all duration-300 group-hover:gap-3">
            Подробнее
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
        ) : null}
      </div>
    </CardShell>
  );
}
