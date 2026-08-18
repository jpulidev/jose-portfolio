import { describe, expect, it } from 'vitest';
import {
  isEmailShaped,
  looksAutomated,
  validateContact,
  type ContactInput,
} from './contact';

const RENDERED = 1_700_000_000_000;
const LATER = RENDERED + 10_000;

function input(overrides: Partial<ContactInput> = {}): ContactInput {
  return {
    name: 'Ana Rivas',
    email: 'ana@example.com',
    message: 'I need a Shopify migration for our store.',
    website: '',
    renderedAt: String(RENDERED),
    ...overrides,
  };
}

describe('isEmailShaped', () => {
  it('accepts ordinary addresses', () => {
    for (const value of [
      'ana@example.com',
      'a@b.co',
      'first.last+tag@sub.domain.org',
    ]) {
      expect(isEmailShaped(value), value).toBe(true);
    }
  });

  it('rejects what cannot be deliverable', () => {
    for (const value of [
      '',
      'no-at-sign',
      '@example.com',
      'two@@example.com',
      'ana@example',
      'ana@.com',
      'ana@example.',
      'has space@example.com',
    ]) {
      expect(isEmailShaped(value), value).toBe(false);
    }
  });
});

describe('validateContact', () => {
  it('accepts a complete submission and trims it', () => {
    const result = validateContact(
      input({ name: '  Ana  ', email: ' ana@example.com ' }),
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.name).toBe('Ana');
      expect(result.value.email).toBe('ana@example.com');
    }
  });

  it('reports every missing field at once, not one at a time', () => {
    const result = validateContact(input({ name: '', email: '', message: '' }));
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(Object.keys(result.errors).sort()).toEqual([
        'email',
        'message',
        'name',
      ]);
    }
  });

  it('rejects a message too short to act on', () => {
    const result = validateContact(input({ message: 'hi' }));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.message).toBeTruthy();
  });

  it('rejects oversized fields', () => {
    expect(validateContact(input({ name: 'a'.repeat(101) })).ok).toBe(false);
    expect(validateContact(input({ message: 'a'.repeat(5001) })).ok).toBe(
      false,
    );
  });

  it('treats whitespace-only input as empty', () => {
    const result = validateContact(input({ name: '   ' }));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.name).toBeTruthy();
  });
});

describe('looksAutomated', () => {
  it('passes a normal submission', () => {
    expect(looksAutomated(input(), LATER)).toBe(false);
  });

  it('catches anything that fills the honeypot', () => {
    expect(
      looksAutomated(input({ website: 'http://spam.example' }), LATER),
    ).toBe(true);
    // Whitespace in the honeypot is still empty.
    expect(looksAutomated(input({ website: '   ' }), LATER)).toBe(false);
  });

  it('catches submissions faster than a person could type', () => {
    expect(looksAutomated(input(), RENDERED + 500)).toBe(true);
    expect(looksAutomated(input(), RENDERED + 2999)).toBe(true);
    expect(looksAutomated(input(), RENDERED + 3001)).toBe(false);
  });

  it('rejects a stale or replayed timestamp', () => {
    const dayLater = RENDERED + 24 * 60 * 60 * 1000 + 1;
    expect(looksAutomated(input(), dayLater)).toBe(true);
    // A timestamp from the future is nonsense too.
    expect(looksAutomated(input({ renderedAt: String(LATER) }), RENDERED)).toBe(
      true,
    );
  });

  it('rejects a missing or unparseable timestamp', () => {
    expect(looksAutomated(input({ renderedAt: '' }), LATER)).toBe(true);
    expect(looksAutomated(input({ renderedAt: 'abc' }), LATER)).toBe(true);
  });
});
