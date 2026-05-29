import Image from "next/image";
import Link from "next/link";

import { AnimalCard } from "@/components/AnimalCard";
import { Reveal } from "@/components/Reveal";
import type { ContactsSettings, HomepageSettings } from "@/lib/content";
import {
  DEFAULT_HERO_IMAGE,
  formatPrice,
  getCats,
  getKittens,
  getSettings,
} from "@/lib/content";

const stats = [
  { value: "8 лет", label: "питомнику" },
  { value: "120+", label: "счастливых семей" },
  { value: "WCF", label: "регистрация" },
  { value: "4.9", label: "средняя оценка" },
];

const features = [
  {
    title: "Здоровье под контролем",
    text: "Тесты на генетические заболевания, наблюдение ветеринара и прививки по возрасту.",
  },
  {
    title: "Социализация с рождения",
    text: "Котята растут в доме среди людей и звуков — спокойные, ручные и ласковые.",
  },
  {
    title: "Полный пакет документов",
    text: "Метрика, договор и ветеринарный паспорт едут вместе с малышом.",
  },
  {
    title: "Поддержка на всю жизнь",
    text: "Консультируем по питанию, уходу и воспитанию столько, сколько нужно.",
  },
];

const steps = [
  { title: "Знакомство", text: "Пишете нам — присылаем фото, видео и рассказываем о малышах." },
  { title: "Бронь", text: "Выбираете котёнка и вносите бронь, чтобы он дождался переезда." },
  { title: "Подготовка", text: "Прививки, документы и приучение к лотку и когтеточке." },
  { title: "Переезд", text: "Передаём котёнка с пакетом документов и заботой о деталях." },
];

const reviews = [
  {
    name: "Анна",
    city: "Москва",
    text: "Котёнок приехал здоровым, ласковым и совершенно ручным. Заводчик на связи до сих пор!",
  },
  {
    name: "Дмитрий",
    city: "Казань",
    text: "Всё честно: показали родителей, документы, отвечали на любые вопросы. Рекомендую.",
  },
  {
    name: "Елена",
    city: "Санкт-Петербург",
    text: "Наш питомец — чудо: воспитанный, чистоплотный, обожает всю семью. Спасибо OrioKerg!",
  },
];

const galleryFallback = [
  "/images/gallery/cat-1.jpg",
  "/images/gallery/cat-2.jpg",
  "/images/gallery/cat-3.jpg",
  "/images/gallery/cat-4.jpg",
  "/images/gallery/cat-5.jpg",
];

