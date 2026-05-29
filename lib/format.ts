export function formatPrice(price?: number) {
  if (typeof price !== "number") {
    return null;
  }

  return new Intl.NumberFormat("ru-RU").format(price);
}
