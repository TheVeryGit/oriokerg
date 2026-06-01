"use client";

import { useState } from "react";

import type { FaqItem } from "@/lib/content";

/** Желаемый порядок групп на странице (неизвестные — в конец). */
const CATEGORY_ORDER = [
  "Бронь и оплата",
  "Документы и гарантии",
  "Уход и здоровье",
  "Доставка",
  "Общее",
];

type Indexed = { q: string; a: string; category: string; id: number };

function CategoryGlyph({ name }: { name: string }) {
  switch (name) {
    case "Бронь и оплата":
      return (
        <>
          <path d="M20.59 13.41 13.42 20.58a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82Z" />
          <path d="M7 7h.01" />
        </>
      );
    case "Документы и гарантии":
      return (
        <>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
          <path d="m9 12 2 2 4-4" />
        </>
      );
    case "Уход и здоровье":
      return (
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z" />
      );
    case "Доставка":
      return (
        <>
          <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
          <path d="m3.3 7 8.7 5 8.7-5" />
          <path d="M12 22V12" />
        </>
      );
    default:
      return (
        <>
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <path d="M12 17h.01" />
        </>
      );
  }
}

function CategoryIcon({ name, className }: { name: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <CategoryGlyph name={name} />
    </svg>
  );
}

function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
        active
          ? "border-accent bg-accent text-accent-foreground shadow-soft"
          : "border-border bg-card text-muted hover:border-accent/50 hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );
}

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const list: Indexed[] = items.map((it, id) => ({
    q: it.q,
    a: it.a,
    category: it.category?.trim() || "Общее",
    id,
  }));

  const rank = (c: string) => {
    const i = CATEGORY_ORDER.indexOf(c);
    return i === -1 ? 99 : i;
  };
  const categories = Array.from(new Set(list.map((i) => i.category))).sort(
    (a, b) => rank(a) - rank(b),
  );
  const grouped = categories.map((category) => ({
    category,
    items: list.filter((i) => i.category === category),
  }));
  const showGroups = categories.length > 1;

  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div>
      {showGroups ? (
        <div className="mb-7 flex flex-wrap gap-2">
          <Chip
            label="Все"
            active={active === null}
            onClick={() => setActive(null)}
          />
          {categories.map((c) => (
            <Chip
              key={c}
              label={c}
              active={active === c}
              onClick={() => setActive(c)}
            />
          ))}
        </div>
      ) : null}

      <div className="space-y-7">
        {grouped.map((group) => {
          const hidden = active !== null && active !== group.category;
          return (
            <section key={group.category} className={hidden ? "hidden" : ""}>
              {showGroups ? (
                <h2 className="mb-3 flex items-center gap-2.5 px-1">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/10 text-accent">
                    <CategoryIcon
                      name={group.category}
                      className="h-[18px] w-[18px]"
                    />
                  </span>
                  <span className="font-serif text-xl font-semibold text-foreground">
                    {group.category}
                  </span>
                  <span className="text-xs text-muted">
                    · {group.items.length}
                  </span>
                </h2>
              ) : null}

              <div className="divide-y divide-border overflow-hidden rounded-4xl border border-border bg-card shadow-soft">
                {group.items.map((item) => {
                  const isOpen = open === item.id;
                  return (
                    <div
                      key={item.id}
                      className={`relative transition-colors ${
                        isOpen ? "bg-surface-2/40" : ""
                      }`}
                    >
                      {isOpen ? (
                        <span
                          className="absolute left-0 top-0 h-full w-[3px] bg-accent"
                          aria-hidden="true"
                        />
                      ) : null}
                      <h3 className="m-0">
                        <button
                          type="button"
                          aria-expanded={isOpen}
                          aria-controls={`faq-panel-${item.id}`}
                          id={`faq-trigger-${item.id}`}
                          onClick={() => setOpen(isOpen ? null : item.id)}
                          className="flex w-full cursor-pointer items-center justify-between gap-4 px-6 py-5 text-left sm:px-7"
                        >
                          <span
                            className={`font-serif text-lg font-semibold transition-colors sm:text-xl ${
                              isOpen ? "text-accent-strong" : "text-foreground"
                            }`}
                          >
                            {item.q}
                          </span>
                          <span
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                              isOpen
                                ? "rotate-45 bg-accent text-accent-foreground"
                                : "bg-accent/10 text-accent"
                            }`}
                          >
                            <svg
                              viewBox="0 0 24 24"
                              className="h-4 w-4"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.4"
                              strokeLinecap="round"
                              aria-hidden="true"
                            >
                              <path d="M12 5v14M5 12h14" />
                            </svg>
                          </span>
                        </button>
                      </h3>
                      <div
                        id={`faq-panel-${item.id}`}
                        role="region"
                        aria-labelledby={`faq-trigger-${item.id}`}
                        className="grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
                        style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                      >
                        <div className="overflow-hidden">
                          <p className="px-6 pb-6 text-[15px] leading-7 text-muted sm:px-7">
                            {item.a}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
