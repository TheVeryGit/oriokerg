"use client";

import { useEffect, useState } from "react";

import { formatAge } from "@/lib/format";

/**
 * Бейдж возраста для карточки котёнка. Возраст считается на клиенте
 * (всегда актуален). До расчёта рендерит null — не мигает плейсхолдером
 * и не вызывает сдвига вёрстки (бейдж — оверлей над фото).
 */
export function AgeBadge({
  birthDate,
  className,
}: {
  birthDate: string;
  className?: string;
}) {
  const [age, setAge] = useState<string | null>(null);

  useEffect(() => {
    setAge(formatAge(birthDate));
  }, [birthDate]);

  if (!age) return null;

  return (
    <span className={className}>
      <svg
        viewBox="0 0 24 24"
        className="h-3.5 w-3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
      {age}
    </span>
  );
}
