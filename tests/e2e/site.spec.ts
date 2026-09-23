import { expect, test, type Page } from "@playwright/test"
import {
  buildConnectionGraph,
  createConnectionNodeKey,
  type ConnectionNode,
} from "../../src/lib/connection-graph"

const primaryRoutes = [
  "/",
  "/colofon",
  "/yo",
  "/notas",
  "/mediateca",
  "/portafolio",
  "/registro",
  "/portafolio/syra-coffee",
] as const

const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
] as const

const collectBrowserProblems = (page: Page) => {
  const problems: string[] = []

  page.on("console", (message) => {
    if (!["error", "warning"].includes(message.type())) return

    const source = message.location().url
    const isExternalFrame =
      source.startsWith("http") &&
      !source.startsWith("http://127.0.0.1") &&
      !source.startsWith("http://localhost")

    if (!isExternalFrame) problems.push(`${message.type()}: ${message.text()}`)
  })
  page.on("pageerror", (error) => problems.push(`pageerror: ${error.message}`))

  return problems
}

test("connection graph derives backlinks, mutual links, and stable deduplication", () => {
  const nodes: ConnectionNode[] = [
    {
      key: createConnectionNodeKey("notas", "a"),
      collection: "notas",
      id: "a",
      title: "Nota A",
      href: "/notas/a",
      archiveNumber: "N.001",
    },
    {
      key: createConnectionNodeKey("mediateca", "b"),
      collection: "mediateca",
      id: "b",
      title: "Referencia B",
      href: "/mediateca/b",
      archiveNumber: "M.001",
    },
    {
      key: createConnectionNodeKey("portafolio", "c"),
      collection: "portafolio",
      id: "c",
      title: "Proyecto C",
      href: "/portafolio/c",
      archiveNumber: "P.001",
    },
  ]
  const noteKey = createConnectionNodeKey("notas", "a")
  const mediaKey = createConnectionNodeKey("mediateca", "b")
  const projectKey = createConnectionNodeKey("portafolio", "c")
  const graph = buildConnectionGraph(nodes, [
    { source: noteKey, target: mediaKey },
    { source: noteKey, target: mediaKey },
    { source: mediaKey, target: noteKey },
    { source: projectKey, target: noteKey },
    { source: projectKey, target: projectKey },
    { source: projectKey, target: createConnectionNodeKey("notas", "missing") },
  ])

  expect(graph.get(noteKey).mutual.map((connection) => connection.key)).toEqual([mediaKey])
  expect(graph.get(noteKey).incoming.map((connection) => connection.key)).toEqual([projectKey])
  expect(graph.get(noteKey).outgoing).toEqual([])
  expect(graph.get(projectKey).outgoing.map((connection) => connection.key)).toEqual([noteKey])
  expect(graph.get(projectKey).incoming).toEqual([])
  expect(graph.get(projectKey).mutual).toEqual([])
  expect(graph.get(createConnectionNodeKey("notas", "missing"))).toEqual({
    outgoing: [],
    incoming: [],
    mutual: [],
  })
})

