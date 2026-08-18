import Image from 'next/image';
import Link from 'next/link';
import { RoleList } from '@/components/RoleList';
import { Engagements, SelectedWork } from '@/components/SelectedWork';
import { education, roles, stack } from '@/lib/experience';
import { pageMetadata } from '@/lib/metadata';
import { getNotes } from '@/lib/sanity/data';
import { site, yearsOfExperience } from '@/lib/site';

export const revalidate = 3600;

export const metadata = pageMetadata({
  title: 'About',
  description:
    'Jose Pulido — Shopify developer and tech lead. Nine years of storefronts, Shopify Plus builds and headless commerce for brands in the US and Mexico.',
  path: '/about',
});

export default async function AboutPage() {
  const notes = await getNotes();

  return (
    <div className="mx-auto max-w-3xl px-5 py-16 sm:py-20">
      <div className="animate-rise">
        <p className="eyebrow">About</p>
        <h1 className="mt-4 text-step-4">
          I used to argue cases. Now I ship code.
        </h1>

        <div className="measure mt-8 space-y-5 text-step-1">
          <p>
            I&apos;m Jose Pulido, a Shopify developer and tech lead from
            Venezuela. I&apos;ve spent {yearsOfExperience()} years building for
            the web — most of it on Shopify, working remotely with agencies and
            brands in the United States and Mexico. For two of those years I led
            the development team on Shopify Plus engagements.
          </p>
          <p className="text-ink-muted">
            Before that I made a living as a litigation lawyer. I left it behind
            when my wife introduced me to this coding adventure, and I
            haven&apos;t stopped learning a day since. I also make a pretty mean
            guacamole.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={`mailto:${site.email}`}
            className="font-display rounded-full bg-accent px-5 py-3 font-medium text-accent-ink"
          >
            Work with me
          </a>
          <Link
            href="/cv"
            className="font-display rounded-full border border-line-strong px-5 py-3 font-medium hover:border-accent hover:text-accent"
          >
            View CV
          </Link>
        </div>
      </div>

      <section className="mt-20">
        <h2 className="eyebrow">Things I&apos;ve built</h2>
        <p className="measure mt-3 text-ink-muted">
          Specific rather than general, because a job title doesn&apos;t say
          what someone can actually do.
        </p>
        <SelectedWork />
      </section>

      <section className="mt-20">
        <h2 className="eyebrow">Experience</h2>
        <RoleList roles={roles} />
      </section>

      <section className="mt-16">
        <h2 className="eyebrow">Client engagements</h2>
        <p className="measure mt-3 text-ink-muted">
          Independent work, alongside the roles above.
        </p>
        <Engagements />
      </section>

      <section className="mt-16">
        <h2 className="eyebrow">Stack</h2>
        <dl className="mt-6 space-y-5">
          {stack.map((group) => (
            <div
              key={group.group}
              className="grid gap-1.5 sm:grid-cols-[9rem_1fr] sm:gap-6"
            >
              <dt className="font-display text-step--1 font-semibold">
                {group.group}
              </dt>
              <dd className="text-ink-muted">{group.items.join(' · ')}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-16">
        <h2 className="eyebrow">Training</h2>
        <ul className="mt-6 space-y-3">
          {education.map((entry) => (
            <li
              key={`${entry.institution}-${entry.qualification}`}
              className="grid gap-0.5 sm:grid-cols-[9rem_1fr] sm:gap-6"
            >
              <span className="font-mono text-step--1 text-ink-muted">
                {entry.year}
              </span>
              <span>
                {entry.qualification}
                <span className="text-ink-muted"> — {entry.institution}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {notes.length > 0 ? (
        <section className="mt-20" data-cms-content>
          <h2 className="eyebrow">Notes</h2>
          {/* These come from the CMS `person` type, which the original scaffold
           * titled "Team". The content is a set of personal notes and short
           * essays, so that is how they are presented. */}
          <div className="mt-8 space-y-12">
            {notes.map((note) => (
              <article
                key={note.id}
                className="grid gap-5 sm:grid-cols-[7rem_1fr] sm:gap-7"
              >
                {note.image ? (
                  <Image
                    src={note.image.url}
                    alt={note.image.alt ?? ''}
                    width={note.image.width}
                    height={note.image.height}
                    sizes="112px"
                    placeholder={note.image.lqip ? 'blur' : 'empty'}
                    blurDataURL={note.image.lqip ?? undefined}
                    className="h-28 w-28 rounded-xl border border-line object-cover"
                  />
                ) : null}
                <div>
                  <h3 className="font-display text-step-1 font-semibold">
                    {note.title}
                  </h3>
                  <p className="mt-2 text-ink-muted">{note.body}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
