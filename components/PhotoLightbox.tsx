"use client";

import Image from "next-export-optimize-images/image";
import type { PointerEvent as ReactPointerEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type PhotoLightboxProps = {
  photos: string[];
  /** Оригиналы в полном разрешении: грузятся поверх сжатой версии открытого фото. */
  fullPhotos?: (string | null)[];
  alt: string;
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
};

type View = { scale: number; x: number; y: number };

type Gesture =
  | {
      type: "swipe";
      startX: number;
      startY: number;
      startTime: number;
      axis: "x" | "y" | null;
    }
  | { type: "pan"; startX: number; startY: number; origX: number; origY: number }
  | { type: "pinch"; startDist: number; startScale: number; origX: number; origY: number };

const MAX_SCALE = 4;
const DOUBLE_TAP_SCALE = 2.5;
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const IDENTITY: View = { scale: 1, x: 0, y: 0 };

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function Icon({ d }: { d: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}

/**
 * Полноэкранный просмотр фото: свайп между фото, увеличение щипком / двойным
 * тапом / колесом мыши, перетаскивание увеличенного фото, закрытие свайпом
 * вниз, Esc или кнопкой «назад» в браузере. Без сторонних библиотек.
 */
export function PhotoLightbox({
  photos,
  fullPhotos,
  alt,
  index,
  onIndexChange,
  onClose,
}: PhotoLightboxProps) {
  const [mounted, setMounted] = useState(false);
  const [view, setView] = useState<View>(IDENTITY);
  const [dragX, setDragX] = useState(0);
  const [dragY, setDragY] = useState(0);
  const [gestureActive, setGestureActive] = useState(false);
  // Какие оригиналы уже загружены (их держим в DOM, чтобы не грузить повторно).
  const [fullLoaded, setFullLoaded] = useState<Set<number>>(() => new Set());
  const stageRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const gesture = useRef<Gesture | null>(null);
  const lastTap = useRef(0);
  const lastPointerType = useRef("mouse");
  const viewRef = useRef(view);
  /** Меняем вид и сразу обновляем ref — иначе обработчик ниже прочтёт старый масштаб. */
  const applyView = useCallback((next: View) => {
    viewRef.current = next;
    setView(next);
  }, []);
  const count = photos.length;

  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  // Уникальная метка этого открытия в истории браузера. Next копирует state
  // между записями, поэтому простой флаг true мог «прилипнуть» к самой странице.
  const historyToken = useRef(`lb-${Math.random().toString(36).slice(2)}`);

  useEffect(() => setMounted(true), []);

  // Блокируем прокрутку страницы, ставим фокус, возвращаем его при закрытии.
  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus?.();
    };
  }, []);

  // «Назад» на телефоне закрывает просмотр, а не уводит со страницы.
  // Состояние Next сохраняем (иначе роутер перезагрузит страницу на popstate).
  useEffect(() => {
    const token = historyToken.current;
    window.history.pushState({ ...(window.history.state ?? {}), photoLightbox: token }, "");
    const onPop = () => {
      if (window.history.state?.photoLightbox !== token) onCloseRef.current();
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const requestClose = useCallback(() => {
    if (window.history.state?.photoLightbox === historyToken.current) {
      window.history.back(); // popstate → onClose
    } else {
      onCloseRef.current();
    }
  }, []);

  const go = useCallback(
    (next: number) => {
      if (next < 0 || next >= count) return;
      applyView(IDENTITY);
      onIndexChange(next);
    },
    [applyView, count, onIndexChange],
  );

  useEffect(() => {
    applyView(IDENTITY);
  }, [applyView, index]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") requestClose();
      else if (event.key === "ArrowLeft") go(index - 1);
      else if (event.key === "ArrowRight") go(index + 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, index, requestClose]);

  /** Масштаб вокруг точки (px от центра сцены), с ограничением сдвига. */
  const zoomAt = useCallback((nextScale: number, px: number, py: number) => {
    const stage = stageRef.current;
    const current = viewRef.current;
    const scale = clamp(nextScale, 1, MAX_SCALE);
    if (scale <= 1.01 || !stage) {
      applyView(IDENTITY);
      return;
    }
    const ratio = scale / current.scale;
    const maxX = ((scale - 1) * stage.clientWidth) / 2;
    const maxY = ((scale - 1) * stage.clientHeight) / 2;
    applyView({
      scale,
      x: clamp(px - (px - current.x) * ratio, -maxX, maxX),
      y: clamp(py - (py - current.y) * ratio, -maxY, maxY),
    });
  }, [applyView]);

  // Колесо мыши/трекпад — увеличение к курсору (нужен не-passive слушатель).
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const rect = stage.getBoundingClientRect();
      const px = event.clientX - rect.left - rect.width / 2;
      const py = event.clientY - rect.top - rect.height / 2;
      zoomAt(viewRef.current.scale * Math.exp(-event.deltaY * 0.0025), px, py);
    };
    stage.addEventListener("wheel", onWheel, { passive: false });
    return () => stage.removeEventListener("wheel", onWheel);
  }, [mounted, zoomAt]);

  const startGesture = () => {
    const list = Array.from(pointers.current.values());
    const current = viewRef.current;
    if (list.length >= 2) {
      const [a, b] = list;
      gesture.current = {
        type: "pinch",
        startDist: Math.hypot(a.x - b.x, a.y - b.y) || 1,
        startScale: current.scale,
        origX: current.x,
        origY: current.y,
      };
      setDragX(0);
      setDragY(0);
    } else if (list.length === 1) {
      const [p] = list;
      gesture.current =
        current.scale > 1
          ? { type: "pan", startX: p.x, startY: p.y, origX: current.x, origY: current.y }
          : { type: "swipe", startX: p.x, startY: p.y, startTime: performance.now(), axis: null };
    } else {
      gesture.current = null;
    }
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest("button")) return;
    lastPointerType.current = event.pointerType;
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // указатель уже неактивен — продолжаем без захвата
    }
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    setGestureActive(true);
    startGesture();
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!pointers.current.has(event.pointerId)) return;
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    const g = gesture.current;
    const stage = stageRef.current;
    if (!g || !stage) return;

    if (g.type === "pinch") {
      const [a, b] = Array.from(pointers.current.values());
      if (!a || !b) return;
      const scale = clamp((g.startScale * Math.hypot(a.x - b.x, a.y - b.y)) / g.startDist, 1, MAX_SCALE);
      const maxX = ((scale - 1) * stage.clientWidth) / 2;
      const maxY = ((scale - 1) * stage.clientHeight) / 2;
      const ratio = scale / g.startScale;
      applyView({
        scale,
        x: clamp(g.origX * ratio, -maxX, maxX),
        y: clamp(g.origY * ratio, -maxY, maxY),
      });
    } else if (g.type === "pan") {
      const scale = viewRef.current.scale;
      const maxX = ((scale - 1) * stage.clientWidth) / 2;
      const maxY = ((scale - 1) * stage.clientHeight) / 2;
      applyView({
        scale,
        x: clamp(g.origX + event.clientX - g.startX, -maxX, maxX),
        y: clamp(g.origY + event.clientY - g.startY, -maxY, maxY),
      });
    } else {
      const dx = event.clientX - g.startX;
      const dy = event.clientY - g.startY;
      if (!g.axis && Math.hypot(dx, dy) > 8) g.axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      if (g.axis === "x") {
        // На краях — «резиновое» сопротивление.
        const atEdge = (index === 0 && dx > 0) || (index === count - 1 && dx < 0);
        setDragX(atEdge ? dx * 0.3 : dx);
      } else if (g.axis === "y") {
        setDragY(Math.max(0, dy));
      }
    }
  };

  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!pointers.current.has(event.pointerId)) return;
    const g = gesture.current;
    const stage = stageRef.current;
    pointers.current.delete(event.pointerId);

    const moved =
      g && g.type !== "pinch"
        ? Math.hypot(event.clientX - g.startX, event.clientY - g.startY)
        : Infinity;

    if (g?.type === "swipe" && stage && g.axis) {
      const dx = event.clientX - g.startX;
      const dy = event.clientY - g.startY;
      const elapsed = Math.max(performance.now() - g.startTime, 1);
      if (g.axis === "x") {
        const fast = Math.abs(dx) / elapsed > 0.5;
        if ((Math.abs(dx) > stage.clientWidth * 0.18 || fast) && Math.abs(dx) > 30) {
          go(dx < 0 ? index + 1 : index - 1);
        }
      } else if (dy > 120 || (dy > 50 && dy / elapsed > 0.5)) {
        requestClose();
      }
    } else if (stage && moved < 8 && event.pointerType !== "mouse") {
      // Тап без движения (и в обычном, и в увеличенном режиме):
      // двойной тап — увеличить / вернуть.
      {
        const now = performance.now();
        if (now - lastTap.current < 300) {
          lastTap.current = 0;
          const rect = stage.getBoundingClientRect();
          if (viewRef.current.scale > 1) applyView(IDENTITY);
          else
            zoomAt(
              DOUBLE_TAP_SCALE,
              event.clientX - rect.left - rect.width / 2,
              event.clientY - rect.top - rect.height / 2,
            );
        } else {
          lastTap.current = now;
        }
      }
    }

    setDragX(0);
    setDragY(0);
    if (pointers.current.size === 0) {
      gesture.current = null;
      setGestureActive(false);
      if (viewRef.current.scale < 1.05) applyView(IDENTITY);
    } else {
      startGesture(); // щипок → остался один палец: продолжаем перетаскивание
    }
  };

  if (!mounted) return null;

  const zoomed = view.scale > 1;
  const backdropOpacity = 1 - Math.min(dragY / 400, 0.6);

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Фото: ${alt}`}
      className="fixed inset-0 z-[200] flex flex-col text-white"
      style={{ backgroundColor: `rgba(0,0,0,${0.95 * backdropOpacity})` }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between p-3 sm:p-5">
        <span className="flex items-center gap-2 rounded-full bg-black/50 px-3 py-1 text-sm tabular-nums">
          {index + 1} / {count}
          {fullPhotos?.[index] ? (
            <span
              className={`text-[0.65rem] font-semibold tracking-wider transition-opacity ${
                fullLoaded.has(index) ? "text-accent opacity-100" : "animate-pulse opacity-60"
              }`}
              title={fullLoaded.has(index) ? "Полное разрешение" : "Загружаем полное разрешение"}
            >
              HD
            </span>
          ) : null}
        </span>
        <button
          ref={closeRef}
          type="button"
          aria-label="Закрыть"
          onClick={requestClose}
          className="pointer-events-auto flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-black/50 transition-colors hover:bg-white/15"
        >
          <Icon d="M6 6l12 12M18 6L6 18" />
        </button>
      </div>

      <div
        ref={stageRef}
        className={`relative flex-1 touch-none select-none overflow-hidden ${
          zoomed ? "cursor-grab active:cursor-grabbing" : "cursor-zoom-in"
        }`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onDoubleClick={(event) => {
          // Мышь: двойной клик — увеличить к курсору / вернуть (тач — в onPointerUp).
          const stage = stageRef.current;
          if (!stage || lastPointerType.current !== "mouse") return;
          const rect = stage.getBoundingClientRect();
          if (viewRef.current.scale > 1) applyView(IDENTITY);
          else
            zoomAt(
              DOUBLE_TAP_SCALE,
              event.clientX - rect.left - rect.width / 2,
              event.clientY - rect.top - rect.height / 2,
            );
        }}
      >
        <div
          className="flex h-full"
          style={{
            transform: `translate3d(calc(${-index * 100}% + ${dragX}px), ${dragY}px, 0)`,
            transition: gestureActive ? "none" : `transform .4s ${EASE}`,
          }}
        >
          {photos.map((photo, i) => (
            <div
              key={`${photo}-${i}`}
              className="flex h-full w-full shrink-0 items-center justify-center p-2 sm:p-8"
            >
              {Math.abs(i - index) <= 1 ? (
                <div
                  className="relative h-full w-full"
                  style={
                    i === index
                      ? {
                          transform: `translate3d(${view.x}px, ${view.y}px, 0) scale(${view.scale})`,
                          transition: gestureActive ? "none" : `transform .3s ${EASE}`,
                        }
                      : undefined
                  }
                >
                  <Image
                    src={photo}
                    alt={i === 0 ? alt : `${alt} — фото ${i + 1}`}
                    width={3200}
                    height={3200}
                    sizes="200vw"
                    priority={i === index}
                    draggable={false}
                    className="pointer-events-none h-full w-full object-contain"
                  />
                  {fullPhotos?.[i] && (i === index || fullLoaded.has(i)) ? (
                    // Оригинал камеры поверх сжатой версии — плавно проявляется после загрузки.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={fullPhotos[i] as string}
                      alt=""
                      aria-hidden="true"
                      decoding="async"
                      draggable={false}
                      onLoad={() =>
                        setFullLoaded((prev) => (prev.has(i) ? prev : new Set(prev).add(i)))
                      }
                      className={`pointer-events-none absolute inset-0 h-full w-full object-contain transition-opacity duration-500 ${
                        fullLoaded.has(i) ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  ) : null}
                </div>
              ) : null}
            </div>
          ))}
        </div>

        {count > 1 && !zoomed ? (
          <>
            <button
              type="button"
              aria-label="Предыдущее фото"
              disabled={index === 0}
              onClick={() => go(index - 1)}
              className="absolute left-4 top-1/2 hidden h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/50 transition-colors hover:bg-white/15 disabled:opacity-0 md:flex"
            >
              <Icon d="M15 5l-7 7 7 7" />
            </button>
            <button
              type="button"
              aria-label="Следующее фото"
              disabled={index === count - 1}
              onClick={() => go(index + 1)}
              className="absolute right-4 top-1/2 hidden h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/50 transition-colors hover:bg-white/15 disabled:opacity-0 md:flex"
            >
              <Icon d="M9 5l7 7-7 7" />
            </button>
          </>
        ) : null}
      </div>

      <p className="pointer-events-none pb-4 pt-2 text-center text-xs text-white/50">
        {zoomed ? "Двойной тап — вернуть" : "Двойной тап или щипок — увеличить"}
      </p>
    </div>,
    document.body,
  );
}
