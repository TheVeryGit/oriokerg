import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

export type AnimalCardBadge = {
  label: string;
  tone?: "gold" | "muted";
};

type AnimalCardProps = {
  name: string;
  photo?: string;
  subtitle?: string;
  price?: string | null;
  badge?: AnimalCardBadge;
  meta?: string;
  href?: string;
};

function CardShell({
  href,
  children,
}: {
  href?: string;
  children: ReactNode;
}) {
  const className =
    "group flex flex-col overflow-hidden rounded-[1.75rem] border border-border bg-card transition-all duration-300 hover:-translate-y-1.5 hover:border-accent/50 hover:shadow-[0_24px_55px_-22px_rgba(80,60,40,0.35)]";

  if (href) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  return <article className={className}>{children}</article>;
}

export function AnimalCard({
  name,
  photo,
  subtitle,
  price,
  badge,
  meta,
  href,
}: AnimalCardProps) {
  return (
    <CardShell href={href}>
      <div className="relative aspect-[4/5] overflow-hidden">
        {photo ? (
          <Image
            src={photo}
            alt={name}
            width={900}
            height={1125}
            sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-accent/5">
            <svg
              viewBox="0 0 24 24"
              className="h-12 w-12 text-accent/30"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 9c-3.5 0-6 2.6-6 5.3 0 1.6 1.3 2.7 3 2.7.9 0 1.7-.3 3-.3s2.1.3 3 .3c1.7 0 3-1.1 3-2.7C18 11.6 15.5 9 12 9Zm-6.5-.5A1.8 1.8 0 1 0 4 6.4a4 4 0 0 0 1.5 2.1Zm13 0A4 4 0 0 0 20 6.4a1.8 1.8 0 1 0-1.5 2.1ZM9 7.2A1.8 1.8 0 1 0 7.4 4 4 4 0 0 0 9 7.2Zm6 0A4 4 0 0 0 16.6 4 1.8 1.8 0 1 0 15 7.2Z" />
            </svg>
          </div>
        )}

        {badge ? (
          <span
            className={`absolute right-4 top-4 rounded-full px-3 py-1 text-xs backdrop-blur-md ${
              badge.tone === "muted"
                ? "bg-card/90 text-foreground"
                : "bg-accent text-accent-foreground"
            }`}
          >
            {badge.label}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-serif text-2xl font-semibold text-foreground">
            {name}
          </h3>
          {price ? (
            <span className="shrink-0 text-lg text-accent-soft">{price}</span>
          ) : null}
        </div>

        {subtitle ? (
          <p className="mt-2 text-sm text-muted">{subtitle}</p>
        ) : null}

        {meta ? (
          <p className="mt-4 border-t border-border pt-4 text-sm text-muted">
            {meta}
          </p>
        ) : null}
      </div>
    </CardShell>
  );
}
