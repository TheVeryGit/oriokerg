/**
 * Серверный компонент: вставляет микроразметку Schema.org как <script type="application/ld+json">.
 * Помогает Яндексу/Google понимать сущности (питомник, котёнок, цена, наличие).
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
