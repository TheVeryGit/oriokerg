"use client";

import { useEffect, useState } from "react";

import { TelegramIcon } from "@/components/icons";

/**
 * Плавающая кнопка «Написать» только на мобиле/планшете (lg:hidden).
 * Появляется после прокрутки (~500px), чтобы не перекрывать hero и его CTA.
 * z-40 — ниже шапки (z-50), выше контента.
 */
export function MobileContactButton({ telegram }: { telegram?: string }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!telegram) return;
    const onScroll = () => setShow(window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [telegram]);

  if (!telegram) return null;

  return (
    <a
      href={telegram}
      target="_blank"
      rel="noreferrer"
      aria-label="Написать в Telegram"
      className={`beam-btn fixed bottom-5 right-4 z-40 flex items-center gap-2 rounded-full bg-gradient-to-br from-accent to-accent-strong px-5 py-3.5 text-sm font-medium text-accent-foreground shadow-glow transition-all duration-300 lg:hidden ${
        show
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <TelegramIcon className="h-5 w-5" />
      Написать
    </a>
  );
}
