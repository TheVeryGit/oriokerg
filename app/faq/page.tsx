import type { Metadata } from "next";

import { ContactButtons } from "@/components/ContactButtons";
import { FaqAccordion } from "@/components/FaqAccordion";
import { Reveal } from "@/components/Reveal";
import type { ContactsSettings } from "@/lib/content";
import { getFaq, getSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Частые вопросы",
  description:
    "Ответы на частые вопросы о покупке ориентального котёнка в питомнике OrioKerg: бронь, документы, доставка, уход и гарантии.",
  alternates: { canonical: "/faq/" },
};

function pluralAnswers(n: number) {
  const abs = n % 100;
  const tail = abs % 10;
  if (abs > 10 && abs < 20) return "ответов";
  if (tail > 1 && tail < 5) return "ответа";
  if (tail === 1) return "ответ";
  return "ответов";
}

export default function FaqPage() {
  const faq = getFaq();
  const contacts = getSettings<ContactsSettings>("contacts");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <div className="pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="relative overflow-hidden">
        <div className="mobile-no-decor pointer-events-none absolute -right-16 -top-12 h-72 w-72 rounded-full bg-accent/12 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 top-40 hidden h-72 w-72 rounded-full bg-emerald/10 blur-3xl lg:block" />

        <div className="mx-auto w-full max-w-7xl px-4 pt-16 sm:px-6 lg:px-8 lg:pt-20">
          <div className="grid gap-10 lg:grid-cols-[0.82fr_1.5fr] lg:gap-14">
            {/* Sidebar */}
            <Reveal>
              <div className="lg:sticky lg:top-28">
                <span className="inline-flex items-center gap-2 text-sm uppercase tracking-luxe text-accent">
                  <span className="h-px w-8 bg-accent/50" />
                  FAQ
                </span>
                <h1 className="mt-5 font-serif text-4xl font-semibold leading-[1.06] text-foreground text-balance sm:text-5xl">
                  {faq.title}
                </h1>
                {faq.intro ? (
                  <p className="mt-5 text-lg leading-8 text-muted text-pretty">
                    {faq.intro}
                  </p>
                ) : null}

                <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted shadow-soft">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  {faq.items.length} {pluralAnswers(faq.items.length)}
                </p>

                <div className="relative mt-8 overflow-hidden rounded-4xl bg-ink p-6 text-ink-foreground shadow-lift sm:p-7">
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-emerald-soft/20 blur-3xl"
                  />
                  <h2 className="relative font-serif text-xl font-semibold sm:text-2xl">
                    Не нашли ответ?
                  </h2>
                  <p className="relative mt-2 text-sm leading-7 text-ink-foreground/70">
                    Напишите нам удобным способом — ответим быстро, подробно и с
                    удовольствием.
                  </p>
                  <ContactButtons
                    telegram={contacts.telegram}
                    vk={contacts.vk}
                    phone={contacts.phone}
                    className="relative mt-5 sm:flex-col"
                  />
                </div>
              </div>
            </Reveal>

            {/* Questions */}
            <Reveal delay={120}>
              <FaqAccordion items={faq.items} />
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
}
