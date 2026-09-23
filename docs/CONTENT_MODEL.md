# Content model

All collection schemas live in `src/content.config.ts` and are checked by
`pnpm run check` and every production build.

## Notas

Markdown and MDX entries share one validated schema:

- `title` and `summary`: required editorial text;
- `publishedAt` and `updatedAt`: coerced dates;
- `state`: `semilla`, `en-crecimiento`, or `perenne`;
- `archiveNumber`: a stable `N.###` identifier;
- `kind`: `note` (default) or `external`;
- `cardFormat`: `compact`, `standard`, `visual`, or `featured`;
- `externalUrl` and `externalSource`: required together for `kind: external`;
- `coverImage`: an optional local image for the index card;
- `coverAlt`: required meaningful alternative text whenever `coverImage` is set;
- `tags`: an optional array that defaults to empty;
- `relatedNotes`: validated references to other Notas entries;
- `relatedMedia`: validated references to Mediateca entries;
- `relatedProjects`: validated references to Portafolio entries;
- `relatedLinks`: optional labeled internal URLs beginning with `/`;
- `featured`, `draft`, and `fixture`: booleans that default to `false`;
- `language`: `es` or `en`, defaulting to `es`;
- `translationKey`: an optional non-empty cross-language identifier;
- the Markdown or MDX body.

`cardFormat` controls presentation in the garden without changing hierarchy,
editorial meaning, URL, or whether an image appears. A card displays a local
cover only when `coverImage` is configured; otherwise it renders as text without
reserving an empty image area. Configured covers fill the card width and retain
their natural aspect ratio rather than using a fixed-height crop. `featured` is
retained as future-facing metadata but currently uses the same presentation as
a regular non-compact card. Renaming an entry from `.md` to `.mdx` preserves its
content ID, slug, and public route.

Every visible local Spanish entry uses the shared `NoteArticle.astro` reading layout.
The default index order and circular previous/next navigation both use
`updatedAt` descending, with `archiveNumber` as the deterministic tie-breaker.
`relatedNotes`, `relatedMedia`, and `relatedProjects` store validated, non-empty
entry IDs. Use `[]` when there is no authored relationship; never add an empty
string as a placeholder.
The author writes only the relationship from the current entry to its target;
the build-time connection graph automatically creates the backlink on the
target. `relatedLinks` stores an optional visible `label` and an internal `href`
that begins with `/`, but it is not part of the backlink graph because an
arbitrary URL does not identify a validated collection entry. Empty Markdown
bodies render an interface-only editorial state without storing fabricated
prose in the content file. Both formats render through `render(entry)` and the
same `NoteArticle.astro` component.

`kind: external` is the intentional exception to the local reading layout. It
requires an HTTPS `externalUrl`, a visible `externalSource`, and
`cardFormat: compact`; it rejects cover images and outgoing connection metadata.
`ExternalNoteCard.astro` opens the source URL in a new tab with an explicit
accessible label and `noopener noreferrer`. External entries remain available
to index filters, sorting, counts and optional homepage previews, but are
excluded from `/notas/[slug]`, previous/next navigation and the sitemap.

Ordinary notes should remain `.md`; MDX is reserved for approved Astro content
components. `VideoEmbed.astro` allowlists YouTube and Vimeo. It validates IDs,
constructs player and fallback URLs internally, exposes a required accessible
title, and never accepts arbitrary iframe URLs or scripts. `ContentImage.astro`
provides semantic, captioned standalone images from locally imported Astro image
metadata. `ImageCarousel.astro` accepts the same kind of local assets and provides
the shared image-carousel behavior described below. Future providers or component types
require their own reviewed implementation, an explicit allowlist decision,
meaningful fallback content, and the minimum client-side JavaScript necessary.

Fenced code blocks in Markdown and MDX use Astro's built-in Shiki highlighter
with the `github-light` theme. JavaScript, TypeScript, HTML, CSS, JSON, Bash, and
plain text require no client-side runtime. Long lines scroll within the code
block instead of expanding the reading column.

`draft` is the publication boundary, while `fixture` separates technical
verification content from genuine editorial content. Ordinary authors normally
omit `fixture`; its default is `false`. Validation requires every
`fixture: true` entry to remain `draft: true`. It also reserves `N.999` for the
technical fixture and rejects `N.999` on an ordinary note.

