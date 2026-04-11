"use client";

import Image from "next/image";
import { useState } from "react";

type PhotoGalleryProps = {
  photos: string[];
  alt: string;
};

export function PhotoGallery({ photos, alt }: PhotoGalleryProps) {
  const [activePhoto, setActivePhoto] = useState(photos[0] ?? null);

  if (photos.length === 0 || !activePhoto) {
    return <div className="aspect-[4/3] rounded-[2rem] bg-[#161616]" />;
  }

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-[2rem] border border-border bg-card">
        <Image
          src={activePhoto}
          alt={alt}
          width={1200}
          height={900}
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="aspect-[4/3] w-full object-cover"
        />
      </div>

      {photos.length > 1 ? (
        <div className="grid grid-cols-4 gap-3">
          {photos.map((photo) => {
            const isActive = photo === activePhoto;

            return (
              <button
                key={photo}
                type="button"
                className={`overflow-hidden rounded-2xl border bg-card ${
                  isActive ? "border-accent" : "border-border"
                }`}
                onClick={() => setActivePhoto(photo)}
              >
                <Image
                  src={photo}
                  alt={alt}
                  width={400}
                  height={400}
                  sizes="25vw"
                  className="aspect-square w-full object-cover"
                />
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
