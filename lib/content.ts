import fs from "fs";
import path from "path";

import matter from "gray-matter";

export { formatPrice } from "./format";

type BaseEntry = {
  slug: string;
  name: string;
  color: string;
  gender: string;
  description: string;
  photos: string[];
};

export type CatEntry = BaseEntry & {
  type: string;
  /** Телосложение ориентала: классический / современный / экстремальный. */
  bodyType?: string;
  price?: number;
  available: boolean;
};

export type KittenEntry = BaseEntry & {
  /** Цена «в любимцы» (пет-класс). */
  pricePet?: number;
  /** Цена «в разведение» (с правом разведения). */
  priceBreed?: number;
  /** Дата рождения в ISO-формате (YYYY-MM-DD). Возраст считается на клиенте. */
  birthDate?: string;
  /** Кличка матери. */
  mother?: string;
  /** Кличка отца. */
  father?: string;
  /** Телосложение ориентала: классический / современный / экстремальный. */
  bodyType?: string;
  reserved: boolean;
};

export type ContactsSettings = {
  phone: string;
  telegram: string;
  vk: string;
  address?: string;
  /** Кто оператор перс. данных (для политики конфиденциальности). */
  operator?: string;
  /** E-mail для обращений по перс. данным. */
  email?: string;
};

export type StatItem = { value: string; suffix: string; label: string };
export type TextItem = { title: string; text: string };
export type ReviewItem = { name: string; city: string; text: string };

export type HomepageSettings = {
  hero_title: string;
  hero_subtitle: string;
  hero_image?: string;
  intro_text: string;
  stats: StatItem[];
  features_title: string;
  features: TextItem[];
  breed_title: string;
  breed_text: string;
  breed_traits: TextItem[];
  steps_title: string;
  steps: TextItem[];
  reviews_title: string;
  reviews: ReviewItem[];
  cta_title: string;
  cta_text: string;
};

export type AboutSettings = {
  title: string;
  body?: string;
  photo?: string;
};

export type BreedSettings = {
  title: string;
  intro_text: string;
  hero_image?: string;
  traits_title: string;
  traits: TextItem[];
  care_title: string;
  care: TextItem[];
  cta_title: string;
  cta_text: string;
};

export type FaqItem = { q: string; a: string; category?: string };
export type FaqSettings = {
  title: string;
  intro: string;
  items: FaqItem[];
};

export const DEFAULT_HERO_IMAGE = "/images/hero-cat.jpg";

const contentRoot = path.join(process.cwd(), "content");

function listMarkdownFiles(directory: string) {
  if (!fs.existsSync(directory)) {
    return [];
  }

  return fs
    .readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && /\.md$/i.test(entry.name))
    .map((entry) => entry.name);
}

function normalizeText(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function normalizeNumber(value: unknown) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : undefined;
  }

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
}

function normalizeBoolean(value: unknown, fallback: boolean) {
  return typeof value === "boolean" ? value : fallback;
}

/**
 * Нормализует дату в ISO-строку `YYYY-MM-DD`. YAML-фронтматтер парсит
 * `2026-04-01` как JS Date, а Decap при `format` может писать строку —
 * учитываем оба случая.
 */
function normalizeDate(value: unknown): string | undefined {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = new Date(value.trim());
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toISOString().slice(0, 10);
    }
  }
  return undefined;
}

function normalizePhotos(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((photo) => {
      if (typeof photo === "string") {
        return photo;
      }

      if (
        photo &&
        typeof photo === "object" &&
        "photo" in photo &&
        typeof photo.photo === "string"
      ) {
        return photo.photo;
      }

      return null;
    })
    .filter((photo): photo is string => Boolean(photo));
}

function normalizeList<T>(
  value: unknown,
  mapItem: (raw: Record<string, unknown>) => T | null,
): T[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((raw) =>
      raw && typeof raw === "object"
        ? mapItem(raw as Record<string, unknown>)
        : null,
    )
    .filter((item): item is T => item !== null);
}

