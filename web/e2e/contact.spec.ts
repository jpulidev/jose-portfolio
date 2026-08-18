import { expect, test } from '@playwright/test';

/**
 * The contact form.
 *
 * The old site's only contact path was a `mailto:` link, which does nothing
 * useful on most phones. These cover the parts that decide whether an enquiry
 * actually reaches Jose: validation, the spam gate, and the fact that a failed
 * send never leaves a visitor stranded.
 */

test.describe('contact form', () => {
  test('rejects an empty submission with per-field errors', async ({
    page,
  }) => {
    await page.goto('/contact', { waitUntil: 'load' });
    // The form has a minimum fill time; wait past it so this tests validation
    // rather than the spam gate.
    await page.waitForTimeout(3200);
    await page.click('button[type="submit"]');

    await expect(page.locator('#name-error')).toBeVisible();
    await expect(page.locator('#email-error')).toBeVisible();
    await expect(page.locator('#message-error')).toBeVisible();
    // Errors must be wired to their fields, not just placed near them.
    await expect(page.locator('#name')).toHaveAttribute('aria-invalid', 'true');
    await expect(page.locator('#name')).toHaveAttribute(
      'aria-describedby',
      'name-error',
    );
  });

  test('keeps what was typed when it rejects', async ({ page }) => {
    await page.goto('/contact', { waitUntil: 'load' });
    await page.waitForTimeout(3200);
    await page.fill('#name', 'Ana Rivas');
    await page.fill('#email', 'not-an-email');
    await page.fill('#message', 'We need a Shopify migration for our store.');
    await page.click('button[type="submit"]');

    await expect(page.locator('#email-error')).toBeVisible();
    // Retyping everything because one field was wrong is the fastest way to
    // lose an enquiry.
    await expect(page.locator('#name')).toHaveValue('Ana Rivas');
    await expect(page.locator('#message')).toHaveValue(
      'We need a Shopify migration for our store.',
    );
  });

  test('says so plainly when sending is not configured', async ({ page }) => {
    await page.goto('/contact', { waitUntil: 'load' });
    await page.waitForTimeout(3200);
    await page.fill('#name', 'Ana Rivas');
    await page.fill('#email', 'ana@example.com');
    await page.fill('#message', 'We need a Shopify migration for our store.');
    await page.click('button[type="submit"]');

    // Without RESEND_API_KEY the action must not pretend it sent anything.
    // Scoped to the form: Next renders its own role="alert" route announcer.
    const alert = page.locator('form [role="alert"]');
    await expect(alert).toBeVisible();
    await expect(alert).toContainText('josecpulidoo@gmail.com');
  });

  test('always offers a way through that does not depend on the form', async ({
    page,
  }) => {
    await page.goto('/contact', { waitUntil: 'load' });
    // Both appear twice — once in the page, once in the footer — so scope to
    // the first rather than tripping Playwright's strict mode.
    await expect(
      page.locator('a[href^="mailto:josecpulidoo@gmail.com"]').first(),
    ).toBeVisible();
    await expect(page.locator('a[href*="linkedin.com"]').first()).toBeVisible();
  });

  test('hides the honeypot from people and from assistive tech', async ({
    page,
  }) => {
    await page.goto('/contact', { waitUntil: 'load' });
    const honeypot = page.locator('#website');
    await expect(honeypot).toHaveCount(1);

    // Positioned off-screen rather than display:none — that is the point of the
    // technique, since a hidden field is trivial for a bot to skip. So the check
    // is that it is out of sight and out of the accessibility tree, not that
    // Playwright considers it "hidden".
    const box = await honeypot.boundingBox();
    expect(
      box,
      'honeypot should still have a box, just off-screen',
    ).not.toBeNull();
    expect(box!.x + box!.width).toBeLessThan(0);

    await expect(honeypot).toHaveAttribute('tabindex', '-1');
    await expect(page.locator('[aria-hidden="true"] #website')).toHaveCount(1);
  });
});

test.describe('CV', () => {
  test('shows the work history and stays in sync with About', async ({
    page,
  }) => {
    await page.goto('/cv', { waitUntil: 'load' });
    await expect(page.locator('h1')).toContainText('Jose Pulido');

    // The roles that carry the story, sourced from lib/experience.ts.
    for (const company of ["Pet's Table", 'Gamma Waves', 'Nanagram Studio']) {
      await expect(
        page.getByText(company, { exact: false }).first(),
      ).toBeVisible();
    }
    await expect(
      page.getByText('Tech Lead', { exact: false }).first(),
    ).toBeVisible();
  });

  test('drops site chrome when printed', async ({ page }) => {
    await page.goto('/cv', { waitUntil: 'load' });
    await page.emulateMedia({ media: 'print' });
    await expect(page.locator('header.site-chrome')).toBeHidden();
    await expect(page.locator('footer.site-chrome')).toBeHidden();
    // The content itself must survive.
    await expect(page.locator('h1')).toBeVisible();
  });

  test('is reachable from the nav and from About', async ({ page }) => {
    await page.goto('/', { waitUntil: 'load' });
    await expect(page.locator('nav a[href="/cv"]')).toBeVisible();
    await page.goto('/about', { waitUntil: 'load' });
    await expect(page.locator('a[href="/cv"]').first()).toBeVisible();
  });
});

test('the years-of-experience figure is consistent everywhere', async ({
  page,
}) => {
  // Three contradictory claims is what the old site shipped. Whatever the
  // number is, every page written by this codebase has to agree on it.
  //
  // CMS prose is excluded, and not because it agrees: a `person` note in Sanity
  // still says "5 years of experience". That number is editable only in the
  // Studio, so this asserts what the code controls and the stale copy stays on
  // the open-items list rather than as a permanently red test.
  const found = new Set<string>();
  for (const path of ['/', '/about', '/cv']) {
    await page.goto(path, { waitUntil: 'load' });
    const text = await page.evaluate(() => {
      const clone = document.body.cloneNode(true) as HTMLElement;
      // `innerText` on a *detached* node degrades to textContent semantics, so
      // it picks up <script> contents — including the RSC flight payload, which
      // carries a serialised copy of every string on the page. Strip both.
      clone
        .querySelectorAll('[data-cms-content], script, template, noscript')
        .forEach((node) => node.remove());
      return clone.innerText;
    });
    for (const match of text.matchAll(/(\d+)\s+years/gi)) found.add(match[1]);
  }
  expect([...found], 'pages disagree on years of experience').toHaveLength(1);
});
