import assert from "node:assert/strict"
import { readdir, readFile } from "node:fs/promises"
import { resolve } from "node:path"

const root = process.cwd()

const collections = [
  { directory: "notas", label: "Notas", uniqueFields: ["archiveNumber"] },
  { directory: "mediateca", label: "Mediateca", uniqueFields: ["archiveNumber"] },
  {
    directory: "portafolio",
    label: "Portafolio",
    uniqueFields: ["archiveNumber", "displayOrder"],
  },
]

const readFrontmatter = (source, file) => {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  assert.ok(match, `${file} debe contener frontmatter YAML.`)
  return match[1]
}

const readScalar = (frontmatter, field) => {
  const match = frontmatter.match(new RegExp(`^${field}:\\s*(.+?)\\s*$`, "m"))
  if (!match) return undefined

  const value = match[1].trim()
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1)
  }

  return value
}

const findDuplicates = (entries, field) => {
  const ownersByValue = new Map()

  for (const entry of entries) {
    const value = entry[field]
    assert.ok(value, `${entry.file} debe definir ${field}.`)
    ownersByValue.set(value, [...(ownersByValue.get(value) ?? []), entry.id])
  }

  return [...ownersByValue.entries()].filter(([, owners]) => owners.length > 1)
}

const publishedCounts = []

for (const collection of collections) {
  const directory = resolve(root, "src/content", collection.directory)
  const files = (await readdir(directory)).filter((file) => /\.mdx?$/.test(file)).sort()
  const entries = await Promise.all(
    files.map(async (file) => {
      const frontmatter = readFrontmatter(await readFile(resolve(directory, file), "utf8"), file)
      return {
        id: file.replace(/\.mdx?$/, ""),
        file: `src/content/${collection.directory}/${file}`,
        archiveNumber: readScalar(frontmatter, "archiveNumber"),
        displayOrder: readScalar(frontmatter, "displayOrder"),
        draft: readScalar(frontmatter, "draft") === "true",
        fixture: readScalar(frontmatter, "fixture") === "true",
      }
    }),
  )
  const publishedEntries = entries.filter((entry) => !entry.draft && !entry.fixture)

  for (const field of collection.uniqueFields) {
    const duplicates = findDuplicates(publishedEntries, field)
    assert.equal(
      duplicates.length,
      0,
      `${collection.label} contiene ${field} duplicados entre entradas publicadas: ${duplicates
        .map(([value, owners]) => `${value} (${owners.join(", ")})`)
        .join("; ")}`,
    )
  }

  publishedCounts.push(`${publishedEntries.length} ${collection.label}`)
}

console.log(
  `Integridad editorial verificada: identificadores publicados únicos y orden de Portafolio único (${publishedCounts.join(
    ", ",
  )}).`,
)
