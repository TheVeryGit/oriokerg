"use client";

import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import Image from "next-export-optimize-images/image";
import { useState } from "react";

type PhotoGalleryProps = {
  photos: string[];
  alt: string;
};

export function PhotoGallery({ photos, alt }: PhotoGalleryProps) {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();

  if (photos.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-5xl border border-border bg-gradient-to-br from-accent/5 to-surface-2">
        <svg
          viewBox="0 0 24 24"
          className="h-16 w-16 text-accent/25"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 9c-3.5 0-6 2.6-6 5.3 0 1.6 1.3 2.7 3 2.7.9 0 1.7-.3 3-.3s2.1.3 3 .3c1.7 0 3-1.1 3-2.7C18 11.6 15.5 9 12 9Zm-6.5-.5A1.8 1.8 0 1 0 4 6.4a4 4 0 0 0 1.5 2.1Zm13 0A4 4 0 0 0 20 6.4a1.8 1.8 0 1 0-1.5 2.1ZM9 7.2A1.8 1.8 0 1 0 7.4 4 4 4 0 0 0 9 7.2Zm6 0A4 4 0 0 0 16.6 4 1.8 1.8 0 1 0 15 7.2Z" />
        </svg>
      </div>
    );
  }

  const activePhoto = photos[Math.min(active, photos.length - 1)];

  return (
    <div className="space-y-4">
      <div className="relative aspect-square overflow-hidden rounded-5xl border border-border bg-card shadow-lift">
        <AnimatePresence mode="wait" initial={false}>
          <m.div
            key={activePhoto}
            initial={reduce ? false : { opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.01 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={activePhoto}
              alt={alt}
              width={1200}
              height={900}
              priority
              placeholder="blur"
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="h-full w-full object-cover"
            />
          </m.div>
        </AnimatePresence>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/15 to-transparent" />
      </div>

      {photos.length > 1 ? (
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
          {photos.map((photo, index) => {
            const isActive = index === active;
            return (
              <button
                key={`${photo}-${index}`}
                type="button"
                aria-label={`Показать фото ${index + 1}`}
                aria-pressed={isActive}
                className={`relative aspect-square cursor-pointer overflow-hidden rounded-2xl border-2 bg-card transition-all duration-300 ${
                  isActive
                    ? "border-accent shadow-soft"
                    : "border-transparent opacity-70 hover:opacity-100"
                }`}
                onClick={() => setActive(index)}
              >
                <Image
                  src={photo}
                  alt=""
                  width={240}
                  height={240}
                  sizes="20vw"
                  className="h-full w-full object-cover"
                />
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
