import type { Metadata, Viewport } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import type { ReactNode } from "react";

import { CookieConsent } from "@/components/CookieConsent";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { YandexMetrika } from "@/components/YandexMetrika";
import type { ContactsSettings } from "@/lib/content";
import { getSettings } from "@/lib/content";
import { isRealPhone, phoneE164 } from "@/lib/format";

import "./globals.css";

// Body face — distinctive, full Cyrillic, premium (intentionally NOT Inter/Roboto).
const sans = Manrope({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-sans",
});

// Playfair Display — high-contrast didone («Vogue»-драма), полная кириллица.
const serif = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-serif",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://oriokerg.ru"),
  title: {
    default: "Ориентальные котята в Москве — питомник OrioKerg",
    template: "%s · OrioKerg",
  },
  description:
    "Питомник ориентальных кошек OrioKerg в Москве: здоровые социализированные котята с документами WCF, прививками и поддержкой на всю жизнь. Доставка по России.",
  keywords: [
    "ориентальные котята",
    "купить ориентального котёнка",
    "питомник ориентальных кошек",
    "ориентальная кошка",
    "Москва",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Ориентальные котята в Москве — питомник OrioKerg",
    description:
      "Здоровые ориентальные котята с документами WCF, прививками и поддержкой. Питомник OrioKerg, Москва. Доставка по России.",
    type: "website",
    locale: "ru_RU",
    siteName: "OrioKerg",
    url: "https://oriokerg.ru",
    images: [
      {
        url: "/images/uploads/oriokerg-hero.png",
        width: 1254,
        height: 1254,
        alt: "Ориентальные котята питомника OrioKerg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ориентальные котята в Москве — питомник OrioKerg",
    description:
      "Здоровые ориентальные котята с документами WCF, прививками и поддержкой. Питомник OrioKerg, Москва. Доставка по России.",
    images: ["/images/uploads/oriokerg-hero.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0c0b0d",
  width: "device-width",
  initialScale: 1,
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  const contacts = getSettings<ContactsSettings>("contacts");

  const sameAs = [contacts.telegram, contacts.vk].filter(
    (url): url is string => typeof url === "string" && url.startsWith("http"),
  );
  const organizationLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "OrioKerg",
    alternateName: "Питомник OrioKerg",
    url: "https://oriokerg.ru",
    logo: "https://oriokerg.ru/icon.png",
    image: "https://oriokerg.ru/images/uploads/oriokerg-hero.png",
    description:
      "Питомник ориентальных кошек OrioKerg в Москве: здоровые социализированные котята с документами WCF и поддержкой. Доставка по России.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Москва",
      addressRegion: "Москва",
      addressCountry: "RU",
    },
    areaServed: ["Москва", "Россия"],
    ...(sameAs.length ? { sameAs } : {}),
    ...(isRealPhone(contacts.phone)
      ? {
          contactPoint: {
            "@type": "ContactPoint",
            telephone: phoneE164(contacts.phone),
            contactType: "sales",
            areaServed: "RU",
            availableLanguage: "Russian",
          },
        }
      : {}),
  };

  return (
    <html lang="ru" suppressHydrationWarning>
      <body
        className={`${sans.variable} ${serif.variable} relative min-h-screen bg-background text-foreground`}
      >
        <JsonLd data={organizationLd} />
        <YandexMetrika />
        {/* Mark JS as ready BEFORE paint so reveal animations can hide content;
            without JS this class is never added and all content stays visible. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "document.documentElement.classList.add('reveal-ready')",
          }}
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-accent focus:px-5 focus:py-2.5 focus:text-sm focus:font-medium focus:text-accent-foreground focus:shadow-lift"
        >
          К содержимому
        </a>
        <div className="grain-layer" aria-hidden="true" />
        <MotionProvider>
          <div className="relative z-[2] flex min-h-screen flex-col">
            <Header />
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <Footer contacts={contacts} />
          </div>
          <CookieConsent />
        </MotionProvider>
      </body>
    </html>
  );
}
