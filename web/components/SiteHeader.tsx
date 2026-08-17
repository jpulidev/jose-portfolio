import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';
import { site } from '@/lib/site';

// `as const` keeps the hrefs as literal types, which is what typedRoutes needs
// to verify each one actually exists.
const nav = [
  { href: '/projects', label: 'Work' },
  { href: '/about', label: 'About' },
  { href: '/cv', label: 'CV' },
] as const;

export function SiteHeader() {
  return (
    <header className="site-chrome border-b border-line">
      {/* Keyboard and screen-reader users get a way past the nav. */}
      <a
        href="#main"
        className="sr-only rounded bg-accent px-3 py-2 text-accent-ink focus:not-sr-only focus:absolute focus:z-50 focus:m-2"
      >
        Skip to content
      </a>
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-5 py-4">
        <Link
          href="/"
          className="font-display text-step-0 font-semibold tracking-tight"
        >
          {site.name}
          <span className="text-accent">.</span>
        </Link>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 sm:gap-x-6">
          <nav aria-label="Main">
            <ul className="flex flex-wrap items-center gap-x-4 gap-y-2 sm:gap-x-6">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="font-display text-step--1 font-medium hover:text-accent"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/contact"
                  className="font-display inline-block rounded-full bg-accent px-3.5 py-1.5 text-step--1 font-medium text-accent-ink"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
