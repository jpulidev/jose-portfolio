import { describe, expect, it } from 'vitest';
import { parseProjectName, slugify, tagKey } from './slug';

describe('slugify', () => {
  it('lowercases and hyphenates', () => {
    expect(slugify('Concrete Pump Supply')).toBe('concrete-pump-supply');
    expect(slugify('DeWALT')).toBe('dewalt');
  });

  it('drops apostrophes instead of turning them into separators', () => {
    // The whole reason this function exists rather than a generic slugifier:
    // "Pet's Table" must not become pet-s-table.
    expect(slugify("Pet's Table")).toBe('pets-table');
    expect(slugify('Pet’s Table')).toBe('pets-table');
  });

  it('strips accents', () => {
    expect(slugify('Ávila Bistró')).toBe('avila-bistro');
  });

  it('collapses runs of punctuation and trims edges', () => {
    expect(slugify('  Hello --- World!!  ')).toBe('hello-world');
    expect(slugify('Node.js')).toBe('node-js');
  });

  it('tolerates strings with nothing slug-worthy', () => {
    expect(slugify('!!!')).toBe('');
    expect(slugify('')).toBe('');
  });
});

describe('parseProjectName', () => {
  it('splits an embedded design credit out of the name', () => {
    expect(parseProjectName('Kairos (Design by DBL Media)')).toEqual({
      name: 'Kairos',
      designCredit: 'DBL Media',
    });
    expect(parseProjectName('Quality Lawyers (Design by Testhink)')).toEqual({
      name: 'Quality Lawyers',
      designCredit: 'Testhink',
    });
  });

  it('leaves names without a credit alone', () => {
    expect(parseProjectName('Supergoop')).toEqual({
      name: 'Supergoop',
      designCredit: null,
    });
  });

  it('trims the stray whitespace present in the dataset', () => {
    // The CMS really does hold "Chameleon " with a trailing space.
    expect(parseProjectName('Chameleon ').name).toBe('Chameleon');
  });

  it('keeps a parenthetical as the credit even without the "Design by" prefix', () => {
    expect(parseProjectName('Thing (Someone Else)')).toEqual({
      name: 'Thing',
      designCredit: 'Someone Else',
    });
  });

  it('never returns an empty name', () => {
    // A name that is *only* a parenthetical would otherwise slug to nothing.
    expect(parseProjectName('(Design by DBL Media)').name).toBe(
      '(Design by DBL Media)',
    );
  });

  it('handles null and undefined', () => {
    expect(parseProjectName(null)).toEqual({ name: '', designCredit: null });
    expect(parseProjectName(undefined)).toEqual({
      name: '',
      designCredit: null,
    });
  });
});

describe('tagKey', () => {
  it('merges the .js spelling variants the dataset contains', () => {
    expect(tagKey('React')).toBe(tagKey('React.js'));
    expect(tagKey('Node')).toBe(tagKey('Node.js'));
  });

  it('is case-insensitive', () => {
    expect(tagKey('shopify')).toBe(tagKey('Shopify'));
  });

  it('keeps genuinely different tags apart', () => {
    expect(tagKey('React')).not.toBe(tagKey('Redux'));
    expect(tagKey('CSS')).not.toBe(tagKey('HTML5'));
  });
});
