export function formatPrice(price?: number) {
  if (typeof price !== "number") {
    return null;
  }

  return new Intl.NumberFormat("ru-RU").format(price);
}

export type PriceLine = { label?: string; value: string };

/**
 * Строит до двух ценовых строк для котёнка: «В любимцы» (pet) и
 * «В разведение» (breed). Если ни одной цены нет — одна строка
 * «Цена по запросу». Используется и на карточках, и на детальной.
 */
export function kittenPriceLines(
  pricePet?: number,
  priceBreed?: number,
): PriceLine[] {
  const lines: PriceLine[] = [];
  const pet = formatPrice(pricePet);
  const breed = formatPrice(priceBreed);

  if (pet) lines.push({ label: "В любимцы", value: `${pet} ₽` });
  if (breed) lines.push({ label: "В разведение", value: `${breed} ₽` });
  if (lines.length === 0) lines.push({ value: "Цена по запросу" });

  return lines;
}