function readFileEntry(directoryName: string, fileName: string) {
  const fullPath = path.join(contentRoot, directoryName, fileName);
  const rawFile = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(rawFile);

  return {
    slug: fileName.replace(/\.md$/i, ""),
    data,
    content: content.trim(),
  };
}

function readSettingsEntry(fileName: string) {
  const normalizedFileName = fileName.endsWith(".md") ? fileName : `${fileName}.md`;
  const fullPath = path.join(contentRoot, "settings", normalizedFileName);
  const rawFile = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(rawFile);

  return {
    data,
    content: content.trim(),
  };
}

export function getCats(): CatEntry[] {
  const directory = path.join(contentRoot, "cats");

  return listMarkdownFiles(directory)
    .map((fileName) => {
      const entry = readFileEntry("cats", fileName);

      return {
        slug: entry.slug,
        name: normalizeText(entry.data.name, entry.slug),
        type: normalizeText(entry.data.type, "Производитель"),
        bodyType: normalizeText(entry.data.body_type) || undefined,
        gender: normalizeText(entry.data.gender, "Кошка"),
        color: normalizeText(entry.data.color, "Не указан"),
        price: normalizeNumber(entry.data.price),
        description: normalizeText(entry.data.description, entry.content),
        photos: normalizePhotos(entry.data.photos),
        available: normalizeBoolean(entry.data.available, true),
      };
    })
    .sort((left, right) => left.name.localeCompare(right.name, "ru"));
}

export function getCatBySlug(slug: string) {
  return getCats().find((cat) => cat.slug === slug);
}

export function getKittens(): KittenEntry[] {
  const directory = path.join(contentRoot, "kittens");

  return listMarkdownFiles(directory)
    .map((fileName) => {
      const entry = readFileEntry("kittens", fileName);

      return {
        slug: entry.slug,
        name: normalizeText(entry.data.name, entry.slug),
        gender: normalizeText(entry.data.gender, "Кошка"),
        color: normalizeText(entry.data.color, "Не указан"),
        // Старое поле `price` остаётся фолбэком для «в любимцы»,
        // чтобы ранее созданные котята не потеряли цену.
        pricePet:
          normalizeNumber(entry.data.price_pet) ??
          normalizeNumber(entry.data.price),
        priceBreed: normalizeNumber(entry.data.price_breed),
        birthDate: normalizeDate(entry.data.birth_date),
        mother: normalizeText(entry.data.mother) || undefined,
        father: normalizeText(entry.data.father) || undefined,
        bodyType: normalizeText(entry.data.body_type) || undefined,
        description: normalizeText(entry.data.description, entry.content),
        photos: normalizePhotos(entry.data.photos),
        reserved: normalizeBoolean(entry.data.reserved, false),
      };
    })
    .sort((left, right) => left.name.localeCompare(right.name, "ru"));
}

/* ----------------------------- Default content ---------------------------- */
/* Used as fallback when the corresponding CMS field is empty, so the site
   never renders blank sections even before the owner fills everything in.   */

