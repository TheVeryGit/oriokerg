import Image from "next/image";

import type { KittenEntry } from "@/lib/content";
import { formatPrice, getKittens } from "@/lib/content";

function KittensGrid({ kittens }: { kittens: KittenEntry[] }) {
  if (kittens.length === 0) {
    return (
      <div className="rounded-[2rem] border border-dashed border-border bg-card/60 p-8 text-muted">
        Котята пока не опубликованы. Когда записи появятся в `content/kittens`,
        они автоматически отобразятся здесь.
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {kittens.map((kitten) => {
        const coverPhoto = kitten.photos[0];
        const price = formatPrice(kitten.price);

        return (
          <article
            key={kitten.slug}
            className="overflow-hidden rounded-[2rem] border border-border bg-card"
          >
            {coverPhoto ? (
              <Image
                src={coverPhoto}
                alt={kitten.name}
                width={1200}
                height={900}
                sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw"
                className="aspect-[4/3] w-full object-cover"
              />
            ) : (
              <div className="aspect-[4/3] bg-[#161616]" />
            )}

            <div className="space-y-4 p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">
                    {kitten.name}
                  </h2>
                  <p className="mt-2 text-sm text-muted">{kitten.color}</p>
                </div>

                {kitten.reserved ? (
                  <span className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs text-accent">
                    Зарезервировано
                  </span>
                ) : null}
              </div>

              <div className="flex items-center justify-between text-sm text-muted">
                <span>{kitten.gender}</span>
                <span>{price ? `${price} ₽` : "Цена по запросу"}</span>
              </div>

              <p className="text-sm leading-7 text-muted">
                {kitten.description || "Описание появится позже."}
              </p>
            </div>
          </article>
        );
      })}
    </div>
  );
}

export default function KittensPage() {
  const kittens = getKittens();

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <section className="max-w-3xl">
        <p className="text-sm uppercase tracking-[0.28em] text-accent">
          Свободные котята
        </p>
        <h1 className="mt-4 text-4xl font-semibold text-foreground">
          Котята в продаже
        </h1>
        <p className="mt-6 text-base leading-8 text-muted">
          Карточки собираются из markdown-файлов в `content/kittens` и готовы для
          статического экспорта.
        </p>
      </section>

      <KittensGrid kittens={kittens} />
    </div>
  );
}