Production contains five local Notas entries:
`el-magnifico-mundo-de-los-jardines-digitales`,
`zettelkasten-un-metodo-para-organizar-nuestro-conocimiento`,
`mis-lugares-favoritos-de-internet`, `metodos-para-descubrir-el-problema`, and
`scrum`. They use `N.001`–`N.003` and `N.008`–`N.009` and participate in the
index, homepage, detail layout, filters, connections, and circular navigation.
Four external Eloquent articles use `N.004`–`N.007` and render only as link
cards.

Development also includes the ordinary drafts
`como-crear-un-sistema-de-contenido-para-li`,
`guia-de-estudio-creative-operations`, `operational-excellence`, and
`priorizar-decisiones`. Their archive numbers are provisional and must be
replaced with unique values before publication. No Notas MDX fixture is active.

Local entries own their editorial body in Markdown or MDX;
`metodos-para-descubrir-el-problema` is the current published MDX note. Reusable
authoring remains documented in the templates without requiring a technical
fixture route in the collection.

See [WRITING_NOTES.md](WRITING_NOTES.md), [templates/nota.md](templates/nota.md),
[templates/nota-mdx.mdx](templates/nota-mdx.mdx), and
[templates/nota-externa.md](templates/nota-externa.md) for the authoring workflow
and safe starter files outside the content collection.

## Shared editorial body

Notas, Portafolio and Mediateca retain different schemas and metadata, but their
Markdown/MDX bodies render inside the same `.rich-content` context from
`src/styles/rich-content.css`. It covers paragraphs, H2/H3, lists, links,
blockquotes, inline and fenced code, horizontal rules, local images, figures,
captions, footnotes and tables at a maximum measure of approximately 70ch.

Astro renders fenced code statically with Shiki and the `github-light` theme;
there is no client-side highlighter. Long lines scroll inside their block.
`VideoEmbed.astro` is collection-neutral and allowlists only YouTube and Vimeo,
with validated IDs, required accessible titles, visible fallback links,
`youtube-nocookie.com`, Vimeo `dnt=1`, lazy loading and no autoplay. Arbitrary
iframes and pasted scripts remain unsupported.

`src/components/content/ImageCarousel.astro` is also collection-neutral and is
supported inside Notas, Portafolio, and Mediateca MDX bodies. Its typed API is:

```ts
interface CarouselImage {
  src: ImageMetadata
  alt: string
  caption?: string
}

interface Props {
  label: string
  images: CarouselImage[]
}
```

The component requires a non-empty accessible `label`, at least two locally
imported images, and meaningful non-empty alternative text for every image.
Optional captions must contain text when supplied. Remote strings and malformed
image objects fail rendering with a Spanish error. Each slide uses its single
imported source file and preserves that file's intrinsic dimensions.

The carousel uses a stable 16:10 contained-image stage, ordered-list and figure
semantics, visible Spanish previous/next controls, an independently updated live
counter, CSS scroll snap, touch and trackpad scrolling, and reduced-motion-aware
movement. It never autoplays or loops. Without JavaScript every image, caption,
and alternative text remains available through native horizontal scrolling;
the small framework-free script adds one-slide controls, counter synchronization,
responsive recalculation, and support for multiple independent instances.

Preferred local-image folders are:

- `src/assets/images/notas/<slug>/`;
- `src/assets/images/portafolio/<slug>/`;
- `src/assets/images/mediateca/<slug>/`.

Every meaningful image needs useful alternative text. Captions are optional.
Structured Portfolio covers and galleries remain separate from inline editorial
images and use the same single-source policy. Normal static images work in `.md`;
`ImageCarousel` requires `.mdx`. Authors should prepare assets at their final useful
dimensions, keep them below 200 KB when practical, and strip unnecessary personal,
EXIF/GPS, and location metadata before committing image files.

`src/components/content/ContentImage.astro` is the collection-neutral component
for one inline editorial image. Its typed API is `src: ImageMetadata`, `alt: string`,
and `caption?: string`. It rejects remote or malformed sources, requires meaningful
non-empty alternative text, preserves intrinsic dimensions, and delegates single-image
metadata validation to Astro without generating a `srcset` or transformed copy. It renders a semantic figure and uses the same shared
mono caption treatment as videos and carousel slides. A captioned static image therefore
requires `.mdx`; normal uncaptioned Markdown images remain supported in `.md`.

## Mediateca

Markdown and MDX entries contain a title, author or creator, format, engagement
mode, editorial state, summary, optional publication year, catalogue status, archival number,
update date, optional canonical external URL and local cover image with required
alternative text and optional visible caption, tags,
related notes, related Mediateca entries, related Portafolio projects, featured,
draft and technical-fixture flags, language, an optional translation key, and an
editorial Markdown or MDX body.

