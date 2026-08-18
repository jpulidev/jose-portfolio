import Image from 'next/image';
import Link from 'next/link';
import { JsonLd } from '@/components/JsonLd';
import { ProjectCard } from '@/components/ProjectCard';
import { homeGraph } from '@/lib/jsonld';
import { pageMetadata } from '@/lib/metadata';
import { getProjects, getTags } from '@/lib/sanity/data';
import { MARQUEE_PROJECT_SLUGS, site, yearsOfExperience } from '@/lib/site';

export const revalidate = 3600;

export const metadata = pageMetadata({
  title: null, // home uses the full default title
  description: site.description,
  path: '/',
});

export default async function HomePage() {
  const [projects, tags] = await Promise.all([getProjects(), getTags()]);
  // The query already orders featured first, so this picks them when they exist
  // and falls back to the newest three until any are marked.
  const selected = projects.slice(0, 3);
  const shopifyCount = tags.find((t) => t.key === 'shopify')?.count ?? 0;

  // Resolved from the CMS rather than hardcoded, so a marquee name always links
  // to a real project page.
  const marquee = MARQUEE_PROJECT_SLUGS.map((slug) =>
    projects.find((p) => p.slug === slug),
  ).filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <div className="mx-auto max-w-5xl px-5">
      {/* Names the subject of this site for search engines — the lever for the
       * branded "jose pulido developer" query. */}
      <JsonLd data={homeGraph(tags.map((t) => t.name))} />

      {/* ---------------------------------------------------------------- Hero */}
      <section className="grid gap-10 py-16 sm:py-24 md:grid-cols-[1fr_auto] md:items-start md:gap-16">
        <div className="animate-rise">
          <p className="eyebrow">
            Shopify developer &amp; tech lead · Venezuela
          </p>

          <h1 className="mt-5 text-step-5">
            I build Shopify storefronts — and lead the teams that ship them.
          </h1>

          <p className="measure mt-6 text-step-1 text-ink-muted">
            {yearsOfExperience()} years, {projects.length} storefronts shipped,{' '}
            {shopifyCount} of them on Shopify. I&apos;ve led Shopify Plus builds
            at agency scale and written the headless pieces behind them — custom
            apps, Shopify Functions, checkout extensions. Currently at
            Pet&apos;s Table.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/projects"
              className="font-display rounded-full bg-accent px-5 py-3 font-medium text-accent-ink"
            >
              See the work
            </Link>
            <Link
              href="/contact"
              className="font-display rounded-full border border-line-strong px-5 py-3 font-medium hover:border-accent hover:text-accent"
            >
              Get in touch
            </Link>
          </div>
        </div>

        {/* Small and cropped on purpose: the headline should carry this page. */}
        <Image
          src="/jose-pulido.jpg"
          alt="Jose Pulido"
          width={600}
          height={800}
          priority
          sizes="176px"
          className="animate-rise order-first h-36 w-36 rounded-2xl object-cover object-top md:order-none md:h-44 md:w-44"
        />
      </section>

      {/* ------------------------------------------------------------- Marquee */}
      {marquee.length > 0 ? (
        <section
          aria-labelledby="brands-heading"
          className="border-y border-line py-8"
        >
          <h2 id="brands-heading" className="eyebrow">
            Storefront work shipped for
          </h2>
          <ul className="mt-4 flex flex-wrap gap-x-7 gap-y-3">
            {marquee.map((project) => (
              <li key={project.id}>
                <Link
                  href={`/projects/${project.slug}`}
                  className="font-display text-step-2 font-semibold tracking-tight hover:text-accent"
                >
                  {project.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* ------------------------------------------------------------- Numbers */}
      <section className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-4">
        <Stat value={`${yearsOfExperience()}`} label="Years building" />
        <Stat value={`${projects.length}`} label="Storefronts shipped" />
        <Stat value={`${shopifyCount}`} label="Shopify builds" />
        <Stat value="2" label="Years as tech lead" />
      </section>

      {/* ---------------------------------------------------------- Selected work */}
      <section className="py-20">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="text-step-3">Selected work</h2>
          <Link
            href="/projects"
            className="font-display text-step--1 font-medium text-accent hover:underline"
          >
            All {projects.length} projects →
          </Link>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {selected.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={i}
              // Only the first card is above the fold on a phone.
              priority={i === 0}
            />
          ))}
        </div>
      </section>

      {/* --------------------------------------------------------------- Stack */}
      <section className="border-t border-line py-16">
        <h2 className="eyebrow">Stack</h2>
        {/* Written out with the weight behind each one, rather than a row of
         * logos that only says "I have touched these". */}
        <ul className="mt-6 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <li
              key={tag.key}
              className="rounded-full border border-line px-3.5 py-1.5 text-step--1"
            >
              {tag.name}
              <span className="ml-1.5 font-mono text-ink-muted">
                {tag.count}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-step--1 text-ink-muted">
          Plus the parts that don&apos;t show up as project tags: Shopify
          Functions and Extensions, checkout extensibility, custom private apps,
          Node, serverless functions, TypeScript.{' '}
          <Link href="/about" className="text-accent underline">
            Full stack and work history →
          </Link>
        </p>
      </section>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-ground px-5 py-6">
      <p className="font-display text-step-3 font-semibold tabular-nums">
        {value}
      </p>
      <p className="mt-1 text-step--1 text-ink-muted">{label}</p>
    </div>
  );
}
