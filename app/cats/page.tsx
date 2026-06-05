import { CatsCollection } from "@/components/CatsCollection";
import { PageHeader } from "@/components/PageHeader";
import { getCats } from "@/lib/content";

export const metadata = {
  title: "Наши кошки",
  description:
    "Производители питомника OrioKerg — мамы и папы наших помётов: проверенные линии, здоровье и характер ориентальной кошки.",
};

export default function CatsPage() {
  // Страница «Наши кошки» — только производители (мамы и папы помётов).
  const cats = getCats().filter((cat) => cat.type === "Производитель");

  return (
    <div className="pb-24">
      <PageHeader
        eyebrow="Производители"
        title="Наши кошки"
        intro="Мамы и папы наших помётов. За каждым производителем — здоровье, проверенные линии и характер настоящей ориентальной кошки."
      />
      <div className="mx-auto mt-10 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <CatsCollection cats={cats} />
      </div>
    </div>
  );
}
