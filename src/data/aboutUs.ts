import type { AboutPageContent } from "../types/content";

/**
 * About Us page content. Source: `.agents/context/about-us.md`.
 * `{{VARIABLE}}` placeholders are kept literal until real values are provided.
 */
export const aboutUs: AboutPageContent = {
  meta: {
    title: "About ProElite Movers | Founded by Luis & Juan",
    description:
      "Meet the team behind ProElite Movers, a Miami Lakes moving agency built on honest hourly billing and a human approach.",
  },
  hero: {
    eyebrow: "Our Founders",
    title: "A Moving Agency, Not Just a Truck",
    subheadline: "Luis and Juan started ProElite Movers to do moving differently.",
    image: {
      src480: "/images/hero/movers-loading-480.webp",
      src720: "/images/hero/movers-loading-720.webp",
      alt: "ProElite Movers crew carefully loading wrapped furniture into a truck",
    },
  },
  story: {
    eyebrow: "Our Story",
    title: "Why We Started ProElite Movers",
    cards: [
      {
        id: "the-problem",
        layout: "wide",
        label: "The Problem",
        body: "Most moving companies treat your move like a transaction, when a move involves someone's actual life. We started ProElite Movers to do it differently: listen first, plan the details, then move you.",
      },
      {
        id: "where-we-stand",
        layout: "tall",
        label: "Where We Stand",
        body: "The moving industry runs cold and corporate. We wanted something more direct: a crew that talks to you like a person, not a ticket number. What actually helps on moving day isn't a bigger truck. It's a plan.",
      },
      {
        id: "what-we-wont-do",
        layout: "default",
        label: "What We Won't Do",
        body: "We won't call ourselves a \"transport\" company. We're a moving agency, involved in the planning and packing, not just the driving. We won't guess on price either: we bill hourly, so you pay for the work done, not a padded flat-rate estimate.",
      },
      {
        id: "who-we-work-with",
        layout: "default",
        label: "Who We Work With",
        body: "ProElite Movers runs lean: a small, coordinated team, not a large corporate fleet. We work best with people and businesses who want to hand off the whole move as one job, instead of juggling movers, packers, and logistics separately.",
      },
      {
        id: "how-we-think",
        layout: "media",
        label: "How We Think",
        body: "Hourly billing means speed matters to us as much as it matters to you. In practice:",
        highlights: [
          { icon: "route", label: "Efficiency", description: "Steady pace, no stretched-out hours." },
          { icon: "shield", label: "Careful handling", description: "Extra attention to corners and edges." },
          { icon: "badge", label: "Discretion", description: "We work quietly, no production." },
        ],
        image: {
          src: "/images/included/crew-loading-wrapped-items.jpeg",
          alt: "ProElite Movers crew carefully securing wrapped furniture inside a truck",
        },
      },
      {
        id: "next-step",
        layout: "cta",
        label: "Next Step",
        body: "If this sounds like the team you want handling your move, reach out and we'll go over the details.",
        cta: { label: "Get My Free Quote", href: "/get-a-quote/" },
      },
    ],
  },
  trust: {
    items: [
      { icon: "badge", label: "Registered Florida Mover · License on file" },
      { icon: "shield", label: "Insured & Bonded" },
      { icon: "mapPin", label: "Locally Owned & Operated · Miami Lakes, FL" },
    ],
  },
  cities: {
    eyebrow: "Where We Work",
    title: "Miami-Dade's Local Moving Team",
    cities: [
      { id: "miami-lakes", name: "Miami Lakes", href: "/get-a-quote/" },
      { id: "hialeah", name: "Hialeah", href: "/get-a-quote/" },
      { id: "doral", name: "Doral", href: "/get-a-quote/" },
      { id: "miramar", name: "Miramar", href: "/get-a-quote/" },
      { id: "pembroke-pines", name: "Pembroke Pines", href: "/get-a-quote/" },
      { id: "wynwood", name: "Wynwood", href: "/get-a-quote/" },
      { id: "miami-springs", name: "Miami Springs", href: "/get-a-quote/" },
      { id: "hialeah-gardens", name: "Hialeah Gardens", href: "/get-a-quote/" },
      { id: "opa-locka", name: "Opa-locka", href: "/get-a-quote/" },
    ],
    longDistance: {
      id: "long-distance",
      name: "Long-Distance Moving Across Florida",
      href: "/get-a-quote/",
    },
  },
  finalCta: {
    title: "Shall we get started?",
    cta: { label: "Get My Free Quote", href: "/get-a-quote/" },
  },
};