function Stars() {
  return (
    <div className="flex gap-0.5 text-accent">
      {Array.from({ length: 5 }).map((_, index) => (
        <svg
          key={index}
          viewBox="0 0 20 20"
          className="h-4 w-4 fill-current"
          aria-hidden="true"
        >
          <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 15l-5.2 2.6 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}

function buildGallery(): string[] {
  const realPhotos = [
    ...getKittens().flatMap((kitten) => kitten.photos),
    ...getCats().flatMap((cat) => cat.photos),
  ];

  const unique = Array.from(new Set(realPhotos));
  const combined = [...unique, ...galleryFallback];
  return combined.slice(0, 5);
}

export default function HomePage() {
  const homepage = getSettings<HomepageSettings>("homepage");
  const contacts = getSettings<ContactsSettings>("contacts");
  const heroImage = homepage.hero_image?.trim()
    ? homepage.hero_image
    : DEFAULT_HERO_IMAGE;
  const featuredKittens = getKittens()
    .filter((kitten) => !kitten.reserved)
    .slice(0, 3);
  const gallery = buildGallery();

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-accent/15 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-40 h-80 w-80 rounded-full bg-accent-soft/15 blur-3xl" />

        <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
          <Reveal>
            <p className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-4 py-1.5 text-xs uppercase tracking-[0.3em] text-accent-soft">
              Питомник с любовью
            </p>
            <h1 className="mt-6 font-serif text-5xl font-semibold leading-[1.04] text-foreground sm:text-6xl lg:text-7xl">
              {homepage.hero_title}
            </h1>
            <p className="mt-7 max-w-md text-lg leading-8 text-muted">
              {homepage.hero_subtitle}
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/kittens"
                className="rounded-full bg-accent px-8 py-4 text-sm font-medium text-accent-foreground shadow-[0_14px_34px_-12px_rgba(154,107,63,0.6)] transition-transform hover:-translate-y-0.5"
              >
                Посмотреть котят
              </Link>
              <Link
                href="/about"
                className="rounded-full border border-border px-8 py-4 text-sm text-muted transition-colors hover:border-accent hover:text-accent"
              >
                О питомнике
              </Link>
            </div>
            <div className="mt-9 flex flex-wrap gap-x-7 gap-y-2 text-sm text-muted">
              <span>✓ Документы WCF</span>
              <span>✓ Прививки по возрасту</span>
              <span>✓ Договор</span>
            </div>
          </Reveal>

          <Reveal delay={120} className="relative">
            <div className="absolute -right-4 -top-4 hidden h-32 w-32 rounded-3xl border border-border sm:block" />
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2.5rem] shadow-[0_40px_70px_-25px_rgba(80,60,40,0.4)]">
              <Image
                src={heroImage}
                alt="Ориентальная кошка питомника OrioKerg"
                fill
                priority
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover object-[50%_20%]"
              />
            </div>
            <div className="absolute -bottom-5 left-5 flex items-center gap-3 rounded-2xl bg-card px-5 py-4 shadow-[0_20px_40px_-18px_rgba(80,60,40,0.4)]">
              <Stars />
              <div className="text-sm">
                <p className="font-medium text-foreground">4.9 / 5</p>
                <p className="text-muted">120+ семей</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-card/60">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-8 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-serif text-4xl font-semibold text-accent">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured kittens */}
      <section className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal className="flex items-end justify-between gap-6">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-accent">
              В продаже
            </p>
            <h2 className="mt-3 font-serif text-4xl font-semibold text-foreground sm:text-5xl">
              Наши котята
            </h2>
          </div>
          <Link
            href="/kittens"
            className="hidden shrink-0 text-sm text-muted transition-colors hover:text-accent sm:block"
          >
            Смотреть всех →
          </Link>
        </Reveal>

        {featuredKittens.length === 0 ? (
          <Reveal className="mt-12 rounded-[1.75rem] border border-dashed border-border bg-card p-10 text-center text-muted">
            Свободные котята скоро появятся. Загляните позже или напишите нам —
            расскажем о ближайших планах.
          </Reveal>
        ) : (
          <div className="mt-12 grid gap-7 md:grid-cols-2 xl:grid-cols-3">
            {featuredKittens.map((kitten, index) => (
              <Reveal key={kitten.slug} delay={index * 100}>
                <AnimalCard
                  name={kitten.name}
                  photo={kitten.photos[0]}
                  subtitle={kitten.color}
                  price={
                    formatPrice(kitten.price)
                      ? `${formatPrice(kitten.price)} ₽`
                      : "Цена по запросу"
                  }
                  badge={{ label: kitten.gender }}
                />
              </Reveal>
            ))}
          </div>
        )}
      </section>

      {/* Features */}
      <section className="bg-card/60 border-y border-border">
        <div className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <Reveal className="max-w-2xl">
            <p className="text-sm uppercase tracking-[0.3em] text-accent">
              Почему мы
            </p>
            <h2 className="mt-3 font-serif text-4xl font-semibold text-foreground sm:text-5xl">
              Забота, которой можно доверять
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {features.map((feature, index) => (
              <Reveal key={feature.title} delay={index * 80}>
                <div className="h-full rounded-3xl border border-border bg-card p-7 shadow-[0_10px_30px_-16px_rgba(80,60,40,0.25)]">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-6 w-6 fill-current"
                      aria-hidden="true"
                    >
                      <path d="M12 9c-3.5 0-6 2.6-6 5.3 0 1.6 1.3 2.7 3 2.7.9 0 1.7-.3 3-.3s2.1.3 3 .3c1.7 0 3-1.1 3-2.7C18 11.6 15.5 9 12 9Zm-6.5-.5A1.8 1.8 0 1 0 4 6.4a4 4 0 0 0 1.5 2.1Zm13 0A4 4 0 0 0 20 6.4a1.8 1.8 0 1 0-1.5 2.1ZM9 7.2A1.8 1.8 0 1 0 7.4 4 4 4 0 0 0 9 7.2Zm6 0A4 4 0 0 0 16.6 4 1.8 1.8 0 1 0 15 7.2Z" />
                    </svg>
                  </div>
                  <h3 className="mt-5 text-lg font-medium text-foreground">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-muted">
                    {feature.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal>
          <p className="text-sm uppercase tracking-[0.3em] text-accent">
            Галерея
          </p>
          <h2 className="mt-3 font-serif text-4xl font-semibold text-foreground sm:text-5xl">
            Жизнь в питомнике
          </h2>
        </Reveal>
        <Reveal className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4 md:grid-rows-2">
          <div className="relative col-span-2 row-span-2 aspect-square overflow-hidden rounded-3xl md:aspect-auto">
            <Image
              src={gallery[0]}
              alt="Жизнь питомника OrioKerg"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          {gallery.slice(1).map((photo, index) => (
            <div
              key={`${photo}-${index}`}
              className="relative aspect-square overflow-hidden rounded-3xl"
            >
              <Image
                src={photo}
                alt="Питомец OrioKerg"
                fill
                sizes="(min-width: 768px) 25vw, 50vw"
                className="object-cover"
              />
            </div>
          ))}
        </Reveal>
      </section>

      {/* Steps */}
      <section className="bg-foreground text-background">
        <div className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <Reveal className="max-w-2xl">
            <p className="text-sm uppercase tracking-[0.3em] text-accent-soft">
              Просто
            </p>
            <h2 className="mt-3 font-serif text-4xl font-semibold sm:text-5xl">
              Как забрать котёнка
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-8 md:grid-cols-4">
            {steps.map((step, index) => (
              <Reveal key={step.title} delay={index * 80}>
                <span className="font-serif text-5xl font-semibold text-accent-soft">
                  0{index + 1}
                </span>
                <h3 className="mt-4 text-lg font-medium">{step.title}</h3>
                <p className="mt-2 text-sm leading-7 text-background/70">
                  {step.text}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal className="text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-accent">
            Отзывы
          </p>
          <h2 className="mt-3 font-serif text-4xl font-semibold text-foreground sm:text-5xl">
            Что говорят семьи
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {reviews.map((review, index) => (
            <Reveal key={review.name} delay={index * 100}>
              <div className="h-full rounded-3xl border border-border bg-card p-7 shadow-[0_10px_30px_-16px_rgba(80,60,40,0.25)]">
                <Stars />
                <p className="mt-4 text-[15px] leading-7 text-foreground/80">
                  «{review.text}»
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-accent-foreground">
                    {review.name[0]}
                  </span>
                  <div className="text-sm">
                    <p className="font-medium text-foreground">{review.name}</p>
                    <p className="text-muted">{review.city}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto w-full max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <Reveal>
          <div className="overflow-hidden rounded-[2.5rem] bg-accent px-6 py-20 text-center text-accent-foreground sm:px-10">
            <h2 className="mx-auto max-w-2xl font-serif text-4xl font-semibold sm:text-5xl">
              Хотите познакомиться с котёнком?
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-accent-foreground/85">
              Напишите нам — расскажем о доступных малышах, пришлём фото и видео,
              поможем выбрать вашего питомца.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <a
                href={contacts.telegram}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-card px-8 py-4 text-sm font-medium text-accent transition-transform hover:-translate-y-0.5"
              >
                Написать в Telegram
              </a>
              <a
                href={contacts.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-accent-foreground/40 px-8 py-4 text-sm text-accent-foreground transition-colors hover:bg-accent-foreground/10"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
