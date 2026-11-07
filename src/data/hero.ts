import type { HeroContent } from "../types/content";
import { site } from "./site";

/** Hero content. Replace with Sanity `hero` document later. */
export const hero: HeroContent = {
  eyebrow: "Local and Long-Distance Moving",
  title: "Miami Movers Who Come Prepared",
  description:
    "Our crew moves apartments, homes, and offices with transparent hourly billing and protection for your furniture and property.",
  primaryCta: { label: "Request a Quote", href: "/get-a-quote/" },
  secondaryCta: { label: "Call Now", href: site.phoneHref },
};
