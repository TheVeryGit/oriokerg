import Link from "next/link";

export default function HomePage() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-16 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <section className="overflow-hidden rounded-[2.5rem] border border-border bg-card px-6 py-16 sm:px-10 lg:px-14 lg:py-24">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.32em] text-accent">
            Premium Cattery
          </p>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-7xl">
            OrioKerg
          </h1>
          <p className="mt-6 text-xl text-foreground/90 sm:text-2xl">
            Питомник ориентальных кошек
          </p>
          <p className="mt-8 max-w-2xl text-base leading-8 text-muted sm:text-lg">
            Спокойное, современное пространство для знакомства с выпускниками
            питомника, производителями и котятами, которые ищут свой новый дом.
          </p>
          <div className="mt-10">
            <Link
              href="/kittens"
              className="inline-flex items-center rounded-full border border-accent bg-accent px-7 py-3 text-sm font-medium text-accent-foreground transition-transform hover:-translate-y-0.5"
            >
              Посмотреть котят
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
        <div className="rounded-[2rem] border border-border bg-card p-8">
          <p className="text-sm uppercase tracking-[0.26em] text-accent">
            О нас
          </p>
          <h2 className="mt-4 text-3xl font-semibold text-foreground">
            Минимализм, внимание к породе и забота о каждом выпускнике
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-8 text-muted">
            Здесь будет размещена подробная информация о философии питомника,
            родословных линиях и подходе к выращиванию котят. Пока эта секция
            служит элегантным стартовым блоком для будущего контента.
          </p>
        </div>

        <div className="rounded-[2rem] border border-border bg-[#121212] p-8">
          <p className="text-sm uppercase tracking-[0.26em] text-accent">
            Контакт
          </p>
          <p className="mt-4 text-lg leading-8 text-muted">
            Для бронирования и уточнений можно перейти в Telegram или WhatsApp со
            страниц котят и карточек животных.
          </p>
        </div>
      </section>
    </div>
  );
}