const DEFAULT_HOMEPAGE: HomepageSettings = {
  hero_title: "Ориентальные кошки с *характером* и родословной",
  hero_subtitle:
    "Здоровые, социализированные котята из питомника OrioKerg. Документы, прививки и поддержка на всю жизнь.",
  hero_image: "",
  intro_text:
    "Знакомьтесь с котятами, их родителями и историей питомника — честно, с документами и заботой о каждой детали.",
  stats: [
    { value: "8", suffix: " лет", label: "питомнику" },
    { value: "120", suffix: "+", label: "счастливых семей" },
    { value: "WCF", suffix: "", label: "регистрация" },
    { value: "4.9", suffix: "", label: "средняя оценка" },
  ],
  features_title: "Что вы получаете вместе с котёнком",
  features: [
    {
      title: "Здоровье под контролем",
      text: "Тесты на генетические заболевания, наблюдение ветеринара и прививки по возрасту.",
    },
    {
      title: "Социализация с рождения",
      text: "Котята растут в доме среди людей и звуков — спокойные, ручные и ласковые.",
    },
    {
      title: "Полный пакет документов",
      text: "Метрика, договор и ветеринарный паспорт едут вместе с малышом.",
    },
    {
      title: "Поддержка на всю жизнь",
      text: "Консультируем по питанию, уходу и воспитанию столько, сколько нужно.",
    },
  ],
  breed_title: "Ориентальная кошка",
  breed_text:
    "Изящные, преданные и невероятно общительные. Ориенталы выбирают одного человека и становятся настоящей тенью — рядом в любую минуту.",
  breed_traits: [
    { title: "Характер-компаньон", text: "Ориенталы привязываются к человеку, ходят следом и любят «разговаривать»." },
    { title: "Грация и элегантность", text: "Точёный силуэт, миндалевидные глаза и шелковистая короткая шерсть." },
    { title: "Высокий интеллект", text: "Быстро учатся, играют в апорт и обожают головоломки и внимание." },
  ],
  steps_title: "Как забрать котёнка",
  steps: [
    { title: "Знакомство", text: "Пишете нам — присылаем фото, видео и рассказываем о малышах." },
    { title: "Бронь", text: "Выбираете котёнка и вносите бронь, чтобы он дождался переезда." },
    { title: "Подготовка", text: "Прививки, документы и приучение к лотку и когтеточке." },
    { title: "Переезд", text: "Передаём котёнка с пакетом документов и заботой о деталях." },
  ],
  reviews_title: "Что говорят семьи",
  reviews: [
    {
      name: "Анна",
      city: "Москва",
      text: "Котёнок приехал здоровым, ласковым и совершенно ручным. Заводчик на связи до сих пор!",
    },
    {
      name: "Дмитрий",
      city: "Казань",
      text: "Всё честно: показали родителей, документы, отвечали на любые вопросы. Рекомендую.",
    },
    {
      name: "Елена",
      city: "Санкт-Петербург",
      text: "Наш питомец — чудо: воспитанный, чистоплотный, обожает всю семью. Спасибо OrioKerg!",
    },
  ],
  cta_title: "Хотите познакомиться с котёнком?",
  cta_text:
    "Напишите нам — расскажем о доступных малышах, пришлём фото и видео, поможем выбрать вашего питомца.",
};

const DEFAULT_BREED: BreedSettings = {
  title: "Ориентальная кошка",
  intro_text:
    "Аристократичная, преданная и невероятно живая. Ориенталы похожи на сиамских кошек силуэтом, но поражают бесконечным разнообразием окрасов — их более трёхсот.",
  hero_image: "",
  traits_title: "Характер и внешность",
  traits: [
    { title: "Преданность", text: "Выбирают «своего» человека и следуют за ним повсюду — настоящие кошки-компаньоны." },
    { title: "Общительность", text: "Любят «разговаривать» мелодичным голосом и всегда участвуют в жизни семьи." },
    { title: "Интеллект", text: "Сообразительны, легко учат трюки, играют в апорт и осваивают головоломки." },
    { title: "Энергия", text: "Активны и игривы во взрослом возрасте — им нужны игры, внимание и компания." },
    { title: "Элегантность", text: "Стройное тело, длинные линии, большие уши и выразительные миндалевидные глаза." },
    { title: "Простой уход", text: "Короткая шелковистая шерсть почти не линяет — достаточно еженедельного вычёсывания." },
  ],
  care_title: "Что важно знать владельцу",
  care: [
    { title: "Питание", text: "Качественный корм или сбалансированный рацион, всегда свежая вода." },
    { title: "Игры", text: "Активные игрушки, полки и комплексы — ориенталу важно движение." },
    { title: "Тепло", text: "Короткая шерсть плохо греет: любят тёплые лежанки и солнечные места." },
    { title: "Внимание", text: "Не переносят одиночество — лучше заводить пару или уделять много времени." },
  ],
  cta_title: "Готовы к встрече с ориенталом?",
  cta_text:
    "Расскажем о доступных котятах и поможем выбрать малыша, который подойдёт именно вам.",
};

