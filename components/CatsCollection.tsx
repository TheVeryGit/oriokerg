import { AnimalCard } from "@/components/AnimalCard";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import type { CatEntry } from "@/lib/content";
import { formatPrice } from "@/lib/format";

type CatsCollectionProps = {
  cats: CatEntry[];
};

/** Роль производителя для бейджа: кошка → Мама, кот → Папа. */
function roleLabel(gender: string) {
  return gender === "Кот" ? "Папа" : "Мама";
}

export function CatsCollection({ cats }: CatsCollectionProps) {
  if (cats.length === 0) {
    return (
      <div className="rounded-4xl border border-dashed border-border-strong bg-card p-12 text-center text-muted">
        Производители появятся здесь после публикации в админке.
      </div>
    );
  }

  return (
    <Stagger className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
      {cats.map((cat) => {
        const price = formatPrice(cat.price);
        const meta = cat.bodyType ? `Тип: ${cat.bodyType}` : undefined;

        return (
          <StaggerItem key={cat.slug}>
            <AnimalCard
              href={`/cats/${cat.slug}`}
              name={cat.name}
              photo={cat.photos[0]}
              subtitle={cat.color}
              price={price ? `${price} ₽` : undefined}
              badge={{ label: roleLabel(cat.gender), tone: "muted" }}
              meta={meta}
            />
          </StaggerItem>
        );
      })}
    </Stagger>
  );
}
