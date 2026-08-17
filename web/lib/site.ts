/**
 * Site-wide facts. Single source of truth for anything that would otherwise be
 * duplicated across pages or go stale on its own.
 */

export const site = {
  name: 'Jose Pulido',
  /**
   * The label, and the reasoning behind it.
   *
   * "Fullstack developer" was the previous headline. It is the most crowded
   * term in the market — it describes millions of people and hides the only
   * thing here that is scarce. "Shopify developer" is what recruiters and
   * clients actually search for, it is undersupplied, and 16 of the 24 shipped
   * projects back it. "Tech lead" is earned (Gamma Waves 2021–2023, and a lead
   * role at Genium before it) and is the seniority signal that separates this
   * from a mid-level Shopify CV.
   *
   * The fullstack capability does not disappear — it moves from being a claim
   * to being evidence: Shopify Functions, custom private apps, Node, GraphQL
   * and serverless all appear in the work history and the stack.
   */
  defaultTitle: 'Jose Pulido — Shopify Developer & Tech Lead',
  url: 'https://jpulidev.com',
  description:
    'Jose Pulido — Shopify developer and tech lead. Nine years building storefronts and headless commerce for DTC brands, with Shopify Plus, custom apps, React and Node.',
  locale: 'en',
  email: 'josecpulidoo@gmail.com',
  social: {
    github: 'https://github.com/jpulidev',
    linkedin: 'https://www.linkedin.com/in/joseclementepulido/',
    instagram: 'https://www.instagram.com/jpulidev/',
  },
} as const;

/**
 * Years of experience, computed from one date.
 *
 * The old site hardcoded three contradictory claims, all written to be read in
 * 2022: "08 years" on the home page, "past 5 years" on /about, and "I'm 33
 * years old". Now there is one number and it cannot drift.
 *
 * 2017 is from the record, not a guess: the earliest roles on the LinkedIn
 * profile are Nanagram Studio (January 2017) and a remote fullstack role
 * (February 2017). It also reconciles the old claims — "5 years" written in
 * 2022 is exactly 2017, and the LinkedIn headline says "8+ years".
 *
 * An earlier revision of this file assumed 2014 and rendered "12 years". That
 * was wrong and overstated the record by three years.
 */
export const CAREER_START_YEAR = 2017;

export function yearsOfExperience(now: Date = new Date()): number {
  return now.getFullYear() - CAREER_START_YEAR;
}

/**
 * The recognisable names among the 24 projects.
 *
 * A recruiter scanning for three seconds stops at a brand they know, long
 * before they read a job title. These were buried in the grid; surfacing them
 * is the single highest-leverage change to the home page.
 *
 * Matched against the CMS by project slug, and a test asserts each one still
 * exists — so a renamed or deleted project fails the build rather than silently
 * dropping a name from the marquee.
 */
export const MARQUEE_PROJECT_SLUGS = [
  'dewalt',
  'supergoop',
  'doen',
  'insidetracker',
  'pets-table',
  'neversecond',
] as const;

/** Absolute URL for a site-relative path. Metadata and sitemaps need these. */
export function absoluteUrl(path: string): string {
  const withSlash = path.startsWith('/') ? path : `/${path}`;
  return `${site.url}${withSlash}`;
}
