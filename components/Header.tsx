"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type NavLink = { href: string; label: string };

const navigation: NavLink[] = [
  { href: "/", label: "Главная" },
  { href: "/kittens", label: "Котята" },
  { href: "/cats", label: "Наши кошки" },
  { href: "/breed", label: "Порода" },
  { href: "/about", label: "О питомнике" },
  { href: "/faq", label: "FAQ" },
  { href: "/contacts", label: "Контакты" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50">
      <div className="relative mx-auto w-full max-w-7xl px-3 pt-3 sm:px-4 sm:pt-4 lg:px-6">
        {/* Floating pill */}
        <div
          className={`flex items-center justify-between gap-4 rounded-full border px-3 py-2 transition-all duration-300 sm:px-4 ${
            scrolled
              ? "border-border bg-surface/[0.97] shadow-lift sm:bg-surface/95 sm:backdrop-blur-xl"
              : "border-border/80 bg-surface/95 shadow-soft sm:bg-surface/85 sm:backdrop-blur-md"
          }`}
        >
          <Link
            href="/"
            className="group flex items-center gap-2.5 pl-1"
            aria-label="OrioKerg — на главную"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-accent-soft to-accent-strong text-accent-foreground shadow-soft transition-transform duration-300 group-hover:scale-105">
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
                <path d="M12 9c-3.5 0-6 2.6-6 5.3 0 1.6 1.3 2.7 3 2.7.9 0 1.7-.3 3-.3s2.1.3 3 .3c1.7 0 3-1.1 3-2.7C18 11.6 15.5 9 12 9Zm-6.5-.5A1.8 1.8 0 1 0 4 6.4a4 4 0 0 0 1.5 2.1Zm13 0A4 4 0 0 0 20 6.4a1.8 1.8 0 1 0-1.5 2.1ZM9 7.2A1.8 1.8 0 1 0 7.4 4 4 4 0 0 0 9 7.2Zm6 0A4 4 0 0 0 16.6 4 1.8 1.8 0 1 0 15 7.2Z" />
              </svg>
            </span>
            <span className="font-serif text-xl font-semibold tracking-[0.2em] text-foreground transition-colors group-hover:text-accent sm:text-2xl">
              ORIOKERG
            </span>
          </Link>

          <nav className="hidden items-center gap-6 lg:flex xl:gap-7">
            {navigation.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  data-active={active}
                  aria-current={active ? "page" : undefined}
                  className={`link-underline whitespace-nowrap text-sm transition-colors ${
                    active ? "text-foreground" : "text-muted hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2.5">
            <Link
              href="/kittens"
              className="hidden rounded-full bg-gradient-to-br from-accent to-accent-strong px-5 py-2.5 text-sm font-medium text-accent-foreground shadow-glow transition-transform duration-200 hover:-translate-y-0.5 lg:inline-flex"
            >
              Выбрать котёнка
            </Link>

            <button
              type="button"
              aria-expanded={isOpen}
              aria-label={isOpen ? "Закрыть меню" : "Открыть меню"}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors hover:border-accent hover:text-accent lg:hidden"
              onClick={() => setIsOpen((open) => !open)}
            >
              <span className="sr-only">Меню</span>
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              >
                {isOpen ? (
                  <>
                    <path d="M6 6L18 18" />
                    <path d="M18 6L6 18" />
                  </>
                ) : (
                  <>
                    <path d="M4 7H20" />
                    <path d="M4 12H20" />
                    <path d="M4 17H20" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu — абсолютный оверлей (не занимает место в потоке когда
            закрыт). GPU-плавно через opacity + translate. */}
        <nav
          aria-hidden={!isOpen}
          className={`absolute inset-x-3 top-full z-50 origin-top transition-[opacity,transform] duration-200 ease-out sm:inset-x-4 lg:hidden ${
            isOpen
              ? "pointer-events-auto translate-y-0 opacity-100"
              : "pointer-events-none -translate-y-2 opacity-0"
          }`}
        >
          <div className="mt-2 flex flex-col gap-1 rounded-3xl border border-border bg-surface p-3 shadow-lift">
            {navigation.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  tabIndex={isOpen ? 0 : -1}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-2xl px-4 py-3 text-base transition-colors ${
                    active
                      ? "bg-accent/10 text-foreground"
                      : "text-muted hover:bg-accent/5 hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/kittens"
              tabIndex={isOpen ? 0 : -1}
              className="mt-1 rounded-full bg-gradient-to-br from-accent to-accent-strong px-6 py-3.5 text-center text-sm font-medium text-accent-foreground shadow-glow"
            >
              Выбрать котёнка
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
