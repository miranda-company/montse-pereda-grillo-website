import assert from "node:assert/strict"
import { readdir, stat } from "node:fs/promises"
import { extname, relative, resolve } from "node:path"

const dist = resolve(process.cwd(), "dist")
const budgets = {
  total: 16 * 1024 * 1024,
  htmlAverage: 14 * 1024,
  htmlSingle: 43 * 1024,
  cssTotal: 90 * 1024,
  jsTotal: 25 * 1024,
  fontTotal: 240 * 1024,
  imageSingle: 500 * 1024,
}

const imageExtensions = new Set([".avif", ".gif", ".jpeg", ".jpg", ".png", ".svg", ".webp"])
const fontExtensions = new Set([".woff", ".woff2"])

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

const files = await walk(dist)
const records = await Promise.all(
  files.map(async (file) => ({
    file,
    extension: extname(file).toLowerCase(),
    size: (await stat(file)).size,
  })),
)

const sum = (extensions) =>
  records
    .filter((record) => extensions.has(record.extension))
    .reduce((total, item) => total + item.size, 0)
const largest = (extensions) =>
  records
    .filter((record) => extensions.has(record.extension))
    .sort((first, second) => second.size - first.size)[0]
const formatKiB = (bytes) => `${(bytes / 1024).toFixed(1)} KiB`

const total = records.reduce((size, record) => size + record.size, 0)
const htmlRecords = records.filter((record) => record.extension === ".html")
const htmlTotal = htmlRecords.reduce((size, record) => size + record.size, 0)
const htmlTotalBudget = budgets.htmlAverage * htmlRecords.length
const cssTotal = sum(new Set([".css"]))
const jsTotal = sum(new Set([".js"]))
const fontTotal = sum(fontExtensions)
const largestHtml = largest(new Set([".html"]))
const largestImage = largest(imageExtensions)

assert(total <= budgets.total, `dist supera el presupuesto total: ${formatKiB(total)}.`)
assert(
  htmlTotal <= htmlTotalBudget,
  `El HTML total supera el presupuesto: ${formatKiB(htmlTotal)}.`,
)
assert(
  largestHtml && largestHtml.size <= budgets.htmlSingle,
  `El HTML más grande supera el presupuesto: ${largestHtml ? relative(dist, largestHtml.file) : "ninguno"}.`,
)
assert(cssTotal <= budgets.cssTotal, `El CSS total supera el presupuesto: ${formatKiB(cssTotal)}.`)
assert(
  jsTotal <= budgets.jsTotal,
  `El JavaScript total supera el presupuesto: ${formatKiB(jsTotal)}.`,
)
assert(
  fontTotal <= budgets.fontTotal,
  `Las fuentes superan el presupuesto: ${formatKiB(fontTotal)}.`,
)
assert(
  largestImage && largestImage.size <= budgets.imageSingle,
  `La imagen más grande supera el presupuesto: ${largestImage ? relative(dist, largestImage.file) : "ninguna"}.`,
)

console.log("Presupuestos de producción verificados:")
console.log(`- dist total: ${formatKiB(total)} / ${formatKiB(budgets.total)}`)
console.log(
  `- HTML total: ${formatKiB(htmlTotal)} / ${formatKiB(htmlTotalBudget)} (${htmlRecords.length} archivos a ${formatKiB(budgets.htmlAverage)} de media)`,
)
console.log(
  `- HTML mayor: ${formatKiB(largestHtml.size)} / ${formatKiB(budgets.htmlSingle)} (${relative(dist, largestHtml.file)})`,
)
console.log(`- CSS total: ${formatKiB(cssTotal)} / ${formatKiB(budgets.cssTotal)}`)
console.log(`- JavaScript total: ${formatKiB(jsTotal)} / ${formatKiB(budgets.jsTotal)}`)
console.log(`- fuentes: ${formatKiB(fontTotal)} / ${formatKiB(budgets.fontTotal)}`)
console.log(
  `- imagen mayor: ${formatKiB(largestImage.size)} / ${formatKiB(budgets.imageSingle)} (${relative(dist, largestImage.file)})`,
)
