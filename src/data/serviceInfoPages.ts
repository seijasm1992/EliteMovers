import type { ServiceInfoPage, ServiceInfoSlug } from "../types/content";

/**
 * Content for the five "Services" menu pages (spec 010), in menu order.
 * Each page has 3 sections: a header, 3 steps, and a one-line link to the quote page.
 * Every claim comes from text already published on the site
 * (see specs/010-service-info-pages/contracts/page-content.md).
 * Never add dollar amounts, ratings, unconfirmed credentials, or services the site does not offer.
 */

const image = (slug: ServiceInfoSlug, alt: string): ServiceInfoPage["hero"]["image"] => ({
  src480: `/images/services/${slug}-480.webp`,
  src720: `/images/services/${slug}-720.webp`,
  src960: `/images/services/${slug}-960.webp`,
  alt,
  width: 960,
  height: 720,
});

export const serviceInfoPages: ServiceInfoPage[] = [
  {
    slug: "packing-services",
    label: "Packing Services",
    href: "/packing-services/",
    meta: {
      title: "Packing Services in Miami | ProElite Movers",
      description:
        "Hourly packing help in Miami-Dade and Broward, usually scheduled a day or two before your move, with boxes and packing materials available.",
    },
    hero: {
      description:
        "Add packing to your move and our crew will box up your home before the truck arrives. Packing is usually scheduled one to two days ahead, and boxes and packing materials come with the service.",
      image: image("packing-services", "Rows of packed and taped moving boxes stacked inside a truck"),
    },
    steps: {
      title: "How We Pack Your Home",
      items: [
        {
          title: "Tell us what needs packing",
          description:
            "When you request your quote, share your packing needs along with the room count and move date, so we can plan the job.",
        },
        {
          title: "We pack a day or two ahead",
          description:
            "Packing is usually scheduled one to two days before your move, billed by the hour with a three-hour minimum.",
        },
        {
          title: "Boxed up and ready to load",
          description:
            "On move day, furniture is wrapped with moving blankets and industrial wrap, included at no extra cost.",
        },
      ],
    },
    closing: { text: "Add packing to your quote →" },
  },
  {
    slug: "installation",
    label: "Installation",
    href: "/installation/",
    meta: {
      title: "Furniture Assembly and TV Mounting | ProElite Movers",
      description:
        "Our crew takes apart standard furniture, puts it back together at your new home, and can mount your TV on the wall as an add-on to the same booking.",
    },
    hero: {
      description:
        "Bed frames, desks, and sectionals don't always fit through a doorway in one piece. Our crew takes standard furniture apart when needed and reassembles it at your new place. Wall-mounting your TV can be added as an installation add-on.",
      image: image(
        "installation",
        "Disassembled white furniture panels and louvered doors wrapped in plastic, standing upright in a moving truck",
      ),
    },
    steps: {
      title: "How We Take Furniture Apart and Put It Back Together",
      items: [
        {
          title: "We take it apart",
          description:
            "The crew disassembles bed frames, headboards, tables, desks, standard shelves, and sofas when needed, and takes down your TV if it's moving with you.",
        },
        {
          title: "It moves with everything else",
          description:
            "Disassembled pieces are wrapped and loaded with the rest of your things, on the same booking.",
        },
        {
          title: "We put it back together",
          description:
            "At your new place, the crew reassembles your furniture and, if you added it, mounts your TV on the wall.",
        },
      ],
    },
    closing: { text: "Include assembly or TV mounting in your quote →" },
  },
  {
    slug: "high-value-items",
    label: "High-Value Items",
    href: "/high-value-items/",
    meta: {
      title: "Moving High-Value Items in Miami | ProElite Movers",
      description:
        "How our background-checked crew handles artwork, safes, and gym equipment: a walkthrough before loading, wrapping, and floor and door protection.",
    },
    hero: {
      description:
        "Artwork, a safe, gym equipment: some items need more planning than others. They get the same protection we use on every move, handled by a background-checked crew that reviews the job before anything is loaded.",
      image: image(
        "high-value-items",
        "Furniture covered in bubble wrap, moving blankets and padded bags, loaded upright in a moving truck",
      ),
    },
    steps: {
      title: "How We Handle High-Value Items",
      items: [
        {
          title: "Tell us about them up front",
          description:
            "List safes, artwork, gym equipment, and other unusual items when you request your quote, so we can assign the right crew and equipment.",
        },
        {
          title: "A walkthrough before loading",
          description:
            "Your background-checked crew arrives early, checks access points, and plans the loading order before anything moves.",
        },
        {
          title: "Wrapped, with the path protected",
          description:
            "Furniture is wrapped, and floors, door jambs, and corners are covered before the first piece leaves the room.",
        },
      ],
    },
    closing: { text: "List your high-value items in your quote →" },
  },
  {
    slug: "furniture-protection",
    label: "Furniture Protection",
    href: "/furniture-protection/",
    meta: {
      title: "Furniture and Home Protection | ProElite Movers",
      description:
        "We wrap your furniture and protect floors, door jambs, corners, hallways, and elevators before loading. Moving blankets and wrap are included on every job.",
    },
    hero: {
      description:
        "Protecting your furniture starts before anything leaves the room. We wrap furniture and protect floors, doors, and high-traffic areas before loading begins, to help prevent scratches and dents. Moving blankets and industrial wrap are included on every job.",
      image: image("furniture-protection", "Furniture wrapped in moving blankets and stretch wrap inside a moving truck"),
    },
    steps: {
      title: "How We Protect Your Home and Furniture",
      items: [
        {
          title: "The path comes first",
          description:
            "Before loading, the crew lays floor runners and covers door jambs and corners. Hallways and elevators get protection too when required.",
        },
        {
          title: "Every piece gets wrapped",
          description: "Furniture is wrapped in moving blankets and industrial wrap before it's carried out.",
        },
        {
          title: "Placed where you want it",
          description: "The crew loads, transports, and places each piece in the room you choose at your new home.",
        },
      ],
    },
    closing: { text: "Get a quote with protection included →" },
  },
  {
    slug: "move-coordination",
    label: "Move Coordination",
    href: "/move-coordination/",
    meta: {
      title: "Move Coordination in Miami | ProElite Movers",
      description:
        "One booking for packing, assembly, and TV mounting, plus a confirmation, reminders, and move-day updates. Here's how we keep your Miami move on track.",
    },
    hero: {
      description:
        "Instead of juggling movers, packers, and installers separately, you can add packing, furniture assembly, and TV mounting to one booking. From there, we keep you posted from booking to completion.",
      image: image(
        "move-coordination",
        "Mover loading boxes into a trailer parked in a residential driveway, with a loading ramp in place",
      ),
    },
    steps: {
      title: "How We Coordinate Your Move",
      items: [
        {
          title: "One booking, confirmed",
          description:
            "Combine the services you need in a single booking. You get a booking confirmation and reminders before move day.",
        },
        {
          title: "A crew that shows up with a plan",
          description: "The crew arrives 10 to 15 minutes early, checks access points, and plans the loading order.",
        },
        {
          title: "Updates until the last box",
          description:
            "We send move-day and completion updates to the contact on file, and you can track the crew and truck when the service is available.",
        },
      ],
    },
    closing: { text: "Plan your move with a quote →" },
  },
];

export function getServiceInfoPage(slug: ServiceInfoSlug): ServiceInfoPage {
  const page = serviceInfoPages.find((entry) => entry.slug === slug);
  if (!page) throw new Error(`Unknown service info page: ${slug}`);
  return page;
}
