# jpulidev.com

Personal portfolio of **Jose Pulido** — fullstack developer. Live at
**[jpulidev.com](https://jpulidev.com)**.

Content is authored in Sanity and rendered as static pages. The site is
mid-rebuild: `web/` is the new front end, `gatsby/` is the 2020 build still
serving production until the new one is deployed.

```
jose-portfolio/
├── web/        # NEW front end — Next.js 16, TypeScript, Tailwind v4
├── gatsby/     # LEGACY front end — Gatsby 2, currently live
└── sanity/     # Sanity Studio 6 — content schemas (see its own README)
```

## The new front end (`web/`)

| | |
|---|---|
| **Framework** | Next.js 16 (App Router), React 19 |
| **Language** | TypeScript, `strict` |
| **Styling** | Tailwind CSS v4, design tokens in `lib/theme.ts` |
| **Content** | Sanity via `next-sanity`, typed GROQ queries, Portable Text |
| **Images** | `next/image`, AVIF/WebP, dimensions and blur placeholders from Sanity |
| **Type** | Schibsted Grotesk (display) + Source Serif 4 (prose), via `next/font` |
| **Tests** | Vitest — 112 unit tests; Playwright — 86 browser checks; Lighthouse CI |
| **Node** | 22 (no version pinning gymnastics required) |

```bash
cd web
npm install
npm run dev        # http://localhost:3000
npm run verify     # typecheck + lint + format check + tests
```

```bash
npm run test:e2e     # Playwright: overflow, contrast, axe, SEO, theme switch
npm run lighthouse   # Lighthouse CI against the four main routes
```

Other scripts: `build`, `start`, `test`, `test:watch`, `typecheck`, `lint`,
`format`.

### The palette is enforced, not eyeballed

`lib/theme.ts` holds the tokens; `lib/theme.test.ts` asserts every rendered
colour pair meets its WCAG minimum **and** that `app/globals.css` still declares
the same values. Change a hex in one place and the test fails.

On top of that, the Playwright suite loads each route in a real browser and
fails on: any element under AA in either theme, horizontal overflow at
320–768px, any axe-core WCAG A/AA violation, an empty or duplicated `<title>`,
a missing canonical, a relative `og:image`, or a 404 that answers 200. Every one
of those was a real defect on the old site, and every one is mechanically
detectable — which is why they are build failures now rather than judgement
calls.

Lighthouse CI gates the rest: 95+ performance and best practices, 100
accessibility and SEO. Current scores are **100 across all four categories on
every route** (99 performance on /projects, which loads 24 images), CLS 0,
LCP 0.5–0.8s.

### Why there is a normalisation layer

`lib/sanity/normalize.ts` converts raw CMS documents into clean domain objects,
and it exists because the dataset has defects that code has to absorb until
someone fixes them in the Studio:

- **`works.slug` holds a live site URL on older documents.** A real slug is used
  when the field contains one, and derived from the name when it doesn't — so
  `/projects/kairos` works either way, before or after the CMS is cleaned up.
- **Names embed design credits** — "Kairos (Design by DBL Media)" — which made
  for long slugs and repeated the parenthetical in every heading.
- **Six tag documents are referenced by no project**, including duplicate
  "React"/"React.js" and "Node"/"Node.js" pairs. Orphans are dropped and
  near-duplicates merged, keeping the spelling projects actually use.
- **Some names carry stray whitespace** ("Chameleon ").

Every one of these is pinned by a test. If the CMS is cleaned up, the tests are
where to start unwinding this.

### Content model

Three document types in `sanity/schemas/`:

Project summaries have a third source: `lib/project-copy.ts` holds a curated
one-liner per project, written after loading each live site. Precedence is CMS
`summary` → curated line → the legacy `project` field, so filling one in via the
Studio always wins. Most `works` documents had no summary, and the eleven that
did carried the tech stack as prose ("Wordpress Site") — which the "Built with"
row already says.

- **`works`** — a project. Now also carries the case-study fields: role,
  timeline, client, problem, approach, outcome, metrics, live URL, repo URL, and
  a `featured` flag
- **`project`** — a technology tag, with a Shopify flag
- **`person`** — personal notes and short essays, rendered on `/about`. The type
  name is historical; the Studio now titles it "Notes"

Type names are unchanged from 2020 on purpose — renaming one orphans its
documents. See `sanity/README.md` for the migration notes and what still needs
filling in.

## The legacy front end (`gatsby/`)

> **Requires Node 16.** Gatsby 2 does not build on current Node. Run
> `nvm use` in `gatsby/` — there is an `.nvmrc`. This constraint is the main
> reason for the rebuild.

```bash
cd gatsby
nvm use && npm install
npm run develop    # http://localhost:8000
```

Kept around only for side-by-side comparison during the rebuild. It will be
deleted once `web/` is deployed.

## Contributing to yourself

Enable the pre-commit hook once per clone — it runs Prettier and ESLint over
staged files in `web/`:

```bash
git config core.hooksPath .githooks
```

## Rebuild progress

**Done — Phase 0, reclaim.** Repo identity, correct page metadata (the old home
page shipped an empty `<title>`, `og:title` and `og:description`), caching
headers, a single computed source of truth for years of experience.

**Done — Phase 1, foundation.** The `web/` app: typed Sanity layer with tests,
all routes ported, clean project slugs, a real 404, generated sitemap and
`robots.txt`, a 1200×630 social card, dark mode, and zero horizontal overflow
from 320px up.

**Done — Phase 2, content structure.** Sanity Studio migrated 1.150 → 6 with
TypeScript schemas; the `works` type extended with every case-study field; the
front end renders them, splits featured projects from an "Also built" index, and
reads legacy field locations as fallbacks so content migrates one document at a
time.

**Blocked — Phase 2, case studies.** The six case studies are not written. The
fields exist and render; the words are Jose's to write, and inventing them would
put fabricated claims in front of recruiters. `sanity/README.md` has the
suggested six, the per-field prompts, and the cleanup checklist.

**Done — Phase 3, design and identity.** A real design system: contrast-enforced
tokens, a fluid type scale, Schibsted Grotesk paired with Source Serif, mono
reserved for data. Dark mode with a three-state toggle (light / system / dark)
applied before first paint, so neither the theme nor the toggle's own highlight
flashes on load. Motion is enhancement only — content renders visible and
`prefers-reduced-motion` is honoured.

**Done — Phase 4, SEO, performance and accessibility.** JSON-LD (Person,
WebSite, CreativeWork, breadcrumbs), a generated 1200×630 share card per
project, an axe-core sweep in both themes, Lighthouse CI, and a GitHub Actions
workflow running all three gates. Chasing the scores turned up a real defect:
`/projects` was shipping its grid only in the RSC payload, not as HTML — see
below.

**Done — Phase 5, evidence and launch prep.** Real work history from the
LinkedIn record, a CV at `/cv` rendered from the same data as the About
timeline, and a contact form on a server action with validation and a
no-third-party spam gate. `LAUNCH.md` has the deployment, DNS, email and search
console steps.

Not done, and it is content rather than code: **the six case studies**. See
`sanity/README.md`.

### A correction worth keeping

Phases 1–3 claimed, in both code comments and this file, that `/projects`
server-rendered every project into the static HTML. It did not. Reading
`useSearchParams` inside a Suspense boundary meant the served HTML contained
only the 40px fallback, with the projects sitting in the RSC payload as JSON —
which also cost a 0.277 CLS when the placeholder was replaced by the real grid.

`/projects` now reads `searchParams` on the server. The trade is that the route
is dynamically rendered rather than static; what it buys is complete, correct
HTML on every request, no layout shift, and no client JavaScript for filtering.

### Known open items

- **JavaScript payload is still above the old site**: 140 KB transferred versus
  115 KB for the Gatsby build, unchanged across Phases 1–3. The bulk is the
  React 19 + App Router baseline, not app code — no CMS client leaks into the
  browser bundle, and the theme switch ships no JS of its own. Phase 4 owns this.
- **Phase 3 added 95 KB of webfonts** (two variable faces, latin subset). A
  deliberate trade for the type pairing; trimmable in Phase 4 by subsetting
  harder or dropping to one family.
- ~~`CAREER_START_YEAR` is an assumption~~ — **resolved.** It is 2017, from the
  LinkedIn record (earliest roles: Nanagram Studio, Jan 2017). The earlier
  assumption of 2014 rendered "12 years" and overstated the record by three.
  A test now asserts it matches the earliest role in `lib/experience.ts`.
- ~~A stale "5 years" claim in the CMS~~ — **resolved.** The `person` note that
  carried it was a duplicate bio; /about now has the real bio, work history and
  stack, so the note is suppressed in `lib/sanity/data.ts`. Delete the document
  in the Studio and remove the suppression list.
- **A real headshot is still needed.** The current photo is the 2020 selfie,
  used small and tightly cropped so the headline carries the page rather than
  the picture. A proper portrait would let the hero do more.
- **The contact form needs `RESEND_API_KEY` and `CONTACT_FROM_EMAIL`** to
  deliver. Without them it validates normally and tells the visitor to email
  directly rather than silently swallowing the message. See `LAUNCH.md`.
- **No analytics.** Deliberate — every option needs an account, and adding a
  third-party script uninvited is not a call to make for someone else.
- **No case study is written yet**, so every project page shows a "write-up in
  progress" notice and nothing is marked featured.

## Launching

`LAUNCH.md` is the ordered checklist: content you have to write, deployment,
contact-form email, search console, analytics, and reconciling the title across
your profiles.

## License

Code is MIT. Content, images and design are © Jose Pulido — please don't
republish the writing or photography.
