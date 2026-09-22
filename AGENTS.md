# montse-pereda-grillo-website

Static Astro website and Spanish-language digital garden for Rodolfo Miranda
Company. Production indexing is enabled after explicit authorization; local
development remains non-indexable and some content is intentionally provisional.

## Start here

Use the smallest relevant source of truth before editing:

- `README.md` — project overview and local setup.
- `docs/README.md` — task-based documentation index.
- `docs/PROJECT_STATUS.md` — current routes, publication boundaries, known
  issues, and launch work.
- `docs/ARCHITECTURE.md` — layouts, shared components, routes, and browser
  behavior.
- `docs/CONTENT_MODEL.md` — collections and validated fields.
- `src/content.config.ts` — authoritative content schemas.

Do not rely on historical baseline documentation; deleted captures remain
available through Git history and tags.

## Development server

Use:

```sh
pnpm run dev
```

Astro listens on `$PORT`, defaulting to `8443`. To choose another port, set the
environment variable rather than appending CLI arguments:

```sh
PORT=8444 pnpm run dev
```

The preview URL is available in the app's preview panel and source changes hot
reload. If Astro reports an existing server, use the URL it prints or stop that
process with `pnpm exec astro dev stop` before starting another one.

## Project structure

- `src/pages/` — Astro routes.
- `src/layouts/BaseLayout.astro` — document metadata, local fonts, crawler
  directives, and global browser behavior.
- `src/components/PageShell.astro` — canonical visible page structure.
- `src/components/Header.astro` and `src/components/Footer.astro` — shared
  global navigation and footer links.
- `src/components/EditorialDetailLayout.astro` — shared detail-page geometry
  for Notas, Mediateca, and Portafolio.
- `src/components/content/` — approved MDX components for images, carousels,
  and YouTube/Vimeo embeds.
- `src/content.config.ts` — validated content collection schemas.
- `src/content/` — Markdown, MDX, and JSON content.
- `src/lib/` — collection visibility, sorting, and publication helpers.
- `src/lib/connection-graph.ts` and `src/lib/content-connections.ts` — pure
  editorial graph logic and its Astro collection adapter.
- `src/lib/site-routes.ts` — published canonical routes shared by Registro and
  the sitemap.
- `src/styles/global.css` — design tokens, shared typography, and global rules.
- `src/styles/home.css` — homepage-only hero, panel, and preview presentation.
- `src/styles/editorial-detail.css` — shared editorial detail layout.
- `src/styles/rich-content.css` — shared rendered Markdown/MDX presentation.
- `src/styles/*-index.css`, `*-detail.css`, `*-shared.css` — route-scoped
  Notas, Mediateca, and Portafolio presentation.
- `src/styles/yo.css` — Yo-specific presentation.
- `src/scripts/archive-controls.ts` — shared Notas and Mediateca index behavior.
- `src/assets/images/` — local images processed by Astro.
- `public/` — files copied directly to the static output.
- `docs/` — active editorial and technical documentation.
- `tests/e2e/` — Playwright route, interaction, responsive, and accessibility
  checks.
- `scripts/` — production-boundary and output-budget checks.
- `astro.config.ts` — MDX, static output, redirects, highlighting, and server
  configuration.
- `playwright.config.ts` — isolated browser-test server and Chromium settings.
- `package.json` — development, formatting, checking, build, test, and preview
  scripts.
- `.mise.toml` — Node.js and pnpm versions.

## Architecture boundaries

- Keep `BaseLayout -> PageShell -> Header + main + Footer` as the page-level
  DOM contract. Content routes should have one site header, one `main` landmark,
  and one site footer.
- Reuse `EditorialDetailLayout.astro` for editorial detail pages. Portafolio
  intentionally disables the right connections rail; Notas and Mediateca keep
  it.
- Keep route-independent Markdown/MDX styling in `rich-content.css`. Do not
  duplicate those rules in collection stylesheets.
- Keep tokens and site-wide semantic typography in `global.css`. Use
  collection styles only for genuinely section-specific layouts and controls.
