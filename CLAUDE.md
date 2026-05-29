# OrioKerg — сайт питомника ориентальных кошек

Маркетинговый сайт питомника **OrioKerg** (боевой адрес — **https://oriokerg.ru**).
Контент редактируется через веб-админку, публикуется автоматически через GitHub.

## Стек

- **Next.js 14** (App Router) + **React 18** + **TypeScript**
- **Tailwind CSS** для стилей
- **Статический экспорт** (`output: "export"` в `next.config.js`) → сборка в папку `out/`
- Контент — **markdown с frontmatter**, читается через `gray-matter`

## Как устроен контент (главное!)

Весь редактируемый контент лежит в `content/` как `.md`-файлы. Код их не хардкодит —
он читает файлы через `lib/content.ts`. То есть **чтобы изменить тексты/котят/кошек,
правят markdown, а не `.tsx`**.

- `content/cats/*.md` — кошки и производители (коллекция `cats`)
- `content/kittens/*.md` — котята в продаже (коллекция `kittens`)
- `content/settings/contacts.md` — телефон, Telegram, WhatsApp, адрес
- `content/settings/homepage.md` — тексты hero-блока главной
- `content/settings/about.md` — страница «О питомнике» (title + markdown-тело + фото)

`lib/content.ts` — единственный модуль доступа к контенту. Он нормализует данные
(на случай кривых значений из CMS) и отдаёт типизированные сущности
(`CatEntry`, `KittenEntry`, `ContactsSettings`, `HomepageSettings`, `AboutSettings`).

Фото загружаются в `public/images/uploads/` (через админку), в markdown хранится путь.

## Страницы (`app/`)

- `app/page.tsx` — главная (читает `homepage` settings)
- `app/cats/page.tsx` + `app/cats/[slug]/page.tsx` — список кошек и карточка кошки.
  URL карточки = slug = имя md-файла. Есть `__placeholder__` для пустой коллекции,
  чтобы статическая сборка не падала.
- `app/kittens/page.tsx` — список котят (отдельной карточки-страницы у котят нет)
- `app/about/page.tsx`, `app/contacts/page.tsx`
- `app/layout.tsx` — общий каркас, `components/Header.tsx` + `components/Footer.tsx`

## Админка (Decap CMS)

- Точка входа: `public/admin/index.html`, конфиг: `public/admin/config.yml`
- На бою доступна по адресу `/admin/` сайта
- Backend: **git-gateway через DecapBridge** (auth.decapbridge.com) — коммитит прямо в `main`
- Имена файлов задаются настройкой `slug` (по полю «Имя»). НЕ убирать `identifier_field: name`
  и блок `slug:` — иначе вернутся монструозные имена файлов из всех полей.

## Деплой

`.github/workflows/deploy.yml`: при пуше в `main` →
`npm ci` → `npm run build` → заливка `out/` по **FTP на Timeweb**
(`/oriokerg/public_html/`). Секреты FTP — в GitHub Secrets (`FTP_SERVER/USERNAME/PASSWORD`).

**Любое изменение публикуется пушем в `main`** (хоть из админки, хоть из кода).

## Команды

```bash
npm run dev     # локальная разработка, http://localhost:3000
npm run build   # статическая сборка в out/
npm run lint    # проверка eslint
```

## Дизайн-система («тёплая гамма»)

- **Палитра:** кремовый фон + коричневый акцент (`--accent`), тёмно-коричневый текст.
  Все цвета — CSS-переменные в `app/globals.css`, проброшены в Tailwind-токены
  (`bg-background`, `text-foreground`, `text-accent`, `bg-card`, `border-border`,
  `text-muted`, `text-accent-soft`, `bg-accent`/`text-accent-foreground`).
  **Используй токены, а не хардкод hex** — тогда смена палитры = правка только globals.
- Контрастная тёмная секция делается через `bg-foreground text-background` (инверсия
  токенов), а не хардкодом — см. блок «Как забрать котёнка» на главной.
- **Шрифты:** Inter (`font-sans`, текст) + Cormorant Garamond (`font-serif`, заголовки),
  подключены в `app/layout.tsx`, объявлены в `tailwind.config.ts`.
- **Карточки животных:** общий компонент `components/AnimalCard.tsx` (фото 4:5, zoom
  при наведении, бейдж статуса, цена). Используется на главной, котятах и кошках.
- **Анимация появления:** `components/Reveal.tsx` (fade-up при скролле через
  IntersectionObserver). Это клиентский компонент.
- **Главная** (`app/page.tsx`) — секции: hero (2 колонки) → цифры → котята → «почему мы»
  → галерея → шаги «как забрать котёнка» → отзывы → CTA.
- **Hero-фото:** поле `hero_image` в настройках главной; если пусто — дефолт
  `public/images/hero-cat.jpg` (`DEFAULT_HERO_IMAGE` в `lib/content.ts`).
- **Галерея** берёт реальные фото из карточек котят/кошек; если их меньше 5 —
  дополняет локальными заглушками `public/images/gallery/cat-1..5.jpg`.
- **Статичный контент в коде** (пока не в CMS): массивы `stats`, `features`, `steps`,
  `reviews` в `app/page.tsx`. Тексты/цифры/отзывы правятся там. При желании их можно
  вынести в настройки Decap.

> Все фото котов сейчас — **стоковые заглушки** (Unsplash, лицензия free). Заменяются
> реальными через админку: фото в карточках → попадают и в галерею.

## Важно при разработке

- `lib/content.ts` импортирует `fs` → **нельзя** импортировать из него значения в
  клиентские компоненты (`"use client"`). Чистые хелперы вроде `formatPrice` лежат в
  `lib/format.ts` — импортируй оттуда в клиентских компонентах. Типы (`import type`)
  из `content.ts` импортировать можно (стираются при компиляции).
- Локально `npm`/`node` не в PATH — см. путь к Node ниже. На GitHub Actions сборка
  идёт штатно (включая загрузку Google-шрифтов).

## Что добавить дальше (идеи)

- Реальные фото котят и кошек (через админку) — без них карточки показывают
  «лапку»-плейсхолдер.
- Своё hero-фото и логотип вместо стоковых заглушек.
