import type { SiteConfig } from "../types/content";

/** Global brand + contact config. Replace with Sanity `siteSettings` document later. */
export const site: SiteConfig = {
  name: "ProElite Movers",
  wordmark: { primary: "ProElite", secondary: "Movers" },
  phone: "+1 (407) 984-9218",
  phoneHref: "tel:+14079849218",
  email: "info@proelitemovers.com",
  address: "1050 SW 70th Ave, Miami, FL 33144",
  addressHref:
    "https://www.google.com/maps/search/?api=1&query=1050+SW+70th+Ave,+Miami,+FL+33144",
  description:
    "Local and long-distance moving in Miami with hourly billing only: clear rates, full protection, and a background-checked crew.",
};
