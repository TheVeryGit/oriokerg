import Link from "next/link";

import { PhoneIcon, TelegramIcon, VkIcon, telHref } from "@/components/icons";
import type { ContactsSettings } from "@/lib/content";
import { formatPhone, isRealPhone } from "@/lib/format";

type FooterProps = {
  contacts: ContactsSettings;
};

const navColumns = [
  {
    title: "Питомник",
    links: [
      { href: "/about", label: "О питомнике" },
      { href: "/breed", label: "Порода ориентал" },
      { href: "/cats", label: "Наши кошки" },
    ],
  },
  {
    title: "Котята",
    links: [
      { href: "/kittens", label: "Котята в продаже" },
      { href: "/faq", label: "Вопросы и ответы" },
      { href: "/contacts", label: "Контакты" },
    ],
  },
];

export function Footer({ contacts }: FooterProps) {
  const tel = telHref(contacts.phone);
  const phoneOk = isRealPhone(contacts.phone);

  const social = [
    { href: contacts.telegram, label: "Telegram", Icon: TelegramIcon, external: true },
    { href: contacts.vk, label: "ВКонтакте", Icon: VkIcon, external: true },
    ...(phoneOk
      ? [{ href: tel, label: "Телефон", Icon: PhoneIcon, external: false }]
      : []),
  ];

  return (
    <footer className="relative mt-10 overflow-hidden bg-ink text-ink-foreground">
      <div className="relative mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <p className="font-serif text-2xl font-semibold tracking-[0.02em]">
              Orio<span className="text-accent-soft">Kerg</span>
            </p>
            <p className="mt-3 max-w-xs text-sm leading-7 text-ink-foreground/70">
              Питомник ориентальных кошек. Здоровые котята с документами,
              прививками и поддержкой на всю жизнь.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {social.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noreferrer" : undefined}
                  aria-label={item.label}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-ink-foreground/15 text-ink-foreground/80 transition-all hover:-translate-y-0.5 hover:border-accent-soft hover:text-accent-soft"
                >
                  <item.Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {navColumns.map((column) => (
            <div key={column.title}>
              <p className="text-xs uppercase tracking-luxe text-accent-soft">
                {column.title}
              </p>
              <ul className="mt-5 space-y-3 text-sm">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-ink-foreground/70 transition-colors hover:text-ink-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <p className="text-xs uppercase tracking-luxe text-accent-soft">
              Связаться
            </p>
            <a
              href={contacts.telegram}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent-strong px-6 py-3.5 text-sm font-medium text-accent-foreground shadow-glow transition-transform hover:-translate-y-0.5"
            >
              Написать в Telegram
            </a>
            {phoneOk ? (
              <a
                href={tel}
                className="mt-3 block text-center text-sm text-ink-foreground/70 transition-colors hover:text-ink-foreground"
              >
                {formatPhone(contacts.phone)}
              </a>
            ) : null}
            {contacts.address ? (
              <p className="mt-3 text-center text-sm text-ink-foreground/55">
                {contacts.address}
              </p>
            ) : null}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-ink-foreground/10 pt-6 text-sm text-ink-foreground/55 md:flex-row md:items-center md:justify-between">
          <p>&copy; {new Date().getFullYear()} OrioKerg. Все права защищены.</p>
          <div className="flex items-center gap-4">
            <Link
              href="/privacy"
              className="transition-colors hover:text-ink-foreground"
            >
              Политика конфиденциальности
            </Link>
            <span className="hidden md:inline">·</span>
            <span>Москва · Россия</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
