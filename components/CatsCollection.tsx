"use client";

import { useMemo, useState } from "react";

import { AnimalCard } from "@/components/AnimalCard";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import type { CatEntry } from "@/lib/content";
import { formatPrice } from "@/lib/format";

type CatsCollectionProps = {
  cats: CatEntry[];
};

type FilterKey = "all" | "producers" | "sale";

const filters: { key: FilterKey; label: string }[] = [
  { key: "all", label: "Все" },
  { key: "producers", label: "Производители" },
  { key: "sale", label: "Котята в продаже" },
];

function matchesFilter(cat: CatEntry, filter: FilterKey) {
  if (filter === "all") {
    return true;
  }
  if (filter === "producers") {
    return cat.type === "Производитель";
  }
  return cat.type === "Котёнок в продаже";
}

export function CatsCollection({ cats }: CatsCollectionProps) {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");

  const filteredCats = useMemo(
    () => cats.filter((cat) => matchesFilter(cat, activeFilter)),
    [activeFilter, cats],
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-3">
        {filters.map((filter) => {
          const isActive = filter.key === activeFilter;
          return (
            <button
              key={filter.key}
              type="button"
              aria-pressed={isActive}
              className={`cursor-pointer rounded-full border px-5 py-2.5 text-sm transition-all duration-200 ${
                isActive
                  ? "border-accent bg-gradient-to-br from-accent to-accent-strong text-accent-foreground shadow-soft"
                  : "border-border-strong bg-card text-muted hover:border-accent hover:text-foreground"
              }`}
              onClick={() => setActiveFilter(filter.key)}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      {filteredCats.length === 0 ? (
        <div className="rounded-4xl border border-dashed border-border-strong bg-card p-12 text-center text-muted">
          В этой категории пока нет опубликованных карточек.
        </div>
      ) : (
        <Stagger className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
          {filteredCats.map((cat) => {
            const price = formatPrice(cat.price);
            const meta = [cat.gender, cat.available ? "Доступен" : "Недоступен"]
              .filter(Boolean)
              .join(" · ");

            return (
              <StaggerItem key={cat.slug}>
                <AnimalCard
                  href={`/cats/${cat.slug}`}
                  name={cat.name}
                  photo={cat.photos[0]}
                  subtitle={cat.color}
                  price={price ? `${price} ₽` : undefined}
                  badge={{ label: cat.type, tone: "muted" }}
                  meta={meta}
                />
              </StaggerItem>
            );
          })}
        </Stagger>
      )}
    </div>
  );
}
