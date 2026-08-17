/**
 * Work history, transcribed from the LinkedIn profile export.
 *
 * The old site had none of this. It said "Fullstack Developer" and showed eight
 * technology logos — which tells a recruiter what you have touched, never what
 * you were responsible for. Roles, dates and scope are the part they screen on.
 *
 * Kept in code rather than the CMS on purpose: it is the one piece of content
 * that has to stay consistent with an external profile, and a diff is easier to
 * reconcile than a CMS edit.
 *
 * Several engagements overlap. That is not an error — the agency and client
 * contracts genuinely ran concurrently, and the dates are reproduced as they
 * appear on the profile rather than tidied into a false sequence.
 */

export type Role = {
  company: string;
  title: string;
  /** ISO year-month, so ordering and formatting are not string comparisons. */
  start: string;
  /** null while current. */
  end: string | null;
  location: string | null;
  /** One or two sentences on scope. Empty for roles with none on record. */
  summary: string | null;
  /** The specific, checkable things — what a technical screener looks for. */
  highlights: string[];
  /** Shown in the condensed CV and the site timeline. */
  featured: boolean;
};

export const roles: Role[] = [
  {
    company: "Pet's Table",
    title: 'Fullstack / Shopify Developer',
    start: '2023-06',
    end: null,
    location: 'Mexico · Remote',
    summary:
      'Sole developer on the storefront and the systems around it — the production theme, checkout extensions, payment integrations and internal tooling.',
    highlights: [
      'Own and maintain the production Shopify theme for a subscription business shipping fresh food nationwide',
      'Shopify checkout UI extensions built from scratch: address and postal-code validation, delivery-date selection, upsells and post-purchase offers',
      'A custom private PayPal app, and a postal-code service that backs address validation at checkout',
      'Headless forms and quizzes in React and GraphQL, with the data flow handled server-side',
      'A veterinarian portal and internal reporting tools, in React, TypeScript and Supabase',
    ],
    featured: true,
  },
  {
    company: 'Gamma Waves (formerly Sellry)',
    title: 'Tech Lead · Shopify Developer',
    start: '2021-02',
    end: '2023-06',
    location: 'United States · Remote',
    summary:
      'Led development teams on Shopify Plus engagements, and migrated e-commerce sites onto Shopify from other platforms.',
    highlights: [
      'Led and collaborated with development teams across Shopify Plus client work',
      'Platform migrations onto Shopify, keeping transitions seamless and performance intact',
      'Shopify Checkout extensions and the Checkout Extensibility API, aimed at conversion',
      'Translated Figma designs into bespoke storefronts; contributed to scalable Shopify apps',
    ],
    featured: true,
  },
  {
    company: 'Vessel',
    title: 'Shopify Developer',
    start: '2022-05',
    end: '2023-06',
    location: 'United States · Remote',
    summary: null,
    highlights: [],
    featured: false,
  },
  {
    company: 'The Taproom',
    title: 'Shopify Developer',
    start: '2021-03',
    end: '2022-04',
    location: 'Remote',
    summary: null,
    highlights: [],
    featured: false,
  },
  {
    company: 'McFadyen Digital',
    title: 'Shopify Developer',
    start: '2021-01',
    end: '2021-02',
    location: 'Remote',
    summary: null,
    highlights: [],
    featured: false,
  },
  {
    company: 'Genium',
    title: 'Lead Shopify Developer',
    start: '2020-10',
    end: '2021-02',
    location: 'Remote',
    summary:
      'Led Shopify development, focused on custom sections and integration research.',
    highlights: [
      'Built a quote generator in JavaScript, and custom internal pages in Liquid and Sass',
      'Researched integration best practices across the app ecosystem',
      'Developed a rapid-purchase flow to shorten the path to checkout',
    ],
    featured: true,
  },
  {
    company: 'Remote',
    title: 'Fullstack Developer',
    start: '2017-02',
    end: '2020-09',
    location: 'Remote',
    summary:
      'Fullstack work across the JavaScript ecosystem, with a headless-CMS focus.',
    highlights: [
      'JavaScript, React, Gatsby and GraphQL, backed by headless CMSes',
      'Serverless functions, progressive image loading and scoped CSS',
    ],
    featured: false,
  },
  {
    company: 'Nanagram Studio',
    title: 'Shopify Developer',
    start: '2017-01',
    end: '2020-09',
    location: 'Remote',
    summary:
      'Built stores and applications end to end, and ran deployment and testing.',
    highlights: [
      'Applications with Node.js, React, Redux, Gatsby, Apollo and MongoDB',
      'Shopify Partner: store development, deployment and testing; Shopify apps in Node and React',
      'E-commerce on WordPress, plus design and UX work in Figma and Photoshop',
    ],
    featured: true,
  },
];

/**
 * Client engagements run through an organisation Jose set up and administers,
 * separate from the salaried roles above.
 *
 * Vistobot is deliberately absent. The repository exists, but none of the last
 * hundred commits are his, so there is nothing here he can defend in an
 * interview — and a CV line that collapses under one question costs more than
 * the line was worth.
 */
