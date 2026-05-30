import type { Metadata } from "next";
import type { ReactNode } from "react";

import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import type { ContactsSettings } from "@/lib/content";
import { getSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Контакты",
  description:
    "Свяжитесь с питомником OrioKerg в Telegram, WhatsApp или по телефону — расскажем о доступных котятах.",
};

const telegramIcon = (
  <path d="M21.2 4.6 18.3 18c-.2 1-.8 1.2-1.7.8l-4.3-3.2-2.1 2c-.2.2-.4.4-.9.4l.3-4.4 8-7.2c.3-.3-.1-.5-.5-.2l-9.9 6.2-4.3-1.3c-.9-.3-1-.9.2-1.4L19.5 3c.8-.3 1.5.2 1.2 1.6Z" />
);
const whatsappIcon = (
  <path d="M19.1 4.9A9.9 9.9 0 0 0 3.5 17.1L2 22l5-1.3a9.9 9.9 0 0 0 4.8 1.2h.1A10 10 0 0 0 22 12c0-2.7-1-5.2-2.9-7.1Zm-7.2 15.3a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3a8.3 8.3 0 1 1 6.9 3.7Zm4.6-6.2c-.2-.1-1.5-.8-1.7-.9-.2-.1-.4-.1-.6.1l-.8.9c-.1.1-.3.2-.5.1-.2-.1-1-.4-1.8-1.1-.7-.6-1.1-1.3-1.3-1.5-.1-.2 0-.4.1-.5l.4-.5.3-.4c.1-.1.1-.3 0-.4l-.7-1.8c-.2-.4-.4-.4-.6-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 2 0 1.2.8 2.4.9 2.6.1.2 1.7 2.7 4.1 3.7.6.3 1.1.5 1.5.6.6.2 1.2.2 1.6.1.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2-.1-.1-.3-.2-.5-.3Z" />
);
const phoneIcon = (
  <path d="M7.3 3.5c.4-1 1.5-1.5 2.5-1.1l2 1c.9.4 1.4 1.5 1.1 2.4l-.7 2c-.2.5 0 1.1.3 1.5l2 2c.4.4 1 .5 1.5.3l2-.7c1-.3 2 .1 2.4 1.1l1 2c.5 1 .1 2.1-.9 2.6l-1.6.7c-1.6.7-3.4.8-5 .2-2-.8-4.1-2.2-6.3-4.4-2.2-2.2-3.6-4.3-4.4-6.3-.6-1.6-.5-3.4.2-5l.7-1.6Z" />
);

export default function ContactsPage() {
  const contacts = getSettings<ContactsSettings>("contacts");

  const cards: {
    href: string;
    label: string;
    value: string;
    icon: ReactNode;
    external: boolean;
  }[] = [
    {
      href: contacts.telegram,
      label: "Telegram",
      value: "Написать в Telegram",
      icon: telegramIcon,
      external: true,
    },
    {
      href: contacts.whatsapp,
      label: "WhatsApp",
      value: "Написать в WhatsApp",
      icon: whatsappIcon,
      external: true,
    },
    {
      href: `tel:${(contacts.phone ?? "").replace(/[^\d+]/g, "")}`,
      label: "Телефон",
      value: contacts.phone,
      icon: phoneIcon,
      external: false,
    },
  ];

  return (
    <div className="pb-24">
      <PageHeader
        eyebrow="Контакты"
        title="Связаться с нами"
        intro="Напишите или позвоните удобным способом — с радостью расскажем о доступных котятах, пришлём фото и видео и поможем выбрать питомца."
      />

      <div className="mx-auto mt-10 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <Stagger className="grid gap-6 md:grid-cols-3">
          {cards.map((card) => (
            <StaggerItem key={card.label}>
              <a
                href={card.href}
                target={card.external ? "_blank" : undefined}
                rel={card.external ? "noreferrer" : undefined}
                className="group flex h-full flex-col rounded-4xl border border-border bg-card p-8 shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:border-accent/40 hover:shadow-lift"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-soft to-accent-strong text-accent-foreground shadow-soft transition-transform duration-300 group-hover:scale-105">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-6 w-6 fill-current"
                    aria-hidden="true"
                  >
                    {card.icon}
                  </svg>
                </span>
                <h2 className="mt-6 font-serif text-2xl font-semibold text-foreground">
                  {card.label}
                </h2>
                <p className="mt-2 text-muted">{card.value}</p>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-accent transition-all duration-300 group-hover:gap-3">
                  Открыть
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
                </span>
              </a>
            </StaggerItem>
          ))}
        </Stagger>

        {contacts.address ? (
          <Reveal className="mt-6">
            <div className="flex items-start gap-4 rounded-4xl border border-border bg-card/70 p-7 shadow-soft">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11Z" />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>
              </span>
              <div>
                <p className="text-xs uppercase tracking-luxe text-accent">Адрес</p>
                <p className="mt-1 text-foreground">{contacts.address}</p>
              </div>
            </div>
          </Reveal>
        ) : null}

        <Reveal className="mt-16">
          <div className="relative overflow-hidden rounded-5xl bg-ink px-6 py-16 text-center text-ink-foreground sm:px-10">
            <h2 className="mx-auto max-w-xl font-serif text-3xl font-semibold sm:text-4xl">
              Готовы рассказать о котятах
            </h2>
            <p className="mx-auto mt-4 max-w-md text-ink-foreground/75">
              Пишите в любое время — отвечаем быстро и с удовольствием.
            </p>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
