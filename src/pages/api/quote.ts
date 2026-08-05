import type { APIRoute } from "astro";
import { z } from "zod";
import { quoteSchema } from "../../lib/validations/quoteSchema";
import { quoteMail, resend } from "../../lib/resend";

export const prerender = false;

const json = (data: unknown, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: { "Content-Type": "application/json" },
});

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
  try {
    const { error } = await resend.emails.send({
      from: quoteMail.from,
      to: [quoteMail.to],
      replyTo: email,
      subject: `New quote request from ${fullName}`,
      text: `New moving quote request\n\nName: ${fullName}\nPhone: ${phone}\nEmail: ${email}\nFrom: ${originCity}\nTo: ${destinationCity}\nMoving date: ${moveDate}\nMove size: ${homeSize}\nSubmitted: ${submittedAt}`,
      html: `<h1>New moving quote request</h1><p><strong>Name:</strong> ${fullName}</p><p><strong>Phone:</strong> ${phone}</p><p><strong>Email:</strong> ${email}</p><p><strong>From:</strong> ${originCity}</p><p><strong>To:</strong> ${destinationCity}</p><p><strong>Moving date:</strong> ${moveDate}</p><p><strong>Move size:</strong> ${homeSize}</p><p>Submitted: ${submittedAt}</p>`,
    });
    if (error) return json({ ok: false, message: "Email could not be sent." }, 502);
    return json({ ok: true });
  } catch {
    return json({ ok: false, message: "Unexpected server error." }, 500);
  }
};
