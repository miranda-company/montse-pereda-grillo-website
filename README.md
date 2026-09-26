# Montse Pereda Grillo Website

Static Astro website for Montse Pereda Grillo, intended for publication at
`https://www.montsepereda.com` and eventual upload to Nominalia by FTP.

The repository began as a fresh-history copy of the Rodolfo Miranda Company
site. Its content system and case-study routes remain available, but the active
launch scope is Montse's homepage and Portfolio experience.

## Current experience

- The homepage combines a dark hero and the complete Portfolio grid on one
  page.
- The header exposes only `Inicio` and `Portafolio`. Yo, Notas and Mediateca
  remain as direct-access shells for later phases, but are excluded from
  navigation, Registro and the sitemap and always emit `noindex, nofollow`.
- The hero title has independently editable sans-serif and italic serif parts.
- The portfolio uses the same responsive card grid on `/` and `/portafolio`:
  three columns on expanded screens, two on medium screens and one on compact
  screens.
- Six case studies are currently published: Club Natació Sant Andreu, Centre
  d'Art Tecla Sala, Museu d'Història de L'Hospitalet, Syra Coffee, Eloquent and
  Modulab Barcelona.
- The output is static HTML suitable for FTP hosting.

## Main routes

| Route                           | Current role                                              |
| ------------------------------- | --------------------------------------------------------- |
| `/`                             | Montse's hero, CV call to action and full Portfolio grid. |
| `/portafolio`                   | Standalone Portfolio index with search and tag filters.   |
| `/portafolio/[slug]`            | Individual case studies.                                  |
| `/yo`, `/notas`, `/mediateca`   | Hidden, non-indexable shells retained for later phases.   |
| `/colofon`, `/registro`, `/404` | Supporting technical and archive routes.                  |

## Local development

The expected toolchain is Node.js 22 and pnpm 10, declared in `.mise.toml`.

```sh
pnpm install
pnpm run dev --host 127.0.0.1 --port 8444
```

Open `http://localhost:8444/`. Source and content changes should hot reload.

Useful server commands:

```sh
pnpm exec astro dev status
pnpm exec astro dev logs
pnpm exec astro dev stop
```

If JSON changes do not appear, check `status` first. A browser tab can keep
showing an old document after the server has stopped. Restart the watcher and
reload the page. A content-schema change can also require one server restart.

## Editing the homepage

Homepage copy is in `src/content/site/homepage.json`:

```json
{
  "heroEyebrow": "Montse Pereda Grillo",
  "heroTitle": "Montse Pereda, ",
  "heroTitleAccent": "Comunicación Corporativa",
  "connectionLabel": "Ayudo a organizaciones a comunicar su mensaje de forma efectiva en el entorno digital."
}
```

- `heroTitle` uses Helvetica Neue with Helvetica, Arial and sans-serif
  fallbacks.
- `heroTitleAccent` uses italic Georgia with Times New Roman and serif
  fallbacks.
- `connectionLabel` is plain text; it no longer contains configurable inline
  link behavior.
- The portrait is imported by `src/pages/index.astro` from
  `src/assets/images/homepage/montse-pereda-portrait.png`.
- The CV CTA downloads the final document stored at
  `public/montse-pereda-cv.pdf`.

The legacy `panels` data remains in `homepage.json` for the retained baseline
routes, but the current homepage does not render the old four-card index.

## Typography and design

Global tokens live in `src/styles/global.css`. The responsive heading scale is
`--text-h1` through `--text-h6`; H1 is:

```css
--text-h1: clamp(2.75rem, 5.2vw, 5.75rem);
```

The hero uses `#171b18` as its dark background. The shared `--accent-color` token is
`#dff09a` and is used by the hero, sticky header and back-to-top control.
Homepage-specific composition lives in `src/styles/home.css`; shared portfolio
cards and controls live in `src/styles/portfolio-index.css`.

See [Typography system](docs/TYPOGRAPHY_SYSTEM.md) and
[Architecture](docs/ARCHITECTURE.md).

## Verification

```sh
pnpm run format:check
pnpm run build
git diff --check
```

For the complete suite:

```sh
pnpm run verify
```

The latest manual visual pass covered the homepage, Portfolio index, a project
detail and the footer at 1440 px, 1024 px, 390 px and the 375 × 667 iPhone SE
viewport. See
[Project status](docs/PROJECT_STATUS.md) for current findings and launch work.

## Deployment

Deployment to Nominalia, FTP upload, DNS and HTTPS configuration are not part
of the repository workflow yet. Generate the static site with `pnpm run build`;
the uploadable output is written to `dist/`.

No license has been added or inferred.