export type Engagement = {
  client: string;
  work: string;
  period: string;
  stack: string[];
};

export const engagements: Engagement[] = [
  {
    client: 'Foqus',
    work: 'Media-connect application — the majority of the codebase, built and shipped over a year.',
    period: '2025 — present',
    stack: ['React', 'TypeScript', 'Supabase', 'TanStack Query', 'Tailwind'],
  },
  {
    client: 'INMARI',
    work: 'Shopify theme development and ongoing storefront work.',
    period: '2025 — present',
    stack: ['Shopify', 'Liquid'],
  },
  {
    client: 'Crosswire Education',
    work: 'Custom Shopify theme build.',
    period: '2025',
    stack: ['Shopify', 'Liquid'],
  },
];

/**
 * Concrete things built, for the reader who wants evidence rather than a title.
 *
 * Every entry is work Jose authored himself — checked against commit history
 * rather than memory. Anything scaffolded by an AI builder with only light
 * involvement is left out on purpose: it would be the first thing a technical
 * interviewer probed, and it would not hold.
 */
export type BuiltThing = {
  title: string;
  detail: string;
  stack: string;
};

export const selectedWork: BuiltThing[] = [
  {
    title: 'Checkout UI extensions',
    detail:
      'Address and postal-code validation, a delivery-date picker, cart upsells and post-purchase offers — running in Shopify’s checkout on a store shipping nationwide.',
    stack: 'Shopify Checkout Extensibility · JavaScript',
  },
  {
    title: 'A production Shopify theme',
    detail:
      'Sole developer on the storefront of a subscription food business: sections, product logic, performance work, and the integrations around it.',
    stack: 'Liquid · JavaScript · Shopify',
  },
  {
    title: 'A custom PayPal app',
    detail:
      'A private Shopify app handling an alternative payment path, built and maintained end to end.',
    stack: 'Node.js · Shopify Admin API',
  },
  {
    title: 'A postal-code service',
    detail:
      'The API behind address validation at checkout — coverage lookups that decide what a customer can be offered.',
    stack: 'Node.js · REST',
  },
  {
    title: 'Headless forms and quizzes',
    detail:
      'Multi-step product-matching flows that write back to Shopify, with state handled server-side rather than in the browser.',
    stack: 'React · GraphQL · Gatsby',
  },
  {
    title: 'Internal tooling',
    detail:
      'A veterinarian portal and operational reporting used by the team day to day, built on a typed React stack over Postgres.',
    stack: 'React · TypeScript · Supabase',
  },
];

export type Education = {
  institution: string;
  qualification: string;
  year: string;
};

export const education: Education[] = [
  {
    institution: 'freeCodeCamp',
    qualification: 'JavaScript Algorithms and Data Structures (300 hours)',
    year: '2020',
  },
  {
    institution: 'Zero To Mastery Academy',
    qualification: 'JavaScript: The Advanced Concepts',
    year: '2020',
  },
  {
    institution: 'Zero To Mastery Academy',
    qualification: 'The Complete Web Developer',
    year: '2020',
  },
];

/**
 * The stack, grouped by what it is for.
 *
 * Grouped rather than listed flat because "what can this person be hired to do
 * tomorrow" is the question a recruiter is actually asking, and a single row of
 * logos does not answer it.
 */
export const stack: Array<{ group: string; items: string[] }> = [
  {
    group: 'Commerce',
    items: [
      'Shopify',
      'Shopify Plus',
      'Liquid',
      'Shopify Functions',
      'Shopify Extensions',
      'Checkout Extensibility',
      'Headless commerce',
      'Recharge',
    ],
  },
  {
    group: 'Frontend',
    items: [
      'TypeScript',
      'JavaScript',
      'React',
      'Next.js',
      'Vite',
      'TanStack',
      'Gatsby',
      'GraphQL',
    ],
  },
  {
    group: 'Backend & data',
    items: [
      'Node.js',
      'Serverless functions',
      'REST APIs',
      'Supabase',
      'Postgres',
      'MongoDB',
      'Apollo',
    ],
  },
  {
    group: 'Content',
    items: ['Sanity', 'Contentful', 'WordPress'],
  },
  {
    group: 'Styling & infra',
    items: [
      'Tailwind CSS',
      'shadcn/ui',
      'CSS Modules',
      'Netlify',
      'Vercel',
      'AWS',
      'Figma',
    ],
  },
];

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

/** "2023-06" → "Jun 2023". Invalid input returns the raw string. */
export function formatMonth(value: string): string {
  const match = value.match(/^(\d{4})-(\d{2})$/);
  if (!match) return value;
  const month = MONTHS[Number(match[2]) - 1];
  return month ? `${month} ${match[1]}` : value;
}

/** "Jun 2023 — Present". */
export function formatPeriod(role: Role): string {
  return `${formatMonth(role.start)} — ${role.end ? formatMonth(role.end) : 'Present'}`;
}

/** Newest first, by start date. */
export function rolesByRecency(list: Role[] = roles): Role[] {
  return [...list].sort((a, b) => b.start.localeCompare(a.start));
}
