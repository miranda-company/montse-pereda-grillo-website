# Montse Pereda Grillo Website

Source code and project documentation for Montse Pereda Grillo’s personal
website. The initial baseline is a clean snapshot of the Rodolfo Miranda Company
site; its public-facing content and design remain unchanged until Montse’s
single-page redesign is implemented.

The first release is written in Spanish. Production builds are configured for
search-engine indexing; local development remains blocked from crawlers and
some content still requires editorial review. Hosting and domain state are not
verified by the repository.

## Main sections

| Route         | Purpose                                                       |
| ------------- | ------------------------------------------------------------- |
| `/`           | Entrance to the garden and overview of its four sections.     |
| `/yo`         | Biography, current work, portrait, and professional timeline. |
| `/notas`      | Notes organized by maturity, theme, and update date.          |
| `/mediateca`  | Books, articles, websites, videos, podcasts, and tools.       |
| `/portafolio` | Selected projects with search and tag filtering.              |
| `/colofon`    | How the site is designed, written, built, and published.      |
| `/registro`   | Alphabetical index of every published canonical route.        |
| `/404`        | Custom not-found page, permanently excluded from indexing.    |

Legacy `/biblioteca` URLs redirect to `/mediateca`.

## Current state

- Production includes 5 local Notas, 4 external-article cards, 15 Mediateca
  references, and 7 Portafolio case studies.
- Notas contains ten local entries in development and five in production, plus
  four external Eloquent articles in both environments. Mediateca contains 16
  ordinary references in development and 15 in production. Portafolio contains
  15 ordinary projects in development and seven in production. Mediateca and
  Portafolio expose isolated MDX fixtures during local development.
- Drafts and technical fixtures are excluded from production routes, homepage
  statistics, filters, connections, and sequence navigation.
- Homepage publication counts and recent-content previews are derived from the
  validated content collections.
- Validated relationships across Notas, Mediateca, and Portafolio become
  bidirectional connections at build time, including automatically derived
  backlinks.
- The project builds to static HTML with minimal framework-free JavaScript.
- The shared header becomes a compact fixed bar after 600px of scrolling and
  uses the existing responsive page-gutter token for its inline padding. The
  scroll-to-top control shares the same lightweight scroll state.
- Canonical URLs, social cards, structured data, and a production-only sitemap
  are generated. Production HTML and `robots.txt` allow indexing, while the
  development server and the 404 page remain excluded.

See [Project status](docs/PROJECT_STATUS.md) for exact counts, editorial limits,
known issues, and launch work.

In this repository, “production” means content included by a normal static
build. It does not mean that the site has been deployed or that every included
entry has received final editorial approval.

## Local development

The expected toolchain is Node.js 22 and pnpm 10, declared in `.mise.toml`.

```sh
pnpm install
pnpm run dev
```

Astro starts at `http://localhost:8443/` by default. Source and content changes
reload automatically.

Useful commands:

```sh
pnpm run format        # format supported project files
pnpm run format:check  # verify formatting without changing files
pnpm run check         # run Astro and TypeScript diagnostics
pnpm run build         # check and generate the production site
pnpm run preview       # serve the latest production build
pnpm run test:content  # verify unique published archive identifiers and ordering
pnpm run test:e2e      # build, then run browser and accessibility checks
pnpm run verify        # format check, build, boundaries, links, budgets, and browser tests
pnpm run verify:launch # full verification plus Lighthouse launch audit
```

`pnpm run format` covers Astro, TypeScript, CSS, JSON, Markdown, and MDX. `pnpm run build`
runs the project check before generating static HTML. Install the local test
browser once with `pnpm exec playwright install chromium`. Run `pnpm run verify`
and `git diff --check` before handing off a complete implementation change.
The detailed test scope and current output budgets live in
[Verification and quality](docs/QUALITY_ASSURANCE.md).
The indexing switch, canonical origin, sitemap, redirects, and hosting
review are documented in [Launch readiness](docs/LAUNCH_READINESS.md).

If Astro reports that another development server is running, open the URL and
PID shown in the message or stop it with `pnpm exec astro dev stop` before
starting a replacement.

## Editing content

Editable content lives in `src/content/`:

