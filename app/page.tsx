import Image from "next/image";
import Link from "next/link";

import { AnimalCard } from "@/components/AnimalCard";
import { Reveal } from "@/components/Reveal";
import type { ContactsSettings, HomepageSettings } from "@/lib/content";
import {
  DEFAULT_HERO_IMAGE,
  formatPrice,
  getKittens,
  getSettings,
} from "@/lib/content";

const trust = [
  {
    title: "Документы и родословная",
    text: "Метрика, договор купли-продажи и ветеринарный паспорт на каждого котёнка.",
  },
  {
    title: "Привит и приучен",
    text: "Прививки по возрасту, приучен к лотку и когтеточке, готов к переезду.",
  },
  {
    title: "Поддержка на всю жизнь",
    text: "Консультируем по питанию, уходу и воспитанию столько, сколько нужно.",
  },
];

export default function HomePage() {
  const homepage = getSettings<HomepageSettings>("homepage");
  const contacts = getSettings<ContactsSettings>("contacts");
  const heroImage = homepage.hero_image?.trim()
    ? homepage.hero_image
    : DEFAULT_HERO_IMAGE;
  const featuredKittens = getKittens()
    .filter((kitten) => !kitten.reserved)
    .slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[88vh] w-full overflow-hidden">
        <Image
          src={heroImage}
          alt="Ориентальная кошка питомника OrioKerg"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/45 to-background/30" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_28%,rgba(201,168,76,0.22),transparent_46%)]" />

        <div className="relative mx-auto flex min-h-[88vh] w-full max-w-7xl flex-col justify-center px-4 py-24 sm:px-6 lg:px-8">
          <p className="animate-fade-up text-xs uppercase tracking-[0.42em] text-accent-soft">
            Премиальный питомник
          </p>
          <h1 className="animate-fade-up mt-6 max-w-3xl font-serif text-5xl font-semibold leading-[1.05] text-white sm:text-6xl lg:text-7xl">
            {homepage.hero_title}
          </h1>
          <p className="animate-fade-up mt-7 max-w-xl text-lg leading-8 text-white/75">
            {homepage.hero_subtitle}
          </p>
          <div className="animate-fade-up mt-10 flex flex-wrap gap-4">
            <Link
              href="/kittens"
              className="rounded-full bg-accent px-8 py-4 text-sm font-medium text-accent-foreground shadow-[0_10px_45px_-10px_rgba(201,168,76,0.65)] transition-transform hover:-translate-y-0.5"
            >
              Посмотреть котят
            </Link>
            <Link
              href="/about"
              className="rounded-full border border-white/25 px-8 py-4 text-sm text-white/90 backdrop-blur-sm transition-colors hover:border-accent hover:text-accent-soft"
            >
              О питомнике
            </Link>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <Reveal className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.3em] text-accent">
            О питомнике
          </p>
          <h2 className="mt-5 font-serif text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
            Минимализм, внимание к породе и забота о каждом выпускнике
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted">
            {homepage.intro_text}
          </p>
        </Reveal>
      </section>

      {/* Featured kittens */}
      <section className="mx-auto w-full max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <Reveal className="flex items-end justify-between gap-6">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-accent">
              В продаже
            </p>
            <h2 className="mt-4 font-serif text-4xl font-semibold text-foreground sm:text-5xl">
              Наши котята
            </h2>
          </div>
          <Link
            href="/kittens"
            className="hidden shrink-0 text-sm text-muted transition-colors hover:text-accent-soft sm:block"
          >
            Смотреть всех →
          </Link>
        </Reveal>

        {featuredKittens.length === 0 ? (
          <Reveal className="mt-12 rounded-[1.75rem] border border-dashed border-border bg-card/60 p-10 text-center text-muted">
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

      {/* Trust */}
      <section className="border-y border-border bg-[#0d0d0d]">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-20 sm:px-6 md:grid-cols-3 lg:px-8">
          {trust.map((item, index) => (
            <Reveal key={item.title} delay={index * 100}>
              <div className="flex gap-5">
                <span className="font-serif text-3xl text-accent">
                  0{index + 1}
                </span>
                <div>
                  <h3 className="text-lg font-medium text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-muted">
                    {item.text}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] border border-accent/30 bg-[radial-gradient(circle_at_30%_50%,rgba(201,168,76,0.16),transparent_60%)] px-6 py-20 text-center sm:px-10">
            <h2 className="mx-auto max-w-2xl font-serif text-4xl font-semibold text-white sm:text-5xl">
              Хотите познакомиться с котёнком?
            </h2>
            <p className="mx-auto mt-6 max-w-lg text-muted">
              Напишите нам — расскажем о доступных малышах, пришлём фото и видео,
              поможем выбрать вашего питомца.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <a
                href={contacts.telegram}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-accent px-8 py-4 text-sm font-medium text-accent-foreground transition-transform hover:-translate-y-0.5"
              >
                Написать в Telegram
              </a>
              <a
                href={contacts.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/25 px-8 py-4 text-sm text-white/90 transition-colors hover:border-accent hover:text-accent-soft"
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
