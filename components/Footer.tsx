import Link from "next/link";

import type { ContactsSettings } from "@/lib/content";

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
      { href: "/contacts", label: "Как забрать" },
      { href: "/contacts", label: "Контакты" },
    ],
  },
];

export function Footer({ contacts }: FooterProps) {
  const tel = `tel:${(contacts.phone ?? "").replace(/[^\d+]/g, "")}`;

  const social = [
    {
      href: contacts.telegram,
      label: "Telegram",
      icon: (
        <path d="M21.2 4.6 18.3 18c-.2 1-.8 1.2-1.7.8l-4.3-3.2-2.1 2c-.2.2-.4.4-.9.4l.3-4.4 8-7.2c.3-.3-.1-.5-.5-.2l-9.9 6.2-4.3-1.3c-.9-.3-1-.9.2-1.4L19.5 3c.8-.3 1.5.2 1.2 1.6Z" />
      ),
    },
    {
      href: contacts.whatsapp,
      label: "WhatsApp",
      icon: (
        <path d="M19.1 4.9A9.9 9.9 0 0 0 3.5 17.1L2 22l5-1.3a9.9 9.9 0 0 0 4.8 1.2h.1A10 10 0 0 0 22 12c0-2.7-1-5.2-2.9-7.1Zm-7.2 15.3a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3a8.3 8.3 0 1 1 6.9 3.7Zm4.6-6.2c-.2-.1-1.5-.8-1.7-.9-.2-.1-.4-.1-.6.1l-.8.9c-.1.1-.3.2-.5.1-.2-.1-1-.4-1.8-1.1-.7-.6-1.1-1.3-1.3-1.5-.1-.2 0-.4.1-.5l.4-.5.3-.4c.1-.1.1-.3 0-.4l-.7-1.8c-.2-.4-.4-.4-.6-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 2 0 1.2.8 2.4.9 2.6.1.2 1.7 2.7 4.1 3.7.6.3 1.1.5 1.5.6.6.2 1.2.2 1.6.1.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2-.1-.1-.3-.2-.5-.3Z" />
      ),
    },
    {
      href: tel,
      label: "Телефон",
      icon: (
        <path d="M7.3 3.5c.4-1 1.5-1.5 2.5-1.1l2 1c.9.4 1.4 1.5 1.1 2.4l-.7 2c-.2.5 0 1.1.3 1.5l2 2c.4.4 1 .5 1.5.3l2-.7c1-.3 2 .1 2.4 1.1l1 2c.5 1 .1 2.1-.9 2.6l-1.6.7c-1.6.7-3.4.8-5 .2-2-.8-4.1-2.2-6.3-4.4-2.2-2.2-3.6-4.3-4.4-6.3-.6-1.6-.5-3.4.2-5l.7-1.6Z" />
      ),
    },
  ];

  return (
    <footer className="relative mt-10 overflow-hidden bg-ink text-ink-foreground">
      <div className="relative mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <p className="font-serif text-2xl font-semibold tracking-[0.18em]">
              OrioKerg
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
                  target={item.href?.startsWith("http") ? "_blank" : undefined}
                  rel={item.href?.startsWith("http") ? "noreferrer" : undefined}
                  aria-label={item.label}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-ink-foreground/15 text-ink-foreground/80 transition-all hover:-translate-y-0.5 hover:border-accent-soft hover:text-accent-soft"
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="h-5 w-5 fill-current"
                  >
                    {item.icon}
                  </svg>
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
            <a
              href={tel}
              className="mt-3 block text-center text-sm text-ink-foreground/70 transition-colors hover:text-ink-foreground"
            >
              {contacts.phone}
            </a>
            {contacts.address ? (
              <p className="mt-3 text-center text-sm text-ink-foreground/55">
                {contacts.address}
              </p>
            ) : null}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-ink-foreground/10 pt-6 text-sm text-ink-foreground/55 md:flex-row md:items-center md:justify-between">
          <p>&copy; {new Date().getFullYear()} OrioKerg. Все права защищены.</p>
          <p>Питомник ориентальных кошек · Россия</p>
        </div>
      </div>
    </footer>
  );
}
