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
 * Строит до двух ценовых строк для котёнка: «В любимцы» (pet) и
 * «В разведение» (breed, помечается tone:"elite"). Если ни одной
 * цены нет — одна строка «Цена по запросу».
 */
export function kittenPriceLines(
  pricePet?: number,
  priceBreed?: number,
): PriceLine[] {
  const lines: PriceLine[] = [];
  const pet = formatPrice(pricePet);
  const breed = formatPrice(priceBreed);

  if (pet) lines.push({ label: "В любимцы", value: `${pet} ₽` });
  if (breed)
    lines.push({ label: "В разведение", value: `${breed} ₽`, tone: "elite" });
  if (lines.length === 0) lines.push({ value: "Цена по запросу" });

  return lines;
}
