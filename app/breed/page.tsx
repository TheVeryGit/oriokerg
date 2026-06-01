import type { Metadata } from "next";
import Image from "next-export-optimize-images/image";
import Link from "next/link";

import { Reveal } from "@/components/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import type { ContactsSettings } from "@/lib/content";
import { DEFAULT_HERO_IMAGE, getBreed, getSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "РџРѕСЂРѕРґР° РѕСЂРёРµРЅС‚Р°Р»",
  description:
    "РћСЂРёРµРЅС‚Р°Р»СЊРЅР°СЏ РєРѕС€РєР°: С…Р°СЂР°РєС‚РµСЂ, РІРЅРµС€РЅРѕСЃС‚СЊ, СѓС…РѕРґ Рё Р·РґРѕСЂРѕРІСЊРµ. Р’СЃС‘, С‡С‚Рѕ РІР°Р¶РЅРѕ Р·РЅР°С‚СЊ Р±СѓРґСѓС‰РµРјСѓ РІР»Р°РґРµР»СЊС†Сѓ.",
};

export default function BreedPage() {
  const breed = getBreed();
  const contacts = getSettings<ContactsSettings>("contacts");
  const heroImage = breed.hero_image?.trim() ? breed.hero_image : DEFAULT_HERO_IMAGE;

  return (
    <div>
      {/* Intro */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-20 top-10 h-72 w-72 rounded-full bg-accent/15 blur-3xl" />
        <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
          <Reveal>
            <span className="inline-flex items-center gap-2 text-sm uppercase tracking-luxe text-accent">
              <span className="h-px w-8 bg-accent/50" />
              РџРѕСЂРѕРґР°
            </span>
            <h1 className="mt-5 font-serif text-5xl font-semibold leading-[1.05] text-foreground sm:text-6xl">
              {breed.title}
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-8 text-muted text-pretty">
              {breed.intro_text}
            </p>
            <Link
              href="/kittens"
              className="mt-8 inline-flex rounded-full bg-gradient-to-br from-accent to-accent-strong px-8 py-4 text-sm font-medium text-accent-foreground shadow-glow transition-transform hover:-translate-y-0.5"
            >
              РџРѕСЃРјРѕС‚СЂРµС‚СЊ РєРѕС‚СЏС‚
            </Link>
          </Reveal>
          <Reveal direction="left" className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-5xl shadow-lift">
              <Image
                src={heroImage}
                alt="РћСЂРёРµРЅС‚Р°Р»СЊРЅР°СЏ РєРѕС€РєР°"
                fill
                priority
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover object-[50%_20%]"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/25 to-transparent" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Traits */}
      <section className="border-y border-border bg-surface-2/50">
        <div className="mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <Reveal className="max-w-2xl">
            <h2 className="font-serif text-4xl font-semibold text-foreground sm:text-5xl">
              {breed.traits_title}
            </h2>
          </Reveal>
          <Stagger className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {breed.traits.map((trait, index) => (
              <StaggerItem key={`${trait.title}-${index}`}>
                <div className="h-full rounded-4xl border border-border bg-card p-7 shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:border-accent/40 hover:shadow-lift">
                  <h3 className="font-serif text-2xl font-semibold text-foreground">
                    {trait.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-muted">{trait.text}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Care */}
      <section className="mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <Reveal className="max-w-2xl">
          <span className="inline-flex items-center gap-2 text-sm uppercase tracking-luxe text-accent">
            <span className="h-px w-8 bg-accent/50" />
            РЈС…РѕРґ
          </span>
          <h2 className="mt-4 font-serif text-4xl font-semibold text-foreground sm:text-5xl">
            {breed.care_title}
          </h2>
        </Reveal>
        <Stagger className="mt-14 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {breed.care.map((item, index) => (
            <StaggerItem key={`${item.title}-${index}`}>
              <div className="flex h-full flex-col rounded-4xl border border-border bg-card p-7 shadow-soft">
                <span className="font-serif text-4xl font-semibold text-gold-gradient">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-lg font-medium text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-muted">{item.text}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* CTA */}
      <section className="mx-auto w-full max-w-7xl px-4 pb-28 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-5xl bg-ink px-6 py-20 text-center text-ink-foreground sm:px-10">
            <h2 className="mx-auto max-w-2xl font-serif text-4xl font-semibold sm:text-5xl">
              {breed.cta_title}
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-ink-foreground/75">
              {breed.cta_text}
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <a
                href={contacts.telegram}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-gradient-to-br from-accent to-accent-strong px-8 py-4 text-sm font-medium text-accent-foreground shadow-glow transition-transform hover:-translate-y-0.5"
              >
                РќР°РїРёСЃР°С‚СЊ РІ Telegram
              </a>
              <Link
                href="/kittens"
                className="rounded-full border border-ink-foreground/30 px-8 py-4 text-sm text-ink-foreground transition-colors hover:bg-ink-foreground/10"
              >
                РЎРјРѕС‚СЂРµС‚СЊ РєРѕС‚СЏС‚
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}

