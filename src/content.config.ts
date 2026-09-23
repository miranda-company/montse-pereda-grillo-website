import { defineCollection, reference } from "astro:content"
import { file, glob } from "astro/loaders"
import { z } from "astro/zod"

const language = z.enum(["es", "en"]).default("es")
const translationKey = z.string().min(1).optional()
const internalUrl = z.string().startsWith("/")
const linkedSegment = z.object({
  text: z.string().min(1),
  href: internalUrl.optional(),
})
const linkedParagraph = z.array(linkedSegment).min(1)
const contentReference = <Collection extends "notas" | "mediateca" | "portafolio">(
  collection: Collection,
) =>
  reference(collection).refine((entry) => entry.id.trim().length > 0, {
    message: "Las referencias de contenido no pueden estar vacías.",
  })

const notas = defineCollection({
  loader: glob({ base: "./src/content/notas", pattern: "**/*.{md,mdx}" }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string().min(1),
        summary: z.string().min(1),
        publishedAt: z.coerce.date(),
        updatedAt: z.coerce.date(),
        state: z.enum(["semilla", "en-crecimiento", "perenne"]),
        archiveNumber: z.string().regex(/^N\.\d{3}$/),
        kind: z.enum(["note", "external"]).default("note"),
        cardFormat: z.enum(["compact", "standard", "visual", "featured"]),
        externalUrl: z.url().optional(),
        externalSource: z.string().min(1).optional(),
        coverImage: image().optional(),
        coverAlt: z.string().min(1).optional(),
        tags: z.array(z.string().min(1)).default([]),
        relatedNotes: z.array(contentReference("notas")).default([]),
        relatedMedia: z.array(contentReference("mediateca")).default([]),
        relatedProjects: z.array(contentReference("portafolio")).default([]),
        relatedLinks: z
          .array(
            z.object({
              label: z.string().min(1),
              href: internalUrl,
            }),
          )
          .default([]),
        featured: z.boolean().default(false),
        draft: z.boolean().default(false),
        fixture: z.boolean().default(false),
        language,
        translationKey,
      })
      .superRefine((entry, context) => {
        if (entry.kind === "external") {
          if (!entry.externalUrl) {
            context.addIssue({
              code: "custom",
              message: "Un artículo externo de Notas requiere externalUrl.",
              path: ["externalUrl"],
            })
          }

          if (!entry.externalSource) {
            context.addIssue({
              code: "custom",
              message: "Un artículo externo de Notas requiere externalSource.",
              path: ["externalSource"],
            })
          }

          if (entry.externalUrl && !entry.externalUrl.startsWith("https://")) {
            context.addIssue({
              code: "custom",
              message: "La URL de un artículo externo debe usar HTTPS.",
              path: ["externalUrl"],
            })
          }

          if (entry.cardFormat !== "compact") {
            context.addIssue({
              code: "custom",
              message: "Un artículo externo de Notas debe usar cardFormat: compact.",
              path: ["cardFormat"],
            })
          }

          if (entry.coverImage || entry.coverAlt) {
            context.addIssue({
              code: "custom",
              message: "Las tarjetas de artículos externos no utilizan imagen de portada.",
              path: [entry.coverImage ? "coverImage" : "coverAlt"],
            })
          }

          const externalRelationshipPath =
            entry.relatedNotes.length > 0
              ? "relatedNotes"
              : entry.relatedMedia.length > 0
                ? "relatedMedia"
                : entry.relatedProjects.length > 0
                  ? "relatedProjects"
                  : entry.relatedLinks.length > 0
                    ? "relatedLinks"
                    : undefined

          if (externalRelationshipPath) {
            context.addIssue({
              code: "custom",
              message: "Un artículo externo no tiene página de detalle para mostrar conexiones.",
              path: [externalRelationshipPath],
            })
          }
        }

        if (entry.kind === "note" && (entry.externalUrl || entry.externalSource)) {
          context.addIssue({
            code: "custom",
            message: "externalUrl y externalSource solo pertenecen a entradas kind: external.",
            path: [entry.externalUrl ? "externalUrl" : "externalSource"],
          })
        }

        if (entry.coverImage && !entry.coverAlt) {
          context.addIssue({
            code: "custom",
            message: "Toda imagen de tarjeta de Notas requiere texto alternativo.",
            path: ["coverAlt"],
          })
        }

        if (entry.fixture && !entry.draft) {
          context.addIssue({
            code: "custom",
            message: "Una fixture técnica de Notas siempre debe ser borrador.",
            path: ["draft"],
          })
        }

        if (entry.fixture && entry.archiveNumber !== "N.999") {
          context.addIssue({
            code: "custom",
            message: "La fixture técnica de Notas debe usar el número reservado N.999.",
            path: ["archiveNumber"],
          })
        }

        if (!entry.fixture && entry.archiveNumber === "N.999") {
          context.addIssue({
            code: "custom",
            message: "N.999 está reservado para la fixture técnica de MDX.",
            path: ["archiveNumber"],
          })
        }
      }),
})

