import { Resend } from "resend";
import {
  QUOTE_FROM_EMAIL,
  QUOTE_TO_EMAIL,
  RESEND_API_KEY,
} from "astro:env/server";

export const resend = new Resend(RESEND_API_KEY);

export const quoteMail = {
  to: QUOTE_TO_EMAIL,
  from: QUOTE_FROM_EMAIL,
};
