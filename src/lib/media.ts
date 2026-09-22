import { getCollection, type CollectionEntry } from "astro:content"

type MediaFormat = CollectionEntry<"mediateca">["data"]["format"]
type MediaStatus = CollectionEntry<"mediateca">["data"]["status"]

export const MEDIA_FORMAT_LABELS = {
  book: "Libro",
  article: "Artículo",
  website: "Sitio",
  tool: "Herramienta",
  video: "Video",
  podcast: "Podcast",
  other: "Referencia",
} satisfies Record<MediaFormat, string>

export const MEDIA_STATUS_LABELS = {
  "en-curso": "En curso",
  consultado: "Consultado",
  "de-referencia": "De referencia",
  "por-explorar": "Por explorar",
} satisfies Record<MediaStatus, string>

function compareMediaByRecent(
  first: CollectionEntry<"mediateca">,
  second: CollectionEntry<"mediateca">,
) {
  return (
    second.data.updatedAt.getTime() - first.data.updatedAt.getTime() ||
    first.data.archiveNumber.localeCompare(second.data.archiveNumber, "es")
  )
}

export function isEditorialMedia(entry: CollectionEntry<"mediateca">) {
  return !entry.data.fixture
}

function isTechnicalMediaFixture(entry: CollectionEntry<"mediateca">) {
  return entry.data.fixture
}

export async function getVisibleSpanishMedia(includeDrafts: boolean) {
  return (await getCollection("mediateca"))
    .filter(
      (entry) =>
        isEditorialMedia(entry) &&
        (includeDrafts || !entry.data.draft) &&
        entry.data.language === "es",
    )
    .sort(compareMediaByRecent)
}

export async function getDevelopmentSpanishMediaFixtures() {
  return (await getCollection("mediateca"))
    .filter(
      (entry) => isTechnicalMediaFixture(entry) && entry.data.draft && entry.data.language === "es",
    )
    .sort(compareMediaByRecent)
}
