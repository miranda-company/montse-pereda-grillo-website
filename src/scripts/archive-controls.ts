interface FilterGroupConfig {
  buttonSelector: string
  buttonDataKey: string
  cardDataKey: string
  defaultValue: string
}

interface ArchiveControlsConfig {
  disclosureSelector: string
  controlsSelector: string
  containerSelector: string
  cardSelector: string
  sortSelector: string
  countSelector: string
  summarySelector: string
  emptySelector: string
  resetSelector: string
  primary: FilterGroupConfig
  secondary: FilterGroupConfig
  singular: string
  plural: string
  compareCards: (first: HTMLElement, second: HTMLElement, sortValue: string) => number
}

const setPressedState = (buttons: HTMLButtonElement[], dataKey: string, activeValue: string) => {
  buttons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset[dataKey] === activeValue))
  })
}

const setupResponsiveDisclosure = (selector: string) => {
  const disclosure = document.querySelector<HTMLDetailsElement>(selector)
  if (!disclosure || disclosure.dataset.viewportReady === "true") return

  disclosure.dataset.viewportReady = "true"
  const mobileViewport = window.matchMedia("(max-width: 767px)")
  const syncDisclosure = () => disclosure.toggleAttribute("open", !mobileViewport.matches)

  syncDisclosure()
  mobileViewport.addEventListener("change", syncDisclosure)
}

export const initArchiveControls = (config: ArchiveControlsConfig) => {
  setupResponsiveDisclosure(config.disclosureSelector)

  const controls = document.querySelector<HTMLElement>(config.controlsSelector)
  const container = document.querySelector<HTMLElement>(config.containerSelector)
  if (!controls || !container || controls.dataset.ready === "true") return

  controls.dataset.ready = "true"

  const primaryButtons = Array.from(
    controls.querySelectorAll<HTMLButtonElement>(config.primary.buttonSelector),
  )
  const secondaryButtons = Array.from(
    controls.querySelectorAll<HTMLButtonElement>(config.secondary.buttonSelector),
  )
  const sortControl = controls.querySelector<HTMLSelectElement>(config.sortSelector)
  const count = document.querySelector<HTMLElement>(config.countSelector)
  const summary = document.querySelector<HTMLElement>(config.summarySelector)
  const empty = document.querySelector<HTMLElement>(config.emptySelector)
  const reset = document.querySelector<HTMLButtonElement>(config.resetSelector)
  const cards = Array.from(container.querySelectorAll<HTMLElement>(config.cardSelector))

  let primaryValue = config.primary.defaultValue
  let secondaryValue = config.secondary.defaultValue

  const applyState = () => {
    const sortValue = sortControl?.value ?? ""
    const sortedCards = [...cards].sort((first, second) =>
      config.compareCards(first, second, sortValue),
    )

    let visible = 0
    sortedCards.forEach((card) => {
      const matchesPrimary =
        primaryValue === config.primary.defaultValue ||
        card.dataset[config.primary.cardDataKey] === primaryValue
      const matchesSecondary =
        secondaryValue === config.secondary.defaultValue ||
        (card.dataset[config.secondary.cardDataKey] ?? "").split("|").includes(secondaryValue)

      card.hidden = !(matchesPrimary && matchesSecondary)
      if (!card.hidden) visible += 1
      container.append(card)
    })

    const noun = visible === 1 ? config.singular : config.plural
    const filtersActive =
      primaryValue !== config.primary.defaultValue ||
      secondaryValue !== config.secondary.defaultValue

    if (count) count.textContent = `${visible} ${noun} ${visible === 1 ? "visible" : "visibles"}`
    if (summary) {
      summary.textContent = `${visible} ${noun} · ${filtersActive ? "filtros activos" : "sin filtros"}`
    }
    if (empty) empty.hidden = visible !== 0
    container.dispatchEvent(new CustomEvent("archive:layout-updated"))
  }

  primaryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      primaryValue = button.dataset[config.primary.buttonDataKey] ?? config.primary.defaultValue
      setPressedState(primaryButtons, config.primary.buttonDataKey, primaryValue)
      applyState()
    })
  })

  secondaryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const nextValue =
        button.dataset[config.secondary.buttonDataKey] ?? config.secondary.defaultValue
      secondaryValue = secondaryValue === nextValue ? config.secondary.defaultValue : nextValue
      setPressedState(secondaryButtons, config.secondary.buttonDataKey, secondaryValue)
      applyState()
    })
  })

  reset?.addEventListener("click", () => {
    primaryValue = config.primary.defaultValue
    secondaryValue = config.secondary.defaultValue
    setPressedState(primaryButtons, config.primary.buttonDataKey, primaryValue)
    setPressedState(secondaryButtons, config.secondary.buttonDataKey, secondaryValue)
    applyState()
  })

  sortControl?.addEventListener("change", applyState)
  applyState()
}
