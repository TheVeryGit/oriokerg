"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const STORAGE_KEY = "oriokerg-cookie-consent";

/**
 * Информирующая плашка о cookie/Яндекс.Метрике (152-ФЗ).
 * Показывается один раз, выбор запоминается в localStorage.
 * Рендерится только после маунта — без рассинхрона гидрации.
 */
export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      /* localStorage недоступен — просто не показываем */
    }
  }, []);

  if (!visible) return null;

  const accept = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* игнорируем */
    }
    setVisible(false);
  };

  return (
    <div className="fixed inset-x-3 bottom-3 z-40 sm:inset-x-auto sm:left-4 sm:right-4 sm:bottom-4">
      <div className="mx-auto flex max-w-3xl flex-col gap-3 rounded-3xl border border-border bg-card p-4 shadow-lift sm:flex-row sm:items-center sm:gap-4 sm:p-5">
        <p className="text-sm leading-6 text-muted">
          Мы используем файлы cookie и сервис Яндекс.Метрика для аналитики и
          улучшения сайта. Оставаясь здесь, вы соглашаетесь с{" "}
          <Link
            href="/privacy"
            className="text-accent underline-offset-2 hover:underline"
          >
            политикой конфиденциальности
          </Link>
          .
        </p>
        <button
          type="button"
          onClick={accept}
          className="shrink-0 rounded-full bg-gradient-to-br from-accent to-accent-strong px-6 py-2.5 text-sm font-medium text-accent-foreground shadow-glow transition-transform hover:-translate-y-0.5"
        >
          Принять
        </button>
      </div>
    </div>
  );
}
