/**
 * Настоящий ли телефон (не пустой и не заглушка вида +7 900 000 00 00).
 * Пока номер не настоящий — телефон не показываем, чтобы фейк не бил по доверию.
 */
export function isRealPhone(phone?: string | null): phone is string {
  if (!phone) return false;
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 7) return false;
  if (/0{6,}/.test(digits)) return false; // 6+ нулей подряд = явная заглушка
  return true;
}

/**
 * Приводит номер к 11 цифрам РФ-формата (7XXXXXXXXXX), как бы он ни был введён:
 * с +7 / 8 / без кода, со скобками, пробелами, дефисами. Возвращает null,
 * если это не похоже на российский номер (тогда показываем как есть).
 */
function ruPhoneDigits(phone?: string | null): string | null {
  if (!phone) return null;
  let d = phone.replace(/\D/g, "");
  if (d.length === 11 && d[0] === "8") d = "7" + d.slice(1);
  if (d.length === 10) d = "7" + d; // ввели без кода страны
  if (d.length !== 11 || d[0] !== "7") return null;
  return d;
}

/**
 * Красивый телефон для показа: «+7 (900) 123-45-67».
 * Не РФ-формат — возвращаем исходную строку (обрезав пробелы), ничего не ломаем.
 */
export function formatPhone(phone?: string | null): string {
  const d = ruPhoneDigits(phone);
  if (!d) return (phone ?? "").trim();
  const n = d.slice(1);
  return `+7 (${n.slice(0, 3)}) ${n.slice(3, 6)}-${n.slice(6, 8)}-${n.slice(8, 10)}`;
}

/**
 * E.164 для tel:-ссылок и schema.org: «+7XXXXXXXXXX».
 * Фолбэк — очищенные цифры с ведущим + (для нестандартных номеров).
 */
export function phoneE164(phone?: string | null): string {
  const d = ruPhoneDigits(phone);
  if (d) return "+" + d;
  return (phone ?? "").replace(/[^\d+]/g, "");
}

/**
 * Ссылка в Telegram с предзаполненным текстом сообщения.
 * `https://t.me/<user>` → `…?text=<urlencoded>` (Telegram-клиенты подставляют
 * текст в поле ввода). Без текста — исходная ссылка.
 */
export function telegramWith(url?: string | null, text?: string) {
  if (!url) return "";
  if (!text) return url;
  return `${url}${url.includes("?") ? "&" : "?"}text=${encodeURIComponent(text)}`;
}

export function formatPrice(price?: number) {
  if (typeof price !== "number") {
    return null;
  }

  return new Intl.NumberFormat("ru-RU").format(price);
}

/** Русская плюрализация: pluralRu(2, ["день","дня","дней"]) → "дня". */
function pluralRu(n: number, forms: [string, string, string]) {
  const abs = Math.abs(n) % 100;
  const tail = abs % 10;
  if (abs > 10 && abs < 20) return forms[2];
  if (tail > 1 && tail < 5) return forms[1];
  if (tail === 1) return forms[0];
  return forms[2];
}

/** Дата рождения → «1 апреля 2026». Принимает ISO-строку (YYYY-MM-DD). */
export function formatBirthDate(iso?: string) {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

/**
 * Возраст котёнка относительно `now` (по умолчанию — сейчас).
 * Дни → недели → месяцы. Вычисляется на клиенте, чтобы всегда быть актуальным.
 */
export function formatAge(iso?: string, now: Date = new Date()) {
  if (!iso) return null;
  const birth = new Date(iso);
  if (Number.isNaN(birth.getTime())) return null;

  const days = Math.floor((now.getTime() - birth.getTime()) / 86_400_000);
  if (days < 0) return null;
  if (days < 14) {
    const n = Math.max(days, 1);
    return `${n} ${pluralRu(n, ["день", "дня", "дней"])}`;
  }
  if (days < 60) {
    const w = Math.round(days / 7);
    return `${w} ${pluralRu(w, ["неделя", "недели", "недель"])}`;
  }
  const m = Math.floor(days / 30.44);
  return `${m} ${pluralRu(m, ["месяц", "месяца", "месяцев"])}`;
}

export type PriceLine = {
  label?: string;
  value: string;
  tone?: "default" | "elite";
};

/**
 * Одна ценовая строка котёнка — цена «в любимцы» (pet). Цену
 * «в разведение» на сайте не показываем цифрой (пугающий якорь для
 * обычных покупателей) — условия разведения обсуждаются в переписке.
 * Если pet-цены нет — «Цена по запросу» (breed-цифра не подставляется).
 */
export function kittenPriceLines(pricePet?: number): PriceLine[] {
  const pet = formatPrice(pricePet);
  if (pet) return [{ value: `${pet} ₽` }];
  return [{ value: "Цена по запросу" }];
}
