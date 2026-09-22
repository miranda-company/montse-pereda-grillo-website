import assert from "node:assert/strict"
import { readdir, readFile } from "node:fs/promises"
import { relative, resolve, sep } from "node:path"

const dist = resolve(process.cwd(), "dist")
const siteOrigin = new URL(process.env.SITE_URL ?? "https://www.rodolfomiranda.company").origin

const walk = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = await Promise.all(
    entries.map((entry) => {
      const path = resolve(directory, entry.name)
      return entry.isDirectory() ? walk(path) : [path]
    }),
  )
  return files.flat()
}

const normalizePath = (path) => (path === "/" ? path : path.replace(/\/+$/, ""))
const decodeAttribute = (value) =>
  value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")

const files = await walk(dist)
const htmlFiles = files.filter((file) => file.endsWith(".html"))
const filePaths = new Set(files.map((file) => `/${relative(dist, file).split(sep).join("/")}`))

const pages = await Promise.all(
  htmlFiles.map(async (file) => {
    const outputPath = relative(dist, file).split(sep).join("/")
    const route =
      outputPath === "index.html"
        ? "/"
        : outputPath.endsWith("/index.html")
          ? `/${outputPath.slice(0, -"index.html".length)}`
          : `/${outputPath}`
    const html = await readFile(file, "utf8")
    const ids = new Set([...html.matchAll(/\sid=["']([^"']+)["']/g)].map((match) => match[1]))

    return { html, ids, route }
  }),
)

const pagesByPath = new Map(pages.map((page) => [normalizePath(page.route), page]))
const failures = []
let checkedLinks = 0

for (const source of pages) {
  for (const match of source.html.matchAll(/<a\b[^>]*\shref=["']([^"']*)["']/gi)) {
    const href = decodeAttribute(match[1])
    if (!href) continue

    let destination
    try {
      destination = new URL(href, `${siteOrigin}${source.route}`)
    } catch {
      failures.push({ source: source.route, href, reason: "URL inválida" })
      continue
    }

    if (destination.protocol !== "http:" && destination.protocol !== "https:") continue
    if (destination.origin !== siteOrigin) continue

    checkedLinks += 1
    const destinationPath = decodeURI(destination.pathname)
    const targetPage = pagesByPath.get(normalizePath(destinationPath))
    const targetFileExists = filePaths.has(destinationPath)

    if (!targetPage && !targetFileExists) {
      failures.push({
        source: source.route,
        href,
        reason: `no existe ${destinationPath}`,
      })
      continue
    }

    if (targetPage && destination.hash) {
      const fragment = decodeURIComponent(destination.hash.slice(1))
      if (fragment && !targetPage.ids.has(fragment)) {
        failures.push({
          source: source.route,
          href,
          reason: `no existe el fragmento #${fragment}`,
        })
      }
    }
  }
}

assert.deepEqual(
  failures,
  [],
  `Se encontraron enlaces internos rotos:\n${failures
    .map(({ source, href, reason }) => `- ${source} → ${href}: ${reason}`)
    .join("\n")}`,
)

console.log(
  `Enlaces internos verificados: ${checkedLinks} enlaces en ${htmlFiles.length} archivos HTML.`,
)