for (const viewport of viewports) {
  for (const route of primaryRoutes) {
    test(`${viewport.name}: ${route} renders without structural regressions`, async ({ page }) => {
      await page.setViewportSize(viewport)
      const problems = collectBrowserProblems(page)
      const response = await page.goto(route)

      expect(response?.ok(), `${route} should return a successful response`).toBe(true)
      await expect(page.locator("html")).toHaveAttribute("lang", "es")
      await expect(page.locator("main")).toHaveCount(1)
      await expect(page.locator(".site-footer")).toHaveCount(1)
      await expect(page.locator("h1")).toHaveCount(1)

      const overflow = await page.evaluate(
        () =>
          Math.max(document.body.scrollWidth, document.documentElement.scrollWidth) - innerWidth,
      )
      expect(
        overflow,
        `${route} should not create page-level horizontal overflow`,
      ).toBeLessThanOrEqual(1)

      const brokenVisibleImages = await page.locator("img").evaluateAll((elements) =>
        (elements as HTMLImageElement[])
          .filter((image) => {
            const bounds = image.getBoundingClientRect()
            const visible = bounds.bottom > 0 && bounds.top < innerHeight && bounds.right > 0
            return visible && image.complete && image.naturalWidth === 0
          })
          .map((image) => image.currentSrc || image.src),
      )
      expect(brokenVisibleImages, `${route} should not show broken images`).toEqual([])
      expect(problems, `${route} should not log browser errors or warnings`).toEqual([])
    })
  }

  test(`${viewport.name}: an unknown route renders the custom 404`, async ({ page }) => {
    await page.setViewportSize(viewport)
    const problems = collectBrowserProblems(page)
    const response = await page.goto("/ruta-que-no-existe")

    expect(response?.status()).toBe(404)
    await expect(page.locator("html")).toHaveAttribute("lang", "es")
    await expect(page.locator("main")).toHaveCount(1)
    await expect(page.locator("h1")).toHaveText("Esta página no existe.")
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      "noindex, nofollow",
    )

    const overflow = await page.evaluate(
      () => Math.max(document.body.scrollWidth, document.documentElement.scrollWidth) - innerWidth,
    )
    expect(overflow).toBeLessThanOrEqual(1)

    const unexpectedProblems = problems.filter(
      (problem) =>
        problem !==
        "error: Failed to load resource: the server responded with a status of 404 (Not Found)",
    )
    expect(unexpectedProblems).toEqual([])
  })
}

test("backlinks return to the homepage Portfolio section", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto("/yo")
  await page.locator(".page-back").click()
  await expect(page).toHaveURL(/\/#indice$/)
  await expect(page.locator("#indice")).toBeInViewport()
})

test("shared scroll controls use the accent color and preserve layout", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto("/portafolio/syra-coffee")

  const header = page.locator("[data-site-header]")
  const main = page.locator("main")
  const scrollToTop = page.getByRole("button", { name: "Volver arriba", includeHidden: true })
  await expect(scrollToTop).toBeHidden()

  await page.evaluate(() => window.scrollTo(0, 600))
  const mainTopBefore = await main.evaluate(
    (element) => element.getBoundingClientRect().top + scrollY,
  )
  await expect(header).not.toHaveAttribute("data-sticky", "")

  await page.evaluate(() => window.scrollTo(0, 601))
  await expect(header).toHaveAttribute("data-sticky", "")
  await expect(header).toHaveCSS("position", "fixed")
  await expect(header).toHaveCSS("height", "48px")
  await expect(header).toHaveCSS("background-color", "rgb(223, 240, 154)")
  await expect(scrollToTop).toBeVisible()
  await expect(scrollToTop).toHaveCSS("width", "48px")
  await expect(scrollToTop).toHaveCSS("height", "48px")
  await expect(scrollToTop).toHaveCSS("background-color", "rgb(223, 240, 154)")

  const mainTopAfter = await main.evaluate(
    (element) => element.getBoundingClientRect().top + scrollY,
  )
  expect(Math.abs(mainTopAfter - mainTopBefore)).toBeLessThanOrEqual(1)

  await scrollToTop.click()
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThanOrEqual(1)
  await expect(scrollToTop).toBeHidden()
})

test("reduced motion makes scroll controls and reveals immediate", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.setViewportSize({ width: 390, height: 600 })
  await page.goto("/")

  await expect(page.locator("[data-scroll-shell]")).not.toHaveAttribute("data-reveal-ready", "true")
  await expect(page.locator("[data-portfolio-card]").first()).toHaveAttribute(
    "data-revealed",
    "true",
  )
  await expect(page.locator(".hero h1 > span")).toHaveCSS("animation-name", "none")

  await page.evaluate(() => window.scrollTo(0, 700))
  const scrollToTop = page.getByRole("button", { name: "Volver arriba" })
  await expect(scrollToTop).toBeVisible()
  await scrollToTop.click()
  expect(await page.evaluate(() => window.scrollY)).toBe(0)
})

