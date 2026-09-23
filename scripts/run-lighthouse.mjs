import assert from "node:assert/strict"
import { spawn } from "node:child_process"
import { mkdir, readFile } from "node:fs/promises"
import { resolve } from "node:path"

const root = process.cwd()
const reportsDirectory = resolve(root, ".lighthouse")
const host = "127.0.0.1"
const port = 4321
const origin = `http://${host}:${port}`
const routes = ["/", "/portafolio", "/portafolio/modulab-barcelona", "/portafolio/syra-coffee"]
const thresholds = {
  performance: 0.75,
  accessibility: 0.95,
  "best-practices": 0.95,
  seo: 0.95,
}
const allowedThirdPartyFailures = {
  "/portafolio/syra-coffee": new Set(["third-party-cookies", "inspector-issues"]),
}

const run = (command, args, options = {}) =>
  new Promise((resolvePromise, reject) => {
    const child = spawn(command, args, {
      cwd: root,
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"],
      ...options,
    })
    let output = ""
    child.stdout.on("data", (chunk) => (output += chunk))
    child.stderr.on("data", (chunk) => (output += chunk))
    child.on("error", reject)
    child.on("exit", (code) => {
      if (code === 0) resolvePromise(output)
      else reject(new Error(`${command} terminó con código ${code}.\n${output}`))
    })
  })

const waitForPreview = async () => {
  const timeoutAt = Date.now() + 30_000
  while (Date.now() < timeoutAt) {
    try {
      const response = await fetch(origin)
      if (response.ok) return
    } catch {
      // The preview process is still starting.
    }
    await new Promise((resolvePromise) => setTimeout(resolvePromise, 250))
  }
  throw new Error("Astro preview no respondió antes del límite de 30 segundos.")
}

await mkdir(reportsDirectory, { recursive: true })

const preview = spawn(
  "pnpm",
  ["exec", "astro", "preview", "--host", host, "--port", String(port)],
  {
    cwd: root,
    env: process.env,
    stdio: ["ignore", "pipe", "pipe"],
  },
)

let previewOutput = ""
preview.stdout.on("data", (chunk) => (previewOutput += chunk))
preview.stderr.on("data", (chunk) => (previewOutput += chunk))

try {
  await waitForPreview()
  const results = []

  for (const route of routes) {
    const reportName = route === "/" ? "home" : route.slice(1).replaceAll("/", "-")
    const reportPath = resolve(reportsDirectory, `${reportName}.json`)
    await run("pnpm", [
      "exec",
      "lighthouse",
      `${origin}${route}`,
      "--quiet",
      "--preset=desktop",
      "--only-categories=performance,accessibility,best-practices,seo",
      "--chrome-flags=--headless --no-sandbox --disable-gpu",
      "--output=json",
      `--output-path=${reportPath}`,
    ])

    const report = JSON.parse(await readFile(reportPath, "utf8"))
    const scores = Object.fromEntries(
      Object.keys(thresholds).map((category) => [category, report.categories[category].score]),
    )
    const allowedFailures = allowedThirdPartyFailures[route]
    if (allowedFailures) {
      const actualFailures = report.categories["best-practices"].auditRefs
        .map(({ id }) => report.audits[id])
        .filter((audit) => audit.score === 0)
        .map((audit) => audit.id)
      assert.deepEqual(
        new Set(actualFailures),
        allowedFailures,
        `${route}: las excepciones de terceros de Lighthouse han cambiado.`,
      )
    }
    results.push({ route, scores, hasAllowedThirdPartyFailure: Boolean(allowedFailures) })

    for (const [category, minimum] of Object.entries(thresholds)) {
      const routeMinimum = category === "best-practices" && allowedFailures ? 0.75 : minimum
      assert.ok(
        scores[category] >= routeMinimum,
        `${route}: ${category} obtuvo ${Math.round(scores[category] * 100)}, mínimo ${Math.round(routeMinimum * 100)}.`,
      )
    }
  }

  for (const { route, scores, hasAllowedThirdPartyFailure } of results) {
    console.log(
      `${route.padEnd(28)} performance ${Math.round(scores.performance * 100)} · accessibility ${Math.round(scores.accessibility * 100)} · best practices ${Math.round(scores["best-practices"] * 100)}${hasAllowedThirdPartyFailure ? "*" : ""} · SEO ${Math.round(scores.seo * 100)}`,
    )
  }
  console.log("* Excepción limitada a cookies e incidencias del reproductor externo de Vimeo.")
  console.log(`Informes Lighthouse guardados temporalmente en ${reportsDirectory}`)
} catch (error) {
  if (previewOutput) console.error(previewOutput)
  throw error
} finally {
  preview.kill("SIGTERM")
}
