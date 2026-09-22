import { getCollection, type CollectionEntry } from "astro:content"

type NoteEntry = CollectionEntry<"notas">
type ExternalNoteEntry = NoteEntry & {
  data: NoteEntry["data"] & {
    kind: "external"
    externalSource: string
    externalUrl: string
  }
}

type NoteDestination =
  | {
      external: false
      href: string
      target?: undefined
      rel?: undefined
      ariaLabel?: undefined
    }
  | {
      external: true
      href: string
      target: "_blank"
      rel: "noopener noreferrer"
      ariaLabel: string
    }

export const NOTE_MATURITY = {
  semilla: {
    label: "Semilla",
    notice: "Esta nota es una semilla. Es un apunte inicial que todavía puede cambiar de forma.",
  },
  "en-crecimiento": {
    label: "En crecimiento",
    notice: "Esta nota está en crecimiento. Puede cambiar a medida que aparecen nuevas conexiones.",
  },
  perenne: {
    label: "Perenne",
    notice:
      "Esta nota es perenne. Su estructura es estable, aunque puede seguir recibiendo ajustes y conexiones.",
  },
} as const

function compareNotesByRecent(first: NoteEntry, second: NoteEntry) {
  const dateDifference = second.data.updatedAt.getTime() - first.data.updatedAt.getTime()
  return dateDifference || first.data.archiveNumber.localeCompare(second.data.archiveNumber, "es")
}

export function isEditorialNote(entry: NoteEntry | undefined): entry is NoteEntry {
  return entry !== undefined && !entry.data.fixture
}

export function isExternalNote(entry: NoteEntry): entry is ExternalNoteEntry {
  return entry.data.kind === "external"
}

export function getNoteDestination(
  entry: NoteEntry,
  localHref = `/notas/${entry.id}`,
): NoteDestination {
  if (!isExternalNote(entry)) return { external: false, href: localHref }

  return {
    external: true,
    href: entry.data.externalUrl,
    target: "_blank",
    rel: "noopener noreferrer",
    ariaLabel: `${entry.data.title} — artículo externo, se abre en una pestaña nueva`,
  }
}

export async function getVisibleSpanishNotes(includeDrafts: boolean) {
  return (await getCollection("notas"))
    .filter(
      (entry) =>
        isEditorialNote(entry) &&
        (includeDrafts || !entry.data.draft) &&
        entry.data.language === "es",
    )
    .sort(compareNotesByRecent)
}

export async function getRoutableSpanishNotes(includeDrafts: boolean) {
  return (await getVisibleSpanishNotes(includeDrafts)).filter((entry) => !isExternalNote(entry))
}

export function hasEditorialNoteBody(entry: NoteEntry) {
  const body = entry.body?.trim()
  if (!body) return false
  if (!entry.filePath?.endsWith(".mdx")) return true

  const contentWithoutAuthoringImports = body
    .replace(/^\s*import\s+.+?\s+from\s+["'][^"']+["'];?\s*$/gm, "")
    .replace(/^\s*import\s+["'][^"']+["'];?\s*$/gm, "")
    .replace(/^\s*export\s+.+$/gm, "")
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
    .trim()

  return contentWithoutAuthoringImports.length > 0
}
