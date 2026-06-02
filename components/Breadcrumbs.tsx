import Link from "next/link";

import { JsonLd } from "@/components/JsonLd";

type Crumb = { name: string; href?: string };

const SITE = "https://oriokerg.ru";

/**
 * Микроразметка BreadcrumbList (Schema.org). По умолчанию рисует и видимые
 * крошки; с `visual={false}` отдаёт только JSON-LD (когда на странице своя
 * навигация — напр. кнопка «назад»).
 */
export function Breadcrumbs({
  items,
  visual = true,
}: {
  items: Crumb[];
  visual?: boolean;
}) {
  const ld = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      ...(item.href ? { item: `${SITE}${item.href}/` } : {}),
    })),
  };

  if (!visual) return <JsonLd data={ld} />;

  return (
    <nav aria-label="Хлебные крошки">
      <JsonLd data={ld} />
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm text-muted">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${item.name}-${i}`} className="flex items-center gap-x-1.5">
              {item.href && !last ? (
                <Link
                  href={item.href}
                  className="transition-colors hover:text-accent"
                >
                  {item.name}
                </Link>
              ) : (
                <span
                  className={last ? "text-foreground" : undefined}
                  aria-current={last ? "page" : undefined}
                >
                  {item.name}
                </span>
              )}
              {!last ? (
                <span aria-hidden="true" className="text-border-strong">
                  /
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
