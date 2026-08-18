import Link from 'next/link';
import { site } from '@/lib/site';

export const metadata = {
  title: 'Page not found',
  description: 'That page does not exist.',
  // No `robots` here on purpose: Next already emits `noindex` for not-found,
  // and setting it again produced two competing meta robots tags.
};

/**
 * The real 404.
 *
 * Next returns an actual 404 status with this, which the old site did not — its
 * `/404` responded 200, and the page itself was one sentence with no heading and
 * no way back to anything. A 404 is a recovery point, so this one offers routes
 * onward.
 */
export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-24">
      <p className="eyebrow">404</p>
      <h1 className="mt-4 text-step-4">That page doesn&apos;t exist.</h1>
      <p className="measure mt-5 text-step-1 text-ink-muted">
        The link may be out of date. Here&apos;s where to go instead.
      </p>
      <ul className="mt-10 flex flex-wrap gap-3">
        <li>
          <Link
            href="/projects"
            className="font-display inline-block rounded-full bg-accent px-5 py-3 font-medium text-accent-ink"
          >
            See the work
          </Link>
        </li>
        <li>
          <Link
            href="/"
            className="font-display inline-block rounded-full border border-line-strong px-5 py-3 font-medium hover:border-accent hover:text-accent"
          >
            Home
          </Link>
        </li>
        <li>
          <a
            href={`mailto:${site.email}`}
            className="font-display inline-block rounded-full border border-line-strong px-5 py-3 font-medium hover:border-accent hover:text-accent"
          >
            Email me
          </a>
        </li>
      </ul>
    </div>
  );
}
