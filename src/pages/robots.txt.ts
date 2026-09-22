import type { APIRoute } from "astro"
import { SITE_ORIGIN } from "../lib/site"

export const prerender = true

export const GET: APIRoute = ({ site }) => {
  const siteUrl = site ?? new URL(SITE_ORIGIN)
  const indexingEnabled = import.meta.env.PUBLIC_INDEXING_ENABLED === "true"
  const policy = indexingEnabled ? "Allow: /" : "Disallow: /"
  const body = [
    `User-agent: *`,
    policy,
    `Sitemap: ${new URL("/sitemap.xml", siteUrl).href}`,
    "",
  ].join("\n")

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
}
