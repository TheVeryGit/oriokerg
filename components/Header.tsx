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
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/logo-mark.png"
              alt=""
              aria-hidden="true"
              className="h-10 w-auto shrink-0 transition-transform duration-300 group-hover:scale-105"
            />
            <span className="font-serif text-2xl font-semibold tracking-[0.02em] text-foreground sm:text-[1.7rem]">
              Orio<span className="text-accent-soft">Kerg</span>
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
              data-ym-goal="cta_choose"
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
          <div className="mt-2 flex flex-col gap-1 rounded-lg border border-border bg-surface p-3 shadow-lift">
            {navigation.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  tabIndex={isOpen ? 0 : -1}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-lg px-4 py-3 text-base transition-colors ${
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
              data-ym-goal="cta_choose"
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
