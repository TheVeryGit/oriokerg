import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { remark } from "remark";
import html from "remark-html";

import { ContactButtons } from "@/components/ContactButtons";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import type { AboutSettings, ContactsSettings } from "@/lib/content";
import { getSettings, getSettingsContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "О питомнике",
  description:
    "История питомника OrioKerg, подход к разведению и забота о котятах ориентальной породы.",
};

export default async function AboutPage() {
  const about = getSettings<AboutSettings>("about");
  const contacts = getSettings<ContactsSettings>("contacts");
  const aboutBody = getSettingsContent("about");
  const processedContent = await remark().use(html).process(aboutBody);
  const htmlContent = processedContent.toString();

  return (
    <div className="pb-24">
      <PageHeader eyebrow="О питомнике" title={about.title} />

      <div className="mx-auto mt-8 grid w-full max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <Reveal>
          <div
            className="prose-content max-w-none space-y-5 text-lg leading-8 text-muted [&_a]:text-accent [&_a:hover]:text-accent-strong [&_h2]:mt-8 [&_h2]:font-serif [&_h2]:text-3xl [&_h2]:font-semibold [&_h2]:text-foreground [&_h3]:mt-6 [&_h3]:font-serif [&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:text-foreground [&_li]:mb-2 [&_p]:mb-5 [&_strong]:text-foreground [&_ul]:mb-5 [&_ul]:list-disc [&_ul]:pl-6"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </Reveal>

        <Reveal direction="left" className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-5xl border border-border bg-gradient-to-br from-accent/5 to-surface-2 shadow-lift lg:sticky lg:top-28">
            {about.photo ? (
              <Image
                src={about.photo}
                alt={about.title}
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  className="h-16 w-16 text-accent/25"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 9c-3.5 0-6 2.6-6 5.3 0 1.6 1.3 2.7 3 2.7.9 0 1.7-.3 3-.3s2.1.3 3 .3c1.7 0 3-1.1 3-2.7C18 11.6 15.5 9 12 9Zm-6.5-.5A1.8 1.8 0 1 0 4 6.4a4 4 0 0 0 1.5 2.1Zm13 0A4 4 0 0 0 20 6.4a1.8 1.8 0 1 0-1.5 2.1ZM9 7.2A1.8 1.8 0 1 0 7.4 4 4 4 0 0 0 9 7.2Zm6 0A4 4 0 0 0 16.6 4 1.8 1.8 0 1 0 15 7.2Z" />
                </svg>
              </div>
            )}
          </div>
        </Reveal>
      </div>

      <section className="mx-auto mt-20 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="rounded-5xl border border-border bg-card p-8 shadow-soft sm:p-12">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-xl">
                <h2 className="font-serif text-3xl font-semibold text-foreground sm:text-4xl">
                  Познакомимся?
                </h2>
                <p className="mt-3 text-muted">
                  Расскажем о доступных котятах, покажем родителей и поможем
                  выбрать малыша. Также загляните в раздел о породе.
                </p>
                <Link
                  href="/breed"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-accent transition-colors hover:text-accent-strong"
                >
                  О породе ориентал →
                </Link>
              </div>
              <ContactButtons
                telegram={contacts.telegram}
                vk={contacts.vk}
                phone={contacts.phone}
                className="lg:w-auto"
              />
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
