# Sanity Studio — jpulidev.com

Content for the portfolio: projects, technology tags, and the notes on `/about`.

```bash
npm install
npm run dev        # http://localhost:3333
```

Requires Node ≥ 22.12 (Sanity 6). Project `xom53qc4`, dataset `production`.

## What changed in the migration

This Studio was on Sanity 1.150 (2020), built on the `parts` system that modern
Sanity removed entirely. It could not run on current Node. It is now Sanity 6
with TypeScript schemas.

**No content was touched.** The document type names — `works`, `project`,
`person` — and every existing field name are unchanged, because renaming a type
orphans its documents. What changed is the editing interface and the set of
available fields.

Removed along the way: `sanity.json`, the `config/` directory, a committed
`dist/` build, and the course's `sample-data/`.

## Fields that need filling in

Everything added is optional, and the site reads the old location as a fallback
until the new one is set. So content can be migrated one document at a time
without the site breaking in between.

| New field | Replaces | What the site does today |
|---|---|---|
| **Live site URL** | the URL wrongly stored in **URL slug** | Falls back to reading the slug field |
| **One-line summary** | the free-text **Summary (legacy)** | Falls back to the legacy field (11 of 24 have one) |
| **Design credit** | the `(Design by …)` bracket inside the name | Parses it out of the name (5 found) |
| **URL slug** | — | Derives a slug from the project name |

### Per-document cleanup

For each project, in the **Basics** tab:

1. **URL slug** — click *Generate*. It currently holds the live URL on older
   entries. This changes the page's address, so do it before the site is
   promoted, not after.
2. **Live site URL** (Credits & links tab) — paste the URL you just removed.
3. **Project name** — drop any `(Design by …)`; put it in **Design credit**.
4. **One-line summary** — one sentence a recruiter can skim.
5. **Screenshot** — re-export at 2× (≥1600px wide). The current ones range from
   573px to 1200px; anything under 600px is too small to work as a social share
   card and the site falls back to a generated one.

### Housekeeping in Technologies

Six tag documents are referenced by no project and can be deleted: **Node**,
**Node.js**, **React.js**, **Sanity Studio Backend**, and the duplicate
**React** and **Gatsby** entries. The site already hides orphans and merges the
`.js` spellings, so this is tidiness rather than a bug.

### One stale claim in Notes

The **Jose Pulido** note still says "5 years of experience". The site computes
years from a single date (`web/lib/site.ts`), so any number written into content
will drift out of sync. Remove it from the prose.

## Writing the case studies

This is the part that changes what a recruiter takes away, and it's the part only
you can write — the fields exist and render, but they're empty. A project page
with a name and a logo says you touched something. A case study says you can
think.

Mark about **six** projects as **Featured**. Featured projects get a full card;
the rest collapse into an "Also built" list. Depth on six beats a thin grid of
24.

### Suggested six

Chosen for brand recognition plus technical range — worth your own judgement,
since you know which ones you actually have stories about:

| Project | Why | Tags on file |
|---|---|---|
| **Pet's Table** | Current role, and the richest stack on file | HTML5, React, Netlify, Gatsby, JS, Shopify, Headless CMS |
| **DeWALT** | Globally recognisable brand | JS, Shopify, HTML5, CSS, Liquid |
| **Supergoop** | Well-known DTC brand | HTML5, Shopify, WordPress, JS, CSS |
| **InsideTracker** | Recognisable in health tech | Shopify |
| **DOEN** | Well-known DTC fashion | Shopify |
| **Upstart13** | Shows the modern React side | Headless CMS, React |

### What to write in each field

Answer these plainly. Two or three short paragraphs per section is plenty.

- **Your role** — "Sole developer", "Frontend lead, team of 4". Be specific;
  vagueness here reads as hiding something.
- **Timeline** — "6 weeks, 2023".
- **The problem** — what did the client need, and why wasn't it easy? Write it so
  someone outside the project understands the stakes.
- **What you did** — the decisions and *why*, including trade-offs and what you
  rejected. This is the section that reads as senior. Not "built a Shopify
  theme" but "the client needed X, so I chose Y over Z because…".
- **The outcome** — what changed, for the client and for users.
- **Metrics** — numbers beat adjectives. Load time, conversion rate, revenue,
  bounce rate. If you don't have real numbers, leave it empty; invented ones are
  worse than none, and a recruiter who checks will find out.

The site marks a project as having a case study only when **What you did** plus
one of **The problem** / **The outcome** are filled in. Until then the page shows
an honest "write-up in progress" notice instead of padding.

### Where it renders

- `/projects/<slug>` — full case study, metrics as a stat row
- `/projects` — featured as cards, rest as the "Also built" index
- Cards show "Read the case study →" once one is written
