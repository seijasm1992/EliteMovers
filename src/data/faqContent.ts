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
      "We confirm the hourly rate when you book. Your final labor total is based on the time the job takes and the travel terms listed in your estimate.",
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
      "Your estimate lists the crew, truck, travel terms, and any optional services. Moving blankets and industrial wrap are included with the job.",
  },
  {
    id: "payment-methods",
    category: "Pricing & Billing",
    question: "What forms of payment do you accept?",
    answer:
      "We accept major credit and debit cards. Ask our office about other payment options when you book.",
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
      "Book residential moves one to two weeks ahead when possible. Larger commercial moves usually require more planning, but you can call us to check short-notice availability.",
  },
  {
    id: "weekends-holidays",
    category: "Scheduling",
    question: "Do you work weekends and holidays?",
    answer:
      "We operate seven days a week from 7:00 AM to 8:00 PM. Holiday availability may vary.",
  },
  {
    id: "arrival-time",
    category: "Scheduling",
    question: "What time do movers usually arrive?",
    answer:
      "The crew usually arrives 10 to 15 minutes before the scheduled start time. Most jobs begin after 9:00 AM.",
  },
  {
    id: "cancellation-policy",
    category: "Scheduling",
    question: "What's your cancellation or rescheduling policy?",
    answer:
      "There is currently no fee for canceling or rescheduling because we do not require a deposit. Contact us as soon as your plans change so we can update the crew schedule.",
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
      "Our crew handles long-distance moves within Florida. For moves across state lines, we connect you with a partner in our referral network.",
  },
  {
    id: "combined-services",
    category: "Services & Coverage",
    question: "Can I combine multiple services in one booking?",
    answer:
      "Yes. Packing, furniture assembly, TV mounting, and other optional services can be added to the same booking.",
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
      "We carry general liability insurance subject to standard exclusions. Ask for the coverage details when you book so you know what applies to your move.",
  },
  {
    id: "damage-process",
    category: "Insurance & Damage",
    question: "What happens if something gets damaged?",
    answer:
      "Tell the crew lead as soon as you notice the damage, then contact our office. We will document the issue and explain the claim process under our coverage.",
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
      "List safes, artwork, gym equipment, and other unusual items when you request the quote. This helps us assign the right crew and equipment.",
  },
  {
    id: "restricted-items",
    category: "Preparing for Your Move",
    question: "Are there items you won't move?",
    answer:
      "Like most moving companies, we can't transport hazardous materials such as propane tanks, gasoline, paint, corrosive chemicals, fireworks, or perishable food. Transport irreplaceable valuables yourself. We also don't offer piano moving, but we'll point you to a specialist if needed.",
  },
];
