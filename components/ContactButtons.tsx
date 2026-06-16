import { PhoneIcon, TelegramIcon, VkIcon, telHref } from "@/components/icons";
import { isRealPhone, telegramWith } from "@/lib/format";

type ContactButtonsProps = {
  telegram?: string;
  vk?: string;
  phone?: string;
  className?: string;
  /** Предзаполненный текст для Telegram (напр. «…Интересует котёнок Диана»). */
  message?: string;
};

const iconClass = "h-5 w-5 shrink-0";

export function ContactButtons({
  telegram,
  vk,
  phone,
  className = "",
  message,
}: ContactButtonsProps) {
  return (
    <div className={`flex flex-col gap-3 sm:flex-row ${className}`}>
      {telegram ? (
        <a
          href={telegramWith(telegram, message)}
          target="_blank"
          rel="noreferrer"
          className="inline-flex flex-1 items-center justify-center gap-2.5 rounded-full bg-gradient-to-br from-accent to-accent-strong px-6 py-3.5 text-sm font-medium text-accent-foreground shadow-glow transition-transform duration-200 hover:-translate-y-0.5"
        >
          <TelegramIcon className={iconClass} />
          Telegram
        </a>
      ) : null}
      {vk ? (
        <a
          href={vk}
          target="_blank"
          rel="noreferrer"
          className="inline-flex flex-1 items-center justify-center gap-2.5 rounded-full border border-border-strong bg-card px-6 py-3.5 text-sm font-medium text-foreground transition-colors hover:border-accent hover:text-accent"
        >
          <VkIcon className={iconClass} />
          ВКонтакте
        </a>
      ) : null}
      {isRealPhone(phone) ? (
        <a
          href={telHref(phone)}
          className="inline-flex flex-1 items-center justify-center gap-2.5 rounded-full border border-border-strong bg-card px-6 py-3.5 text-sm font-medium text-foreground transition-colors hover:border-accent hover:text-accent"
        >
          <PhoneIcon className={iconClass} />
          Позвонить
        </a>
      ) : null}
    </div>
  );
}
