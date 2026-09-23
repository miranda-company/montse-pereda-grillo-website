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
  const projects = await getVisibleSpanishProjects(false)

  return [
    {
      path: "/",
      title: "Inicio",
      updatedAt: latestDate(projects.map((entry) => entry.data.updatedAt)),
    },
    { path: "/colofon", title: "Colofón" },
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
