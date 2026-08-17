import { site, yearsOfExperience } from '@/lib/site';

const links = [
  { href: site.social.github, label: 'GitHub' },
  { href: site.social.linkedin, label: 'LinkedIn' },
  { href: site.social.instagram, label: 'Instagram' },
];

export function SiteFooter() {
  return (
    <footer className="site-chrome mt-24 border-t border-line">
      <div className="mx-auto max-w-5xl px-5 py-12">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <p className="font-display text-step-2 font-semibold tracking-tight text-balance">
              Building something?{' '}
              <a
                href={`mailto:${site.email}`}
                className="text-accent underline decoration-2 underline-offset-4"
              >
                Let&apos;s talk.
              </a>
            </p>
            <p className="mt-3 text-step--1 text-ink-muted">{site.email}</p>
          </div>

          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-step--1">
            {links.map((link) => (
              <li key={link.href}>
                {/* External links get rel=noopener — the old site had neither. */}
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-12 border-t border-line pt-6 text-step--1 text-ink-muted">
          © {new Date().getFullYear()} {site.name} — {yearsOfExperience()} years
          building for the web.
        </p>
      </div>
    </footer>
  );
}
