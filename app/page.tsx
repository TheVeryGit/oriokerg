import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

import { AnimalCard } from "@/components/AnimalCard";
import { TelegramIcon, VkIcon } from "@/components/icons";
import { Hero } from "@/components/home/Hero";
import { Reveal } from "@/components/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import type { ContactsSettings } from "@/lib/content";
import {
  DEFAULT_HERO_IMAGE,
  formatPrice,
  getCats,
  getHomepage,
  getKittens,
  getSettings,
} from "@/lib/content";

// Icons are assigned by position; the owner controls the text via the CMS.
const featureIcons: ReactNode[] = [
  <path key="i0" d="M3 12h3l2 5 4-12 2 7 2-3h4" />,
  <path key="i1" d="M3 11l9-8 9 8M5 10v10h14V10M9 20v-6h6v6" />,
  <path key="i2" d="M7 3h7l5 5v13H7zM14 3v5h5M9 13h6M9 17h6" />,
  <path
    key="i3"
    d="M4 14a8 8 0 0 1 16 0v3a2 2 0 0 1-2 2h-1v-5h3M4 14v3a2 2 0 0 0 2 2h1v-5H4"
  />,
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

function Eyebrow({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm uppercase tracking-luxe text-accent">
      <span className="h-px w-8 bg-accent/50" />
      {children}
    </span>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
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
  const homepage = getHomepage();
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
      <Hero
        title={homepage.hero_title}
        subtitle={homepage.hero_subtitle}
        image={heroImage}
        telegram={contacts.telegram}
      />

      {/* Stats */}
      <section className="border-y border-border bg-surface-2/60">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-8 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
          {homepage.stats.map((stat, index) => (
            <Reveal
              key={`${stat.label}-${index}`}
              delay={index * 90}
              className="px-2 text-center"
            >
              <p className="font-serif text-5xl font-semibold text-gold-gradient">
                {stat.value}
                {stat.suffix ? <span className="text-3xl">{stat.suffix}</span> : null}
              </p>
              <p className="mt-2 text-sm text-muted">{stat.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Featured kittens */}
      <section className="mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow>В продаже</Eyebrow>
            <h2 className="mt-4 font-serif text-4xl font-semibold text-foreground sm:text-5xl">
              Наши котята
            </h2>
          </div>
          <Link
            href="/kittens"
            className="link-underline hidden shrink-0 text-sm text-muted hover:text-accent sm:block"
          >
            Смотреть всех →
          </Link>
        </Reveal>

        {featuredKittens.length === 0 ? (
          <Reveal className="mt-12 rounded-4xl border border-dashed border-border-strong bg-card p-12 text-center text-muted">
            Свободные котята скоро появятся. Загляните позже или напишите нам —
            расскажем о ближайших планах.
          </Reveal>
        ) : (
          <Stagger className="mt-12 grid gap-7 md:grid-cols-2 xl:grid-cols-3">
            {featuredKittens.map((kitten) => (
              <StaggerItem key={kitten.slug}>
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
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </section>

      {/* Features */}
      <section className="border-y border-border bg-surface-2/50">
        <div className="mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <Reveal className="max-w-2xl">
            <Eyebrow>Почему мы</Eyebrow>
            <h2 className="mt-4 font-serif text-4xl font-semibold text-foreground sm:text-5xl">
              {homepage.features_title}
            </h2>
          </Reveal>
          <Stagger className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {homepage.features.map((feature, index) => (
              <StaggerItem key={`${feature.title}-${index}`}>
                <div className="h-full rounded-4xl border border-border bg-card p-7 shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:border-accent/40 hover:shadow-lift">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-6 w-6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      {featureIcons[index % featureIcons.length]}
                    </svg>
                  </div>
                  <h3 className="mt-5 text-lg font-medium text-foreground">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-muted">{feature.text}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Breed intro */}
      <section className="mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal direction="right" className="relative">
            <div className="relative aspect-[5/6] overflow-hidden rounded-5xl shadow-lift">
              <Image
                src={gallery[1] ?? heroImage}
                alt="Ориентальная кошка крупным планом"
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/30 to-transparent" />
            </div>
            <div className="absolute -left-4 -top-4 hidden h-28 w-28 rounded-4xl border border-border-strong lg:block" />
          </Reveal>

          <div>
            <Reveal>
              <Eyebrow>Порода</Eyebrow>
              <h2 className="mt-4 font-serif text-4xl font-semibold text-foreground sm:text-5xl">
                {homepage.breed_title}
              </h2>
              <p className="mt-5 max-w-lg text-lg leading-8 text-muted text-pretty">
                {homepage.breed_text}
              </p>
            </Reveal>
            <Stagger className="mt-8 space-y-4">
              {homepage.breed_traits.map((trait, index) => (
                <StaggerItem key={`${trait.title}-${index}`}>
                  <div className="flex gap-4 rounded-3xl border border-border bg-card/70 p-5 shadow-soft">
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                      <CheckIcon />
                    </span>
                    <div>
                      <h3 className="font-medium text-foreground">{trait.title}</h3>
                      <p className="mt-1 text-sm leading-7 text-muted">{trait.text}</p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
            <Reveal delay={120}>
              <Link
                href="/breed"
                className="mt-8 inline-flex items-center gap-2 rounded-full border border-border-strong bg-card/60 px-7 py-3.5 text-sm font-medium text-foreground transition-colors hover:border-accent hover:text-accent"
              >
                Узнать о породе больше
                <ArrowIcon />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="border-y border-border bg-surface-2/50">
        <div className="mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <Reveal>
            <Eyebrow>Галерея</Eyebrow>
            <h2 className="mt-4 font-serif text-4xl font-semibold text-foreground sm:text-5xl">
              Жизнь в питомнике
            </h2>
          </Reveal>
          <Reveal className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4 md:grid-rows-2">
            <div className="group relative col-span-2 row-span-2 aspect-square overflow-hidden rounded-4xl md:aspect-auto">
              <Image
                src={gallery[0]}
                alt="Жизнь питомника OrioKerg"
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </div>
            {gallery.slice(1).map((photo, index) => (
              <div
                key={`${photo}-${index}`}
                className="group relative aspect-square overflow-hidden rounded-4xl"
              >
                <Image
                  src={photo}
                  alt="Питомец OrioKerg"
                  fill
                  sizes="(min-width: 768px) 25vw, 50vw"
                  className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
                />
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Steps — warm dark band */}
      <section className="relative overflow-hidden bg-ink text-ink-foreground">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-[-3%] top-1/2 hidden -translate-y-1/2 select-none font-serif text-[12rem] leading-none text-ink-foreground/[0.05] lg:block xl:text-[16rem]"
        >
          ✦
        </span>
        <div className="relative mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <Reveal className="max-w-2xl">
            <span className="inline-flex items-center gap-2 text-sm uppercase tracking-luxe text-accent-soft">
              <span className="h-px w-8 bg-accent-soft/60" />
              Просто
            </span>
            <h2 className="mt-4 font-serif text-4xl font-semibold sm:text-5xl">
              {homepage.steps_title}
            </h2>
          </Reveal>
          <Stagger className="mt-14 grid gap-10 md:grid-cols-4">
            {homepage.steps.map((step, index) => (
              <StaggerItem key={`${step.title}-${index}`}>
                <span className="font-serif text-6xl font-semibold text-gold-gradient">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 text-lg font-medium">{step.title}</h3>
                <p className="mt-2 text-sm leading-7 text-ink-foreground/70">
                  {step.text}
                </p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Reviews */}
      <section className="mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <Reveal className="text-center">
          <div className="flex justify-center">
            <Eyebrow>Отзывы</Eyebrow>
          </div>
          <h2 className="mt-4 font-serif text-4xl font-semibold text-foreground sm:text-5xl">
            {homepage.reviews_title}
          </h2>
        </Reveal>
        <Stagger className="mt-14 grid gap-6 md:grid-cols-3">
          {homepage.reviews.map((review, index) => (
            <StaggerItem key={`${review.name}-${index}`}>
              <figure className="flex h-full flex-col rounded-4xl border border-border bg-card p-7 shadow-soft">
                <Stars />
                <blockquote className="mt-4 flex-1 text-[15px] leading-7 text-foreground/80">
                  «{review.text}»
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-accent-soft to-accent-strong font-medium text-accent-foreground">
                    {review.name.charAt(0) || "★"}
                  </span>
                  <div className="text-sm">
                    <p className="font-medium text-foreground">{review.name}</p>
                    <p className="text-muted">{review.city}</p>
                  </div>
                </figcaption>
              </figure>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* CTA */}
      <section className="mx-auto w-full max-w-7xl px-4 pb-28 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-5xl bg-gradient-to-br from-accent via-accent to-accent-strong px-6 py-20 text-center text-accent-foreground shadow-glow sm:px-10">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-accent-foreground/10 blur-2xl"
            />
            <h2 className="mx-auto max-w-2xl font-serif text-4xl font-semibold text-balance sm:text-5xl">
              {homepage.cta_title}
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-accent-foreground/85">
              {homepage.cta_text}
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <a
                href={contacts.telegram}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2.5 rounded-full bg-card px-8 py-4 text-sm font-medium text-accent-strong transition-transform duration-200 hover:-translate-y-0.5"
              >
                <TelegramIcon className="h-5 w-5" />
                Telegram
              </a>
              <a
                href={contacts.vk}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2.5 rounded-full border border-accent-foreground/40 px-8 py-4 text-sm text-accent-foreground transition-colors hover:bg-accent-foreground/10"
              >
                <VkIcon className="h-5 w-5" />
                ВКонтакте
              </a>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
