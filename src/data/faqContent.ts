import type { FAQItem } from "../types/content";

/**
 * Homepage FAQ content grouped by topic. The component derives its category
 * filters from this array, so new topics do not require component changes.
 */
export const faqContent: FAQItem[] = [
  {
    id: "hourly-billing",
    category: "Pricing & Billing",
    question: "How does hourly billing work?",
    answer:
      "We bill by the hour at the rate confirmed when you book. You pay for the time the job actually takes, with no flat-rate markup. Because we work quickly, most customers pay less than they'd expect from a flat-rate company.",
  },
  {
    id: "deposit",
    category: "Pricing & Billing",
    question: "Do you require a deposit?",
    answer:
      "No. We don't require a deposit or a signed contract to book your move.",
  },
  {
    id: "hidden-fees",
    category: "Pricing & Billing",
    question: "Are there any hidden fees?",
    answer:
      "No. Your hourly rate covers the crew and the truck, and packing materials—moving blankets and industrial wrap—are included at no extra cost.",
  },
  {
    id: "payment-methods",
    category: "Pricing & Billing",
    question: "What forms of payment do you accept?",
    answer:
      "We accept all standard payment methods, including major credit and debit cards, for your convenience.",
  },
  {
    id: "packing-minimum",
    category: "Pricing & Billing",
    question: "Is there a minimum for packing services?",
    answer:
      "Yes, packing is billed hourly with a three-hour minimum, typically scheduled one to two days before your move.",
  },
  {
    id: "booking-window",
    category: "Scheduling",
    question: "How far in advance should I book?",
    answer:
      "We recommend booking one to two weeks ahead for residential moves, and earlier for larger commercial relocations—though we can often accommodate shorter notice.",
  },
  {
    id: "weekends-holidays",
    category: "Scheduling",
    question: "Do you work weekends and holidays?",
    answer:
      "Yes, we're open seven days a week, 7:00 AM–8:00 PM. Reach out to confirm availability around major holidays.",
  },
  {
    id: "arrival-time",
    category: "Scheduling",
    question: "What time do movers usually arrive?",
    answer:
      "Our crew arrives 10–15 minutes before your scheduled time, and work generally begins after 9:00 AM.",
  },
  {
    id: "cancellation-policy",
    category: "Scheduling",
    question: "What's your cancellation or rescheduling policy?",
    answer:
      "Since we don't require a deposit or a contract, there's currently no charge or penalty for canceling or rescheduling. Just let us know as soon as you can so we can keep our schedule accurate for other customers.",
  },
  {
    id: "service-areas",
    category: "Services & Coverage",
    question: "What areas do you serve?",
    answer:
      "We're based in Miami Lakes and regularly serve Hialeah, Doral, Miramar, Pembroke Pines, Wynwood, Miami Springs, Hialeah Gardens, and Opa-locka. We also handle long-distance moves anywhere within Florida directly.",
  },
  {
    id: "long-distance",
    category: "Services & Coverage",
    question: "Do you handle long-distance or out-of-state moves?",
    answer:
      "We handle long-distance moves anywhere within Florida directly, with the same hourly billing and careful handling as a local move. For moves that cross state lines, we connect you with a trusted partner from our referral network.",
  },
  {
    id: "combined-services",
    category: "Services & Coverage",
    question: "Can I combine multiple services in one booking?",
    answer:
      "Yes—packing, furniture assembly, TV mounting, and other add-ons are commonly combined with a single move.",
  },
  {
    id: "packing-materials",
    category: "Services & Coverage",
    question: "Do you provide packing boxes and materials?",
    answer:
      "Moving blankets and industrial wrap are included at no extra cost on every job. Boxes and additional packing materials are available with our packing services.",
  },
  {
    id: "move-insurance",
    category: "Insurance & Damage",
    question: "Is my move insured?",
    answer:
      "Yes, we carry general liability insurance, with certain standard exclusions common in the moving industry. We're happy to walk you through exactly what's covered when you book.",
  },
  {
    id: "damage-process",
    category: "Insurance & Damage",
    question: "What happens if something gets damaged?",
    answer:
      "Let your crew lead know right away, and follow up with our office as soon as possible. We'll walk you through the next steps under our general liability coverage.",
  },
  {
    id: "before-arrival",
    category: "Preparing for Your Move",
    question: "What should I do before movers arrive?",
    answer:
      "Clear walkways between rooms and the front door, secure pets somewhere out of the way, and set aside important documents, medications, and valuables to transport yourself.",
  },
  {
    id: "empty-drawers",
    category: "Preparing for Your Move",
    question: "Do I need to empty my drawers?",
    answer:
      "Lightweight items can often stay in drawers. We'll let you know what to remove during your quote call, based on the specific pieces.",
  },
  {
    id: "fragile-items",
    category: "Preparing for Your Move",
    question: "How should I prepare fragile or high-value items?",
    answer:
      "Flag anything unusual—a safe, artwork, or gym equipment—when you request your quote, so we arrive prepared with the right equipment and technique.",
  },
  {
    id: "restricted-items",
    category: "Preparing for Your Move",
    question: "Are there items you won't move?",
    answer:
      "Like most moving companies, we can't transport hazardous materials such as propane tanks, gasoline, paint, corrosive chemicals, fireworks, or perishable food. Transport irreplaceable valuables yourself. We also don't offer piano moving, but we'll point you to a specialist if needed.",
  },
];
