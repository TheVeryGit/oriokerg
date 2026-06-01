"use client";

import { useEffect, useState } from "react";

import { TelegramIcon, VkIcon } from "@/components/icons";

const btn =
  "inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-border-strong bg-card text-foreground transition-colors hover:border-accent hover:text-accent";

/** Поделиться страницей котёнка: нативный шер (мобайл) + Telegram/ВК/копировать. */
export function ShareButtons({
  title,
  className = "",
}: {
  title: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    setCanNativeShare(
      typeof navigator !== "undefined" && typeof navigator.share === "function",
    );
  }, []);

  const url = () => window.location.href;
  const openShare = (u: string) =>
    window.open(u, "_blank", "noopener,noreferrer");

  const onTelegram = () =>
    openShare(
      `https://t.me/share/url?url=${encodeURIComponent(url())}&text=${encodeURIComponent(title)}`,
    );
  const onVk = () =>
    openShare(`https://vk.com/share.php?url=${encodeURIComponent(url())}`);
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(url());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard недоступен — игнорируем */
    }
  };
  const onNative = async () => {
    try {
      await navigator.share({ title, url: url() });
    } catch {
      /* пользователь отменил — ок */
    }
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <span className="hidden text-sm text-muted sm:inline">Поделиться:</span>
      <button
        type="button"
        onClick={onTelegram}
        aria-label="Поделиться в Telegram"
        className={btn}
      >
        <TelegramIcon className="h-[18px] w-[18px]" />
      </button>
      <button
        type="button"
        onClick={onVk}
        aria-label="Поделиться во ВКонтакте"
        className={btn}
      >
        <VkIcon className="h-[18px] w-[18px]" />
      </button>
      <button
        type="button"
        onClick={onCopy}
        aria-label={copied ? "Ссылка скопирована" : "Скопировать ссылку"}
        className={btn}
      >
        {copied ? (
          <svg
            viewBox="0 0 24 24"
            className="h-[18px] w-[18px] text-emerald"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        ) : (
          <svg
            viewBox="0 0 24 24"
            className="h-[18px] w-[18px]"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        )}
      </button>
      {canNativeShare ? (
        <button
          type="button"
          onClick={onNative}
          aria-label="Поделиться"
          className={btn}
        >
          <svg
            viewBox="0 0 24 24"
            className="h-[18px] w-[18px]"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <path d="m8.59 13.51 6.83 3.98M15.41 6.51 8.59 10.49" />
          </svg>
        </button>
      ) : null}
    </div>
  );
}
