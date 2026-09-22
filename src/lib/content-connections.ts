import { getEntries, type CollectionEntry } from "astro:content"
import { getVisibleSpanishMedia } from "./media"
import {
  getNoteDestination,
  getRoutableSpanishNotes,
  isEditorialNote,
  isExternalNote,
} from "./notes"
import { getVisibleSpanishProjects } from "./portfolio"
import {
  buildConnectionGraph,
  createConnectionNodeKey,
  type ConnectionEdge,
  type ConnectionGraph,
  type ConnectionNode,
  type EditorialCollection,
  type SupplementalConnectionLink,
} from "./connection-graph"

type EntryReference = { id: string }
type NoteReference = CollectionEntry<"notas">["data"]["relatedNotes"][number]

let productionGraph: Promise<ConnectionGraph> | undefined

function createNode(
  collection: EditorialCollection,
  entry: CollectionEntry<"notas"> | CollectionEntry<"mediateca"> | CollectionEntry<"portafolio">,
): ConnectionNode {
  return {
    key: createConnectionNodeKey(collection, entry.id),
    collection,
    id: entry.id,
    title: entry.data.title,
    href: `/${collection}/${entry.id}`,
    archiveNumber: entry.data.archiveNumber,
  }
}

function addEdges(
  edges: ConnectionEdge[],
  sourceCollection: EditorialCollection,
  sourceId: string,
  targetCollection: EditorialCollection,
  references: EntryReference[],
) {
  const source = createConnectionNodeKey(sourceCollection, sourceId)

  for (const reference of references) {
    edges.push({
      source,
      target: createConnectionNodeKey(targetCollection, reference.id),
    })
  }
}

async function createEditorialConnectionGraph(includeDrafts: boolean) {
  const [notes, media, projects] = await Promise.all([
    getRoutableSpanishNotes(includeDrafts),
    getVisibleSpanishMedia(includeDrafts),
    getVisibleSpanishProjects(includeDrafts),
  ])
  const nodes: ConnectionNode[] = [
    ...notes.map((entry) => createNode("notas", entry)),
    ...media.map((entry) => createNode("mediateca", entry)),
    ...projects.map((entry) => createNode("portafolio", entry)),
  ]
  const edges: ConnectionEdge[] = []

  for (const note of notes) {
    addEdges(edges, "notas", note.id, "notas", note.data.relatedNotes)
    addEdges(edges, "notas", note.id, "mediateca", note.data.relatedMedia)
    addEdges(edges, "notas", note.id, "portafolio", note.data.relatedProjects)
  }

  for (const item of media) {
    addEdges(edges, "mediateca", item.id, "notas", item.data.relatedNotes)
    addEdges(edges, "mediateca", item.id, "mediateca", item.data.relatedMedia)
    addEdges(edges, "mediateca", item.id, "portafolio", item.data.relatedProjects)
  }

  for (const project of projects) {
    addEdges(edges, "portafolio", project.id, "notas", project.data.relatedNotes)
    addEdges(edges, "portafolio", project.id, "mediateca", project.data.relatedMedia)
    addEdges(edges, "portafolio", project.id, "portafolio", project.data.relatedProjects)
  }

  return buildConnectionGraph(nodes, edges)
}

export function getEditorialConnectionGraph(includeDrafts: boolean) {
  // Keep local authoring fresh: Astro may preserve this module while a content
  // entry is updated through HMR. Production builds can safely reuse one graph.
  if (includeDrafts) return createEditorialConnectionGraph(true)

  productionGraph ??= createEditorialConnectionGraph(false)
  return productionGraph
}

export async function getExternalNoteConnectionLinks(
  references: NoteReference[],
  includeDrafts: boolean,
): Promise<SupplementalConnectionLink[]> {
  const externalNotes = (await getEntries(references)).filter(
    (note) =>
      isEditorialNote(note) &&
      isExternalNote(note) &&
      note.data.language === "es" &&
      (includeDrafts || !note.data.draft),
  )

  return externalNotes.map((note) => {
    const destination = getNoteDestination(note)

    return {
      title: note.data.title,
      href: destination.href,
      label: `Artículo externo · ${note.data.archiveNumber}`,
      target: destination.target,
      rel: destination.rel,
      ariaLabel: destination.ariaLabel,
      external: true,
    }
  })
}
