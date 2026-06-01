import { Resend } from "resend";

/**
 * Lazily creates a Resend client from env vars. Never hardcode keys.
 * Returns null when RESEND_API_KEY is missing so the API route can respond
 * gracefully in mock / local mode instead of crashing.
 */
export function getResendClient(): Resend | null {
  const apiKey = import.meta.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

export const quoteMail = {
  to: import.meta.env.QUOTE_TO_EMAIL ?? "hello@proelitemovers.com",
  from: import.meta.env.QUOTE_FROM_EMAIL ?? "ProElite Movers <quotes@proelitemovers.com>",
};
