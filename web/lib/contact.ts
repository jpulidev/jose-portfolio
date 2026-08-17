/**
 * Contact form validation and spam heuristics.
 *
 * Pure functions, no framework — the server action in `app/contact/actions.ts`
 * calls these, and they are unit-tested directly. Validation lives on the
 * server because client-side checks are a convenience, not a control: anything
 * can POST to the action.
 */

export type ContactInput = {
  name: string;
  email: string;
  message: string;
  /** Hidden field. Real people leave it empty; many bots fill everything. */
  website: string;
  /** When the form was rendered, as epoch ms. */
  renderedAt: string;
};

export type FieldErrors = Partial<Record<'name' | 'email' | 'message', string>>;

export type ValidationResult =
  | { ok: true; value: { name: string; email: string; message: string } }
  | { ok: false; errors: FieldErrors };

const MAX = { name: 100, email: 200, message: 5000 };
const MIN_MESSAGE = 10;

/**
 * Deliberately permissive. The only thing worth rejecting is an address that
 * cannot possibly be deliverable — anything stricter starts refusing valid
 * addresses, and the real check is whether the reply arrives.
 */
export function isEmailShaped(value: string): boolean {
  const trimmed = value.trim();
  if (trimmed.length < 3 || trimmed.length > MAX.email) return false;
  if (/\s/.test(trimmed)) return false;
  const at = trimmed.indexOf('@');
  if (at < 1 || at !== trimmed.lastIndexOf('@')) return false;
  const domain = trimmed.slice(at + 1);
  return (
    domain.includes('.') && !domain.startsWith('.') && !domain.endsWith('.')
  );
}

export function validateContact(input: ContactInput): ValidationResult {
  const name = input.name?.trim() ?? '';
  const email = input.email?.trim() ?? '';
  const message = input.message?.trim() ?? '';
  const errors: FieldErrors = {};

  if (!name) errors.name = 'Please add your name.';
  else if (name.length > MAX.name) errors.name = 'That name is too long.';

  if (!email) errors.email = 'Please add an email address so I can reply.';
  else if (!isEmailShaped(email))
    errors.email = "That doesn't look like an email address.";

  if (!message) errors.message = 'Please add a message.';
  else if (message.length < MIN_MESSAGE)
    errors.message = 'Could you add a little more detail?';
  else if (message.length > MAX.message)
    errors.message = 'That message is too long — email me directly instead.';

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, value: { name, email, message } };
}

/**
 * Two cheap signals, no third-party captcha.
 *
 * A captcha would mean loading someone else's script, sending visitors'
 * behaviour to it, and making a keyboard user solve a puzzle to say hello. For
 * the volume a personal site sees, a honeypot plus a minimum fill time catches
 * effectively all of it.
 */
export function looksAutomated(
  input: ContactInput,
  now: number = Date.now(),
): boolean {
  // Honeypot: hidden from people, irresistible to naive bots.
  if (input.website?.trim()) return true;

  const renderedAt = Number(input.renderedAt);
  if (!Number.isFinite(renderedAt)) return true;

  const elapsed = now - renderedAt;
  // Submitted implausibly fast, or with a timestamp from the future.
  if (elapsed < 3000) return true;
  // Stale form — a page left open for a day, or a replayed timestamp.
  if (elapsed > 24 * 60 * 60 * 1000) return true;

  return false;
}
