import type { SiteConfig } from "../types/content";

const phone = "+1 (786) 281-7825";

/** Global brand + contact config. Replace with Sanity `siteSettings` document later. */
export const site: SiteConfig = {
  name: "ProElite Movers",
  legalName: "PROELITE MOVING LLC",
  wordmark: { primary: "ProElite", secondary: "Movers" },
  phone,
  phoneHref: `tel:+${phone.replace(/\D/g, "")}`,
  email: "info@proelitemovers.com",
  location: "Miami, FL",
  description:
    "Local and long-distance moving in Miami with hourly billing only: clear rates, full protection, and a background-checked crew.",
};
