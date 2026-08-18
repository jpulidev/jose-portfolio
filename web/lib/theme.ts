/**
 * The palette, as data.
 *
 * This is the single source of truth. `app/globals.css` declares the same values
 * as CSS custom properties, and `theme.test.ts` asserts two things: that every
 * pair meets its WCAG minimum, and that the CSS has not drifted from these
 * numbers. Picking colours by eye is how the old site ended up with a contact
 * button at 3.21:1 and a section label at 1.34:1.
 *
 * Direction: a deep pine accent on cool, slightly green-biased neutrals. The
 * green is doing work — it reads as commerce and growth rather than the default
 * developer-portfolio blue — and the neutrals carry a trace of the same hue so
 * they look chosen rather than inherited.
 */

export type ThemeTokens = {
  /** Page background. */
  ground: string;
  /** Raised panels: cards, code blocks, table headers. */
  surface: string;
  /** Body text. */
  ink: string;
  /** Secondary text: captions, labels, metadata. */
  inkMuted: string;
  /** Decorative hairlines. Not required to meet 3:1. */
  line: string;
  /** Borders that carry meaning (inputs, active states). Meets 3:1. */
  lineStrong: string;
  /** The one saturated colour. Used sparingly. */
  accent: string;
  /** Text on top of `accent`. */
  accentInk: string;
  /** Tinted background for callouts and active chips. */
  accentSoft: string;
};

export const lightTheme: ThemeTokens = {
  ground: '#FBFBF9',
  surface: '#F2F3F0',
  ink: '#121714',
  inkMuted: '#55605A',
  line: '#DCDFD9',
  lineStrong: '#7B857F',
  accent: '#14603C',
  accentInk: '#FFFFFF',
  accentSoft: '#E4EFE8',
};

export const darkTheme: ThemeTokens = {
  ground: '#0B0F0D',
  surface: '#151B18',
  ink: '#E8EEE9',
  inkMuted: '#9AA8A0',
  line: '#28322D',
  lineStrong: '#57665F',
  accent: '#5FD39B',
  accentInk: '#06231A',
  accentSoft: '#122A20',
};

/**
 * Every colour combination the design actually renders, with the minimum it has
 * to meet. If a component needs a pair that isn't listed here, add it — an
 * unlisted pair is an unchecked pair.
 */
export const REQUIRED_CONTRAST: ReadonlyArray<{
  name: string;
  fg: keyof ThemeTokens;
  bg: keyof ThemeTokens;
  min: number;
}> = [
  { name: 'body text on page', fg: 'ink', bg: 'ground', min: 4.5 },
  { name: 'body text on card', fg: 'ink', bg: 'surface', min: 4.5 },
  { name: 'muted text on page', fg: 'inkMuted', bg: 'ground', min: 4.5 },
  { name: 'muted text on card', fg: 'inkMuted', bg: 'surface', min: 4.5 },
  { name: 'button label', fg: 'accentInk', bg: 'accent', min: 4.5 },
  { name: 'accent text on page', fg: 'accent', bg: 'ground', min: 4.5 },
  { name: 'accent text on card', fg: 'accent', bg: 'surface', min: 4.5 },
  { name: 'accent text on tint', fg: 'accent', bg: 'accentSoft', min: 4.5 },
  { name: 'body text on tint', fg: 'ink', bg: 'accentSoft', min: 4.5 },
  { name: 'meaningful border', fg: 'lineStrong', bg: 'ground', min: 3 },
  { name: 'focus ring', fg: 'accent', bg: 'ground', min: 3 },
  { name: 'focus ring on card', fg: 'accent', bg: 'surface', min: 3 },
];
