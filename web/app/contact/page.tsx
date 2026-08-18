import { ContactForm } from '@/components/ContactForm';
import { pageMetadata } from '@/lib/metadata';
import { site } from '@/lib/site';

// The form embeds the render time as a spam signal, so this page can't be
// cached — a stale timestamp would look like a replayed submission.
export const dynamic = 'force-dynamic';

export const metadata = pageMetadata({
  title: 'Contact',
  description:
    'Get in touch with Jose Pulido — Shopify developer and tech lead specialising in Shopify Plus and headless commerce. Available for remote work.',
  path: '/contact',
});

/**
 * Read outside the component body: calling `Date.now()` during render is impure
 * and React's lint rule rejects it. The page is force-dynamic, so this runs per
 * request and the timestamp is genuinely the render time.
 */
async function renderTime(): Promise<number> {
  return Date.now();
}

export default async function ContactPage() {
  const renderedAt = await renderTime();

  return (
    <div className="mx-auto max-w-2xl px-5 py-16 sm:py-20">
      <div className="animate-rise">
        <p className="eyebrow">Contact</p>
        <h1 className="mt-4 text-step-4">Let&apos;s talk about your store.</h1>
        <p className="measure mt-5 text-step-1 text-ink-muted">
          Shopify build, a migration, or a headless front end — tell me what
          you&apos;re working on and I&apos;ll reply within a couple of days.
        </p>
      </div>

      <ContactForm renderedAt={renderedAt} />

      {/* The address stays visible whatever the form does. A visitor should
       * never be stuck because a send failed. */}
      <p className="mt-10 border-t border-line pt-6 text-step--1 text-ink-muted">
        Prefer email?{' '}
        <a
          href={`mailto:${site.email}`}
          className="text-accent underline underline-offset-4"
        >
          {site.email}
        </a>
        {' · '}
        <a
          href={site.social.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent underline underline-offset-4"
        >
          LinkedIn
        </a>
      </p>
    </div>
  );
}