Formats cover books, articles, websites, tools, videos, podcasts, and other
useful references. Status values are `en-curso`, `consultado`,
`de-referencia`, and `por-explorar`. Engagement mode is a separate presentation
and consumption cue. Its internal values are `read`, `watch`, and `listen`,
shown in the Spanish interface as `LEER`, `VER`, and `ESCUCHAR` respectively.
It does not replace format and is not part of catalogue filtering. Status also
remains editorial metadata but is not exposed as a catalogue filter.

`editorialState` is separate from publication. `provisional` shows the current
copy warning and `revisado` removes it. It does not generate or rename article
sections. The Markdown or MDX body owns the complete reading structure, including
headings such as “Comentario”, “Por qué está aquí” or any alternative an author
chooses. `draft` remains the production boundary in both cases. All sixteen
ordinary references currently use `revisado`; the technical fixture retains its
provisional warning.

Development includes sixteen ordinary references. A normal production build
includes fifteen; `casey-neistat-diary-of-a-ceo` remains a draft. The ordinary
entries use unique archive numbers from `M.001` through `M.016`.

`ejemplo-mdx` is an additional technical route in development. Validation
requires `fixture: true` entries to remain drafts, reserves `M.999` for that
fixture, and rejects the number on genuine references. Central collection
helpers keep it out of catalogue cards, counts, filters, homepage previews,
related entries and production. It is not a recommendation.

`displayInShelf` defaults to `false`. Set it to `true` to include a visible
Mediateca entry in “Anaquel”; the page orders selected entries by
`updatedAt` and then `archiveNumber`, using the same deterministic order as the
catalogue. The homepage “Anaquel” preview uses the first three published Spanish
entries from this same ordered selection. Drafts and fixtures never enter that
preview. This keeps shelf membership in the entry metadata rather than in a
separate route-level slug list.

When a Mediateca entry supplies `coverImage`, validation also requires
`coverAlt`. The same local cover appears in “Anaquel” when
`displayInShelf` is `true` and on its detail page. A selected entry without
`coverImage` uses a neutral image marker on the shelf. Its detail page instead
uses the semantic `engagementMode` icon and label—LEER, VER, or ESCUCHAR—rather
than a generated format illustration.
Optional `coverCaption` appears below the cover on the detail page, not in the
compact index card. The caption provides context or credit and never replaces
alternative text.

The Markdown or MDX body remains the source of truth for every reference's
editorial structure. `VideoEmbed` supports the current video reference, while
explicit Markdown hard breaks preserve verse structure in poem entries without
changing whitespace behavior for other articles.

Every canonical reference, including `/mediateca/the-age-of-the-image`, is generated by
`src/pages/mediateca/[slug].astro`; there is no route-specific renderer. See
[WRITING_MEDIATECA.md](WRITING_MEDIATECA.md),
[templates/mediateca.md](templates/mediateca.md), and
[templates/mediateca-mdx.mdx](templates/mediateca-mdx.mdx).

## Yo profile

`src/content/site/yo.json` contains the complete editable `/yo` prototype:
hero labels, linked prose segments, portrait metadata, current context, five
timeline records, approved personal history, and the two closing links. The
`profile` collection validates this file separately
from the minimal provisional-page collection.

The five timeline records render as normal career history. Exactly one entry
must use `current: true`; completed historical roles use `current: false` and
`placeholder: false`. Approved personal-history copy belongs directly in
`history.paragraphs` or in the approved `history.personalNote` sidebar. The
personal note is not a provisional-content state. Eloquent and Modulab publish
verified case-study links; timeline entries without a case study omit the
optional label and URL fields.

The retained `/yo` prototype still uses its baseline portrait asset and will be
revisited when that route enters Montse's launch scope. The active homepage
portrait lives at
`src/assets/images/homepage/montse-pereda-portrait.png` and is imported directly
by `src/pages/index.astro`.

For a future approved replacement, overwrite that repository asset with a
sanitized local image, preserve the outer `figure`, field dimensions, border
and caption, and update the `alt` and annotation in `src/content/site/yo.json`
when the visible subject or provenance changes. Do not substitute a remote URL,
upscale beyond the replacement source, or commit EXIF/GPS metadata.

To add a genuine case-study link, set both `caseStudyLabel` and an internal
`caseStudyUrl` on a non-placeholder timeline entry. Validation rejects URLs on
placeholder entries, rejects a case-study URL without visible link text, and
prevents the current role from being marked as provisional.

## Portafolio

La referencia práctica y campo por campo está en
[PORTFOLIO_PROJECT_GUIDE.md](PORTFOLIO_PROJECT_GUIDE.md).

