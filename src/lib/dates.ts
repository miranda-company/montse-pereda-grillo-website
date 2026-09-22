const numericSpanishDate = new Intl.DateTimeFormat("es-ES", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
})

export function formatDottedDate(date: Date) {
  return date.toISOString().slice(0, 10).split("-").reverse().join(".")
}

export function formatNumericDate(date: Date) {
  return numericSpanishDate.format(date)
}

export function toDateValue(date: Date) {
  return date.toISOString().slice(0, 10)
}
