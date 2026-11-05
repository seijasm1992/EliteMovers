import { Resend } from "resend";
import { getSecret } from "astro:env/server";
import { site } from "../data/site";

const DEFAULT_TO_EMAIL = site.email;
const DEFAULT_FROM_EMAIL = `${site.name} <quotes@proelitemovers.com>`;

export const getQuoteEmailClient = () => {
  const apiKey = getSecret("RESEND_API_KEY")?.trim();
  return apiKey ? new Resend(apiKey) : null;
};

export const getQuoteMail = () => ({
  to: getSecret("QUOTE_TO_EMAIL")?.trim() || DEFAULT_TO_EMAIL,
  from: getSecret("QUOTE_FROM_EMAIL")?.trim() || DEFAULT_FROM_EMAIL,
});
