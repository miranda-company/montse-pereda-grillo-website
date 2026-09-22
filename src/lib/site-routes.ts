import { getVisibleSpanishMedia } from "./media"
import { getRoutableSpanishNotes, getVisibleSpanishNotes } from "./notes"
import { getVisibleSpanishProjects } from "./portfolio"

export interface SiteRoute {
  path: string
  title: string
  updatedAt?: Date
}

const latestDate = (dates: Date[]) =>
  dates.reduce<Date | undefined>(
    (current, date) => (!current || date.getTime() > current.getTime() ? date : current),
    undefined,
  )

export async function getPublishedSiteRoutes(): Promise<SiteRoute[]> {
  const [notes, localNotes, media, projects] = await Promise.all([
    getVisibleSpanishNotes(false),
    getRoutableSpanishNotes(false),
    getVisibleSpanishMedia(false),
    getVisibleSpanishProjects(false),
  ])

  return [
    {
      path: "/",
      title: "Inicio",
      updatedAt: latestDate([
        ...notes.map((entry) => entry.data.updatedAt),
        ...media.map((entry) => entry.data.updatedAt),
        ...projects.map((entry) => entry.data.updatedAt),
      ]),
    },
    { path: "/colofon", title: "Colofón" },
    { path: "/yo", title: "Yo" },
    {
      path: "/notas",
      title: "Notas",
      updatedAt: latestDate(notes.map((entry) => entry.data.updatedAt)),
    },
    ...localNotes.map((entry) => ({
      path: `/notas/${entry.id}`,
      title: entry.data.title,
      updatedAt: entry.data.updatedAt,
    })),
    {
      path: "/mediateca",
      title: "Mediateca",
      updatedAt: latestDate(media.map((entry) => entry.data.updatedAt)),
    },
    ...media.map((entry) => ({
      path: `/mediateca/${entry.id}`,
      title: entry.data.title,
      updatedAt: entry.data.updatedAt,
    })),
    {
      path: "/portafolio",
      title: "Portafolio",
      updatedAt: latestDate(projects.map((entry) => entry.data.updatedAt)),
    },
    ...projects.map((entry) => ({
      path: `/portafolio/${entry.id}`,
      title: entry.data.title,
      updatedAt: entry.data.updatedAt,
    })),
    { path: "/registro", title: "Registro" },
  ]
}
