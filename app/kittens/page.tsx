import { KittensCollection } from "@/components/KittensCollection";
import { PageHeader } from "@/components/PageHeader";
import { getKittens } from "@/lib/content";

export const metadata = {
  title: "Купить ориентального котёнка в Москве",
  description:
    "Ориентальные котята в продаже — питомник OrioKerg, Москва. Здоровые, социализированные, с документами WCF и ветеринарным паспортом. Доставка по России.",
};

export default function KittensPage() {
  const kittens = getKittens();

  return (
    <div className="pb-24">
      <PageHeader
        eyebrow="Свободные котята"
        title="Котята в продаже"
        intro="Малыши из питомника OrioKerg — здоровые, социализированные и готовые стать частью вашей семьи. Все котята передаются с документами и ветеринарным паспортом."
      />
      <div className="mx-auto mt-10 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <KittensCollection kittens={kittens} />
      </div>
    </div>
  );
}
