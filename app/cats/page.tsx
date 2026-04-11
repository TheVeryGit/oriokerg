import { CatsCollection } from "@/components/CatsCollection";
import { getCats } from "@/lib/content";

export default function CatsPage() {
  const cats = getCats();

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <section className="max-w-3xl">
        <p className="text-sm uppercase tracking-[0.28em] text-accent">
          Коллекция
        </p>
        <h1 className="mt-4 text-4xl font-semibold text-foreground">
          Наши кошки
        </h1>
        <p className="mt-6 text-base leading-8 text-muted">
          Производители и котята выводятся из markdown-файлов в каталоге
          `content/cats`. Карточки собираются на этапе сборки и полностью
          статичны.
        </p>
      </section>

      <CatsCollection cats={cats} />
    </div>
  );
}
