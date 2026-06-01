"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

// useLayoutEffect на клиенте (до отрисовки), useEffect на сервере — без warning.
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

function parseNumeric(value: string) {
  const m = value.replace(/\s/g, "").match(/^(\d+(?:[.,]\d+)?)$/);
  if (!m) return null;
  const decimals = (m[1].split(/[.,]/)[1] || "").length;
  return { target: parseFloat(m[1].replace(",", ".")), decimals };
}

function fmt(n: number, decimals: number) {
  return n.toLocaleString("ru-RU", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function prefersReduced() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Число с анимацией «доезжания» от 0 при попадании в экран.
 * Нечисловые значения (WCF) выводятся как есть. SSR отдаёт финальное число
 * (видно без JS и поисковику); на клиенте до отрисовки сбрасываем в 0 и считаем.
 */
export function CountUpValue({ value }: { value: string }) {
  const parsed = parseNumeric(value);
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);

  useIsoLayoutEffect(() => {
    if (!parsed || prefersReduced()) return;
    setDisplay(fmt(0, parsed.decimals));
  }, []);

  useEffect(() => {
    if (!parsed) return;
    if (prefersReduced()) {
      setDisplay(fmt(parsed.target, parsed.decimals));
      return;
    }
    const node = ref.current;
    if (!node) return;

    let raf = 0;
    let started = false;
    const run = () => {
      const duration = 1300;
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setDisplay(fmt(parsed.target * eased, parsed.decimals));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started) {
          started = true;
          run();
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(node);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!parsed) return <>{value}</>;
  return <span ref={ref}>{display}</span>;
}
