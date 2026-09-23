import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"

const routes = [
  "/",
  "/colofon",
  "/yo",
  "/notas",
  "/mediateca",
  "/portafolio",
  "/portafolio/syra-coffee",
  "/ruta-que-no-existe",
] as const

for (const route of routes) {
  test(`automated accessibility scan: ${route}`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto(route)
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze()

    expect(results.violations, `${route} has automated accessibility violations`).toEqual([])
  })
}

test("open mobile controls pass the automated accessibility scan", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("/notas")
  await page.locator("[data-note-disclosure] summary").click()

  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze()

  expect(results.violations).toEqual([])
})

test("sticky mobile navigation passes the automated accessibility scan", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("/portafolio/syra-coffee")
  await page.evaluate(() => window.scrollTo(0, 700))
  await expect(page.locator("[data-site-header]")).toHaveAttribute("data-sticky", "")
  await page.locator(".mobile-menu-button").click()

  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze()

  expect(results.violations).toEqual([])
})