const mediateca = defineCollection({
  loader: glob({ base: "./src/content/mediateca", pattern: "**/*.{md,mdx}" }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string().min(1),
        creator: z.string().min(1),
        format: z.enum(["book", "article", "website", "tool", "video", "podcast", "other"]),
        engagementMode: z.enum(["read", "watch", "listen"]),
        editorialState: z.enum(["provisional", "revisado"]),
        summary: z.string().min(1),
        publicationYear: z.number().int().min(1400).max(2100).optional(),
        status: z.enum(["en-curso", "consultado", "de-referencia", "por-explorar"]),
        archiveNumber: z.string().regex(/^M\.\d{3}$/),
        updatedAt: z.coerce.date(),
        externalUrl: z.url().optional(),
        coverImage: image().optional(),
        coverAlt: z.string().min(1).optional(),
        coverCaption: z.string().min(1).optional(),
        tags: z.array(z.string().min(1)).default([]),
        relatedNotes: z.array(contentReference("notas")).default([]),
        relatedMedia: z.array(contentReference("mediateca")).default([]),
        relatedProjects: z.array(contentReference("portafolio")).default([]),
        displayInShelf: z.boolean().default(false),
        featured: z.boolean().default(false),
        draft: z.boolean().default(false),
        fixture: z.boolean().default(false),
        language,
        translationKey,
      })
      .superRefine((entry, context) => {
        if (entry.coverImage && !entry.coverAlt) {
          context.addIssue({
            code: "custom",
            message: "Toda cubierta de Mediateca requiere texto alternativo.",
            path: ["coverAlt"],
          })
        }

        if (entry.coverCaption && !entry.coverImage) {
          context.addIssue({
            code: "custom",
            message: "La leyenda de cubierta de Mediateca requiere una imagen de cubierta.",
            path: ["coverCaption"],
          })
        }

        if (entry.fixture && !entry.draft) {
          context.addIssue({
            code: "custom",
            message: "Una fixture técnica de Mediateca siempre debe ser borrador.",
            path: ["draft"],
          })
        }

        if (entry.fixture && entry.archiveNumber !== "M.999") {
          context.addIssue({
            code: "custom",
            message: "La fixture técnica de Mediateca debe usar el número reservado M.999.",
            path: ["archiveNumber"],
          })
        }

        if (!entry.fixture && entry.archiveNumber === "M.999") {
          context.addIssue({
            code: "custom",
            message: "M.999 está reservado para la fixture técnica de MDX.",
            path: ["archiveNumber"],
          })
        }
      }),
})

