import type { APIRoute } from "astro";
import { z } from "zod";
import { quoteSchema } from "../../lib/validations/quoteSchema";
import { quoteMail, resend } from "../../lib/resend";

export const prerender = false;

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

  const parsed = quoteSchema.safeParse(rawBody);
  if (!parsed.success) {
    return json({ ok: false, errors: z.flattenError(parsed.error).fieldErrors }, 422);
  }

  const { originCity, destinationCity, moveDate, homeSize, fullName, phone, email } = parsed.data;
  const submittedAt = new Date().toLocaleString("en-US", { timeZone: "America/New_York" });
  const safe = {
    destinationCity: escapeHtml(destinationCity),
    email: escapeHtml(email),
    fullName: escapeHtml(fullName),
    homeSize: escapeHtml(homeSize),
    moveDate: escapeHtml(moveDate),
    originCity: escapeHtml(originCity),
    phone: escapeHtml(phone),
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
