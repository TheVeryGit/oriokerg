import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import type { ReactNode } from "react";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MotionProvider } from "@/components/motion/MotionProvider";
import type { ContactsSettings } from "@/lib/content";
import { getSettings } from "@/lib/content";

import "./globals.css";

// Body face — distinctive, full Cyrillic, premium (intentionally NOT Inter/Roboto).
const sans = Manrope({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-sans",
});

const serif = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-serif",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://oriokerg.ru"),
  title: {
    default: "OrioKerg — питомник ориентальных кошек",
    template: "%s · OrioKerg",
  },
  description:
    "Питомник OrioKerg: здоровые социализированные ориентальные котята с документами, прививками и поддержкой на всю жизнь.",
  openGraph: {
    title: "OrioKerg — питомник ориентальных кошек",
    description:
      "Здоровые социализированные ориентальные котята с документами, прививками и поддержкой на всю жизнь.",
    type: "website",
    locale: "ru_RU",
    siteName: "OrioKerg",
  },
};

export const viewport: Viewport = {
  themeColor: "#faf6ef",
  width: "device-width",
  initialScale: 1,
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  const contacts = getSettings<ContactsSettings>("contacts");

  return (
    <html lang="ru">
      <body
        className={`${sans.variable} ${serif.variable} relative min-h-screen bg-background text-foreground`}
      >
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
        </MotionProvider>
      </body>
    </html>
  );
}
