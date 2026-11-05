import type { HeroContent } from "../types/content";

/** Hero content + background slider. Replace with Sanity `hero` document later. */
export const hero: HeroContent = {
  eyebrow: "Local and Long-Distance Moving",
  title: "Miami Movers Who Come Prepared",
  description:
    "Our crew moves apartments, homes, and offices with transparent hourly billing and protection for your furniture and property.",
  primaryCta: { label: "Request a Quote", href: "/get-a-quote/" },
  secondaryCta: { label: "Call Now", href: "tel:+14079849218" },
  rating: {
    score: "4.9",
    reviewsLabel: "Based on 500+ reviews",
  },
  slides: [
    { src: "/2M.jpg", alt: "Moving crew wrapping furniture for transport" },
  ],
};
