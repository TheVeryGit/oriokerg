import type { Metadata } from "next";
import type { ComponentType, SVGProps } from "react";

import { PhoneIcon, TelegramIcon, VkIcon, telHref } from "@/components/icons";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import type { ContactsSettings } from "@/lib/content";
import { getSettings } from "@/lib/content";
import { formatPhone, isRealPhone } from "@/lib/format";

export const metadata: Metadata = {
  title: "Контакты",
  description:
    "Свяжитесь с питомником OrioKerg в Telegram, ВКонтакте или по телефону — расскажем о доступных котятах.",
};

export default function ContactsPage() {
  const contacts = getSettings<ContactsSettings>("contacts");

  const cards: {
    href: string;
    label: string;
    value: string;
    Icon: ComponentType<SVGProps<SVGSVGElement>>;
    external: boolean;
  }[] = [
    {
      href: contacts.telegram,
      label: "Telegram",
      value: "Написать в Telegram",
      Icon: TelegramIcon,
      external: true,
    },
    {
      href: contacts.vk,
      label: "ВКонтакте",
      value: "Написать ВКонтакте",
      Icon: VkIcon,
      external: true,
    },
    ...(isRealPhone(contacts.phone)
      ? [
          {
            href: telHref(contacts.phone),
            label: "Телефон",
            value: formatPhone(contacts.phone),
            Icon: PhoneIcon,
            external: false,
          },
        ]
      : []),
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
                <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-accent-soft to-accent-strong text-accent-foreground shadow-soft transition-transform duration-300 group-hover:scale-105">
                  <card.Icon className="h-6 w-6" />
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
