'use server';

import { looksAutomated, validateContact } from '@/lib/contact';
import { site } from '@/lib/site';
import type { FieldErrors } from '@/lib/contact';

export type ContactState = {
  status: 'idle' | 'success' | 'error';
  message?: string;
  errors?: FieldErrors;
  /** Echoed back so a rejected submission doesn't wipe what was typed. */
  values?: { name: string; email: string; message: string };
};

/**
 * Handles a contact submission.
 *
 * Delivery goes through Resend's HTTP API with `fetch` rather than their SDK —
 * one less dependency for a single POST.
 *
 * If no API key is configured the action says so plainly instead of pretending
 * to have sent the message. A form that silently swallows enquiries is worse
 * than no form, which is why the page shows the email address either way.
 */
export async function submitContact(
  _previous: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const input = {
    name: String(formData.get('name') ?? ''),
    email: String(formData.get('email') ?? ''),
    message: String(formData.get('message') ?? ''),
    website: String(formData.get('website') ?? ''),
    renderedAt: String(formData.get('renderedAt') ?? ''),
  };

  const values = {
    name: input.name,
    email: input.email,
    message: input.message,
  };

  // Answer a bot exactly as we answer a person: no signal to tune against.
  if (looksAutomated(input)) {
    return { status: 'success', message: "Thanks — I'll be in touch." };
  }

  const result = validateContact(input);
  if (!result.ok) {
    return {
      status: 'error',
      message: 'Please check the fields below.',
      errors: result.errors,
      values,
    };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !from) {
    return {
      status: 'error',
      message: `Sending isn't configured yet — please email ${site.email} directly.`,
      values,
    };
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: site.email,
        // Replying in a mail client should reach the sender, not the site.
        reply_to: result.value.email,
        subject: `Portfolio enquiry from ${result.value.name}`,
        text: [
          `From: ${result.value.name} <${result.value.email}>`,
          '',
          result.value.message,
        ].join('\n'),
      }),
    });

    if (!response.ok) {
      // Log the provider's reason server-side; never show it to the visitor.
      console.error(
        'Resend rejected the message:',
        response.status,
        await response.text().catch(() => ''),
      );
      return {
        status: 'error',
        message: `Something went wrong sending that. Please email ${site.email} directly.`,
        values,
      };
    }
  } catch (error) {
    console.error('Contact send failed:', error);
    return {
      status: 'error',
      message: `Something went wrong sending that. Please email ${site.email} directly.`,
      values,
    };
  }

  return {
    status: 'success',
    message: "Thanks — I'll be in touch.",
  };
}
