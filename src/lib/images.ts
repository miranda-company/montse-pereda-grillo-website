import type { ImageMetadata } from "astro"

export function isLocalImageMetadata(value: unknown): value is ImageMetadata {
  if (!value || typeof value !== "object") return false

  const image = value as Partial<ImageMetadata>
  return (
    typeof image.src === "string" &&
    image.src.length > 0 &&
    !/^(?:https?:)?\/\//i.test(image.src) &&
    typeof image.width === "number" &&
    Number.isFinite(image.width) &&
    image.width > 0 &&
    typeof image.height === "number" &&
    Number.isFinite(image.height) &&
    image.height > 0 &&
    typeof image.format === "string" &&
    image.format.length > 0
  )
}
