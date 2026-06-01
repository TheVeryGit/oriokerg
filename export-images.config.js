/**
 * Конфиг next-export-optimize-images (применяется на этапе `npx next-export-optimize-images`).
 * Конвертируем тяжёлые JPG/PNG в WebP — браузер грузит ~в 3-5 раз меньше байт
 * без потери качества. Размеры (resize) Next подбирает по `sizes` автоматически.
 */
module.exports = {
  convertFormat: [
    ["jpg", "webp"],
    ["jpeg", "webp"],
    ["png", "webp"],
  ],
  // Качество WebP: 78 — визуально неотличимо от оригинала, но заметно легче.
  quality: 78,
};