test("hero and portfolio motion use independent, one-way reveal systems", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 700 })
  await page.goto("/")

  await expect(page.locator(".hero h1 > span")).toHaveCSS("animation-name", "hero-title-enter")
  await expect(page.locator(".hero .img-container")).toHaveCSS(
    "animation-name",
    "hero-portrait-enter",
  )
  await expect(page.locator(".site-footer")).not.toHaveAttribute("data-scroll-reveal")

  const firstCard = page.locator("[data-portfolio-card]").first()
  await expect(firstCard).toHaveAttribute("data-scroll-reveal", "media")
  await firstCard.scrollIntoViewIfNeeded()
  await expect(firstCard).toHaveAttribute("data-revealed", "true")
})

for (const viewport of [
  { name: "mobile", width: 390, height: 844 },
  { name: "tablet", width: 768, height: 1024 },
] as const) {
  test(`${viewport.name}: portfolio detail body remains visible without observer-dependent reveals`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport)
    await page.goto("/portafolio/cn-sant-andreu")

    const articleBlocks = page.locator(".entry-detail-reading > .rich-content > *")
    expect(await articleBlocks.count()).toBeGreaterThan(0)
    await expect(articleBlocks.first()).not.toHaveAttribute("data-scroll-reveal")
    expect(
      await articleBlocks.evaluateAll((elements) =>
        elements.every((element) => getComputedStyle(element).opacity === "1"),
      ),
    ).toBe(true)
  })
}

test("desktop header exposes only the launch navigation", async ({ page }) => {
  await page.goto("/")

  const links = page.locator(".desktop-nav a")
  await expect(links).toHaveText(["Inicio", "Portafolio"])
  expect(
    await links.evaluateAll((items) => items.map((item) => item.getAttribute("href"))),
  ).toEqual(["/", "/portafolio"])
})

test("mobile menu opens from the keyboard and Escape restores focus", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("/")

  const trigger = page.locator(".mobile-menu-button")
  await page.evaluate(() => window.scrollTo(0, 700))
  await trigger.focus()
  await page.keyboard.press("Enter")
  await expect(trigger).toHaveAttribute("aria-expanded", "true")
  await expect(trigger).toHaveAccessibleName("Cerrar")
  await expect(page.locator("#mobile-menu")).toBeVisible()
  await expect(page.locator("#mobile-menu a")).toHaveText(["Inicio", "Portafolio"])

  await page.keyboard.press("Escape")
  await expect(trigger).toHaveAttribute("aria-expanded", "false")
  await expect(page.locator("#mobile-menu")).toBeHidden()
  await expect(trigger).toBeFocused()
})

test("footer exposes Montse's current social, contact, and archive links", async ({ page }) => {
  await page.goto("/")

  const footer = page.locator(".site-footer")
  await expect(footer.getByRole("link", { name: /LinkedIn/ })).toHaveAttribute(
    "href",
    "https://www.linkedin.com/in/montse-pereda-grillo/",
  )
  await expect(footer.getByRole("link", { name: /Eloquent/ })).toHaveAttribute(
    "href",
    "https://www.eloquent.es/",
  )
  await expect(footer.getByRole("link", { name: "Email" })).toHaveAttribute(
    "href",
    "mailto:montse@eloquent.es",
  )
  await expect(footer.getByRole("link", { name: "Colofón" })).toHaveAttribute("href", "/colofon")
  await expect(footer.getByRole("link", { name: "Registro" })).toHaveAttribute("href", "/registro")
})