| Content            | Location                                       | Guide                                                      |
| ------------------ | ---------------------------------------------- | ---------------------------------------------------------- |
| Homepage and Ahora | `src/content/site/homepage.json`, `ahora.json` | [Content model](docs/CONTENT_MODEL.md)                     |
| Yo                 | `src/content/site/yo.json`                     | [Content model](docs/CONTENT_MODEL.md)                     |
| Notas              | `src/content/notas/`                           | [Writing Notas](docs/WRITING_NOTES.md)                     |
| Mediateca          | `src/content/mediateca/`                       | [Writing Mediateca](docs/WRITING_MEDIATECA.md)             |
| Portafolio         | `src/content/portafolio/`                      | [Portfolio project guide](docs/PORTFOLIO_PROJECT_GUIDE.md) |

Use Markdown for normal editorial content. Use MDX only when a page needs an
approved component such as `ContentImage`, `ImageCarousel`, or `VideoEmbed`.
Images remain local and are served as the single author-supplied file. Prepare
them at the final useful dimensions and keep each file below 200 KB when practical.

Changing `draft` to `false` only makes an entry eligible for a production build.
Before publishing it, replace placeholder content and review its copy, credits,
links, images, alternative text, and captions. Entries marked `fixture: true`
are technical examples and must remain isolated from published content.

## Changing the implementation

| Area                                        | Start with                                                                                                    |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Page structure and shared layouts           | `src/components/PageShell.astro`, `Header.astro`, `Footer.astro`, `EditorialDetailLayout.astro`               |
| Header and global scroll controls           | `src/components/Header.astro`, `ScrollToTop.astro`, `src/scripts/scroll-controls.ts`, `src/styles/global.css` |
| Site tokens and semantic typography         | `src/styles/global.css`                                                                                       |
| Homepage presentation                       | `src/pages/index.astro`, `src/styles/home.css`                                                                |
| Rendered Markdown and MDX                   | `src/styles/rich-content.css`                                                                                 |
| Collection indexes and controls             | `src/styles/notes-index.css`, `media-index.css`, `portfolio-index.css`                                        |
| Collection detail and shared visuals        | `src/styles/*-detail.css`, `src/styles/*-shared.css`                                                          |
| Yo page                                     | `src/pages/yo.astro`, `src/styles/yo.css`                                                                     |
| Colophon page                               | `src/pages/colofon.astro`, `src/styles/colophon.css`                                                          |
| Content validation                          | `src/content.config.ts`                                                                                       |
| Draft, fixture, sorting, and count behavior | `src/lib/notes.ts`, `media.ts`, `portfolio.ts`                                                                |
| Bidirectional editorial connections         | `src/lib/connection-graph.ts`, `content-connections.ts`, `EditorialConnections.astro`                         |
| Canonical/social metadata and JSON-LD       | `src/layouts/BaseLayout.astro`, `src/lib/site.ts`                                                             |
| Registro, sitemap and crawler policy        | `src/lib/site-routes.ts`, `src/pages/registro.astro`, `sitemap.xml.ts`, `robots.txt.ts`                       |
| Not-found page                              | `src/pages/404.astro`, `src/styles/not-found.css`                                                             |

The [architecture guide](docs/ARCHITECTURE.md) explains the shared DOM contract,
editorial detail layout, content components, redirects, and route generation in
more detail.

## Project structure

- `src/pages/` — Astro routes.
- `src/components/` — shared page and content components.
- `src/content/` — validated editorial content and development fixtures.
- `src/styles/` — design tokens, shared editorial rules, and section styles.
- `src/scripts/` — small shared framework-free browser controllers.
- `src/assets/images/` — local source images processed by Astro.
- `public/` — static public files that do not require build-time generation.
- `docs/` — editorial and technical documentation.
- `tests/e2e/` — Playwright interaction and accessibility checks.
- `scripts/` — production-boundary and performance-budget verification.

Start with the [documentation guide](docs/README.md) to find the active source of
truth for a writing, design, development, or launch task. Historical visual
captures are not kept in the current tree; earlier checkpoints remain available
through Git history and tags.

## Technology

- Astro 7 with static output.
- Strict TypeScript and validated content collections.
- Markdown and MDX with build-time Shiki highlighting.
- Custom CSS with semantic color, focus, motion, and responsive contracts; locally bundled fonts.
- Build-time bidirectional editorial connections with no client runtime.
- Minimal JavaScript for navigation, sticky-header and scroll-to-top state,
  filters, search, and image carousels.
- Playwright, axe-core, and GitHub Actions quality safeguards.
- pnpm for dependency and task management.

## Inspiration and authorship

[Maggie Appleton’s digital garden](https://maggieappleton.com/) influenced the
exploratory organization of Notas and the biographical approach of Yo. The
visual system, content model, and Astro implementation are specific to Rodolfo
Miranda Company.
