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

## Известные нюансы / TODO

- На странице карточки кошки (`app/cats/[slug]/page.tsx`) ссылки Telegram/WhatsApp
  **захардкожены** (`t.me/oriokerg`, `wa.me/79000000000`) и не берутся из
  `content/settings/contacts.md`. Стоит подключить к настройкам контактов.
- В типе `AboutSettings` нет поля `body`, хотя админка его редактирует — учитывать
  при работе со страницей «О питомнике».
