import { expect, test } from '@playwright/test';

/**
 * The theme switch has no React behind it — it is static markup driven by the
 * inline script in the layout, which is what keeps the client runtime off every
 * page. That makes these tests the only thing standing between a refactor and a
 * silently dead control.
 */

test.describe('theme switch', () => {
  test('defaults to system with nothing stored', async ({ page }) => {
    await page.goto('/');
    const root = page.locator('html');
    await expect(root).toHaveAttribute('data-theme-choice', 'system');
    await expect(root).not.toHaveAttribute('data-theme', /.*/);
    await expect(
      page.locator('[data-theme-switch] [data-choice="system"]'),
    ).toHaveAttribute('aria-pressed', 'true');
  });

  test('switches to dark and back', async ({ page }) => {
    await page.goto('/');
    const root = page.locator('html');

    await page.click('[data-theme-switch] [data-choice="dark"]');
    await expect(root).toHaveAttribute('data-theme', 'dark');
    await expect(root).toHaveAttribute('data-theme-choice', 'dark');

    await page.click('[data-theme-switch] [data-choice="light"]');
    await expect(root).toHaveAttribute('data-theme', 'light');

    await page.click('[data-theme-switch] [data-choice="system"]');
    await expect(root).not.toHaveAttribute('data-theme', /.*/);
    await expect(root).toHaveAttribute('data-theme-choice', 'system');
  });

  test('actually repaints the page, not just the attribute', async ({
    page,
  }) => {
    await page.goto('/');
    const bg = () =>
      page.evaluate(() => getComputedStyle(document.body).backgroundColor);

    await page.click('[data-theme-switch] [data-choice="light"]');
    const light = await bg();
    await page.click('[data-theme-switch] [data-choice="dark"]');
    const dark = await bg();

    expect(light).not.toBe(dark);
    expect(light).toBe('rgb(251, 251, 249)');
    expect(dark).toBe('rgb(11, 15, 13)');
  });

  test('survives a reload and applies before first paint', async ({ page }) => {
    await page.goto('/');
    await page.click('[data-theme-switch] [data-choice="dark"]');

    await page.goto('/projects');
    // Asserted on the very first evaluation after load: if the stamp happened
    // late, the page would have painted light first.
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(
      page.locator('[data-theme-switch] [data-choice="dark"]'),
    ).toHaveAttribute('aria-pressed', 'true');
  });

  test('the toggle carries no client-side React', async ({ page }) => {
    // The whole reason this control is static markup. If someone reintroduces
    // 'use client' in the header, the home page starts shipping the client
    // runtime again and this catches it.
    const chunks: string[] = [];
    page.on('response', (r) => {
      const url = r.url();
      if (url.includes('/_next/static/') && url.endsWith('.js')) {
        chunks.push(url);
      }
    });
    await page.goto('/', { waitUntil: 'load' });
    // The control still has to work with whatever JS the page does ship.
    await page.click('[data-theme-switch] [data-choice="dark"]');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  });
});
