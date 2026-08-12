import type { APIRoute } from "astro";
import { ENABLE_TURNSTILE, getSecret } from "astro:env/server";
import { z } from "zod";
import { quoteSchema } from "../../lib/validations/quoteSchema";
import { getQuoteEmailClient, getQuoteMail } from "../../lib/resend";

export const prerender = false;

const quoteSubmissionSchema = quoteSchema.extend({
  turnstileToken: z.string().trim().max(4096).optional(),
});

const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

const verifyTurnstileToken = async (token: string, secretKey: string, remoteIp: string | null) => {
  const body = new FormData();
  body.append("secret", secretKey);
  body.append("response", token);
  if (remoteIp) body.append("remoteip", remoteIp);
  try {
    const response = await fetch(TURNSTILE_VERIFY_URL, { method: "POST", body });
    if (!response.ok) return false;
    const outcome = await response.json() as { success?: boolean };
    return outcome.success === true;
  } catch {
    return false;
  }
};

const json = (data: unknown, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: {
    "Cache-Control": "no-store",
    "Content-Type": "application/json; charset=utf-8",
    "X-Content-Type-Options": "nosniff",
  },
});

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (character) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
})[character] ?? character);

export const POST: APIRoute = async ({ request }) => {
  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return json({ ok: false, message: "Invalid request body." }, 400);
  }

  const parsed = quoteSubmissionSchema.safeParse(rawBody);
  if (!parsed.success) {
    return json({ ok: false, errors: z.flattenError(parsed.error).fieldErrors }, 422);
  }

  if (ENABLE_TURNSTILE) {
    const secretKey = getSecret("TURNSTILE_SECRET_KEY")?.trim();
    if (!secretKey) {
      return json({ ok: false, message: "Security check is not configured." }, 503);
    }
    const token = parsed.data.turnstileToken?.trim();
    if (!token) {
      return json({ ok: false, message: "Security check failed. Please try again." }, 403);
    }
    const remoteIp = request.headers.get("CF-Connecting-IP");
    const isHuman = await verifyTurnstileToken(token, secretKey, remoteIp);
    if (!isHuman) {
      return json({ ok: false, message: "Security check failed. Please try again." }, 403);
    }
  }

  const { originCity, destinationCity, moveDate, homeSize, fullName, phone, email } = parsed.data;
  const resend = getQuoteEmailClient();
  if (!resend) {
    return json({ ok: false, message: "Quote email service is not configured." }, 503);
  }

  const quoteMail = getQuoteMail();
  const submittedAt = new Date().toLocaleString("en-US", { timeZone: "America/New_York" });
  const safe = {
    originCity: escapeHtml(originCity),
    destinationCity: escapeHtml(destinationCity),
    moveDate: escapeHtml(moveDate),
    homeSize: escapeHtml(homeSize),
    fullName: escapeHtml(fullName),
    phone: escapeHtml(phone),
    email: escapeHtml(email),
    submittedAt: escapeHtml(submittedAt),
  };

  try {
    const { error } = await resend.emails.send({
      from: quoteMail.from,
      to: [quoteMail.to],
      replyTo: email,
      subject: `New quote request from ${fullName}`,
      text: `New moving quote request\n\nName: ${fullName}\nPhone: ${phone}\nEmail: ${email}\nFrom: ${originCity}\nTo: ${destinationCity}\nMoving date: ${moveDate}\nMove size: ${homeSize}\nSubmitted: ${submittedAt}`,
      html: `<h1>New moving quote request</h1><p><strong>Name:</strong> ${safe.fullName}</p><p><strong>Phone:</strong> ${safe.phone}</p><p><strong>Email:</strong> ${safe.email}</p><p><strong>From:</strong> ${safe.originCity}</p><p><strong>To:</strong> ${safe.destinationCity}</p><p><strong>Moving date:</strong> ${safe.moveDate}</p><p><strong>Move size:</strong> ${safe.homeSize}</p><p>Submitted: ${safe.submittedAt}</p>`,
    });
    if (error) return json({ ok: false, message: "Email could not be sent." }, 502);
    return json({ ok: true });
  } catch {
    return json({ ok: false, message: "Unexpected server error." }, 500);
  }
};
