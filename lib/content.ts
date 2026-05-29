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
  price?: number;
  available: boolean;
};

export type KittenEntry = BaseEntry & {
  price?: number;
  reserved: boolean;
};

export type ContactsSettings = {
  phone: string;
  telegram: string;
  whatsapp: string;
  address?: string;
};

export type HomepageSettings = {
  hero_title: string;
  hero_subtitle: string;
  hero_image?: string;
  intro_text: string;
};

export type AboutSettings = {
  title: string;
  body?: string;
  photo?: string;
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
        price: normalizeNumber(entry.data.price),
        description: normalizeText(entry.data.description, entry.content),
        photos: normalizePhotos(entry.data.photos),
        reserved: normalizeBoolean(entry.data.reserved, false),
      };
    })
    .sort((left, right) => left.name.localeCompare(right.name, "ru"));
}

export function getSettings<T>(fileName: string): T {
  return readSettingsEntry(fileName).data as T;
}

export function getSettingsContent(fileName: string) {
  return readSettingsEntry(fileName).content;
}
