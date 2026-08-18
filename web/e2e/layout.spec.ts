import { expect, test } from '@playwright/test';

/**
 * Regression guards for the two defects measured on the old site.
 *
 * Both are mechanically detectable, which is exactly why they should never have
 * shipped: every page overflowed horizontally at 375px, and three elements —
 * including the contact button at 3.21:1 — failed WCAG AA contrast.
 */

const ROUTES = [
  '/',
  '/projects',
  '/about',
  '/cv',
  '/contact',
  '/projects/kairos',
] as const;
const WIDTHS = [320, 360, 375, 390, 768] as const;

test.describe('no horizontal overflow', () => {
  for (const route of ROUTES) {
    for (const width of WIDTHS) {
      test(`${route} at ${width}px`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        // 'load' rather than 'networkidle': image-heavy pages keep the
        // network busy long enough to trip the timeout, and layout is settled
        // once fonts are ready.
        await page.goto(route, { waitUntil: 'load' });
        await page.evaluate(() => document.fonts.ready);

        const result = await page.evaluate(() => {
          const de = document.documentElement;
          // Neutralise the overflow-x guard so this measures real overflow
          // rather than overflow that is merely being hidden.
          const previous = de.style.overflowX;
          de.style.overflowX = 'visible';
          document.body.style.overflowX = 'visible';
          void de.offsetWidth;

          const viewport = de.clientWidth;
          const culprits = Array.from(document.querySelectorAll('body *'))
            .filter((el) => el.getBoundingClientRect().right > viewport + 1)
            .slice(0, 5)
            .map((el) => {
              const rect = el.getBoundingClientRect();
              return `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 40)} right=${Math.round(rect.right)}`;
            });

          const scrollWidth = de.scrollWidth;
          de.style.overflowX = previous;
          document.body.style.overflowX = '';
          return { viewport, scrollWidth, culprits };
        });

        expect(
          result.scrollWidth,
          `overflows by ${result.scrollWidth - result.viewport}px: ${result.culprits.join(' | ')}`,
        ).toBeLessThanOrEqual(result.viewport + 1);
      });
    }
  }
});

/** WCAG 2.1 relative luminance and contrast, evaluated in the page. */
const CONTRAST_PROBE = `() => {
  const lum = (c) => {
    const m = c.match(/[\\d.]+/g);
    if (!m) return 1;
    const [r, g, b] = m.slice(0, 3).map(Number).map((v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const bgOf = (el) => {
    let e = el;
    while (e) {
      const b = getComputedStyle(e).backgroundColor;
      if (b && !/rgba\\(0, 0, 0, 0\\)|transparent/.test(b)) return b;
      e = e.parentElement;
    }
    return getComputedStyle(document.body).backgroundColor;
  };
  const els = Array.from(
    document.querySelectorAll('h1,h2,h3,h4,p,a,li,span,dt,dd,button,label')
  ).filter(
    (e) =>
      e.textContent.trim() &&
      e.offsetParent !== null &&
      !e.querySelector('h1,h2,h3,h4,p,a,li,dt,dd,button')
  );
  return els.map((el) => {
    const cs = getComputedStyle(el);
    const L1 = lum(cs.color);
    const L2 = lum(bgOf(el));
    const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
    const px = parseFloat(cs.fontSize);
    const bold = parseInt(cs.fontWeight) >= 700;
    const large = px >= 24 || (px >= 18.66 && bold);
    const min = large ? 3 : 4.5;
    return {
      text: el.textContent.trim().slice(0, 40),
      ratio: Math.round(ratio * 100) / 100,
      min,
      passes: ratio >= min,
    };
  });
}`;

test.describe('WCAG AA contrast', () => {
  for (const theme of ['light', 'dark'] as const) {
    for (const route of ROUTES) {
      test(`${route} in ${theme}`, async ({ page }) => {
        // Set the stored preference before first paint, then load fresh.
        // Toggling the attribute on a live page measures mid-transition values.
        await page.goto('/');
        await page.evaluate((t) => localStorage.setItem('theme', t), theme);
        await page.goto(route, { waitUntil: 'load' });
        await page.evaluate(() => document.fonts.ready);
        // Colours read mid-transition are interpolated values, not the ones
        // that actually render — wait for every animation to finish first.
        await page.evaluate(() =>
          Promise.all(
            document.getAnimations().map((a) => a.finished.catch(() => {})),
          ),
        );

        // Wrapped as an IIFE: passing a bare function expression as a string
        // makes Playwright evaluate it to the function itself, not call it.
        const results = (await page.evaluate(
          `(${CONTRAST_PROBE})()`,
        )) as Array<{
          text: string;
          ratio: number;
          min: number;
          passes: boolean;
        }>;
        const failures = results.filter((r) => !r.passes);

        expect(
          failures,
          failures
            .map((f) => `"${f.text}" ${f.ratio}:1 (needs ${f.min})`)
            .join('\n'),
        ).toEqual([]);
        // Guards against the probe silently matching nothing.
        expect(results.length).toBeGreaterThan(10);
      });
    }
  }
});
