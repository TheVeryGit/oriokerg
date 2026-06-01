"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const COUNTER_ID = 109573825;

declare global {
  interface Window {
    ym?: (id: number, action: string, ...args: unknown[]) => void;
  }
}

/**
 * Учёт переходов между страницами при клиентской навигации (Next.js Link).
 * `init` уже засчитал первую загрузку — поэтому первый запуск пропускаем,
 * иначе главная посчиталась бы дважды.
 */
function PageviewTracker() {
  const pathname = usePathname();
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    window.ym?.(COUNTER_ID, "hit", window.location.href);
  }, [pathname]);

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
      <PageviewTracker />
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
