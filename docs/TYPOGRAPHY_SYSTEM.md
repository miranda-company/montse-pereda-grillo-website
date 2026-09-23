# Typography system

This document defines the semantic typography contract for Montse Pereda
Grillo's website. Choose heading levels from document structure first; their
appearance comes from the global tokens and selectors in
`src/styles/global.css`.

## Font responsibilities

- **Helvetica Neue**, falling back to Helvetica, Arial and any sans-serif font:
  headings, body copy, controls, metadata and interface text.
- **Georgia**, falling back to Times New Roman and any serif font: editorial
  emphasis inside headings. Use an `em` element for this treatment.

The project uses system fonts and does not require bundled font files or remote
font requests.

## Responsive heading scale

| Level | Token       | Value                               | Line height | Letter spacing |
| ----- | ----------- | ----------------------------------- | ----------: | -------------: |
| H1    | `--text-h1` | `clamp(2.75rem, 5.2vw, 5.75rem)`    |         `1` |      `-0.03em` |
| H2    | `--text-h2` | `clamp(2.125rem, 3vw, 3.25rem)`     |         `1` |      `-0.03em` |
| H3    | `--text-h3` | `clamp(1.625rem, 2.15vw, 2.25rem)`  |      `1.05` |      `-0.02em` |
| H4    | `--text-h4` | `clamp(1.375rem, 1.65vw, 1.75rem)`  |       `1.1` |      `-0.02em` |
| H5    | `--text-h5` | `clamp(1.125rem, 1.35vw, 1.375rem)` |      `1.15` |     `-0.015em` |
| H6    | `--text-h6` | `clamp(1rem, 1.1vw, 1.125rem)`      |       `1.2` |     `-0.015em` |

All levels use the main Helvetica stack at weight 400. An emphasized fragment
inside any heading switches to the Georgia stack, stays weight 400 and becomes
italic.

Component selectors may change layout concerns such as width, margin, color,
position and wrapping. Shared heading sizes should continue to use the global
tokens rather than introducing route-specific clamps.

## Homepage title

The homepage H1 is composed from two editable fields in
`src/content/site/homepage.json`:

- `heroTitle` renders inside a `span` using the main sans-serif family.
- `heroTitleAccent` renders inside an `em` using the accent color and italic
  Georgia family.

Both fields are required. The accent treatment does not depend on a hard-coded
phrase, so its text can change without editing the Astro template.

At a 1440 px viewport the H1 currently resolves to approximately 74.9 px; at a
390 px viewport it reaches its 44 px minimum. The same `--text-h1` token is used
for the Portfolio display title.

## Semantic outline

1. Each page has one H1 that names the page.
2. H2 begins a primary page section.
3. H3 names a subsection or item belonging to an H2.
4. H4 through H6 are reserved for genuinely deeper nesting.
5. Never choose a heading level only to obtain a particular size.
6. Technical labels and metadata are not headings.

Current examples:

- Homepage: one H1 for Montse's positioning and one H2 for Portfolio.
- Portfolio index: H1 for `Portafolio`, a visually hidden H2 for the search and
  filter region, and H3 for each project card.
- Portfolio detail: H1 for the project title and H2 for case-study sections.
- Supporting routes: one H1 for the route title, with sections starting at H2.

## Non-heading roles

| Role         | Token or size              | Typical use                                           |
| ------------ | -------------------------- | ----------------------------------------------------- |
| Introduction | `--type-introduction-size` | Hero description, page summaries and editorial leads. |
| Body         | `--type-body-size`         | Long-form copy.                                       |
| Metadata     | `--type-metadata-size`     | Archive numbers, dates, status and technical labels.  |
| Kicker       | Shared `.kicker` utility   | Eyebrow text above a page or section title.           |

## Review checklist

- Confirm exactly one H1 per page.
- Confirm the outline remains meaningful without considering visual size.
- Check desktop, medium and compact widths.
- Check for horizontal overflow and unwanted single-word wrapping.
- Confirm `em` fragments use Georgia italic while the surrounding heading uses
  Helvetica Neue.
- Keep heading tokens centralized in `global.css`.
