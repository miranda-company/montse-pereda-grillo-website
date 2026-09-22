interface MasonryGridConfig {
  containerSelector: string
  itemSelector: string
}

const parseCssLength = (value: string) => {
  const parsed = Number.parseFloat(value)
  return Number.isFinite(parsed) ? parsed : 0
}

export const initMasonryGrid = ({ containerSelector, itemSelector }: MasonryGridConfig) => {
  const container = document.querySelector<HTMLElement>(containerSelector)
  if (!container || container.dataset.masonryReady === "true") return

  const items = Array.from(container.querySelectorAll<HTMLElement>(itemSelector))
  let animationFrame: number | undefined

  const layout = () => {
    animationFrame = undefined
    container.dataset.masonryReady = "true"

    items.forEach((item) => item.style.removeProperty("grid-row-end"))

    const styles = window.getComputedStyle(container)
    const rowHeight = parseCssLength(styles.gridAutoRows)
    const rowGap = parseCssLength(styles.rowGap)
    if (styles.display !== "grid" || rowHeight <= 0) return

    items.forEach((item) => {
      if (item.hidden) return

      const itemHeight = item.getBoundingClientRect().height
      const rowSpan = Math.max(1, Math.ceil((itemHeight + rowGap) / (rowHeight + rowGap)))
      item.style.gridRowEnd = `span ${rowSpan}`
    })
  }

  const scheduleLayout = () => {
    if (animationFrame !== undefined) return
    animationFrame = window.requestAnimationFrame(layout)
  }

  container.addEventListener("archive:layout-updated", scheduleLayout)

  const resizeObserver = new ResizeObserver(scheduleLayout)
  resizeObserver.observe(container)
  items.forEach((item) => resizeObserver.observe(item))

  document.fonts?.ready.then(scheduleLayout)
  window.addEventListener("load", scheduleLayout, { once: true })
  scheduleLayout()
}
