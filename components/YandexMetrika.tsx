"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const COUNTER_ID = 109573825;

declare global {
  interface Window {
    ym?: (id: number, action: string, ...args: unknown[]) => void;
  }
}

/** Отправить цель в Метрику (no-op, если счётчик ещё не загрузился). */
function reachGoal(goal: string) {
  window.ym?.(COUNTER_ID, "reachGoal", goal);
}

/** По ссылке определяет, какая это цель-обращение, либо null. */
function goalForHref(href: string): string | null {
  const h = href.toLowerCase();
  if (h.startsWith("tel:")) return "phone";
  if (h.startsWith("mailto:")) return "email";
  if (h.includes("wa.me") || h.includes("whatsapp.com") || h.startsWith("whatsapp:"))
    return "whatsapp";
  if (h.includes("t.me") || h.includes("telegram.me")) return "telegram";
  if (h.includes("vk.com") || h.includes("vk.ru")) return "vk";
  return null;
}

/**
 * Аналитика воронки. Цели-«идентификаторы» (создаются в настройках Метрики):
 *  - phone / email / telegram / vk / whatsapp — обращения (клик по контакту)
 *  - kitten_view — открыл карточку конкретного котёнка (интерес к товару)
 *  - engaged     — вовлечённый визит: >30 сек ИЛИ прокрутка >50% (не «отказ»)
 *  - cta_choose  — нажал кнопку «Выбрать котёнка» (или любой data-ym-goal)
 *
 * Любой элемент с атрибутом data-ym-goal="X" при клике шлёт цель X —
 * так можно размечать кнопки без правки этого файла.
 */
function MetrikaTracker() {
  const pathname = usePathname();
  const isFirst = useRef(true);

  // 1) Хит при клиентской навигации + цель «просмотр карточки котёнка».
  useEffect(() => {
    // /kittens/<slug> — карточка конкретного котёнка (но не сам каталог /kittens).
    if (/^\/kittens\/[^/]+/.test(pathname)) {
      reachGoal("kitten_view");
    }
    if (isFirst.current) {
      isFirst.current = false;
      return; // первую загрузку уже засчитал init
    }
    window.ym?.(COUNTER_ID, "hit", window.location.href);
  }, [pathname]);

  // 2) Обращения (по href) + произвольные CTA (data-ym-goal) — глобально по кликам.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;

      const tagged = target?.closest?.("[data-ym-goal]") as HTMLElement | null;
      const taggedGoal = tagged?.getAttribute("data-ym-goal");
      if (taggedGoal) reachGoal(taggedGoal);

      const link = target?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (link) {
        const goal = goalForHref(link.getAttribute("href") ?? "");
        if (goal) reachGoal(goal);
      }
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  // 3) Вовлечённый визит: >30 сек ИЛИ прокрутка >50% — один раз за сессию.
  useEffect(() => {
    if (sessionStorage.getItem("ym_engaged")) return;

    let done = false;
    const fire = () => {
      if (done) return;
      done = true;
      sessionStorage.setItem("ym_engaged", "1");
      reachGoal("engaged");
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
    const onScroll = () => {
      const reached = window.scrollY + window.innerHeight;
      if (reached >= document.documentElement.scrollHeight * 0.5) fire();
    };

    const timer = window.setTimeout(fire, 30_000);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
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
