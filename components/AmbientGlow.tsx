"use client";

import { useEffect, useRef } from "react";

/**
 * Фоновое «свечение» за контентом: два мягких золотых пятна, которые медленно
 * смещаются по мере прокрутки. Только transform (дёшево для GPU), без blur-фильтров.
 * При prefers-reduced-motion стоит на месте. Фото и карточки непрозрачные —
 * свечение видно только в пустых зонах между блоками.
 */
export function AmbientGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      el.style.setProperty("--sp", progress.toFixed(4));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={ref} className="ambient" aria-hidden="true">
      <div className="ambient__glow ambient__glow--a" />
      <div className="ambient__glow ambient__glow--b" />
    </div>
  );
}
