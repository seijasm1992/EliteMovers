import type { GuaranteeContent } from "../types/content";

/** "The Elite Guarantee" section. `icon` keys map to inline SVGs in Icon.astro. */
export const guarantee: GuaranteeContent = {
  eyebrow: "Why ProElite",
  title: "The Elite Guarantee",
  subtitle:
    "The standard we set before your move — and the standard we uphold when it matters most.",
  cards: [
    {
      id: "hourly-rate",
      icon: "tag",
      title: "Honest Hourly Rate",
      description:
        "You pay only for the time your move actually takes. Our crew works efficiently and never stretches the clock — just honest hourly pricing with no hidden fees.",
    },
    {
      id: "protection",
      icon: "shield",
      title: "Full Protection Coverage",
      description:
        "Every item is custom-wrapped and covered from door to door. Furniture, artwork, antiques — protected beyond the standard blanket wrap.",
    },
    {
      id: "crew",
      icon: "badge",
      title: "Background-Checked Crew",
      description:
        "Every mover is carefully selected, professionally trained, and arrives in Elite uniform. Your crew is assigned in advance — no random day-laborers.",
    },
  ],
};
