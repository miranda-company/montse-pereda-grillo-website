type RevealGroup = {
  selector: string
  variant?: "media"
  stagger?: number
}

const revealGroups: RevealGroup[] = [
  { selector: ".page-back" },
  { selector: ".page-intro > *", stagger: 65 },
  { selector: ".portfolio-controls" },
  { selector: "[data-portfolio-card]", variant: "media", stagger: 70 },
  { selector: ".entry-detail-layout > *", stagger: 70 },
  { selector: ".entry-detail-reading > .rich-content > *", stagger: 45 },
  { selector: ".yo-section > *", stagger: 60 },
  { selector: ".colophon-layout > *", stagger: 70 },
  { selector: ".colophon-content > section", stagger: 45 },
  { selector: ".registry-index > *", stagger: 55 },
]

const revealImmediately = (elements: HTMLElement[]) => {
  elements.forEach((element) => {
    element.dataset.revealed = "true"
  })
}

export const initScrollReveal = () => {
  document.querySelectorAll<HTMLElement>("[data-scroll-shell]").forEach((shell) => {
    if (shell.dataset.revealInitialized === "true") return
    shell.dataset.revealInitialized = "true"

    const elements = new Set<HTMLElement>()

    revealGroups.forEach(({ selector, variant, stagger = 0 }) => {
      shell.querySelectorAll<HTMLElement>(selector).forEach((element, index) => {
        if (elements.has(element)) return

        element.dataset.scrollReveal = variant ?? "default"
        element.style.setProperty("--reveal-delay", `${Math.min(index, 2) * stagger}ms`)
        elements.add(element)
      })
    })

    const revealElements = Array.from(elements)
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      revealImmediately(revealElements)
      return
    }

    const pendingElements = revealElements.filter((element) => {
      const bounds = element.getBoundingClientRect()
      const isInitiallyVisible = bounds.top < window.innerHeight && bounds.bottom > 0

      if (isInitiallyVisible) element.dataset.revealed = "true"
      return !isInitiallyVisible
    })

    shell.dataset.revealReady = "true"

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return

          const element = entry.target as HTMLElement
          element.dataset.revealed = "true"
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
