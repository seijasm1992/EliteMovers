import type { HeroContent } from "../types/content";

/** Hero content + background slider. Replace with Sanity `hero` document later. */
export const hero: HeroContent = {
  eyebrow: "Miami's Premium Moving Company",
  title: "Premium Moving Services Without the Stress",
  description:
    "From local moves to long-distance relocations, our trained crew handles every detail with transparent flat-rate pricing, full protection, and a seamless move-day experience.",
  primaryCta: { label: "Get Your Free Quote", href: "#hero-quote" },
  secondaryCta: { label: "Call Now", href: "tel:+13055550199" },
  rating: {
    score: "4.9",
    reviewsLabel: "Based on 500+ reviews",
  },
  slides: [
    { src: "/1M.jpg", alt: "Elite movers carefully loading a moving truck" },
    { src: "/2M.jpg", alt: "Professional crew wrapping furniture for transport" },
    { src: "/3M.jpg", alt: "Moving truck ready for a long-distance relocation" },
    { src: "/4M.jpg", alt: "Uniformed mover carrying protected boxes" },
  ],
};
