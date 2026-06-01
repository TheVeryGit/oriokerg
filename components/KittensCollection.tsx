"use client";

import { useMemo, useState } from "react";

import { AnimalCard } from "@/components/AnimalCard";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import type { KittenEntry } from "@/lib/content";
import { kittenPriceLines } from "@/lib/format";

type KittensCollectionProps = {
  kittens: KittenEntry[];
};

type FilterKey = "all" | "free" | "reserved";

const filters: { key: FilterKey; label: string }[] = [
  { key: "all", label: "Все" },
  { key: "free", label: "Свободные" },
  { key: "reserved", label: "Зарезервированные" },
];

export function KittensCollection({ kittens }: KittensCollectionProps) {
  const [active, setActive] = useState<FilterKey>("all");

  const filtered = useMemo(
    () =>
      kittens.filter((kitten) => {
        if (active === "free") return !kitten.reserved;
        if (active === "reserved") return kitten.reserved;
        return true;
      }),
    [active, kittens],
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-3">
        {filters.map((filter) => {
          const isActive = filter.key === active;
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
              onClick={() => setActive(filter.key)}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-4xl border border-dashed border-border-strong bg-card p-12 text-center text-muted">
          В этой категории пока нет котят. Напишите нам — расскажем о ближайших
          пометах и поможем выбрать малыша заранее.
        </div>
      ) : (
        <Stagger className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((kitten) => (
            <StaggerItem key={kitten.slug}>
              <AnimalCard
                href={`/kittens/${kitten.slug}`}
                name={kitten.name}
                photo={kitten.photos[0]}
                subtitle={kitten.color}
                birthDate={kitten.birthDate}
                prices={kittenPriceLines(kitten.pricePet, kitten.priceBreed)}
                badge={
                  kitten.reserved
                    ? { label: "Зарезервирован", tone: "sold" }
                    : { label: kitten.gender }
                }
              />
            </StaggerItem>
          ))}
        </Stagger>
      )}
    </div>
  );
}