Markdown entries model a deliberately curated project rather than a complete
chronological archive. Fields include title, summary, start year (`year`), optional
end year (`endYear`), role, one or more
disciplines, optional client or organization, project status, `P.###` archive
number, tags, optional cover image, required companion alternative text, optional cover caption, update
date, structured gallery, verified project links, related Notas, Mediateca and
Portafolio references, display order, placeholder and draft flags, language,
optional translation key, and the case-study body.

Portfolio has no `featured` field or visual state. Every selected project uses
the same index proportions, hierarchy and interaction. `displayOrder` is the
only ordering mechanism for both the index and previous/next navigation. Tags
feed the index filter and remain separate from the longer discipline metadata.
The text search matches project titles, summaries, organizations, disciplines
and tags without changing route generation or editorial order.

### Publication boundary

- Development includes 15 ordinary projects: seven published case studies and
  eight provisional placeholders.
- All eight placeholders use `draft: true` and `placeholder: true`. Their copy,
  organizations, roles and disciplines remain pending, and they contain no
  external project URLs.
- A placeholder must be a draft and cannot contain project links. Schema
  validation rejects either violation.
- Production excludes every draft and placeholder card and detail route. It
  currently generates `syra-coffee`, `bsc`, `minka-icm`, `cn-sant-andreu`,
  `modulab-barcelona`, `eloquent`, and `elespacio`.
- A genuine non-draft project requires `coverImage` and `coverAlt` and must use
  `placeholder: false`.
- `ejemplo-mdx` is a separate technical fixture. It must remain a draft, uses
  reserved number `P.999`, and is excluded centrally from the index, search,
  filters, counts, connections, previous/next navigation and production.

When no genuine project is published, the production index remains valid and
shows “La selección de proyectos está en preparación.”

The seven published projects currently use the ordered identifiers `P.001` to
`P.007` and matching `displayOrder` values. Several draft placeholders still
reuse identifiers or ordering values. Those fields must be made unique before a
placeholder becomes a genuine project. The schema validates the `P.###` shape
and individual field rules; uniqueness across entries is currently an editorial
requirement rather than a schema-enforced invariant.

`draft: false` controls route generation; it does not constitute editorial
approval by itself. Every published case still requires verified text, results,
rights, credits, links, alternative text, and captions before launch.

### Adding a genuine project

Copy `docs/templates/portafolio.md` or `portafolio-mdx.mdx` into
`src/content/portafolio/`. Give it a unique slug, unique `P.###` archive number and
`displayOrder`, replace every pending value with approved information, set
`placeholder: false`, and keep it as `draft: true` until editorial and visual
review is complete. Publish only by changing `draft` to `false` after adding an
approved cover and alternative text.

Project images should live under `src/assets/images/portafolio/<slug>/` and be
referenced as local assets. A cover requires `coverAlt` that describes the
visible image rather than repeating the project title. Optional `coverCaption`
renders below the detail-page cover for context or credits and is intentionally
omitted from compact index cards. Do not use remote images,
stock imagery, generic mockups or unverified client material.

Gallery entries are objects with:

- `image`: the local image asset;
- `alt`: required descriptive alternative text;
- `caption`: optional editorial caption.

Gallery figures render after the Markdown body in the reading flow. Authors may
also use semantic Markdown/HTML figures within the body when an image belongs to
a specific section; those figures require alternative text and should include a
caption when the surrounding prose does not provide enough context.
An inline `ImageCarousel` in the MDX body is an additional narrative component;
it does not replace `coverImage`, convert `gallery`, or change their rendering.

Markdown H2 sections form the primary case-study sequence (for example,
Contexto, El reto, Enfoque, Lo que construimos, and Resultado y aprendizajes).
H3 is reserved for genuine subsections within an H2. Paragraphs, ordered and
unordered lists, links and editorial figures inherit the shared reading
typography.

`relatedNotes`, `relatedMedia`, and `relatedProjects` contain validated
content-entry IDs, and `projectLinks` contains labeled, verified external URLs.
Portafolio connections render inline near the end of the reading column rather
than restoring the intentionally removed right-hand rail.

## Bidirectional connection graph

Notas, Mediateca, and Portafolio form one build-time directed graph. Explicit
frontmatter relationships are outgoing edges. During route generation,
`src/lib/content-connections.ts` normalizes those fields and
`src/lib/connection-graph.ts` inverts each edge to derive incoming backlinks.
No content file is rewritten and no browser JavaScript, database, or generated
placeholder page is involved.

The interface distinguishes:

