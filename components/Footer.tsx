const contacts = [
  {
    href: "https://t.me/oriokerg",
    label: "Telegram",
    icon: (
      <path d="M21.2 4.6 18.3 18c-.2 1-.8 1.2-1.7.8l-4.3-3.2-2.1 2c-.2.2-.4.4-.9.4l.3-4.4 8-7.2c.3-.3-.1-.5-.5-.2l-9.9 6.2-4.3-1.3c-.9-.3-1-.9.2-1.4L19.5 3c.8-.3 1.5.2 1.2 1.6Z" />
    ),
  },
  {
    href: "https://wa.me/79000000000",
    label: "WhatsApp",
    icon: (
      <path d="M19.1 4.9A9.9 9.9 0 0 0 3.5 17.1L2 22l5-1.3a9.9 9.9 0 0 0 4.8 1.2h.1A10 10 0 0 0 22 12c0-2.7-1-5.2-2.9-7.1Zm-7.2 15.3a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3a8.3 8.3 0 1 1 6.9 3.7Zm4.6-6.2c-.2-.1-1.5-.8-1.7-.9-.2-.1-.4-.1-.6.1l-.8.9c-.1.1-.3.2-.5.1-.2-.1-1-.4-1.8-1.1-.7-.6-1.1-1.3-1.3-1.5-.1-.2 0-.4.1-.5l.4-.5.3-.4c.1-.1.1-.3 0-.4l-.7-1.8c-.2-.4-.4-.4-.6-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 2 0 1.2.8 2.4.9 2.6.1.2 1.7 2.7 4.1 3.7.6.3 1.1.5 1.5.6.6.2 1.2.2 1.6.1.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2-.1-.1-.3-.2-.5-.3Z" />
    ),
  },
  {
    href: "tel:+79000000000",
    label: "Телефон",
    icon: (
      <path d="M7.3 3.5c.4-1 1.5-1.5 2.5-1.1l2 1c.9.4 1.4 1.5 1.1 2.4l-.7 2c-.2.5 0 1.1.3 1.5l2 2c.4.4 1 .5 1.5.3l2-.7c1-.3 2 .1 2.4 1.1l1 2c.5 1 .1 2.1-.9 2.6l-1.6.7c-1.6.7-3.4.8-5 .2-2-.8-4.1-2.2-6.3-4.4-2.2-2.2-3.6-4.3-4.4-6.3-.6-1.6-.5-3.4.2-5l.7-1.6Z" />
    ),
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-lg font-semibold uppercase tracking-[0.24em] text-foreground">
              OrioKerg
            </p>
            <p className="mt-2 max-w-xl text-sm text-muted">
              Питомник с премиальным и спокойным визуальным стилем. Контакты пока
              оставлены как временные заглушки.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {contacts.map((contact) => (
              <a
                key={contact.label}
                href={contact.href}
                target={contact.href.startsWith("http") ? "_blank" : undefined}
                rel={contact.href.startsWith("http") ? "noreferrer" : undefined}
                aria-label={contact.label}
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-border bg-background text-muted transition-all hover:border-accent hover:text-accent"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-5 w-5 fill-current"
                >
                  {contact.icon}
                </svg>
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-border pt-6 text-sm text-muted md:flex-row md:items-center md:justify-between">
          <p>&copy; {new Date().getFullYear()} OrioKerg. Все права защищены.</p>
          <a
            href="tel:+79000000000"
            className="transition-colors hover:text-accent"
          >
            +7 900 000 00 00
          </a>
        </div>
      </div>
    </footer>
  );
}
