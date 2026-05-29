import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import type { ReactNode } from "react";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
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
  weight: ["500", "600", "700"],
  display: "swap",
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "OrioKerg — питомник ориентальных кошек",
  description:
    "Питомник OrioKerg: здоровые социализированные ориентальные котята с документами, прививками и поддержкой на всю жизнь.",
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  const contacts = getSettings<ContactsSettings>("contacts");

  return (
    <html lang="ru">
      <body className={`${inter.variable} ${serif.variable} min-h-screen bg-background text-foreground`}>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer contacts={contacts} />
        </div>
      </body>
    </html>
  );
}
