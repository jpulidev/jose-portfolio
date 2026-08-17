/**
 * WCAG 2.1 contrast maths.
 *
 * Lives in the app rather than a script because the palette is checked by a
 * test: the old site shipped a contact button at 3.21:1 and a section label at
 * 1.34:1, and the only reliable way to keep that from recurring is to make it a
 * build failure rather than a judgement call.
 */

export type Rgb = { r: number; g: number; b: number };

export function hexToRgb(hex: string): Rgb {
  const clean = hex.replace('#', '').trim();
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) {
    throw new Error(`Not a hex colour: ${hex}`);
  }
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

/** Relative luminance, per WCAG 2.1. */
export function luminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  const channel = (value: number) => {
    const v = value / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/** Contrast ratio between two colours, from 1 to 21. */
export function contrastRatio(a: string, b: string): number {
  const l1 = luminance(a);
  const l2 = luminance(b);
  const [light, dark] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (light + 0.05) / (dark + 0.05);
}

/** Rounded to two decimals, for readable assertions and reports. */
export function ratio(a: string, b: string): number {
  return Math.round(contrastRatio(a, b) * 100) / 100;
}

export const AA_TEXT = 4.5;
/** 24px+, or 18.66px+ bold. */
export const AA_LARGE_TEXT = 3;
/** Borders, icons, focus rings and other non-text indicators. */
export const AA_NON_TEXT = 3;
