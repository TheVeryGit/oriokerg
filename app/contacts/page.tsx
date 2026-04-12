import type { ContactsSettings } from "@/lib/content";
import { getSettings } from "@/lib/content";

export default function ContactsPage() {
  const contacts = getSettings<ContactsSettings>("contacts");
  const contactItems = [
    {
      href: contacts.telegram,
      label: "Telegram",
      description: contacts.telegram,
    },
    {
      href: contacts.whatsapp,
      label: "WhatsApp",
      description: contacts.whatsapp,
    },
    {
      href: `tel:${contacts.phone.replace(/[^\d+]/g, "")}`,
      label: "Позвонить",
      description: contacts.phone,
    },
  ];

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <section className="max-w-3xl">
        <p className="text-sm uppercase tracking-[0.28em] text-accent">
          Контакты
        </p>
        <h1 className="mt-4 text-4xl font-semibold text-foreground">Связаться с нами</h1>
        <p className="mt-6 text-base leading-8 text-muted">
          Выберите удобный способ связи. Форму пока не добавляю: по условию здесь
          нужны только прямые контактные действия.
        </p>
      </section>

      <div className="grid gap-6 md:grid-cols-3">
        {contactItems.map((contact) => (
          <a
            key={contact.label}
            href={contact.href}
            target={contact.href.startsWith("http") ? "_blank" : undefined}
            rel={contact.href.startsWith("http") ? "noreferrer" : undefined}
            className="rounded-[2rem] border border-border bg-card p-8 transition-transform duration-300 hover:-translate-y-1 hover:border-accent"
          >
            <p className="text-sm uppercase tracking-[0.22em] text-accent">
              Контакт
            </p>
            <h2 className="mt-5 text-2xl font-semibold text-foreground">
              {contact.label}
            </h2>
            <p className="mt-3 text-base text-muted">{contact.description}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
