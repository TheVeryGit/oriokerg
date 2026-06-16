import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import type { ReactNode } from "react";

import { AnimalCard } from "@/components/AnimalCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ContactButtons } from "@/components/ContactButtons";
import { TelegramIcon } from "@/components/icons";
import { JsonLd } from "@/components/JsonLd";
import { KittenAge } from "@/components/KittenAge";
import { PhotoGallery } from "@/components/PhotoGallery";
import { Reveal } from "@/components/Reveal";
import { ShareButtons } from "@/components/ShareButtons";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import type { ContactsSettings } from "@/lib/content";
import { getKittenBySlug, getKittens, getSettings } from "@/lib/content";
import { formatBirthDate, kittenPriceLines, telegramWith } from "@/lib/format";

type KittenPageProps = {
  params: { slug: string };
};

const placeholderSlug = "__placeholder__";

// In `output: export`, non-ASCII (Cyrillic) route params arrive percent-encoded
// at prerender time, so we must decode before matching the markdown slug.
function decodeSlug(raw: string) {
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

export const dynamicParams = false;

export async function generateStaticParams() {
  const kittens = getKittens();
  if (kittens.length === 0) {
    return [{ slug: placeholderSlug }];
  }
  return kittens.map((kitten) => ({ slug: kitten.slug }));
}

export function generateMetadata({ params }: KittenPageProps): Metadata {
  const kitten = getKittenBySlug(decodeSlug(params.slug));
  if (!kitten) return { title: "Котёнок" };
  const traits = [kitten.gender, kitten.color]
    .filter((t) => t && t !== "Не указан")
    .join(", ");
  const description = `Ориентальный котёнок ${kitten.name}${
    traits ? ` — ${traits}` : ""
  }. Документы WCF, прививки, поддержка. Питомник OrioKerg, Москва — купить или забронировать.${
    kitten.description ? ` ${kitten.description}` : ""
  }`;
  const image = kitten.photos[0];
  return {
    title: `${kitten.name} — ориентальный котёнок${traits ? ` (${traits})` : ""} в Москве`,
    description,
    alternates: { canonical: `/kittens/${encodeURIComponent(kitten.slug)}/` },
    openGraph: {
      title: `${kitten.name} — ориентальный котёнок`,
      description,
      type: "article",
      ...(image ? { images: [{ url: image, alt: kitten.name }] } : {}),
    },
    ...(image ? { twitter: { card: "summary_large_image", images: [image] } } : {}),
  };
}

function InfoRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border py-3.5 last:border-0">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="text-right text-sm font-medium text-foreground">{value}</dd>
    </div>
  );
}

