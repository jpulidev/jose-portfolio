import { expect, test } from '@playwright/test';

/**
 * Whole-site link check.
 *
 * Crawls every internal link reachable from the entry pages and asserts each
 * one answers 200, that no page logs a console error, and that the canonical
 * tag matches the URL actually served — a canonical pointing at a URL that
 * redirects is a duplicate-content signal, which is the exact class of problem
 * the old site had.
 */

const ENTRY_POINTS = [
  '/',
  '/projects',
  '/about',
  '/cv',
  '/contact',
  '/projects/kairos',
];

/** Paths that are expected to be missing. */
const EXPECTED_404 = ['/definitely-not-a-page'];

test.describe('internal links', () => {
  test('every internal link on the site answers 200', async ({
    page,
    request,
  }) => {
    const discovered = new Set<string>();

    for (const entry of ENTRY_POINTS) {
      await page.goto(entry, { waitUntil: 'load' });
      const hrefs = await page.evaluate(() =>
        Array.from(document.querySelectorAll('a[href]'))
          .map((a) => a.getAttribute('href')!)
          .filter((href) => href.startsWith('/')),
      );
      hrefs.forEach((href) => discovered.add(href));
    }

    expect(
      discovered.size,
      'crawl found suspiciously few internal links',
    ).toBeGreaterThan(10);

    const broken: string[] = [];
    for (const href of discovered) {
      if (EXPECTED_404.includes(href)) continue;
      const res = await request.get(href, { maxRedirects: 0 });
      // 200 direct, or a redirect that itself resolves — both fine. Anything
      // else is a link a visitor can click into a dead end.
      if (res.status() === 200) continue;
      if (res.status() >= 300 && res.status() < 400) {
        const location = res.headers()['location'];
        const followed = await request.get(location ?? href);
        if (followed.status() === 200) continue;
        broken.push(`${href} → ${location} → ${followed.status()}`);
        continue;
      }
      broken.push(`${href} → ${res.status()}`);
    }

    expect(broken, `broken internal links:\n${broken.join('\n')}`).toEqual([]);
  });

  test('all 24 project pages render with a heading and a live-site link', async ({
    page,
    request,
  }) => {
    const res = await request.get('/sitemap.xml');
    const body = await res.text();
    const projectUrls = [...body.matchAll(/<loc>(.*?)<\/loc>/g)]
      .map((m) => new URL(m[1]).pathname)
      .filter((p) => p.startsWith('/projects/') && p !== '/projects/');

    expect(projectUrls).toHaveLength(24);

    const problems: string[] = [];
    for (const path of projectUrls) {
      const response = await page.goto(path, { waitUntil: 'load' });
      if (response?.status() !== 200) {
        problems.push(`${path}: status ${response?.status()}`);
        continue;
      }
      const h1 = await page.locator('h1').count();
      if (h1 !== 1) problems.push(`${path}: ${h1} h1 elements`);
      // Either a working live link, or an explicit note that the store is
      // gone. What must never happen is neither — or a button to a dead site.
      const live = await page
        .locator('a:has-text("Visit the live site")')
        .count();
      const offline = await page
        .locator('text=This store is no longer online')
        .count();
      if (live + offline !== 1) {
        problems.push(
          `${path}: ${live} live links, ${offline} offline notices`,
        );
      }
    }

    expect(problems, problems.join('\n')).toEqual([]);
  });
});

test.describe('canonical and redirects', () => {
  test('the canonical tag matches the URL actually served', async ({
    page,
  }) => {
    const mismatches: string[] = [];
    for (const path of ENTRY_POINTS) {
      await page.goto(path, { waitUntil: 'load' });
      const canonical = await page
        .locator('link[rel="canonical"]')
        .getAttribute('href');
      const served = new URL(page.url()).pathname;
      const declared = new URL(canonical!).pathname;
      if (declared !== served) {
        mismatches.push(`${path}: serves ${served}, declares ${declared}`);
      }
    }
    expect(mismatches, mismatches.join('\n')).toEqual([]);
  });

  test('a trailing slash resolves rather than 404ing', async ({ request }) => {
    // Next serves without trailing slashes by default; the slashed form should
    // redirect, not die, because inbound links will use both.
    for (const path of ['/about/', '/projects/', '/cv/']) {
      const res = await request.get(path);
      expect(res.status(), `${path} → ${res.status()}`).toBe(200);
    }
  });
});

test.describe('no console errors', () => {
  for (const path of ENTRY_POINTS) {
    test(`${path} logs nothing`, async ({ page }) => {
      const errors: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') errors.push(msg.text());
      });
      page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`));

      await page.goto(path, { waitUntil: 'load' });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(1200);

      expect(errors, errors.join('\n')).toEqual([]);
    });
  }
});
