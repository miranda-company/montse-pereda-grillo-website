import type { APIRoute } from "astro"
import { SITE_ORIGIN } from "../lib/site"
import { getPublishedSiteRoutes } from "../lib/site-routes"

export const prerender = true

const escapeXml = (value: string) =>
  value.replace(/[<>&'\"]/g, (character) => {
    const entities: Record<string, string> = {
      "<": "&lt;",
      ">": "&gt;",
      "&": "&amp;",
      "'": "&apos;",
      '"': "&quot;",
    }
    return entities[character] ?? character
  })

export const GET: APIRoute = async ({ site }) => {
  const siteUrl = site ?? new URL(SITE_ORIGIN)
  const entries = await getPublishedSiteRoutes()

  const urls = entries
    .map(({ path, updatedAt }) => {
      const location = escapeXml(new URL(path, siteUrl).href)
      const lastModified = updatedAt
        ? `\n    <lastmod>${updatedAt.toISOString().slice(0, 10)}</lastmod>`
        : ""
      return `  <url>\n    <loc>${location}</loc>${lastModified}\n  </url>`
    })
    .join("\n")

  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`

  return new Response(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  })
}
