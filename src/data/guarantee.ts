import type { GuaranteeContent } from "../types/content";

/** "The Elite Guarantee" section. `icon` keys map to inline SVGs in Icon.astro. */
export const guarantee: GuaranteeContent = {
  eyebrow: "Why ProElite",
  title: "The Elite Guarantee",
  subtitle:
    "What you can expect from the crew assigned to your move, starting with an hourly rate confirmed before move day.",
  cards: [
    {
      id: "hourly-rate",
      icon: "tag",
      title: "Honest Hourly Rate",
      description:
        "We bill by the hour only, with no flat-rate packages. Your rate is confirmed before move day, and you pay for the time the job takes. If anything extra comes up, we discuss it before work begins.",
    },
    {
      id: "protection",
      icon: "shield",
      title: "Furniture and Property Protection",
      description:
        "We wrap furniture and protect floors, doors, and high-traffic areas before loading begins.",
    },
    {
      id: "crew",
      icon: "badge",
      title: "Background-Checked Crew",
      description:
        "Your assigned movers are background checked, trained, and scheduled before move day. They arrive in ProElite uniform.",
    },
  ],
};