- **Enlaces directos**: targets selected in the current entry's frontmatter;
- **Menciones**: entries that point to the current entry automatically;
- **Relaciones mutuas**: two entries that explicitly point to each other,
  rendered once instead of duplicated in both groups.

Only routable Spanish editorial entries participate. Development includes
ordinary drafts to match its visible routes; production excludes drafts.
Fixtures are always excluded, and external Notas cards cannot participate
as graph nodes because they have no local detail route. A local entry may still
use `relatedNotes` to expose an external article as a supplemental outgoing
link, but that destination cannot show a backlink. Rendering helpers omit an
unresolved entry so that a stale relationship does not crash the page, while
Astro reports the missing target during the build. Authors should not add the
reverse field merely to obtain a backlink; add it only when the editorial
relationship itself is intentionally mutual.

### Cleaning connections after renaming or deleting content

Renaming or deleting a content file does not rewrite the frontmatter or Markdown
of entries that linked to its old ID. An unresolved connection is omitted from
the rendered page, but it remains an authoring error and must be cleaned up.

For example, a build may print:

```text
/mediateca/thinking-in-systems
Entry notas → antiguo-slug was not found.
```

The route identifies the source entry to inspect:
`src/content/mediateca/thinking-in-systems.md` (or `.mdx`). The collection and ID
after `Entry` identify the missing destination. In this example, look for
`antiguo-slug` inside `relatedNotes`.

Use this mapping when reading the warning:

| Missing destination | Frontmatter field to inspect |
| ------------------- | ---------------------------- |
| `notas → <id>`      | `relatedNotes`               |
| `mediateca → <id>`  | `relatedMedia`               |
| `portafolio → <id>` | `relatedProjects`            |

After deleting or renaming an entry:

1. Keep its old filename without `.md` or `.mdx`; that filename is the ID used
   by relationships and public routes.
2. Search every authored and maintained use of the old ID. For example:

   ```sh
   rg -n 'antiguo-slug' src/content docs tests
   ```

3. In frontmatter, replace the old ID with the intended new ID or remove it when
   the relationship no longer exists. Also update direct Markdown links such as
   `/notas/antiguo-slug`, documentation examples, expected routes, and tests.
4. Format and validate the result:

   ```sh
   pnpm run format
   git diff --check
   pnpm run check
   pnpm run build
   ```

5. Confirm that the build no longer prints `Entry … was not found` and inspect
   the affected source and destination pages. Run `pnpm run verify` before
   handing off a complete change.

Do not add a reverse relationship merely to remove a warning. A missing target
must be replaced or removed at the source; incoming backlinks are still derived
automatically when the target exists.

See [PORTFOLIO_PROJECT_GUIDE.md](PORTFOLIO_PROJECT_GUIDE.md),
[WRITING_PORTFOLIO.md](WRITING_PORTFOLIO.md),
[templates/portafolio.md](templates/portafolio.md), and
[templates/portafolio-mdx.mdx](templates/portafolio-mdx.mdx) for the complete
workflow. Templates omit the internal `fixture` field.

## Site copy

Homepage copy uses a validated JSON collection. Yo and the retained Ahora data
use their own validated JSON collections. These files are intentionally
editable without changing Astro components.

`homepage.json` retains one archive panel for each validated legacy kind:
`yo`, `notas`, `mediateca`, and `portafolio`. Those panel records are not
rendered by the current homepage but remain valid baseline data for later
phases. The active homepage derives its Portfolio cards from published Spanish
project entries at build time.

The hero eyebrow is editable through `heroEyebrow`. The H1 has two required
parts: `heroTitle` renders with the Helvetica stack and `heroTitleAccent`
renders as italic Georgia in the accent color. The introduction is the plain
text `connectionLabel` field. It no longer supports or validates an inline
`connectionLink` object.

- Notas: latest `publishedAt` date and total published-note count;
- Mediateca: total published-reference count;
- Portafolio: total published-project count.

The homepage passes `getVisibleSpanishProjects(false)` to the shared
`PortfolioSection.astro` component. It produces the same project order, search,
tag filters, count and responsive cards as `/portafolio`.

The derived statistics use `getVisibleSpanishNotes(false)`,
`getVisibleSpanishMedia(false)`, and `getVisibleSpanishProjects(false)`. Drafts
and `fixture: true` entries therefore never contribute to homepage publication
statistics.

## Cross-entry integrity

Cross-entry constraints cannot be expressed in an individual collection schema.
`pnpm run test:content` therefore checks that published archive numbers are
unique within each editorial collection and that published Portfolio entries
also have unique `displayOrder` values.
