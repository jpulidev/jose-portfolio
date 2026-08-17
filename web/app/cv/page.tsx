import { RoleList } from '@/components/RoleList';
import { Engagements, SelectedWork } from '@/components/SelectedWork';
import { education, roles, stack } from '@/lib/experience';
import { pageMetadata } from '@/lib/metadata';
import { getProjects } from '@/lib/sanity/data';
import { site, yearsOfExperience } from '@/lib/site';

export const revalidate = 3600;

export const metadata = pageMetadata({
  title: 'CV',
  description:
    'Curriculum vitae for Jose Pulido — Shopify developer and tech lead, nine years of storefront, Shopify Plus and headless commerce work for brands in the US and Mexico.',
  path: '/cv',
});

/**
 * The CV, at a stable URL.
 *
 * Deliberately a page rather than a checked-in PDF. A PDF is a second copy that
 * goes stale the moment a role changes; this renders from the same
 * `lib/experience.ts` the About page uses, so the two can never disagree. The
 * print stylesheet is tuned so "Save as PDF" produces the file a recruiter can
 * forward.
 *
 * The old site offered no CV at all, which is one of the first things a
 * recruiter looks for.
 */
export default async function CvPage() {
  const projects = await getProjects();
  const shopifyCount = projects.filter((p) =>
    p.tags.some((t) => t.toLowerCase() === 'shopify'),
  ).length;

  return (
    <div className="mx-auto max-w-3xl px-5 py-16 print:max-w-none print:py-0">
      {/* Screen-only: tells the reader how to get the file. Hidden in print. */}
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-line bg-surface p-5 print:hidden">
        <p className="text-step--1 text-ink-muted">
          Print this page or save it as PDF — it always matches the live CV.
        </p>
        <a
          href={`mailto:${site.email}`}
          className="font-display rounded-full bg-accent px-4 py-2 text-step--1 font-medium text-accent-ink"
        >
          Get in touch
        </a>
      </div>

      <header>
        <h1 className="text-step-4">{site.name}</h1>
        <p className="mt-2 text-step-1 text-ink-muted">
          Shopify Developer &amp; Tech Lead — storefronts, Plus, and headless
          commerce
        </p>
        <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 font-mono text-step--1 text-ink-muted">
          <span>{site.email}</span>
          <span>jpulidev.com</span>
          <span>Venezuela · Remote</span>
        </p>
      </header>

      <section className="mt-10">
        <h2 className="eyebrow">Profile</h2>
        <p className="measure mt-3">
          Shopify developer with {yearsOfExperience()} years building for the
          web. I have led development teams on Shopify Plus engagements and
          migrated stores between platforms, and I currently own a production
          storefront end to end — theme, checkout extensions, a custom payment
          app, and the internal tooling around it. {projects.length} client
          projects shipped, {shopifyCount} of them on Shopify, for brands
          including DeWALT, Supergoop and DOEN. I work remotely and
          asynchronously, and have done so with teams in the United States and
          Mexico since 2017.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="eyebrow">Selected work</h2>
        <SelectedWork headingLevel="h3" />
      </section>

      <section className="mt-10">
        <h2 className="eyebrow">Experience</h2>
        <RoleList roles={roles} headingLevel="h3" />
      </section>

      <section className="mt-10 break-inside-avoid">
        <h2 className="eyebrow">Client engagements</h2>
        <Engagements headingLevel="h3" />
      </section>

      <section className="mt-10 break-inside-avoid">
        <h2 className="eyebrow">Stack</h2>
        <dl className="mt-4 space-y-3">
          {stack.map((group) => (
            <div
              key={group.group}
              className="grid gap-1 sm:grid-cols-[9rem_1fr] sm:gap-6"
            >
              <dt className="font-display text-step--1 font-semibold">
                {group.group}
              </dt>
              <dd className="text-step--1 text-ink-muted">
                {group.items.join(' · ')}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-10 break-inside-avoid">
        <h2 className="eyebrow">Training</h2>
        <ul className="mt-4 space-y-2">
          {education.map((entry) => (
            <li
              key={`${entry.institution}-${entry.qualification}`}
              className="grid gap-0.5 text-step--1 sm:grid-cols-[9rem_1fr] sm:gap-6"
            >
              <span className="font-mono text-ink-muted">{entry.year}</span>
              <span>
                {entry.qualification}
                <span className="text-ink-muted"> — {entry.institution}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10 break-inside-avoid">
        <h2 className="eyebrow">Languages</h2>
        <p className="mt-3 text-step--1">
          Spanish (native) · English (professional)
        </p>
      </section>

      <p className="mt-10 hidden text-step--1 text-ink-muted print:block">
        Full portfolio and case studies at jpulidev.com
      </p>
    </div>
  );
}
