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
- `content/settings/contacts.md` — телефон, Telegram, ВКонтакте, адрес
- `content/settings/homepage.md` — **все блоки главной**: hero, цифры (`stats`),
  «почему мы» (`features`), блок о породе (`breed_*`), шаги (`steps`), отзывы (`reviews`),
  CTA. Списки редактируются в Decap.
- `content/settings/breed.md` — страница «Порода» (интро, `traits`, `care`, CTA)
- `content/settings/about.md` — страница «О питомнике» (title + markdown-тело + фото)

`lib/content.ts` — единственный модуль доступа к контенту. Нормализует данные и отдаёт
типизированные сущности (`CatEntry`, `KittenEntry`, `ContactsSettings`, `HomepageSettings`,
`BreedSettings`, `AboutSettings`). Главную/породу читай через `getHomepage()`/`getBreed()`
(они подставляют дефолты, если поле в CMS пустое — пустой контент не ломает вёрстку).

Фото загружаются в `public/images/uploads/` (через админку), в markdown хранится путь.

## Страницы (`app/`)

- `app/page.tsx` — главная (читает `homepage` settings)
- `app/cats/page.tsx` + `app/cats/[slug]/page.tsx` — список кошек и карточка кошки.
  URL карточки = slug = имя md-файла. Есть `__placeholder__` для пустой коллекции,
  чтобы статическая сборка не падала.
- `app/kittens/page.tsx` + `app/kittens/[slug]/page.tsx` — список котят и карточка котёнка
  (карточка с галереей, ценой, статусом и CTA в мессенджеры). Тот же `__placeholder__`,
  что и у кошек.
- `app/breed/page.tsx` — страница о породе (контент из `content/settings/breed.md`)
- `app/about/page.tsx`, `app/contacts/page.tsx`
- `app/layout.tsx` — общий каркас: `components/Header.tsx` + `components/Footer.tsx`,
  обёрнут в `components/motion/MotionProvider.tsx` (LazyMotion), есть `grain-layer`.

> **Динамические роуты + статический экспорт:** `next dev` НЕ рендерит страницы
> `[slug]` (выдаёт 500 «missing generateStaticParams») — это ограничение dev-режима
> при `output: export`. Проверять карточки нужно через `npm run build` (папка `out/`),
> а не дев-сервером. Cyrillic-slug приходит percent-encoded → в карточках декодируем
> через `decodeURIComponent` (см. `decodeSlug`). Включён `trailingSlash: true`, чтобы
> хост отдавал `/kittens/<slug>/` → `index.html`.

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

## Дизайн-система («тёплая премиум-элегантность»)

Премиум-редизайн 2026-05 в рамках тёплой гаммы. **Всегда используй токены, а не хардкод hex.**

- **Палитра** (CSS-переменные в `app/globals.css` → Tailwind-токены):
  `--background` тёплая слоновая кость, `--surface`/`--surface-2` (карточки/секции),
  `--foreground` эспрессо, `--muted`, `--border`/`--border-strong`,
  `--accent`/`--accent-soft`/`--accent-strong` (карамель-золото),
  `--ink`/`--ink-foreground` (тёплая тёмная секция — поклон референсу CATS, но тёплый).
  Утилиты: `shadow-soft/lift/glow`, `text-gold-gradient`, `rule-gold`, `link-underline`,
  `grain-layer` (зерно поверх фона), `tracking-luxe`, `rounded-4xl/5xl`.
- **Шрифты:** Inter (`font-sans`) + Cormorant Garamond (`font-serif`), в `app/layout.tsx`.
- **Анимации — Framer Motion** через `LazyMotion`+`domAnimation` (бандл лёгкий):
  - Везде используем `m.*` (не `motion.*`), провайдер — `components/motion/MotionProvider.tsx`.
  - `components/Reveal.tsx` — появление по скроллу (`whileInView`); `components/motion/Stagger.tsx`
    (`Stagger`/`StaggerItem`) — каскад для сеток; `components/home/Hero.tsx` — оркестрованный
    вход + parallax. Всё уважает `useReducedMotion` + глобальный `@media (prefers-reduced-motion)`.
  - Анимируем только `transform`/`opacity`.
- **Компоненты:** `AnimalCard` (фото 4:5, zoom, скрим, бейдж `gold/muted/sold`, чип цены,
  hover-«Подробнее», ссылка через `href`); `PhotoGallery` (активное фото с fade, превью
  с акцентной рамкой); `ContactButtons` (Telegram/ВКонтакте/телефон); бренд-иконки —
  в `components/icons.tsx` (Simple Icons: Telegram, VK + телефон); `PageHeader`
  (eyebrow + serif h1 + intro); `Header`
  (прозрачный→твёрдый при скролле, активная ссылка, кнопка «Выбрать котёнка», моб. меню);
  `Footer` (колонки, соц-пиллы, призрачный вотермарк — `hidden` на мобиле).
- **Декор спрятан на мобиле:** ✦ в тёмной секции (`hidden lg:block`) и вотермарк
  в футере (`hidden sm:block`), чтобы не лезли на текст.
- **Главная** (`app/page.tsx`): Hero → цифры → котята → «почему мы» → блок о породе →
  галерея → шаги (тёмная секция) → отзывы → CTA.
- **Галерея** берёт реальные фото из карточек; если меньше 5 — заглушки `public/images/gallery/cat-1..5.jpg`.
- **Контент главной и /breed — в CMS** (не хардкод!): тексты/списки берутся через
  `getHomepage()`/`getBreed()` из `lib/content.ts` с дефолтами-фолбэками. В коде остаются
  только иконки фич (массив `featureIcons` в `app/page.tsx`, по индексу).

> Все фото котов сейчас — **стоковые заглушки** (Unsplash, free). Заменяются реальными
> через админку: фото в карточках → попадают и в галерею.

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
