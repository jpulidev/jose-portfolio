import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

/**
 * Full accessibility sweep with axe-core.
 *
 * `layout.spec.ts` already checks contrast, but only for colour pairs on text
 * it can find. This catches the rest of WCAG A/AA that a machine can see:
 * landmark structure, heading order, form labels, link names, ARIA misuse.
 *
 * Run in both themes, because a rule can pass on one ground and fail on the
 * other.
 */

const PAGES = [
  '/',
  '/projects',
  '/about',
  '/cv',
  '/contact',
  '/projects/kairos',
] as const;

for (const theme of ['light', 'dark'] as const) {
  for (const path of PAGES) {
    test(`${path} has no axe violations in ${theme}`, async ({ page }) => {
      await page.goto('/');
      await page.evaluate((t) => localStorage.setItem('theme', t), theme);
      await page.goto(path, { waitUntil: 'load' });
      await page.evaluate(() => document.fonts.ready);
      // The entrance animation fades content in from opacity 0. Sampled
      // mid-flight, axe measures the blended colour and reports a contrast
      // failure that does not exist at rest — so wait for it to finish.
      await page.evaluate(() =>
        Promise.all(
          document.getAnimations().map((a) => a.finished.catch(() => {})),
        ),
      );

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      const summary = results.violations.map(
        (v) =>
          `${v.id} (${v.impact}): ${v.help}\n  ${v.nodes
            .slice(0, 3)
            .map((n) => n.target.join(' '))
            .join('\n  ')}`,
      );

      expect(results.violations, summary.join('\n\n')).toEqual([]);
    });
  }
}

test('keyboard users can reach the main content and the nav', async ({
  page,
}) => {
  await page.goto('/', { waitUntil: 'load' });

  // The skip link is the first thing Tab reaches, and it must become visible
  // when focused — a skip link that stays hidden helps nobody.
  await page.keyboard.press('Tab');
  const skip = page.locator('a[href="#main"]');
  await expect(skip).toBeFocused();
  await expect(skip).toBeVisible();

  // Every interactive control should be reachable, and show a focus ring.
  const outline = await page.evaluate(() => {
    const link = document.querySelector('a[href="/projects"]') as HTMLElement;
    link.focus();
    const style = getComputedStyle(link);
    return { width: style.outlineWidth, style: style.outlineStyle };
  });
  expect(outline.style).not.toBe('none');
  expect(parseFloat(outline.width)).toBeGreaterThan(0);
});
