const setupScrollControls = (shell: HTMLElement) => {
  if (shell.dataset.scrollReady === "true") return

  const header = shell.querySelector<HTMLElement>("[data-site-header]")
  const scrollToTop = shell.querySelector<HTMLButtonElement>("[data-scroll-to-top]")
  const threshold = Number(shell.dataset.scrollThreshold)
  if (!header || !scrollToTop || !Number.isFinite(threshold)) return

  shell.dataset.scrollReady = "true"
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
  let animationFrame: number | undefined
  let isPastThreshold: boolean | undefined

  const syncScrollState = () => {
    animationFrame = undefined
    const nextState = window.scrollY > threshold
    if (nextState === isPastThreshold) return

    isPastThreshold = nextState
    shell.toggleAttribute("data-sticky-header", nextState)
    header.toggleAttribute("data-sticky", nextState)
    scrollToTop.hidden = !nextState
  }

  const scheduleScrollState = () => {
    if (animationFrame !== undefined) return
    animationFrame = window.requestAnimationFrame(syncScrollState)
  }

  scrollToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: reduceMotion.matches ? "auto" : "smooth" })
  })
  window.addEventListener("scroll", scheduleScrollState, { passive: true })
  window.addEventListener("pageshow", scheduleScrollState)
  syncScrollState()
}

export const initScrollControls = () => {
  document.querySelectorAll<HTMLElement>("[data-scroll-shell]").forEach(setupScrollControls)
}
