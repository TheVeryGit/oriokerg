"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import type { CatEntry } from "@/lib/content";

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
              className={`rounded-full border px-5 py-3 text-sm transition-all ${
                isActive
                  ? "border-accent bg-accent text-accent-foreground"
                  : "border-border bg-card text-muted hover:border-accent hover:text-foreground"
              }`}
              onClick={() => setActiveFilter(filter.key)}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      {filteredCats.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-border bg-card/60 p-8 text-muted">
          В этой категории пока нет опубликованных карточек.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredCats.map((cat) => {
            const coverPhoto = cat.photos[0];

            return (
              <Link
                key={cat.slug}
                href={`/cats/${cat.slug}`}
                className="group overflow-hidden rounded-[2rem] border border-border bg-card transition-transform duration-300 hover:-translate-y-1 hover:border-accent/70"
              >
                {coverPhoto ? (
                  <div className="aspect-[4/3] overflow-hidden">
                    <Image
                      src={coverPhoto}
                      alt={cat.name}
                      width={1200}
                      height={900}
                      sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="aspect-[4/3] bg-[#161616]" />
                )}

                <div className="space-y-4 p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">
                        {cat.name}
                      </h3>
                      <p className="mt-2 text-sm text-muted">{cat.color}</p>
                    </div>

                    <span className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs text-accent">
                      {cat.type}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted">
                    <span>{cat.gender}</span>
                    <span>{cat.available ? "Доступно" : "Недоступно"}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
