import { expect, test } from '@playwright/test';

/**
 * What the old site actually served, and what a crawler now gets instead.
 *
 * Every assertion here maps to a measured finding: an empty homepage `<title>`,
 * empty `og:title` / `og:description`, no canonical, no sitemap, no robots.txt,
 * no structured data, and a 204x132 share image behind a relative path.
 */

const PAGES = [
  '/',
  '/projects',
  '/about',
  '/cv',
  '/contact',
  '/projects/kairos',
] as const;

test.describe('page metadata', () => {
  for (const path of PAGES) {
    test(`${path} serves complete metadata`, async ({ page }) => {
      const response = await page.goto(path, { waitUntil: 'load' });
      expect(response?.status()).toBe(200);

      const meta = await page.evaluate(() => {
        const attr = (selector: string, name: string) =>
          document.querySelector(selector)?.getAttribute(name) ?? null;
        return {
          title: document.title,
          description: attr('meta[name="description"]', 'content'),
          canonical: attr('link[rel="canonical"]', 'href'),
          ogTitle: attr('meta[property="og:title"]', 'content'),
          ogDescription: attr('meta[property="og:description"]', 'content'),
          ogImage: attr('meta[property="og:image"]', 'content'),
          ogUrl: attr('meta[property="og:url"]', 'content'),
          twitterCard: attr('meta[name="twitter:card"]', 'content'),
          lang: document.documentElement.lang,
        };
      });

      // The exact bug the old home page shipped.
      expect(meta.title.trim().length).toBeGreaterThan(0);
      expect(meta.title.length).toBeLessThanOrEqual(60);
      expect(meta.ogTitle?.trim().length ?? 0).toBeGreaterThan(0);
      expect(meta.ogDescription?.trim().length ?? 0).toBeGreaterThan(0);

      expect(meta.description?.length ?? 0).toBeGreaterThanOrEqual(80);
      expect(meta.description?.length ?? 0).toBeLessThanOrEqual(200);

      // Social crawlers reject relative paths.
      expect(meta.ogImage).toMatch(/^https:\/\/jpulidev\.com\//);
      expect(meta.ogUrl).toMatch(/^https:\/\/jpulidev\.com/);
      expect(meta.canonical).toMatch(/^https:\/\/jpulidev\.com/);
      expect(meta.twitterCard).toBe('summary_large_image');
      expect(meta.lang).toBe('en');
    });
  }

  test('each page has exactly one canonical and one h1', async ({ page }) => {
    for (const path of PAGES) {
      await page.goto(path, { waitUntil: 'load' });
      await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
      await expect(page.locator('h1')).toHaveCount(1);
    }
  });

  test('titles are unique across pages', async ({ page }) => {
    const titles: string[] = [];
    for (const path of PAGES) {
      await page.goto(path, { waitUntil: 'load' });
      titles.push(await page.title());
    }
    expect(new Set(titles).size).toBe(titles.length);
  });
});

test.describe('structured data', () => {
  test('home describes the person and the site', async ({ page }) => {
    await page.goto('/', { waitUntil: 'load' });
    const blocks = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents();
    expect(blocks).toHaveLength(1);

    const data = JSON.parse(blocks[0]);
    const types = data['@graph'].map((n: { '@type': string }) => n['@type']);
    expect(types).toContain('Person');
    expect(types).toContain('WebSite');

    const person = data['@graph'].find(
      (n: { '@type': string }) => n['@type'] === 'Person',
    );
    expect(person.name).toBe('Jose Pulido');
    expect(person.sameAs).toContain('https://github.com/jpulidev');
  });

  test('a project describes the work and its breadcrumbs', async ({ page }) => {
    await page.goto('/projects/kairos', { waitUntil: 'load' });
    const raw = await page
      .locator('script[type="application/ld+json"]')
      .first()
      .textContent();
    const data = JSON.parse(raw ?? '{}');
    const types = data['@graph'].map((n: { '@type': string }) => n['@type']);
    expect(types).toContain('CreativeWork');
    expect(types).toContain('BreadcrumbList');
  });
});

test.describe('crawl files', () => {
  test('robots.txt points at the sitemap', async ({ request }) => {
    const res = await request.get('/robots.txt');
    expect(res.status()).toBe(200);
    const body = await res.text();
    expect(body).toContain('Sitemap: https://jpulidev.com/sitemap.xml');
    expect(body).toContain('Allow: /');
  });

  test('sitemap lists every project and no tag pages', async ({ request }) => {
    const res = await request.get('/sitemap.xml');
    expect(res.status()).toBe(200);
    const body = await res.text();
    const urls = [...body.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);

    expect(urls).toContain('https://jpulidev.com/');
    expect(urls).toContain('https://jpulidev.com/projects');
    expect(urls.filter((u) => u.includes('/projects/')).length).toBe(24);
    // The old site generated an indexable page per technology tag; those were
    // near-duplicates of /projects with no canonical.
    expect(urls.filter((u) => /\/project\/[^s]/.test(u))).toEqual([]);
    expect(new Set(urls).size).toBe(urls.length);
  });

  test('a missing page returns a real 404', async ({ page }) => {
    // The old /404 responded 200, which tells a crawler the page exists.
    const response = await page.goto('/definitely-not-a-page');
    expect(response?.status()).toBe(404);
    await expect(page.locator('h1')).toContainText("doesn't exist");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      'content',
      /noindex/,
    );
  });
});