const asStat = (raw: Record<string, unknown>): StatItem => ({
  value: normalizeText(raw.value),
  suffix: normalizeText(raw.suffix),
  label: normalizeText(raw.label),
});

const asTextItem = (raw: Record<string, unknown>): TextItem | null => {
  const title = normalizeText(raw.title);
  const text = normalizeText(raw.text);
  return title || text ? { title, text } : null;
};

const asReview = (raw: Record<string, unknown>): ReviewItem | null => {
  const text = normalizeText(raw.text);
  return text
    ? { name: normalizeText(raw.name), city: normalizeText(raw.city), text }
    : null;
};

export function getHomepage(): HomepageSettings {
  const data = readSettingsEntry("homepage").data as Record<string, unknown>;
  const stats = normalizeList(data.stats, asStat).filter((s) => s.value || s.label);
  const features = normalizeList(data.features, asTextItem);
  const breedTraits = normalizeList(data.breed_traits, asTextItem);
  const steps = normalizeList(data.steps, asTextItem);
  const reviews = normalizeList(data.reviews, asReview);

  return {
    hero_title: normalizeText(data.hero_title, DEFAULT_HOMEPAGE.hero_title),
    hero_subtitle: normalizeText(data.hero_subtitle, DEFAULT_HOMEPAGE.hero_subtitle),
    hero_image: normalizeText(data.hero_image),
    intro_text: normalizeText(data.intro_text, DEFAULT_HOMEPAGE.intro_text),
    stats: stats.length ? stats : DEFAULT_HOMEPAGE.stats,
    features_title: normalizeText(data.features_title, DEFAULT_HOMEPAGE.features_title),
    features: features.length ? features : DEFAULT_HOMEPAGE.features,
    breed_title: normalizeText(data.breed_title, DEFAULT_HOMEPAGE.breed_title),
    breed_text: normalizeText(data.breed_text, DEFAULT_HOMEPAGE.breed_text),
    breed_traits: breedTraits.length ? breedTraits : DEFAULT_HOMEPAGE.breed_traits,
    steps_title: normalizeText(data.steps_title, DEFAULT_HOMEPAGE.steps_title),
    steps: steps.length ? steps : DEFAULT_HOMEPAGE.steps,
    reviews_title: normalizeText(data.reviews_title, DEFAULT_HOMEPAGE.reviews_title),
    reviews: reviews.length ? reviews : DEFAULT_HOMEPAGE.reviews,
    cta_title: normalizeText(data.cta_title, DEFAULT_HOMEPAGE.cta_title),
    cta_text: normalizeText(data.cta_text, DEFAULT_HOMEPAGE.cta_text),
  };
}

export function getBreed(): BreedSettings {
  let data: Record<string, unknown> = {};
  try {
    data = readSettingsEntry("breed").data as Record<string, unknown>;
  } catch {
    // breed.md may not exist yet — fall back to defaults entirely.
  }
  const traits = normalizeList(data.traits, asTextItem);
  const care = normalizeList(data.care, asTextItem);

  return {
    title: normalizeText(data.title, DEFAULT_BREED.title),
    intro_text: normalizeText(data.intro_text, DEFAULT_BREED.intro_text),
    hero_image: normalizeText(data.hero_image),
    traits_title: normalizeText(data.traits_title, DEFAULT_BREED.traits_title),
    traits: traits.length ? traits : DEFAULT_BREED.traits,
    care_title: normalizeText(data.care_title, DEFAULT_BREED.care_title),
    care: care.length ? care : DEFAULT_BREED.care,
    cta_title: normalizeText(data.cta_title, DEFAULT_BREED.cta_title),
    cta_text: normalizeText(data.cta_text, DEFAULT_BREED.cta_text),
  };
}

