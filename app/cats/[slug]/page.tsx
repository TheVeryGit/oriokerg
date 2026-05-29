import Link from "next/link";
import { notFound } from "next/navigation";

import { PhotoGallery } from "@/components/PhotoGallery";
import type { ContactsSettings } from "@/lib/content";
import { formatPrice, getCatBySlug, getCats, getSettings } from "@/lib/content";

type CatPageProps = {
  params: {
    slug: string;
  };
};

const placeholderSlug = "__placeholder__";

export const dynamicParams = false;

export async function generateStaticParams() {
  const cats = getCats();

  if (cats.length === 0) {
    return [{ slug: placeholderSlug }];
  }

  return cats.map((cat) => ({
    slug: cat.slug,
  }));
}

export default function CatPage({ params }: CatPageProps) {
  const cat = getCatBySlug(params.slug);

  if (!cat && params.slug === placeholderSlug) {
    return (
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <section className="rounded-[2rem] border border-border bg-card p-8 sm:p-10">
          <p className="text-sm uppercase tracking-[0.28em] text-accent">
            Карточка будет доступна позже
          </p>
          <h1 className="mt-4 text-4xl font-semibold text-foreground">
            Страница кошки появится после первой публикации в CMS
          </h1>
          <p className="mt-6 text-base leading-8 text-muted">
            Это технический placeholder для корректной статической сборки в
            режиме `output: &quot;export&quot;`, пока в `content/cats` еще нет markdown-
            файлов с реальными slug.
          </p>
          <div className="mt-8">
            <Link href="/cats" className="text-sm text-accent hover:text-foreground">
              Вернуться к списку кошек
            </Link>
          </div>
        </section>
      </div>
    );
  }

  if (!cat) {
    notFound();
  }

  const contacts = getSettings<ContactsSettings>("contacts");
  const price = formatPrice(cat.price);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <PhotoGallery photos={cat.photos} alt={cat.name} />

        <aside className="rounded-[2rem] border border-border bg-card p-8">
          <p className="text-sm uppercase tracking-[0.28em] text-accent">
            {cat.type}
          </p>
          <h1 className="mt-4 font-serif text-4xl font-semibold text-foreground">
            {cat.name}
          </h1>

          <dl className="mt-8 space-y-4 text-sm text-muted">
            <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
              <dt>Пол</dt>
              <dd className="text-foreground">{cat.gender}</dd>
            </div>
            <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
              <dt>Окрас</dt>
              <dd className="text-foreground">{cat.color}</dd>
            </div>
            <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
              <dt>Статус</dt>
              <dd className="text-foreground">
                {cat.available ? "Доступен" : "Недоступен"}
              </dd>
            </div>
            {price ? (
              <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
                <dt>Цена</dt>
                <dd className="text-foreground">{price} ₽</dd>
              </div>
            ) : null}
          </dl>

          <div className="mt-8 flex flex-col gap-3">
            <a
              href={contacts.telegram}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-accent bg-accent px-6 py-3 text-sm font-medium text-accent-foreground"
            >
              Написать в Telegram
            </a>
            <a
              href={contacts.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-border bg-background px-6 py-3 text-sm font-medium text-foreground hover:border-accent hover:text-accent"
            >
              WhatsApp
            </a>
          </div>
        </aside>
      </div>

      <section className="rounded-[2rem] border border-border bg-card p-8">
        <h2 className="text-2xl font-semibold text-foreground">Описание</h2>
        <p className="mt-5 max-w-3xl text-base leading-8 text-muted">
          {cat.description || "Описание пока не добавлено."}
        </p>
        <div className="mt-8">
          <Link href="/cats" className="text-sm text-accent hover:text-foreground">
            Вернуться к списку кошек
          </Link>
        </div>
      </section>
    </div>
  );
}
