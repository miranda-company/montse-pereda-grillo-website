type RevealGroup = {
  selector: string
  expandedOnly?: boolean
  variant?: "media"
  stagger?: number
}

const REVEALED = "true"
const MAX_STAGGER_INDEX = 2
const EXPANDED_VIEWPORT_QUERY = "(min-width: 1101px)"

const revealGroups: RevealGroup[] = [
  { selector: ".page-back" },
  { selector: ".page-intro > *", stagger: 65 },
  { selector: "[data-portfolio-card]", variant: "media", stagger: 70 },
  {
    selector: ".entry-detail-layout > :not(.entry-detail-reading)",
    stagger: 70,
  },
  {
    selector: ".entry-detail-reading > .rich-content > *",
    expandedOnly: true,
    stagger: 45,
  },
  { selector: ".yo-section > *", stagger: 60 },
  { selector: ".colophon-layout > *", stagger: 70 },
  { selector: ".colophon-content > section", stagger: 45 },
  { selector: ".registry-index > *", stagger: 55 },
]

const revealImmediately = (elements: HTMLElement[]) => {
  elements.forEach((element) => {
    element.dataset.revealed = REVEALED
  })
}

const isInInitialViewport = (element: HTMLElement) => {
  const bounds = element.getBoundingClientRect()
  return bounds.top < window.innerHeight && bounds.bottom > 0
}

export const initScrollReveal = () => {
  const isExpandedViewport = window.matchMedia(EXPANDED_VIEWPORT_QUERY).matches

  document.querySelectorAll<HTMLElement>("[data-scroll-shell]").forEach((shell) => {
    if (shell.dataset.revealInitialized === "true") return
    shell.dataset.revealInitialized = "true"

    const elements = new Set<HTMLElement>()

    revealGroups.forEach(({ selector, expandedOnly, variant, stagger = 0 }) => {
      if (expandedOnly && !isExpandedViewport) return

      shell.querySelectorAll<HTMLElement>(selector).forEach((element, index) => {
        if (elements.has(element)) return

        element.dataset.scrollReveal = variant ?? "default"
        element.style.setProperty(
          "--reveal-delay",
          `${Math.min(index, MAX_STAGGER_INDEX) * stagger}ms`,
        )
        elements.add(element)
      })
    })

    const revealElements = Array.from(elements)
    if (revealElements.length === 0) return

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      revealImmediately(revealElements)
      return
    }

    const pendingElements = revealElements.filter((element) => {
      if (!isInInitialViewport(element)) return true
      element.dataset.revealed = REVEALED
      return false
    })

    shell.dataset.revealReady = "true"
    if (pendingElements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return

          const element = entry.target as HTMLElement
          element.dataset.revealed = REVEALED
          observer.unobserve(element)
        })
      },
      {
        rootMargin: "0px 0px -8% 0px",
        threshold: 0.12,
      },
    )

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        pendingElements.forEach((element) => observer.observe(element))
      })
    })
  })
}
