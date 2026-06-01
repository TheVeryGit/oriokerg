"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const COUNTER_ID = 109573825;

declare global {
  interface Window {
    ym?: (id: number, action: string, ...args: unknown[]) => void;
  }
}

/** По ссылке определяет, какая это цель (клик-обращение), либо null. */
function goalForHref(href: string): string | null {
  const h = href.toLowerCase();
  if (h.startsWith("tel:")) return "phone";
  if (h.startsWith("mailto:")) return "email";
  if (h.includes("t.me") || h.includes("telegram.me")) return "telegram";
  if (h.includes("vk.com") || h.includes("vk.ru")) return "vk";
  return null;
}

/**
 * 1) Учёт переходов между страницами при клиентской навигации (Next.js Link).
 *    `init` уже засчитал первую загрузку — первый запуск пропускаем.
 * 2) Цели-обращения: глобально ловим клики по ссылкам Telegram/ВК/телефон/email
 *    в любом месте сайта и шлём reachGoal — без правки каждой кнопки.
 */
function MetrikaTracker() {
  const pathname = usePathname();
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    window.ym?.(COUNTER_ID, "hit", window.location.href);
  }, [pathname]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const link = target?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!link) return;
      const goal = goalForHref(link.getAttribute("href") ?? "");
      if (goal) window.ym?.(COUNTER_ID, "reachGoal", goal);
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}

export function YandexMetrika() {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(m,e,t,r,i,k,a){
            m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();
            for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
            k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
        })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=${COUNTER_ID}', 'ym');
        ym(${COUNTER_ID}, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", accurateTrackBounce:true, trackLinks:true});`,
        }}
      />
      <MetrikaTracker />
      <noscript>
        <div>
          <img
            src={`https://mc.yandex.ru/watch/${COUNTER_ID}`}
            style={{ position: "absolute", left: "-9999px" }}
            alt=""
          />
        </div>
      </noscript>
    </>
  );
}
