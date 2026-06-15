import type { APIRoute } from "astro";
import { z } from "zod";
import { quoteSchema } from "../../lib/validations/quoteSchema";
import { quoteMail, resend } from "../../lib/resend";

// On-demand (server) route — the rest of the site stays static.
export const prerender = false;

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });

function renderEmail(d: Record<string, unknown>): string {
  const row = (label: string, value: unknown) =>
    value ? `<tr><td style="padding:4px 12px 4px 0;color:#424242">${label}</td><td style="padding:4px 0;font-weight:600;color:#111">${value}</td></tr>` : "";
  return `
    <div style="font-family:Inter,Arial,sans-serif;color:#111">
      <h2 style="margin:0 0 12px">New Quote Request</h2>
      <table style="border-collapse:collapse;font-size:14px">
        ${row("Name", d.fullName)}
        ${row("Email", d.email)}
        ${row("Phone", d.phone)}
        ${row("Move type", d.moveType)}
        ${row("Origin city", d.originCity)}
        ${row("Destination city", d.destinationCity)}
        ${row("Estimated date", d.moveDate)}
        ${row("Move size", d.homeSize)}
        ${row("Contact preference", d.contactPreference)}
        ${row("Message", d.message)}
      </table>
    </div>`;
}

export const POST: APIRoute = async ({ request }) => {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return json({ ok: false, message: "Invalid request body." }, 400);
  }

  const parsed = quoteSchema.safeParse(payload);
  if (!parsed.success) {
    return json(
      {
        ok: false,
        message: "Please review the highlighted fields.",
        errors: z.flattenError(parsed.error).fieldErrors,
      },
      422,
    );
  }

  const data = parsed.data;

  try {
    const { error } = await resend.emails.send({
      from: quoteMail.from,
      to: [quoteMail.to],
      replyTo: data.email,
      subject: `New quote request — ${data.fullName}`,
      html: renderEmail(data),
    });
    if (error) {
      console.error("[quote] Resend error:", error);
      return json({ ok: false, message: "Email could not be sent." }, 502);
    }
    return json({ ok: true, message: "Quote received." });
  } catch (err) {
    console.error("[quote] Unexpected error:", err);
    return json({ ok: false, message: "Unexpected server error." }, 500);
  }
};
