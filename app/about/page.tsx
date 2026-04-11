export default function AboutPage() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <section className="rounded-[2rem] border border-border bg-card p-8 sm:p-10">
        <p className="text-sm uppercase tracking-[0.28em] text-accent">
          О питомнике
        </p>
        <h1 className="mt-4 text-4xl font-semibold text-foreground">
          О питомнике
        </h1>
        <div className="mt-6 max-w-3xl space-y-5 text-base leading-8 text-muted">
          <p>
            Здесь будет размещена история питомника, информация о подходе к
            разведению, условиях содержания и ключевых ценностях OrioKerg.
          </p>
          <p>
            Пока страница служит статической заготовкой, которую можно будет
            наполнить реальными текстами, фотографиями и фактами о кошках и
            выпускниках.
          </p>
        </div>
      </section>

      <div className="h-[420px] w-full rounded-[2rem] border border-border bg-gray-800" />
    </div>
  );
}
