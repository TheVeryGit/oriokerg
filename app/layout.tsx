import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import type { ReactNode } from "react";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MotionProvider } from "@/components/motion/MotionProvider";
import type { ContactsSettings } from "@/lib/content";
import { getSettings } from "@/lib/content";

import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-inter",
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

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  const contacts = getSettings<ContactsSettings>("contacts");

  return (
    <html lang="ru">
      <body
        className={`${inter.variable} ${serif.variable} relative min-h-screen bg-background text-foreground`}
      >
        <div className="grain-layer" aria-hidden="true" />
        <MotionProvider>
          <div className="relative z-[2] flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer contacts={contacts} />
          </div>
        </MotionProvider>
      </body>
    </html>
  );
}
