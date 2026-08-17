import { describe, expect, it } from 'vitest';
import { composeDescription } from './metadata';

/**
 * Meta descriptions have a useful band: too short wastes the slot, too long gets
 * truncated by the search engine mid-sentence. Both failure modes were real —
 * project pages shipped a 33-character description, then a 229-character one
 * once the summaries were rewritten.
 */
describe('composeDescription', () => {
  const STACK = 'Built with CSS, HTML5, Javascript, Wordpress Site.';
  const FRAMING =
    'One of 24 storefronts built by Jose Pulido, Shopify developer and tech lead.';

  it('pads a short lead until it carries real information', () => {
    const out = composeDescription(
      'Luxat — a handmade design label.',
      STACK,
      FRAMING,
    );
    expect(out.length).toBeGreaterThanOrEqual(80);
    expect(out.length).toBeLessThanOrEqual(200);
    expect(out).toContain('Built with');
  });

  it('stops appending once the description is long enough', () => {
    const lead =
      'Kairos — WordPress site for Kairos Realty Advisors, a real-estate advisory firm. Design by DBL Media.';
    const out = composeDescription(lead, STACK, FRAMING);
    expect(out.length).toBeLessThanOrEqual(200);
    expect(out).toContain(lead);
    // Room for the stack, but not for the framing sentence on top — which is
    // the whole point: stop before overflowing rather than truncate.
    expect(out).toContain('Built with');
    expect(out).not.toContain(FRAMING);
  });

  it('appends nothing to a lead that already fills the slot', () => {
    const lead = 'A'.repeat(150);
    expect(composeDescription(lead, STACK, FRAMING)).toBe(lead);
  });

  it('trims an over-long lead at a word boundary', () => {
    const out = composeDescription('word '.repeat(60));
    expect(out.length).toBeLessThanOrEqual(200);
    expect(out.endsWith('…')).toBe(true);
    // No half-words, and no dangling punctuation before the ellipsis.
    expect(out).not.toMatch(/\s…$/);
  });

  it('skips empty extras', () => {
    const out = composeDescription('Short lead.', '', '  ', FRAMING);
    expect(out).toBe(`Short lead. ${FRAMING}`);
  });

  it('never exceeds the limit for any real project summary', async () => {
    const { PROJECT_SUMMARIES } = await import('./project-copy');
    for (const [slug, summary] of Object.entries(PROJECT_SUMMARIES)) {
      const out = composeDescription(`${slug} — ${summary}`, STACK, FRAMING);
      expect(out.length, `${slug}: ${out.length} chars`).toBeLessThanOrEqual(
        200,
      );
      expect(out.length, `${slug} too short`).toBeGreaterThanOrEqual(80);
    }
  });
});
