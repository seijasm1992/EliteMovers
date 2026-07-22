import type { APIRoute } from "astro";
import { z } from "zod";
import { quoteSchema, type QuoteFormValues } from "../../lib/validations/quoteSchema";
import { quoteMail, resend } from "../../lib/resend";
import {
  ENABLE_TURNSTILE,
  TURNSTILE_SECRET_KEY,
} from "astro:env/server";

// On-demand (server) route — the rest of the site stays static.
export const prerender = false;

// ── Helpers ──────────────────────────────────────────────────────────────────

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });

// ── Turnstile ─────────────────────────────────────────────────────────────────

async function verifyTurnstile(
  token: string | undefined,
  clientIp: string | null,
): Promise<boolean> {
  if (!token || !TURNSTILE_SECRET_KEY) {
    console.warn("[turnstile] Missing token or secret key — verification skipped");
    return false;
  }
  try {
    const body = new URLSearchParams({ secret: TURNSTILE_SECRET_KEY, response: token });
    if (clientIp) body.set("remoteip", clientIp);
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body,
    });
    const data = (await res.json()) as { success: boolean; "error-codes"?: string[] };
    if (!data.success) {
      console.warn("[turnstile] Verification failed:", data["error-codes"]);
    }
    return data.success;
  } catch (err) {
    console.error("[turnstile] Unexpected error during verification:", err);
    return false;
  }
}

// ── Email template ────────────────────────────────────────────────────────────

const BRAND = {
  green: "#00704C",
  gold: "#FFD84D",
  ink: "#111111",
  muted: "#424242",
  border: "#00704C",
  bg: "#DEDEDE",
  lightText: "#DEDEDE",
  white: "#FFFFFF",
};

function labelMap(key: string): string {
  const map: Record<string, string> = {
    fullName: "Full Name",
    email: "Email",
    phone: "Phone",
    moveType: "Move Type",
    originCity: "Origin City",
    destinationCity: "Destination City",
    moveDate: "Estimated Date",
    homeSize: "Move Size",
    contactPreference: "Contact Preference",
    message: "Additional Message",
  };
  return map[key] ?? key;
}

function formatMoveType(val: string): string {
  const map: Record<string, string> = {
    local: "Local Move",
    "long-distance": "Long Distance Move",
    office: "Office Move",
    commercial: "Commercial Move",
    small: "Small Move",
    large: "Large Move",
  };
  return map[val] ?? val;
}

function formatHomeSize(val: string): string {
  const map: Record<string, string> = {
    studio: "Studio",
    "1-bed": "1 Bedroom",
    "2-bed": "2 Bedrooms",
    "3-bed": "3 Bedrooms",
    "4-bed-plus": "4+ Bedrooms",
    office: "Office / Commercial",
  };
  return map[val] ?? val;
}

function formatContactPref(val: string): string {
  const map: Record<string, string> = {
    phone: "Phone call",
    email: "Email",
    text: "Text message",
    any: "No preference",
  };
  return map[val] ?? val;
}

function row(label: string, value: string): string {
  return `
    <tr>
      <td style="padding:8px 16px 8px 0;color:${BRAND.muted};font-size:13px;white-space:nowrap;vertical-align:top;width:160px;">${label}</td>
      <td style="padding:8px 0;color:${BRAND.ink};font-size:13px;font-weight:600;vertical-align:top;">${value}</td>
    </tr>`;
}

function section(title: string, rows: string): string {
  return `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
      <tr>
        <td style="padding-bottom:8px;">
          <p style="margin:0;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.2px;color:${BRAND.muted};">${title}</p>
        </td>
      </tr>
      <tr>
        <td style="background:${BRAND.white};border:1px solid ${BRAND.border};border-radius:8px;padding:4px 16px;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            ${rows}
          </table>
        </td>
      </tr>
    </table>`;
}