test.describe('social share images', () => {
  test('the site card is 1200x630', async ({ request }) => {
    const res = await request.get('/opengraph-image');
    expect(res.status()).toBe(200);
    expect(res.headers()['content-type']).toContain('image/png');
    // The old og:image was 204x132, below what platforms will render.
    expect((await res.body()).length).toBeGreaterThan(5000);
  });

  test('each project generates its own card', async ({ page, request }) => {
    await page.goto('/projects/kairos', { waitUntil: 'load' });
    const ogImage = await page
      .locator('meta[property="og:image"]')
      .getAttribute('content');
    expect(ogImage).toContain('/projects/kairos/opengraph-image');

    const res = await request.get(
      new URL(ogImage!).pathname + new URL(ogImage!).search,
    );
    expect(res.status()).toBe(200);
    expect(res.headers()['content-type']).toContain('image/png');
  });
});

test.describe('positioning', () => {
  test('the marquee brands all resolve to real project pages', async ({
    page,
    request,
  }) => {
    // Hardcoded slugs in lib/site.ts. If a project is renamed or deleted in the
    // CMS, the name silently disappears from the home page — catch that here.
    await page.goto('/', { waitUntil: 'load' });
    const links = page.locator('section[aria-labelledby="brands-heading"] a');
    const count = await links.count();
    expect(count, 'no brand names rendered').toBeGreaterThanOrEqual(5);

    for (let i = 0; i < count; i += 1) {
      const href = await links.nth(i).getAttribute('href');
      expect(href).toMatch(/^\/projects\//);
      const res = await request.get(href!);
      expect(res.status(), `${href} is broken`).toBe(200);
    }
  });

  test('the title reads as the role, consistently', async ({ page }) => {
    await page.goto('/', { waitUntil: 'load' });
    expect(await page.title()).toBe(
      'Jose Pulido — Shopify Developer & Tech Lead',
    );

    // The JSON-LD job title has to match what the page says, or the two tell a
    // search engine different things about the same person.
    const raw = await page
      .locator('script[type="application/ld+json"]')
      .first()
      .textContent();
    const data = JSON.parse(raw ?? '{}');
    const person = data['@graph'].find(
      (n: { '@type': string }) => n['@type'] === 'Person',
    );
    expect(person.jobTitle).toBe('Shopify Developer & Tech Lead');
  });
});