const DEFAULT_FAQ: FaqSettings = {
  title: "Частые вопросы",
  intro:
    "Собрали ответы на вопросы, которые чаще всего задают будущие владельцы. Не нашли свой — напишите нам, с радостью ответим.",
  items: [
    {
      q: "Как забронировать котёнка?",
      a: "Выбираете малыша и вносите предоплату — она закрепляет котёнка за вами. Остаток оплачивается при передаче. До переезда держим вас в курсе: фото, видео, новости о малыше.",
      category: "Бронь и оплата",
    },
    {
      q: "Что входит в стоимость котёнка?",
      a: "Метрика (родословная), ветеринарный паспорт с прививками по возрасту, договор купли-продажи, стартовый запас привычного корма и пожизненная поддержка по уходу и воспитанию.",
      category: "Бронь и оплата",
    },
    {
      q: "В каком возрасте котята переезжают в новый дом?",
      a: "Обычно с 3 месяцев — после необходимых прививок, приучения к лотку и когтеточке и базовой социализации. Так малыш переезжает здоровым и готовым к новой семье.",
      category: "Уход и здоровье",
    },
    {
      q: "Делаете ли вы доставку в другие города и страны?",
      a: "Да. Обсуждаем удобный способ индивидуально: передача лично, перевозка автомобилем, авиа или с проверенным зоокурьером. Поможем с оформлением документов для поездки.",
      category: "Доставка",
    },
    {
      q: "Какие документы и гарантии вы даёте?",
      a: "Метрика установленного образца, договор купли-продажи и гарантия здоровья на момент передачи. Все животные проходят ветеринарный осмотр.",
      category: "Документы и гарантии",
    },
    {
      q: "Нужно ли стерилизовать котёнка?",
      a: "Котята «для души» (пет-класс) передаются с условием кастрации/стерилизации в рекомендованном возрасте. Животные для разведения обсуждаются отдельно.",
      category: "Документы и гарантии",
    },
    {
      q: "Чем кормить ориентального котёнка?",
      a: "Первое время — тем же кормом, к которому малыш привык, чтобы избежать стресса. Дадим подробные рекомендации по питанию и поможем плавно перейти на ваш рацион.",
      category: "Уход и здоровье",
    },
    {
      q: "Ладят ли ориенталы с детьми и другими животными?",
      a: "Да — это общительные, социальные и привязчивые кошки. Они отлично уживаются с детьми и другими питомцами, если знакомить постепенно и с уважением.",
      category: "Уход и здоровье",
    },
  ],
};

const asFaqItem = (raw: Record<string, unknown>): FaqItem | null => {
  const q = normalizeText(raw.q);
  const a = normalizeText(raw.a);
  const category = normalizeText(raw.category) || undefined;
  return q && a ? { q, a, category } : null;
};

export function getFaq(): FaqSettings {
  let data: Record<string, unknown> = {};
  try {
    data = readSettingsEntry("faq").data as Record<string, unknown>;
  } catch {
    // faq.md may not exist yet — fall back to defaults entirely.
  }
  const items = normalizeList(data.items, asFaqItem);
  return {
    title: normalizeText(data.title, DEFAULT_FAQ.title),
    intro: normalizeText(data.intro, DEFAULT_FAQ.intro),
    items: items.length ? items : DEFAULT_FAQ.items,
  };
}

export function getKittenBySlug(slug: string) {
  return getKittens().find((kitten) => kitten.slug === slug);
}

export function getSettings<T>(fileName: string): T {
  return readSettingsEntry(fileName).data as T;
}

export function getSettingsContent(fileName: string) {
  return readSettingsEntry(fileName).content;
}
