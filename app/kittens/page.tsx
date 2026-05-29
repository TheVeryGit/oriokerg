import { AnimalCard } from "@/components/AnimalCard";
import { Reveal } from "@/components/Reveal";
import type { KittenEntry } from "@/lib/content";
import { formatPrice, getKittens } from "@/lib/content";

function KittensGrid({ kittens }: { kittens: KittenEntry[] }) {
  if (kittens.length === 0) {
    return (
      <div className="rounded-[1.75rem] border border-dashed border-border bg-card/60 p-10 text-center text-muted">
        Сейчас свободных котят нет. Напишите нам — расскажем о ближайших
        пометах и поможем выбрать малыша заранее.
      </div>
    );
  }

  return (
    <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
      {kittens.map((kitten, index) => {
        const price = formatPrice(kitten.price);

        return (
          <Reveal key={kitten.slug} delay={index * 80}>
            <AnimalCard
              name={kitten.name}
              photo={kitten.photos[0]}
              subtitle={kitten.color}
              price={price ? `${price} ₽` : "Цена по запросу"}
              badge={
                kitten.reserved
                  ? { label: "Зарезервирован", tone: "muted" }
                  : { label: kitten.gender }
              }
              meta={kitten.description || undefined}
            />
          </Reveal>
        );
      })}
    </div>
  );
}

export default function KittensPage() {
  const kittens = getKittens();

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <Reveal className="max-w-3xl">
        <p className="text-sm uppercase tracking-[0.3em] text-accent">
          Свободные котята
        </p>
        <h1 className="mt-4 font-serif text-4xl font-semibold text-foreground sm:text-5xl">
          Котята в продаже
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted">
          Малыши из питомника OrioKerg — здоровые, социализированные и готовые
          стать частью вашей семьи. Все котята передаются с документами и
          ветеринарным паспортом.
        </p>
      </Reveal>

      <KittensGrid kittens={kittens} />
    </div>
  );
}
