'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { submitContact, type ContactState } from '@/app/contact/actions';

const initial: ContactState = { status: 'idle' };

/**
 * The contact form.
 *
 * Built on a server action, so it submits and validates without JavaScript —
 * `useActionState` progressively enhances it rather than being required for it
 * to work.
 *
 * Errors are wired to their fields with `aria-describedby` and `aria-invalid`,
 * and the status message is a live region, so a screen reader hears the result
 * instead of only seeing it.
 */
export function ContactForm({ renderedAt }: { renderedAt: number }) {
  const [state, formAction] = useActionState(submitContact, initial);

  if (state.status === 'success') {
    return (
      <p
        role="status"
        className="mt-8 rounded-xl border border-accent bg-accent-soft p-5"
      >
        {state.message}
      </p>
    );
  }

  return (
    <form action={formAction} className="mt-8 grid gap-5" noValidate>
      <input type="hidden" name="renderedAt" value={renderedAt} />

      {/* Honeypot. Hidden from people, tempting to naive bots. Kept out of the
       * tab order and hidden from assistive tech rather than display:none,
       * which some bots detect. */}
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <Field
        name="name"
        label="Your name"
        autoComplete="name"
        defaultValue={state.values?.name}
        error={state.errors?.name}
      />
      <Field
        name="email"
        label="Email"
        type="email"
        autoComplete="email"
        defaultValue={state.values?.email}
        error={state.errors?.email}
      />
      <Field
        name="message"
        label="What are you building?"
        multiline
        defaultValue={state.values?.message}
        error={state.errors?.message}
      />

      {state.status === 'error' && state.message ? (
        <p role="alert" className="text-step--1 text-accent">
          {state.message}
        </p>
      ) : null}

      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="font-display justify-self-start rounded-full bg-accent px-5 py-3 font-medium text-accent-ink disabled:opacity-60"
    >
      {pending ? 'Sending…' : 'Send message'}
    </button>
  );
}

function Field({
  name,
  label,
  type = 'text',
  multiline = false,
  autoComplete,
  defaultValue,
  error,
}: {
  name: string;
  label: string;
  type?: string;
  multiline?: boolean;
  autoComplete?: string;
  defaultValue?: string;
  error?: string;
}) {
  const errorId = `${name}-error`;
  const shared = {
    id: name,
    name,
    defaultValue,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error ? errorId : undefined,
    className:
      'w-full rounded-lg border border-line-strong bg-ground px-3.5 py-2.5 text-step-0',
  } as const;

  return (
    <div className="grid gap-1.5">
      <label htmlFor={name} className="font-display text-step--1 font-medium">
        {label}
      </label>
      {multiline ? (
        <textarea {...shared} rows={6} />
      ) : (
        <input {...shared} type={type} autoComplete={autoComplete} />
      )}
      {error ? (
        <p id={errorId} className="text-step--1 text-accent">
          {error}
        </p>
      ) : null}
    </div>
  );
}
