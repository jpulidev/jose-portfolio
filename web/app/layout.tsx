import type { Metadata } from 'next';
import { Schibsted_Grotesk, Source_Serif_4 } from 'next/font/google';
import './globals.css';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { site } from '@/lib/site';

/**
 * Two faces, each with a job.
 *
 * Schibsted Grotesk sets headings and interface text — a little narrower and
 * more characterful than the usual default. Source Serif carries running prose,
 * which is a deliberate signal on a portfolio that intends to contain real
 * writing. Monospace comes from the system stack and is reserved for data that
 * lines up. The old site used one monospace face for everything, which is a
 * large part of why it reads as dated.
 *
 * next/font self-hosts, subsets and preloads both, and sets font-display: swap.
 */
const display = Schibsted_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-schibsted',
});

const serif = Source_Serif_4({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-source-serif',
});

export const metadata: Metadata = {
  // Every relative URL in page metadata resolves against this. Without it,
  // og:image and canonical tags emit relative paths, which social crawlers
  // reject — exactly the bug the old site shipped.
  metadataBase: new URL(site.url),
  title: {
    default: site.defaultTitle,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
};

/**
 * The entire theme feature, in about thirty lines of vanilla JS.
 *
 * It runs before first paint, so neither the palette nor the toggle's highlight
 * flashes. Doing this here rather than in a client component keeps every page
 * free of the React client runtime — see components/ThemeToggle.tsx for what
 * that cost when it was a client component. Wrapped in try/catch throughout,
 * since it runs before anything else on the page.
 */
const themeScript = `
(function () {
  var KEY = 'theme';
  var el = document.documentElement;

  function read() {
    try {
      var t = localStorage.getItem(KEY);
      return t === 'light' || t === 'dark' ? t : 'system';
    } catch (e) { return 'system'; }
  }

  function apply(choice) {
    if (choice === 'system') el.removeAttribute('data-theme');
    else el.setAttribute('data-theme', choice);
    // Drives which toggle option is highlighted, in CSS, before hydration.
    el.setAttribute('data-theme-choice', choice);
    var btns = document.querySelectorAll('[data-theme-switch] [data-choice]');
    for (var i = 0; i < btns.length; i++) {
      btns[i].setAttribute('aria-pressed', String(btns[i].dataset.choice === choice));
    }
  }

  apply(read());

  // apply() runs in <head>, before the buttons exist, so the palette is right
  // from the first frame but aria-pressed cannot be. Sync it once the markup
  // is parsed, or screen readers are told the wrong option is selected.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { apply(read()); });
  }

  // Delegated, so it works no matter when the buttons are parsed.
  document.addEventListener('click', function (event) {
    var btn = event.target && event.target.closest
      ? event.target.closest('[data-theme-switch] [data-choice]')
      : null;
    if (!btn) return;
    var choice = btn.dataset.choice;
    try {
      if (choice === 'system') localStorage.removeItem(KEY);
      else localStorage.setItem(KEY, choice);
    } catch (e) {}
    apply(choice);
  });

  // Another tab changed the preference.
  window.addEventListener('storage', function (event) {
    if (event.key === KEY) apply(read());
  });
})();
`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang={site.locale}
      className={`${display.variable} ${serif.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-screen flex-col antialiased">
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