- Treat `relatedNotes`, `relatedMedia`, and `relatedProjects` as the authored
  source of truth for editorial connections. Incoming backlinks are derived at
  build time; do not duplicate a reverse edge unless the relationship is meant
  to be explicitly mutual.
- Preserve static HTML output and framework-free browser JavaScript. Do not add
  a client framework or dependency unless the task requires it.
- Canonical media routes use `/mediateca`; `/biblioteca` exists only as a legacy
  redirect source.
- Keep site identity and intended origin in `src/lib/site.ts`. Canonical links,
  social metadata and JSON-LD belong in `BaseLayout.astro`; sitemap and crawler
  policy belong in their generated routes.
- Public indexing was explicitly authorized on 30 August 2026.
  `.env.production` therefore keeps `PUBLIC_INDEXING_ENABLED=true` for normal
  production builds. Local development remains `noindex, nofollow`; never
  remove the permanent `forceNoIndex` behavior from the 404 page. Use an
  explicit false override only for a private review build.

## Content authoring

Editable site copy lives in:

- `src/content/site/homepage.json`
- `src/content/site/ahora.json`
- `src/content/site/yo.json`
- `src/content/notas/`
- `src/content/mediateca/`
- `src/content/portafolio/`

Follow the collection guides in `docs/WRITING_NOTES.md`,
`docs/WRITING_MEDIATECA.md`, and `docs/PORTFOLIO_PROJECT_GUIDE.md`.

- Use `.md` for normal editorial prose.
- Use `.mdx` only when importing an approved component such as `ContentImage`,
  `ImageCarousel`, or `VideoEmbed`.
- Keep editorial images local under `src/assets/images/<collection>/<slug>/` so
  Astro can validate their metadata and emit the imported file safely.
- Every meaningful image needs accurate, non-empty alternative text. Captions
  are optional unless the surrounding prose does not provide enough context.
- `draft: false` controls production eligibility; it does not imply editorial
  approval.
- Use validated local entry IDs in `relatedNotes`, `relatedMedia`, and
  `relatedProjects`. Do not add wiki-link parsing, ghost pages, or manual
  backlink fields; the build-time graph derives incoming links from visible
  content.
- `fixture: true` entries are technical demonstrations. They must remain
  drafts, use their reserved `*.999` archive numbers, and stay out of indexes,
  counts, homepage previews, relationships, sequence navigation, and
  production.
- Do not publish placeholder entries by only changing `draft`. Replace all
  provisional fields and complete editorial review first.

## Code conventions

- Keep Astro component frontmatter strictly typed.
- Use double quotes for strings containing apostrophes
  (`"We're here to help"`), or escape the apostrophe. An unescaped apostrophe in
  a single-quoted string breaks the build.
- Prefer existing helpers and components over route-specific copies.
- Use `var(--line)` for standard borders unless the design intentionally calls
  for another token.
- Preserve accessibility semantics, visible focus states, reduced-motion
  behavior, keyboard operation, and local image metadata. Displayed editorial
  images use the single imported source file, without generated responsive
  variants; authors size it appropriately and keep it below 200 KB whenever
  practical.
- Preserve unrelated user changes in a dirty worktree. Do not stage, commit,
  tag, push, deploy, or modify the domain unless the user explicitly requests
  it.

## Verification

For implementation or documentation changes, run the checks appropriate to the
scope. Before handoff, the normal full sequence is:

```sh
pnpm run format
git diff --check
pnpm run verify
pnpm run verify:launch # only for launch-readiness work
```

`pnpm run format` writes consistent Astro, TypeScript, CSS, JSON, Markdown, and
MDX formatting. `pnpm run verify` checks formatting, builds the static site,
verifies production boundaries and output budgets, and runs Playwright plus
axe-core. Install its pinned local browser once with
`pnpm exec playwright install chromium`. When behavior or layout changes, also
perform a focused visual review of the affected routes. Use
`docs/PROJECT_STATUS.md` for the current expected production route and content
counts rather than copying counts into this file.
