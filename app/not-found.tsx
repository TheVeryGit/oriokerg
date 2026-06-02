import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Страница не найдена",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="relative overflow-hidden">
      <div className="mobile-no-decor pointer-events-none absolute -right-20 -top-16 h-72 w-72 rounded-full bg-accent/12 blur-3xl" />
      <div className="mobile-no-decor pointer-events-none absolute -left-20 top-48 h-72 w-72 rounded-full bg-emerald/10 blur-3xl" />

      <div className="mx-auto flex w-full max-w-2xl flex-col items-center px-4 py-24 text-center sm:px-6 lg:py-32">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-accent/10 text-accent">
          <svg
            viewBox="0 0 24 24"
            className="h-11 w-11"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M12 9c-3.5 0-6 2.6-6 5.3 0 1.6 1.3 2.7 3 2.7.9 0 1.7-.3 3-.3s2.1.3 3 .3c1.7 0 3-1.1 3-2.7C18 11.6 15.5 9 12 9Zm-6.5-.5A1.8 1.8 0 1 0 4 6.4a4 4 0 0 0 1.5 2.1Zm13 0A4 4 0 0 0 20 6.4a1.8 1.8 0 1 0-1.5 2.1ZM9 7.2A1.8 1.8 0 1 0 7.4 4 4 4 0 0 0 9 7.2Zm6 0A4 4 0 0 0 16.6 4 1.8 1.8 0 1 0 15 7.2Z" />
          </svg>
        </span>

        <p className="mt-8 font-serif text-7xl font-semibold text-gold-gradient sm:text-8xl">
          404
        </p>
        <h1 className="mt-4 font-serif text-3xl font-semibold text-foreground sm:text-4xl">
          Котёнок убежал с этой страницы
        </h1>
        <p className="mx-auto mt-4 max-w-md text-muted">
          Такой страницы нет или она переехала. Давайте вернёмся туда, где живут
          наши малыши.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/kittens"
            className="beam-btn rounded-full bg-gradient-to-br from-accent to-accent-strong px-7 py-3.5 text-sm font-medium text-accent-foreground shadow-glow transition-transform duration-200 hover:-translate-y-0.5"
          >
            Посмотреть котят
          </Link>
          <Link
            href="/"
            className="rounded-full border border-border-strong bg-card px-7 py-3.5 text-sm font-medium text-foreground transition-colors hover:border-accent hover:text-accent"
          >
            На главную
          </Link>
        </div>
      </div>
    </div>
  );
}
