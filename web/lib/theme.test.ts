import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { ratio } from './contrast';
import {
  REQUIRED_CONTRAST,
  darkTheme,
  lightTheme,
  type ThemeTokens,
} from './theme';

/**
 * The palette's guard rail.
 *
 * Two jobs: prove every rendered colour pair meets WCAG AA, and prove the CSS
 * has not drifted from the TypeScript source of truth. Contrast failures are
 * mechanically detectable, so the old site's 3.21:1 contact button and 1.34:1
 * section label should never have been able to ship.
 */

const css = readFileSync(join(process.cwd(), 'app/globals.css'), 'utf8');

/** Maps a token name to the CSS custom property that carries it. */
const CSS_VAR: Record<keyof ThemeTokens, string> = {
  ground: '--ground',
  surface: '--surface',
  ink: '--ink',
  inkMuted: '--ink-muted',
  line: '--line',
  lineStrong: '--line-strong',
  accent: '--accent',
  accentInk: '--accent-ink',
  accentSoft: '--accent-soft',
};

/**
 * Reads a token out of a specific CSS block.
 *
 * `--ink` and `--ink-muted` share a prefix, so the pattern anchors on the colon
 * to avoid `--ink` matching the `--ink-muted` declaration.
 */
function readToken(block: string, cssVar: string): string | null {
  const match = block.match(
    new RegExp(`${cssVar}\\s*:\\s*(#[0-9a-fA-F]{3,8})\\s*;`),
  );
  return match ? match[1].toLowerCase() : null;
}

function blockAfter(marker: string): string {
  const start = css.indexOf(marker);
  if (start === -1) throw new Error(`Missing CSS block: ${marker}`);
  const open = css.indexOf('{', start);
  const end = css.indexOf('}', open);
  return css.slice(open, end);
}

describe('palette contrast', () => {
  for (const [themeName, tokens] of [
    ['light', lightTheme],
    ['dark', darkTheme],
  ] as const) {
    describe(themeName, () => {
      for (const pair of REQUIRED_CONTRAST) {
        it(`${pair.name} meets ${pair.min}:1`, () => {
          const value = ratio(tokens[pair.fg], tokens[pair.bg]);
          expect(
            value,
            `${pair.fg} (${tokens[pair.fg]}) on ${pair.bg} (${tokens[pair.bg]}) is ${value}:1`,
          ).toBeGreaterThanOrEqual(pair.min);
        });
      }
    });
  }
});

describe('globals.css matches lib/theme.ts', () => {
  it('declares the light palette on bare :root', () => {
    // Bare :root, not a media query — a colour defined only behind
    // prefers-color-scheme never applies in the un-stamped default state.
    const block = blockAfter(':root {');
    for (const [token, cssVar] of Object.entries(CSS_VAR)) {
      expect(readToken(block, cssVar), `${cssVar} in :root`).toBe(
        lightTheme[token as keyof ThemeTokens].toLowerCase(),
      );
    }
  });

  it('declares the dark palette under prefers-color-scheme', () => {
    const block = blockAfter(":root:not([data-theme='light'])");
    for (const [token, cssVar] of Object.entries(CSS_VAR)) {
      expect(readToken(block, cssVar), `${cssVar} in media query`).toBe(
        darkTheme[token as keyof ThemeTokens].toLowerCase(),
      );
    }
  });

  it('declares the dark palette again for the explicit toggle', () => {
    // Without this block the manual toggle cannot beat a light OS setting.
    const block = blockAfter(":root[data-theme='dark']");
    for (const [token, cssVar] of Object.entries(CSS_VAR)) {
      expect(readToken(block, cssVar), `${cssVar} in [data-theme=dark]`).toBe(
        darkTheme[token as keyof ThemeTokens].toLowerCase(),
      );
    }
  });

  it('guards the dark media query so an explicit light choice wins', () => {
    expect(css).toContain(":root:not([data-theme='light'])");
  });

  it('paints an explicit background on body', () => {
    // The page composites over a ground the host paints in its own theme, so a
    // transparent body silently borrows the wrong one.
    expect(css).toMatch(/body\s*\{[^}]*background:\s*var\(--ground\)/);
  });

  it('honours prefers-reduced-motion', () => {
    expect(css).toContain('prefers-reduced-motion: reduce');
  });
});