test("Registro mirrors the sitemap and orders routes alphabetically", async ({ page }) => {
  await page.goto("/registro")

  const registryPaths = await page.locator(".registry-index code").allTextContents()
  const alphabeticalPaths = [...registryPaths].sort((first, second) =>
    first.localeCompare(second, "es"),
  )
  const sitemapResponse = await page.request.get("/sitemap.xml")
  const sitemap = await sitemapResponse.text()
  const sitemapPaths = Array.from(
    sitemap.matchAll(/<loc>([^<]+)<\/loc>/g),
    (match) => new URL(match[1]!).pathname,
  ).sort((first, second) => first.localeCompare(second, "es"))

  expect(registryPaths).toEqual(alphabeticalPaths)
  expect(registryPaths).toEqual(sitemapPaths)
  expect(new Set(registryPaths).size).toBe(registryPaths.length)
})

test("hidden sections are explicitly non-indexable", async ({ page }) => {
  for (const route of ["/yo", "/notas", "/mediateca"]) {
    await page.goto(route)
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      "noindex, nofollow",
    )
    await expect(page.locator('meta[name="googlebot"]')).toHaveAttribute(
      "content",
      "noindex, nofollow",
    )
  }
})

test("mobile detail titles use compact type and safe wrapping", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("/portafolio/modulab-barcelona")

  const typography = await page.locator(".entry-detail-intro h1").evaluate((element) => {
    const style = getComputedStyle(element)
    return {
      fontSize: Number.parseFloat(style.fontSize),
      overflowWrap: style.overflowWrap,
      overflows: element.scrollWidth > element.clientWidth,
    }
  })

  expect(typography.fontSize).toBeGreaterThanOrEqual(44)
  expect(typography.fontSize).toBeLessThanOrEqual(56)
  expect(typography.overflowWrap).toBe("break-word")
  expect(typography.overflows).toBe(false)
})

test("Portafolio empty search state has a working recovery action", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("/portafolio")

  const search = page.getByPlaceholder("Buscar proyectos")
  await search.fill("resultado-imposible")
  await expect(page.locator("[data-portfolio-count]")).toHaveText("0 proyectos")
  await expect(page.locator("[data-portfolio-empty]")).toBeVisible()

  const reset = page.getByRole("button", { name: "Restablecer filtros" })
  await reset.click()
  await expect(search).toHaveValue("")
  await expect(search).toBeFocused()
  await expect(page.locator("[data-portfolio-empty]")).toBeHidden()
})

test("portfolio case-study links resolve from trailing-slash URLs", async ({ page }) => {
  await page.goto("/portafolio/syra-coffee/")

  const article = page.locator(".rich-content")
  const destinations = [
    { label: "Eloquent", href: "/portafolio/eloquent" },
    { label: "Modulab Barcelona", href: "/portafolio/modulab-barcelona" },
  ]

  for (const destination of destinations) {
    const link = article.getByRole("link", { name: destination.label, exact: true })
    await expect(link).toHaveAttribute("href", destination.href)
    await link.click()
    await expect(page).toHaveURL(new RegExp(`${destination.href}/?$`))
    await page.goto("/portafolio/syra-coffee/")
  }
})

test("carousel controls expose correct disabled states and respect reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("/portafolio/syra-coffee")

  const carousel = page.locator("[data-image-carousel]").first()
  const secondCarousel = page.locator("[data-image-carousel]").nth(1)
  const previous = carousel.getByRole("button", { name: "Mostrar imagen anterior" })
  const next = carousel.getByRole("button", { name: "Mostrar imagen siguiente" })
  const counter = carousel.locator("[data-carousel-counter]")

  await expect(previous).toBeDisabled()
  await expect(next).toBeEnabled()
  await next.click()
  await expect(counter).toHaveText("02 / 03")
  await expect(secondCarousel.locator("[data-carousel-counter]")).toHaveText("01 / 05")
  await next.click()
  await expect(counter).toHaveText("03 / 03")
  await expect(next).toBeDisabled()
  await expect(previous).toBeEnabled()
  await expect(page.locator("html")).toHaveCSS("scroll-behavior", "auto")
})
