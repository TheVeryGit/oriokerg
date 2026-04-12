import type { Metadata } from "next";
import { Inter } from "next/font/google";
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

export const metadata: Metadata = {
  title: "OrioKerg",
  description: "Питомник кошек OrioKerg",
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  const contacts = getSettings<ContactsSettings>("contacts");

  return (
    <html lang="ru">
      <body className={`${inter.variable} min-h-screen bg-background text-foreground`}>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer contacts={contacts} />
        </div>
      </body>
    </html>
  );
}