const portafolio = defineCollection({
  loader: glob({ base: "./src/content/portafolio", pattern: "**/*.{md,mdx}" }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string().min(1),
        summary: z.string().min(1),
        year: z.number().int().min(1900),
        endYear: z.number().int().min(1900).optional(),
        role: z.string().min(1),
        disciplines: z.array(z.string().min(1)).min(1),
        tags: z.array(z.string().min(1)).default([]),
        client: z.string().min(1).optional(),
        projectStatus: z.string().min(1),
        archiveNumber: z.string().regex(/^P\.\d{3}$/),
        coverImage: image().optional(),
        coverAlt: z.string().min(1).optional(),
        coverCaption: z.string().min(1).optional(),
        gallery: z
          .array(
            z.object({
              image: image(),
              alt: z.string().min(1),
              caption: z.string().min(1).optional(),
            }),
          )
          .default([]),
        projectLinks: z
          .array(
            z.object({
              label: z.string().min(1),
              url: z.url(),
            }),
          )
          .default([]),
        displayOrder: z.number().int().nonnegative(),
        updatedAt: z.coerce.date(),
        placeholder: z.boolean().default(false),
        relatedNotes: z.array(contentReference("notas")).default([]),
        relatedMedia: z.array(contentReference("mediateca")).default([]),
        relatedProjects: z.array(contentReference("portafolio")).default([]),
        draft: z.boolean().default(false),
        fixture: z.boolean().default(false),
        language,
        translationKey,
      })
      .superRefine((entry, context) => {
        if (entry.endYear !== undefined && entry.endYear <= entry.year) {
          context.addIssue({
            code: "custom",
            message:
              "El año final debe ser posterior al año inicial. Para un proyecto de un solo año, omite endYear.",
            path: ["endYear"],
          })
        }

        if (!entry.draft && !entry.coverImage) {
          context.addIssue({
            code: "custom",
            message: "Los proyectos publicados requieren una imagen de portada.",
            path: ["coverImage"],
          })
        }

        if (entry.coverImage && !entry.coverAlt) {
          context.addIssue({
            code: "custom",
            message: "Toda imagen de portada requiere texto alternativo.",
            path: ["coverAlt"],
          })
        }

        if (!entry.draft && !entry.coverAlt) {
          context.addIssue({
            code: "custom",
            message: "Los proyectos publicados requieren texto alternativo para su portada.",
            path: ["coverAlt"],
          })
        }

        if (entry.coverCaption && !entry.coverImage) {
          context.addIssue({
            code: "custom",
            message: "La leyenda de portada requiere una imagen de portada.",
            path: ["coverCaption"],
          })
        }

        if (entry.placeholder && !entry.draft) {
          context.addIssue({
            code: "custom",
            message: "Un proyecto provisional siempre debe ser borrador.",
            path: ["draft"],
          })
        }

        if (entry.placeholder && entry.projectLinks.length > 0) {
          context.addIssue({
            code: "custom",
            message: "Los proyectos provisionales no pueden publicar enlaces externos.",
            path: ["projectLinks"],
          })
        }

        if (entry.fixture && !entry.draft) {
          context.addIssue({
            code: "custom",
            message: "Una fixture técnica de Portafolio siempre debe ser borrador.",
            path: ["draft"],
          })
        }

        if (entry.fixture && entry.archiveNumber !== "P.999") {
          context.addIssue({
            code: "custom",
            message: "La fixture técnica de Portafolio debe usar el número reservado P.999.",
            path: ["archiveNumber"],
          })
        }

        if (!entry.fixture && entry.archiveNumber === "P.999") {
          context.addIssue({
            code: "custom",
            message: "P.999 está reservado para la fixture técnica de MDX.",
            path: ["archiveNumber"],
          })
        }
      }),
})

const timelineEntry = z
  .object({
    role: z.string().min(1),
    organization: z.string().min(1),
    period: z.string().min(1),
    description: z.string().min(1),
    organizationUrl: z.url().optional(),
    caseStudyLabel: z.string().min(1).optional(),
    caseStudyUrl: internalUrl.optional(),
    current: z.boolean().default(false),
    placeholder: z.boolean().default(false),
  })
  .superRefine((entry, context) => {
    if (entry.caseStudyUrl && !entry.caseStudyLabel) {
      context.addIssue({
        code: "custom",
        message: "Un enlace de caso requiere una etiqueta visible.",
        path: ["caseStudyLabel"],
      })
    }

    if (entry.placeholder && (entry.organizationUrl || entry.caseStudyUrl)) {
      context.addIssue({
        code: "custom",
        message: "Las etapas provisionales no pueden publicar enlaces.",
      })
    }

    if (entry.current && entry.placeholder) {
      context.addIssue({
        code: "custom",
        message: "La etapa actual no puede marcarse como provisional.",
        path: ["placeholder"],
      })
    }
  })

