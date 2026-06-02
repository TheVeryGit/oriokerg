import type { Metadata } from "next";
import Image from "next-export-optimize-images/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ContactButtons } from "@/components/ContactButtons";
import { PhotoGallery } from "@/components/PhotoGallery";
import { Reveal } from "@/components/Reveal";
import type { ContactsSettings } from "@/lib/content";
import { formatPrice, getCatBySlug, getCats, getSettings } from "@/lib/content";

type CatPageProps = {
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
  const cats = getCats();
  if (cats.length === 0) {
    return [{ slug: placeholderSlug }];
  }
  return cats.map((cat) => ({ slug: cat.slug }));
}

export function generateMetadata({ params }: CatPageProps): Metadata {
  const cat = getCatBySlug(decodeSlug(params.slug));
  if (!cat) return { title: "Кошка" };
  const description =
    cat.description ||
    `${cat.name}: ${cat.type}, окрас ${cat.color}. Питомник OrioKerg.`;
  const image = cat.photos[0];
  return {
    title: `${cat.name} — ${cat.type}`,
    description,
    alternates: { canonical: `/cats/${encodeURIComponent(cat.slug)}/` },
    openGraph: {
      title: `${cat.name} — ${cat.type}`,
      description,
      type: "article",
      ...(image ? { images: [{ url: image, alt: cat.name }] } : {}),
    },
    ...(image ? { twitter: { card: "summary_large_image", images: [image] } } : {}),
  };
}

function InfoRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border py-3.5 last:border-0">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="text-sm font-medium text-foreground">{value}</dd>
    </div>
  );
}

export default function CatPage({ params }: CatPageProps) {
  const slug = decodeSlug(params.slug);
  const cat = getCatBySlug(slug);

  if (!cat && slug === placeholderSlug) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="rounded-5xl border border-border bg-card p-10 text-center shadow-soft">
          <h1 className="font-serif text-3xl font-semibold text-foreground">
            Страница появится позже
          </h1>
          <p className="mt-4 text-muted">
            Технический placeholder для статической сборки, пока в админке нет
            опубликованных кошек.
          </p>
          <Link
            href="/cats"
            className="mt-8 inline-flex rounded-full bg-gradient-to-br from-accent to-accent-strong px-7 py-3.5 text-sm font-medium text-accent-foreground shadow-glow"
          >
            К списку кошек
          </Link>
        </div>
      </div>
    );
  }

  if (!cat) {
    notFound();
  }

  const contacts = getSettings<ContactsSettings>("contacts");
  const price = formatPrice(cat.price);
  const related = getCats()
    .filter((item) => item.slug !== cat.slug)
    .slice(0, 3);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <Breadcrumbs
        visual={false}
        items={[
          { name: "Главная", href: "/" },
          { name: "Наши кошки", href: "/cats" },
          { name: cat.name },
        ]}
      />
      <Reveal>
        <Link
          href="/cats"
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
          Все кошки
        </Link>
      </Reveal>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.25fr_0.75fr]">
        <Reveal>
          <PhotoGallery photos={cat.photos} alt={cat.name} />
        </Reveal>

        <Reveal delay={120} className="h-full">
          <aside className="h-full">
            <div className="flex h-full flex-col rounded-5xl border border-border bg-card p-8 shadow-lift">
              <span className="inline-flex rounded-full bg-accent/12 px-3 py-1 text-xs font-medium text-accent-strong">
                {cat.type}
              </span>
              <h1 className="mt-5 font-serif text-4xl font-semibold text-foreground">
                {cat.name}
              </h1>
              {price ? (
                <p className="mt-3 font-serif text-3xl font-semibold text-gold-gradient">
                  {price} ₽
                </p>
              ) : null}

              <dl className="mt-7">
                <InfoRow label="Пол" value={cat.gender} />
                <InfoRow label="Окрас" value={cat.color} />
                {cat.bodyType ? (
                  <InfoRow label="Тип" value={cat.bodyType} />
                ) : null}
                <InfoRow
                  label="Статус"
                  value={
                    cat.available ? (
                      <span className="inline-flex items-center gap-1.5 text-emerald">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald" />
                        Доступна
                      </span>
                    ) : (
                      "Недоступна"
                    )
                  }
                />
              </dl>

              <ContactButtons
                telegram={contacts.telegram}
                vk={contacts.vk}
                phone={contacts.phone}
                className="mt-auto pt-7 sm:flex-col"
              />
            </div>
          </aside>
        </Reveal>
      </div>

      <Reveal className="mt-12">
        <div className="rounded-5xl border border-border bg-card/70 p-8 shadow-soft sm:p-10">
          <h2 className="font-serif text-2xl font-semibold text-foreground">
            Описание
          </h2>
          <p className="mt-5 max-w-3xl text-base leading-8 text-muted text-pretty">
            {cat.description || "Описание пока не добавлено."}
          </p>
        </div>
      </Reveal>

      {related.length > 0 ? (
        <section className="mt-20">
          <Reveal>
            <h2 className="font-serif text-3xl font-semibold text-foreground sm:text-4xl">
              Другие кошки
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-7 md:grid-cols-3">
            {related.map((item, index) => (
              <Reveal key={item.slug} delay={index * 90}>
                <Link
                  href={`/cats/${item.slug}`}
                  className="group flex items-center gap-4 rounded-4xl border border-border bg-card p-4 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-lift"
                >
                  <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-accent/5">
                    {item.photos[0] ? (
                      <Image
                        src={item.photos[0]}
                        alt={item.name}
                        fill
                        sizes="64px"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : null}
                  </span>
                  <span>
                    <span className="block font-serif text-xl font-semibold text-foreground">
                      {item.name}
                    </span>
                    <span className="block text-sm text-muted">{item.color}</span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
