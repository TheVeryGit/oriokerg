"use client";

import { useReducedMotion } from "framer-motion";
import Image from "next-export-optimize-images/image";
import type { KeyboardEvent, MouseEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

type PhotoCarouselProps = {
  photos: string[];
  alt: string;
  sizes: string;
  /** sizes для обложки: кадр 3:2 в квадрате масштабируется ×1.5, поэтому файл нужен крупнее. */
  coverSizes?: string;
  /** Первый кадр грузится сразу (для фото над сгибом). */
  priority?: boolean;
  /** Управляемый режим: активный кадр задаёт родитель (например, миниатюры). */
  active?: number;
  onActiveChange?: (index: number) => void;
  /** Режим карточки в списке: родитель — ссылка, клики по кнопкам не должны переходить. */
  insideLink?: boolean;
  /** Показывать счётчик «2 / 5» в углу. */
  showCounter?: boolean;
  /** Класс для <img> (например, hover-зум в карточке). */
  imageClassName?: string;
};

const hideScrollbar =
  "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden";

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={dir === "left" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"} />
    </svg>
  );
}

/**
 * Квадратная карусель на нативном scroll-snap: свайп пальцем на телефонах и
 * планшетах, трекпад/колесо на ноутбуках, стрелки и точки на десктопе,
 * стрелки клавиатуры. Без JS-библиотек — плавно и на слабых устройствах.
 */
export function PhotoCarousel({
  photos,
  alt,
  sizes,
  coverSizes,
  priority = false,
  active: controlledActive,
  onActiveChange,
  insideLink = false,
  showCounter = false,
  imageClassName = "",
}: PhotoCarouselProps) {
  const reduce = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const [internalActive, setInternalActive] = useState(0);
  const active = Math.min(controlledActive ?? internalActive, photos.length - 1);
  const count = photos.length;

  const readIndex = useCallback(() => {
    const el = trackRef.current;
    if (!el || el.clientWidth === 0) return 0;
    return Math.round(el.scrollLeft / el.getBoundingClientRect().width);
  }, []);

  const goTo = useCallback(
    (index: number) => {
      const el = trackRef.current;
      if (!el) return;
      const next = Math.max(0, Math.min(index, count - 1));
      el.scrollTo({
        left: next * el.getBoundingClientRect().width,
        behavior: reduce ? "auto" : "smooth",
      });
    },
    [count, reduce],
  );

  const handleScroll = useCallback(() => {
    if (rafRef.current !== null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const index = Math.min(readIndex(), count - 1);
      setInternalActive((prev) => {
        if (prev !== index) onActiveChange?.(index);
        return index;
      });
    });
  }, [count, onActiveChange, readIndex]);

  useEffect(
    () => () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    },
    [],
  );

  // Родитель выбрал другой кадр (клик по миниатюре) — докручиваем.
  useEffect(() => {
    if (controlledActive === undefined) return;
    if (controlledActive !== readIndex()) goTo(controlledActive);
  }, [controlledActive, goTo, readIndex]);

  const step = (direction: -1 | 1) => (event: MouseEvent) => {
    if (insideLink) {
      event.preventDefault();
      event.stopPropagation();
    }
    goTo(active + direction);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(active - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(active + 1);
    }
  };

  const multi = count > 1;

  return (
    <div
      className="group/carousel relative h-full w-full"
      role="group"
      aria-roledescription="carousel"
      aria-label={`Фото: ${alt}`}
    >
      <div
        ref={trackRef}
        tabIndex={multi && !insideLink ? 0 : undefined}
        onScroll={multi ? handleScroll : undefined}
        onKeyDown={multi ? onKeyDown : undefined}
        className={`flex h-full w-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-smooth focus-visible:outline-none ${hideScrollbar}`}
      >
        {photos.map((photo, index) => (
          <div
            key={`${photo}-${index}`}
            className="relative h-full w-full shrink-0 snap-center snap-always"
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} из ${count}`}
          >
            {index > 0 ? (
              // Дополнительные фото показываем целиком; поля заполняет размытая копия кадра.
              <Image
                src={photo}
                alt=""
                aria-hidden="true"
                width={64}
                height={64}
                sizes="64px"
                draggable={false}
                className="absolute inset-0 h-full w-full scale-125 select-none object-cover opacity-70 blur-2xl"
              />
            ) : null}
            <Image
              src={photo}
              alt={index === 0 ? alt : `${alt} — фото ${index + 1}`}
              width={1200}
              height={1200}
              priority={priority && index === 0}
              placeholder="blur"
              sizes={index === 0 ? (coverSizes ?? sizes) : sizes}
              draggable={false}
              className={`relative h-full w-full select-none ${
                index === 0 ? "object-cover" : "object-contain"
              } ${imageClassName}`}
            />
          </div>
        ))}
      </div>

      {multi ? (
        <>
          <button
            type="button"
            aria-label="Предыдущее фото"
            disabled={active === 0}
            onClick={step(-1)}
            className="absolute left-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-ink/65 text-ink-foreground opacity-0 backdrop-blur transition-all duration-300 hover:bg-ink/85 focus-visible:opacity-100 disabled:pointer-events-none disabled:!opacity-0 group-hover/carousel:opacity-100 md:flex"
          >
            <Chevron dir="left" />
          </button>
          <button
            type="button"
            aria-label="Следующее фото"
            disabled={active === count - 1}
            onClick={step(1)}
            className="absolute right-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-ink/65 text-ink-foreground opacity-0 backdrop-blur transition-all duration-300 hover:bg-ink/85 focus-visible:opacity-100 disabled:pointer-events-none disabled:!opacity-0 group-hover/carousel:opacity-100 md:flex"
          >
            <Chevron dir="right" />
          </button>

          {showCounter ? (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-3 rounded-full bg-ink/65 px-3 py-1 text-xs font-medium tabular-nums text-ink-foreground backdrop-blur"
            >
              {active + 1} / {count}
            </span>
          ) : null}

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center gap-1.5"
          >
            {photos.map((photo, index) => (
              <span
                key={`${photo}-dot-${index}`}
                className={`h-1.5 rounded-full shadow-soft transition-all duration-300 ${
                  index === active ? "w-5 bg-accent" : "w-1.5 bg-white/60"
                }`}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
