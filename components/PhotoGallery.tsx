"use client";

import Image from "next-export-optimize-images/image";
import { useEffect, useRef, useState } from "react";

import { PhotoCarousel } from "@/components/PhotoCarousel";

type PhotoGalleryProps = {
  photos: string[];
  alt: string;
};

export function PhotoGallery({ photos, alt }: PhotoGalleryProps) {
  const [active, setActive] = useState(0);
  const stripRef = useRef<HTMLDivElement>(null);

  // Лента миниатюр следует за активным кадром (при свайпе большого фото).
  useEffect(() => {
    const strip = stripRef.current;
    const thumb = strip?.children[active] as HTMLElement | undefined;
    if (!strip || !thumb) return;
    const left = thumb.offsetLeft - (strip.clientWidth - thumb.clientWidth) / 2;
    strip.scrollTo({ left, behavior: "smooth" });
  }, [active]);

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

  return (
    <div className="space-y-4">
      <div className="relative aspect-square overflow-hidden rounded-5xl border border-border bg-card shadow-lift">
        <PhotoCarousel
          photos={photos}
          alt={alt}
          priority
          showCounter
          sizes="(min-width: 1024px) 60vw, 100vw"
          coverSizes="(min-width: 1024px) 90vw, 150vw"
          active={active}
          onActiveChange={setActive}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/15 to-transparent" />
      </div>

      {photos.length > 1 ? (
        <div
          ref={stripRef}
          className="relative flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {photos.map((photo, index) => {
            const isActive = index === active;
            return (
              <button
                key={`${photo}-${index}`}
                type="button"
                aria-label={`Показать фото ${index + 1}`}
                aria-pressed={isActive}
                className={`relative aspect-square w-[calc((100%-2.25rem)/4)] shrink-0 cursor-pointer overflow-hidden rounded-lg border-2 bg-card transition-all duration-300 sm:w-[calc((100%-3rem)/5)] ${
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
                  className={`h-full w-full ${
                    index === 0 ? "object-cover" : "bg-surface-2 object-contain"
                  }`}
                />
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
