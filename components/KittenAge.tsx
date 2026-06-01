"use client";

import { useEffect, useState } from "react";

import { formatAge } from "@/lib/format";

/**
 * Возраст котёнка, вычисляемый в браузере от текущей даты — поэтому
 * всегда актуален (сайт статический, дата сборки бы «застыла»).
 * До маунта показываем прочерк, чтобы не было рассинхрона гидрации.
 */
export function KittenAge({ birthDate }: { birthDate: string }) {
  const [age, setAge] = useState<string | null>(null);

  useEffect(() => {
    setAge(formatAge(birthDate));
  }, [birthDate]);

  return <>{age ?? "—"}</>;
}