const profile = defineCollection({
  loader: file("./src/content/site/yo.json"),
  schema: z
    .object({
      hero: z.object({
        label: z.string().min(1),
        name: z.string().min(1),
        positioning: z.string().min(1),
        disciplines: z.string().min(1),
      }),
      portrait: z.object({
        alt: z.string().min(1),
        annotation: z.string().min(1),
      }),
      context: z.object({
        index: z.string().min(1),
        title: z.string().min(1),
        paragraphs: z.array(linkedParagraph).min(1),
      }),
      currentContext: z.object({
        index: z.string().min(1),
        title: z.string().min(1),
        paragraphs: z.array(linkedParagraph).min(1),
      }),
      timeline: z.object({
        index: z.string().min(1),
        title: z.string().min(1),
        entries: z.array(timelineEntry).length(5),
      }),
      history: z.object({
        index: z.string().min(1),
        title: z.string().min(1),
        paragraphs: z.array(linkedParagraph).min(1),
        personalNote: z.object({
          label: z.string().min(1),
          paragraph: z.string().min(1),
        }),
      }),
      closing: z.object({
        index: z.string().min(1),
        label: z.string().min(1),
        links: z
          .array(
            z.object({
              label: z.string().min(1),
              href: internalUrl,
            }),
          )
          .length(2),
      }),
      language,
    })
    .superRefine((entry, context) => {
      if (entry.timeline.entries.filter((timelineItem) => timelineItem.current).length !== 1) {
        context.addIssue({
          code: "custom",
          message: "La trayectoria requiere exactamente una etapa actual.",
          path: ["timeline", "entries"],
        })
      }
    }),
})

const homepage = defineCollection({
  loader: file("./src/content/site/homepage.json"),
  schema: ({ image }) => {
    const panelBase = z.object({
      index: z.string().regex(/^\d{2}$/),
      title: z.string().min(1),
      description: z.string().min(1),
      href: z.string().startsWith("/"),
      image: image().nullable().default(null),
      imageAlt: z.string().trim().min(1).nullable().default(null),
    })

    const panel = z
      .discriminatedUnion("kind", [
        panelBase
          .extend({
            kind: z.literal("yo"),
            metadata: z.string().min(1),
            reveal: z.string().min(1),
          })
          .strict(),
        panelBase.extend({ kind: z.literal("notas") }).strict(),
        panelBase
          .extend({
            kind: z.literal("mediateca"),
            metadata: z.string().min(1),
          })
          .strict(),
        panelBase
          .extend({
            kind: z.literal("portafolio"),
            metadata: z.string().min(1),
          })
          .strict(),
      ])
      .superRefine((entry, context) => {
        if (Boolean(entry.image) === Boolean(entry.imageAlt)) return

        context.addIssue({
          code: "custom",
          message:
            "Cada imagen de panel requiere un texto alternativo y cada texto alternativo requiere una imagen.",
          path: [entry.image ? "imageAlt" : "image"],
        })
      })

    return z
      .object({
        heroEyebrow: z.string().trim().min(1),
        heroTitle: z.string().min(1),
        heroTitleAccent: z.string().min(1),
        connectionLabel: z.string().min(1),
        indexLabel: z.string().min(1),
        panels: z.array(panel).length(4),
      })
      .superRefine((entry, context) => {
        if (new Set(entry.panels.map((item) => item.kind)).size !== 4) {
          context.addIssue({
            code: "custom",
            message:
              "La portada requiere exactamente un panel de Yo, Notas, Mediateca y Portafolio.",
            path: ["panels"],
          })
        }
      })
  },
})

const ahora = defineCollection({
  loader: file("./src/content/site/ahora.json"),
  schema: z.object({
    label: z.string().min(1),
    period: z.string().min(1),
    title: z.string().min(1),
    notesHeading: z.string().min(1),
    notesLinkLabel: z.string().min(1),
    mediatecaHeading: z.string().min(1),
    mediatecaLinkLabel: z.string().min(1),
    portfolioHeading: z.string().min(1),
    portfolioLinkLabel: z.string().min(1),
    portfolioEmptyTitle: z.string().min(1),
    portfolioEmptyStatus: z.string().min(1),
  }),
})

export const collections = {
  notas,
  mediateca,
  portafolio,
  profile,
  homepage,
  ahora,
}