export default function KittenPage({ params }: KittenPageProps) {
  const slug = decodeSlug(params.slug);
  const kitten = getKittenBySlug(slug);

  if (!kitten && slug === placeholderSlug) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="rounded-5xl border border-border bg-card p-10 text-center shadow-soft">
          <h1 className="font-serif text-3xl font-semibold text-foreground">
            Котята скоро появятся
          </h1>
          <p className="mt-4 text-muted">
            Здесь будут страницы малышей после первой публикации в админке.
          </p>
          <Link
            href="/kittens"
            className="mt-8 inline-flex rounded-full bg-gradient-to-br from-accent to-accent-strong px-7 py-3.5 text-sm font-medium text-accent-foreground shadow-glow"
          >
            К списку котят
          </Link>
        </div>
      </div>
    );
  }

  if (!kitten) {
    notFound();
  }

  const contacts = getSettings<ContactsSettings>("contacts");
  const tgMessage = `Здравствуйте! Интересует котёнок ${kitten.name}`;
  const priceLines = kittenPriceLines(kitten.pricePet, kitten.priceBreed);
  const related = getKittens()
    .filter((item) => item.slug !== kitten.slug && !item.reserved)
    .slice(0, 3);

  const offerPrice = kitten.pricePet ?? kitten.priceBreed;
  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: kitten.name,
    description:
      kitten.description ||
      `Ориентальный котёнок ${kitten.name}, окрас: ${kitten.color}.`,
    category: "Ориентальная кошка",
    ...(kitten.photos.length
      ? { image: kitten.photos.map((p) => `https://oriokerg.ru${p}`) }
      : {}),
    ...(offerPrice
      ? {
          offers: {
            "@type": "Offer",
            price: offerPrice,
            priceCurrency: "RUB",
            availability: kitten.reserved
              ? "https://schema.org/SoldOut"
              : "https://schema.org/InStock",
            url: `https://oriokerg.ru/kittens/${encodeURIComponent(kitten.slug)}/`,
          },
        }
      : {}),
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <JsonLd data={productLd} />
      <Breadcrumbs
        visual={false}
        items={[
          { name: "Главная", href: "/" },
          { name: "Котята", href: "/kittens" },
          { name: kitten.name },
        ]}
      />
      <Reveal>
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/kittens"
            className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-accent"
          >
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
              <path d="M19 12H5M11 18l-6-6 6-6" />
            </svg>
            Все котята
          </Link>
          <ShareButtons title={`${kitten.name} — ориентальный котёнок`} />
        </div>
      </Reveal>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.25fr_0.75fr]">
        <div>
          <PhotoGallery photos={kitten.photos} alt={kitten.name} />
        </div>

        <div className="h-full">
          <aside className="h-full">
            <div className="flex h-full flex-col rounded-5xl border border-border bg-card p-8 shadow-lift">
              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                    kitten.reserved
                      ? "bg-ink/85 text-ink-foreground"
                      : "bg-emerald/12 text-emerald"
                  }`}
                >
                  {!kitten.reserved ? (
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald" />
                  ) : null}
                  {kitten.reserved ? "Зарезервирован" : "Свободен"}
                </span>
                <span className="text-xs uppercase tracking-luxe text-muted">
                  {kitten.gender}
                </span>
              </div>

              <h1 className="mt-5 font-serif text-4xl font-semibold text-foreground">
                {kitten.name}
              </h1>

              <div className="mt-4 space-y-2">
                {priceLines.map((line, index) => (
                  <div
                    key={`${line.label ?? "price"}-${index}`}
                    className="flex items-baseline justify-between gap-4 rounded-lg bg-surface-2/60 px-4 py-2.5"
                  >
                    <span className="text-sm text-muted">
                      {line.label ?? "Стоимость"}
                    </span>
                    <span className="font-serif text-2xl font-semibold text-gold-gradient">
                      {line.value}
                    </span>
                  </div>
                ))}
              </div>

              <dl className="mt-7">
                <InfoRow label="Пол" value={kitten.gender} />
                <InfoRow label="Окрас" value={kitten.color} />
                {kitten.bodyType ? (
                  <InfoRow label="Тип" value={kitten.bodyType} />
                ) : null}
                {kitten.birthDate ? (
                  <InfoRow
                    label="Возраст"
                    value={<KittenAge birthDate={kitten.birthDate} />}
                  />
                ) : null}
                {kitten.birthDate ? (
                  <InfoRow
                    label="Дата рождения"
                    value={formatBirthDate(kitten.birthDate)}
                  />
                ) : null}
                {kitten.mother ? (
                  <InfoRow label="Мама" value={kitten.mother} />
                ) : null}
                {kitten.father ? (
                  <InfoRow label="Папа" value={kitten.father} />
                ) : null}
                <InfoRow
                  label="Статус"
                  value={kitten.reserved ? "Зарезервирован" : "Свободен"}
                />
              </dl>

              <ContactButtons
                telegram={contacts.telegram}
                vk={contacts.vk}
                phone={contacts.phone}
                message={tgMessage}
                className="mt-auto pt-7 sm:flex-col"
              />
              <p className="mt-4 text-center text-xs text-muted">
                Ответим, пришлём фото и видео малыша
              </p>
            </div>
          </aside>
        </div>
      </div>

      {kitten.description ? (
        <Reveal className="mt-12">
          <div className="rounded-5xl border border-border bg-card/70 p-8 shadow-soft sm:p-10">
            <h2 className="font-serif text-2xl font-semibold text-foreground">
              О котёнке
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-8 text-muted text-pretty">
              {kitten.description}
            </p>
          </div>
        </Reveal>
      ) : null}

      {related.length > 0 ? (
        <section className="mt-20">
          <Reveal>
            <h2 className="font-serif text-3xl font-semibold text-foreground sm:text-4xl">
              Другие котята
            </h2>
          </Reveal>
          <Stagger className="mt-10 grid gap-7 md:grid-cols-2 xl:grid-cols-3">
            {related.map((item) => (
              <StaggerItem key={item.slug}>
                <AnimalCard
                  href={`/kittens/${item.slug}`}
                  name={item.name}
                  photo={item.photos[0]}
                  subtitle={item.gender}
                  birthDate={item.birthDate}
                  prices={kittenPriceLines(item.pricePet, item.priceBreed)}
                  badge={{ label: "Свободен", tone: "free" }}
                />
              </StaggerItem>
            ))}
          </Stagger>
        </section>
      ) : null}

      {/* Запас снизу, чтобы липкая моб-кнопка не перекрывала контент */}
      <div className="h-20 lg:hidden" aria-hidden="true" />

      {/* Липкая кнопка связи на мобиле — всегда под пальцем */}
      {contacts.telegram ? (
        <a
          href={telegramWith(contacts.telegram, tgMessage)}
          target="_blank"
          rel="noreferrer"
          className="fixed inset-x-3 bottom-3 z-30 inline-flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-br from-accent to-accent-strong px-6 py-4 text-sm font-medium text-accent-foreground shadow-glow lg:hidden"
        >
          <TelegramIcon className="h-5 w-5" />
          Спросить про {kitten.name}
        </a>
      ) : null}
    </div>
  );
}
