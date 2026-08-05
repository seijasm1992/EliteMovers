import type { HeroContent } from "../types/content";

/** Hero content + background slider. Replace with Sanity `hero` document later. */
export const hero: HeroContent = {
  eyebrow: "Local and Long-Distance Moving",
  title: "Miami Movers Who Come Prepared",
  description:
    "Our crew moves apartments, homes, and offices with hourly pricing and protection for your furniture and property.",
  primaryCta: { label: "Request a Quote", href: "/get-a-quote/" },
  secondaryCta: { label: "Call Now", href: "tel:+13055550199" },
  rating: {
    score: "4.9",
    reviewsLabel: "Based on 500+ reviews",
  },
  slides: [
    { src: "/1M.jpg", alt: "ProElite crew loading a moving truck" },
    { src: "/2M.jpg", alt: "Moving crew wrapping furniture for transport" },
    { src: "/3M.jpg", alt: "Moving truck ready for a long-distance relocation" },
    { src: "/4M.jpg", alt: "Uniformed mover carrying protected boxes" },
  ],
};
