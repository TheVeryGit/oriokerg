import type { Metadata } from "next";

import { ContactButtons } from "@/components/ContactButtons";
import { FaqAccordion } from "@/components/FaqAccordion";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import type { ContactsSettings } from "@/lib/content";
import { getFaq, getSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Частые вопросы",
  description:
    "Ответы на частые вопросы о покупке ориентального котёнка в питомнике OrioKerg: бронь, документы, доставка, уход и гарантии.",
};

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

      <PageHeader eyebrow="FAQ" title={faq.title} intro={faq.intro} />

      <div className="mx-auto mt-10 w-full max-w-3xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <FaqAccordion items={faq.items} />
        </Reveal>

        <Reveal className="mt-12">
          <div className="rounded-4xl border border-border bg-card p-8 text-center shadow-soft sm:p-10">
            <h2 className="font-serif text-2xl font-semibold text-foreground sm:text-3xl">
              Остались вопросы?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-muted">
              Напишите нам удобным способом — ответим быстро, подробно и с
              удовольствием.
            </p>
            <ContactButtons
              telegram={contacts.telegram}
              vk={contacts.vk}
              phone={contacts.phone}
              className="mx-auto mt-7 max-w-md"
            />
          </div>
        </Reveal>
      </div>
    </div>
  );
}