function buildHtml(d: QuoteFormValues, submittedAt: string): string {
  const contactRows = [
    row(labelMap("fullName"), d.fullName),
    row(labelMap("email"), `<a href="mailto:${d.email}" style="color:${BRAND.green};text-decoration:none;">${d.email}</a>`),
    row(labelMap("phone"), `<a href="tel:${d.phone}" style="color:${BRAND.green};text-decoration:none;">${d.phone}</a>`),
    row(labelMap("contactPreference"), formatContactPref(d.contactPreference)),
  ].join("");

  const moveRows = [
    row(labelMap("moveType"), formatMoveType(d.moveType)),
    row(labelMap("homeSize"), formatHomeSize(d.homeSize)),
    row(labelMap("originCity"), d.originCity),
    row(labelMap("destinationCity"), d.destinationCity),
    row(labelMap("moveDate"), new Date(d.moveDate + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })),
  ].join("");

  const notesSection = d.message
    ? section(
        "Additional Notes",
        `<tr><td style="padding:12px 0;color:${BRAND.ink};font-size:13px;line-height:1.6;white-space:pre-wrap;">${d.message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</td></tr>`,
      )
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>New Quote Request — ProElite Movers</title>
</head>
<body style="margin:0;padding:0;background:${BRAND.bg};font-family:Inter,Arial,Helvetica,sans-serif;-webkit-font-smoothing:antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${BRAND.bg}">
    <tr>
      <td align="center" style="padding:32px 16px;">

        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">

          <!-- ── Header ───────────────────────────────────────────────── -->
          <tr>
            <td bgcolor="${BRAND.ink}" style="padding:28px 32px;border-radius:12px 12px 0 0;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <p style="margin:0;font-size:22px;font-weight:800;color:${BRAND.white};letter-spacing:-0.5px;">
                      ⚡ ProElite Movers
                    </p>
                    <p style="margin:4px 0 0;font-size:11px;color:${BRAND.lightText};text-transform:uppercase;letter-spacing:1.2px;">
                      Moving Quote Request
                    </p>
                  </td>
                  <td align="right" style="vertical-align:middle;">
                    <span style="display:inline-block;background:${BRAND.gold};color:${BRAND.ink};padding:5px 14px;border-radius:20px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">
                      Action Required
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ── Alert banner ──────────────────────────────────────────── -->
          <tr>
            <td bgcolor="${BRAND.green}" style="padding:12px 32px;">
              <p style="margin:0;font-size:13px;font-weight:600;color:${BRAND.white};">
                📋 A new moving quote was submitted via your website. Please follow up within 24 hours.
              </p>
            </td>
          </tr>

          <!-- ── Body ─────────────────────────────────────────────────── -->
          <tr>
            <td bgcolor="${BRAND.white}" style="padding:32px;border-left:1px solid ${BRAND.border};border-right:1px solid ${BRAND.border};">

              ${section("Contact Information", contactRows)}
              ${section("Move Details", moveRows)}
              ${notesSection}

              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:8px;">
                <tr>
                  <td align="center" style="padding:20px;background:${BRAND.bg};border-radius:8px;border:1px solid ${BRAND.border};">
                    <p style="margin:0 0 12px;font-size:13px;color:${BRAND.muted};">Reply directly to this email to reach the client</p>
                    <a href="mailto:${d.email}?subject=Your Moving Quote — ProElite Movers&body=Hi ${encodeURIComponent(d.fullName)}," style="display:inline-block;background:${BRAND.green};color:${BRAND.white};padding:10px 24px;border-radius:8px;font-size:13px;font-weight:700;text-decoration:none;letter-spacing:0.3px;">
                      Reply to ${d.fullName}
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- ── Footer ───────────────────────────────────────────────── -->
          <tr>
            <td bgcolor="${BRAND.bg}" style="padding:16px 32px;border:1px solid ${BRAND.border};border-top:none;border-radius:0 0 12px 12px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <p style="margin:0;font-size:11px;color:${BRAND.muted};">
                      Submitted via <strong style="color:${BRAND.muted};">proelitemovers.com</strong> · ${submittedAt}
                    </p>
                  </td>
                  <td align="right">
                    <p style="margin:0;font-size:11px;color:${BRAND.muted};">Source: Website quote form</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buildText(d: QuoteFormValues, submittedAt: string): string {
  const sep = "─".repeat(50);
  return [
    "NEW MOVING QUOTE REQUEST — ProElite Movers",
    sep,
    "",
    "CONTACT INFORMATION",
    `Name:               ${d.fullName}`,
    `Email:              ${d.email}`,
    `Phone:              ${d.phone}`,
    `Contact preference: ${formatContactPref(d.contactPreference)}`,
    "",
    "MOVE DETAILS",
    `Move type:          ${formatMoveType(d.moveType)}`,
    `Move size:          ${formatHomeSize(d.homeSize)}`,
    `Origin city:        ${d.originCity}`,
    `Destination city:   ${d.destinationCity}`,
    `Estimated date:     ${d.moveDate}`,
    "",
    ...(d.message ? ["ADDITIONAL NOTES", d.message, ""] : []),
    sep,
    `Submitted: ${submittedAt}`,
    "Source: proelitemovers.com website quote form",
  ].join("\n");
}

// ── Route handler ─────────────────────────────────────────────────────────────

export const POST: APIRoute = async ({ request }) => {
  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return json({ ok: false, message: "Invalid request body." }, 400);
  }

  const { turnstileToken, ...formData } = rawBody as Record<string, unknown> & {
    turnstileToken?: string;
  };

  const parsed = quoteSchema.safeParse(formData);
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

  if (ENABLE_TURNSTILE) {
    const clientIp =
      request.headers.get("CF-Connecting-IP") ??
      request.headers.get("X-Forwarded-For") ??
      null;
    const verified = await verifyTurnstile(turnstileToken, clientIp);
    if (!verified) {
      return json(
        { ok: false, message: "Human verification failed. Please complete the security check and try again." },
        403,
      );
    }
  } else {
    console.info("[quote] Turnstile verification skipped (ENABLE_TURNSTILE=false)");
  }

  const data = parsed.data;

  const submittedAt = new Date().toLocaleString("en-US", {
    timeZone: "America/New_York",
    dateStyle: "full",
    timeStyle: "short",
  });

  try {
    const { error } = await resend.emails.send({
      from: quoteMail.from,
      to: [quoteMail.to],
      replyTo: data.email,
      subject: `New quote request from ${data.fullName} — ProElite Movers`,
      html: buildHtml(data, submittedAt),
      text: buildText(data, submittedAt),
    });

    if (error) {
      console.error("[quote] Resend error:", error);
      return json({ ok: false, message: "Email could not be sent. Please try again shortly." }, 502);
    }

    console.info(`[quote] Quote sent for ${data.fullName} <${data.email}> → ${quoteMail.to}`);
    return json({ ok: true, message: "Quote received." });
  } catch (err) {
    console.error("[quote] Unexpected error:", err);
    return json({ ok: false, message: "Unexpected server error." }, 500);
  }
};
