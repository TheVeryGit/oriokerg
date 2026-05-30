import { CatsCollection } from "@/components/CatsCollection";
import { PageHeader } from "@/components/PageHeader";
import { getCats } from "@/lib/content";

export const metadata = {
  title: "Наши кошки",
  description:
    "Производители и подрастающие животные питомника OrioKerg — проверенные линии, здоровье и характер ориентальной кошки.",
};

export default function CatsPage() {
  const cats = getCats();

  return (
    <div className="pb-24">
      <PageHeader
        eyebrow="Коллекция"
        title="Наши кошки"
        intro="Наши производители и подрастающие котята. За каждым животным — здоровье, проверенные линии и характер настоящей ориентальной кошки."
      />
      <div className="mx-auto mt-10 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <CatsCollection cats={cats} />
      </div>
    </div>
  );
}
