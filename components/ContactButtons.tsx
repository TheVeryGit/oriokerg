type ContactButtonsProps = {
  telegram?: string;
  whatsapp?: string;
  /** Optional message prefilled into WhatsApp (Telegram t.me can't prefill). */
  message?: string;
  className?: string;
};

function withText(url: string, message?: string) {
  if (!message || !url) return url;
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}text=${encodeURIComponent(message)}`;
}

const TelegramIcon = (
  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
    <path d="M21.2 4.6 18.3 18c-.2 1-.8 1.2-1.7.8l-4.3-3.2-2.1 2c-.2.2-.4.4-.9.4l.3-4.4 8-7.2c.3-.3-.1-.5-.5-.2l-9.9 6.2-4.3-1.3c-.9-.3-1-.9.2-1.4L19.5 3c.8-.3 1.5.2 1.2 1.6Z" />
  </svg>
);

const WhatsappIcon = (
  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
    <path d="M19.1 4.9A9.9 9.9 0 0 0 3.5 17.1L2 22l5-1.3a9.9 9.9 0 0 0 4.8 1.2h.1A10 10 0 0 0 22 12c0-2.7-1-5.2-2.9-7.1Zm-7.2 15.3a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3a8.3 8.3 0 1 1 6.9 3.7Zm4.6-6.2c-.2-.1-1.5-.8-1.7-.9-.2-.1-.4-.1-.6.1l-.8.9c-.1.1-.3.2-.5.1-.2-.1-1-.4-1.8-1.1-.7-.6-1.1-1.3-1.3-1.5-.1-.2 0-.4.1-.5l.4-.5.3-.4c.1-.1.1-.3 0-.4l-.7-1.8c-.2-.4-.4-.4-.6-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 2 0 1.2.8 2.4.9 2.6.1.2 1.7 2.7 4.1 3.7.6.3 1.1.5 1.5.6.6.2 1.2.2 1.6.1.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2-.1-.1-.3-.2-.5-.3Z" />
  </svg>
);

export function ContactButtons({
  telegram,
  whatsapp,
  message,
  className = "",
}: ContactButtonsProps) {
  return (
    <div className={`flex flex-col gap-3 sm:flex-row ${className}`}>
      {telegram ? (
        <a
          href={telegram}
          target="_blank"
          rel="noreferrer"
          className="inline-flex flex-1 items-center justify-center gap-2.5 rounded-full bg-gradient-to-br from-accent to-accent-strong px-6 py-3.5 text-sm font-medium text-accent-foreground shadow-glow transition-transform duration-200 hover:-translate-y-0.5"
        >
          {TelegramIcon}
          Написать в Telegram
        </a>
      ) : null}
      {whatsapp ? (
        <a
          href={withText(whatsapp, message)}
          target="_blank"
          rel="noreferrer"
          className="inline-flex flex-1 items-center justify-center gap-2.5 rounded-full border border-border-strong bg-card px-6 py-3.5 text-sm font-medium text-foreground transition-colors hover:border-accent hover:text-accent"
        >
          {WhatsappIcon}
          WhatsApp
        </a>
      ) : null}
    </div>
  );
}
