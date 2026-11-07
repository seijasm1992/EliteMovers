import type { MovingServicePage, MovingServiceSlug } from "../types/content";

/**
 * Content for the six "Moving" menu pages (spec 007), in menu order.
 * Each page has 2 sections: a header and a "What's included" list.
 * Business facts come only from the current site or from the owner.
 * Never add dollar amounts, ratings or unconfirmed credentials here.
 */

/** `sizes` for the hero photo. Shared by the <img> and its preload so they pick the same file. */
export const SERVICE_HERO_IMAGE_SIZES = "(min-width: 1024px) 34rem, calc(100vw - 2rem)";

const image = (slug: MovingServiceSlug, alt: string): MovingServicePage["hero"]["image"] => ({
  src480: `/images/services/${slug}-480.webp`,
  src720: `/images/services/${slug}-720.webp`,
  src960: `/images/services/${slug}-960.webp`,
  alt,
  width: 960,
  height: 720,
});

export const movingServicePages: MovingServicePage[] = [
  {
    slug: "local-moving",
    label: "Local Moving",
    href: "/local-moving/",
    meta: {
      title: "Local Movers in Miami | ProElite Movers",
      description:
        "Local moves across Miami-Dade and Broward with a trained, background-checked crew, furniture protection, and an hourly rate confirmed before move day.",
    },
    hero: {
      eyebrow: "Local Moving",
      title: "Local Moving in Miami",
      description:
        "Moving across town or a few exits up I-95? Our crew handles apartments, condos, and houses in Miami-Dade and Broward, billed by the hour with no surprises.",
      image: image(
        "local-moving",
        "Moving truck with its liftgate down in front of a two-story house, with hand trucks in the driveway",
      ),
    },
    included: {
      title: "What a Local Move Includes",
      items: [
        {
          title: "Truck and two movers",
          description:
            "Your rate covers the truck and a two-person crew. Need more hands for a big load? Add movers when you book.",
        },
        {
          title: "Building and elevator planning",
          description:
            "Condo and apartment buildings in Miami often require elevator reservations and set move hours. We plan the day around your building's rules.",
        },
        {
          title: "Pads and plastic wrap",
          description:
            "Furniture is padded and wrapped before it leaves the room, so it arrives the way it left.",
        },
        {
          title: "Disassembly and reassembly",
          description:
            "Bed frames, tables, and standard shelving are taken apart and put back together at your new place.",
        },
        {
          title: "Floor, wall, and door protection",
          description:
            "We cover high-traffic areas at both homes before the first item moves.",
        },
      ],
    },
  },
  {
    slug: "long-distance-moving",
    label: "Long Distance Moving",
    href: "/long-distance-moving/",
    meta: {
      title: "Long Distance Movers in Florida | ProElite Movers",
      description:
        "Long-distance moves from Miami to anywhere in Florida, with route and load planning, secured cargo, and travel terms confirmed in writing before move day.",
    },
    hero: {
      eyebrow: "Long Distance Moving",
      title: "Long Distance Moving Across Florida",
      description:
        "Heading to Orlando, Tampa, or anywhere else in Florida? Our own crew plans the route, loads for the road, and delivers to your new door.",
      image: image(
        "long-distance-moving",
        "Boxes and a plastic-covered mattress secured with ratchet straps inside a moving truck",
      ),
    },
    included: {
      title: "What a Long Distance Move Includes",
      items: [
        {
          title: "Route and delivery planning",
          description:
            "We plan the route, the loading order, and the delivery window before move day, so you know when to expect the truck.",
        },
        {
          title: "Loading for the road",
          description:
            "Items are packed tight and strapped in place to keep them from shifting over hundreds of miles.",
        },
        {
          title: "Door-to-door service",
          description:
            "Our own crew handles the loading, the drive, and the unloading for moves within Florida.",
        },
        {
          title: "One contact from start to finish",
          description:
            "You get a single point of contact for scheduling and delivery updates.",
        },
        {
          title: "Pads, wrap, and furniture care",
          description:
            "Moving pads, plastic wrap, and the tools for disassembly and reassembly come with the job.",
        },
      ],
    },
  },
  {
    slug: "office-moving",
    label: "Office Moving",
    href: "/office-moving/",
    meta: {
      title: "Office Movers in Miami | ProElite Movers",
      description:
        "Office moves in Miami planned around your business hours: workstations, files, and IT equipment moved with care, with after-hours and weekend scheduling.",
    },
    hero: {
      eyebrow: "Office Moving",
      title: "Office Moving in Miami",
      description:
        "Move your team without losing a workweek. We plan around your hours, move desks and equipment with care, and leave the new office ready to work.",
      image: image(
        "office-moving",
        "Rows of black and yellow storage totes stacked tightly inside a moving truck",
      ),
    },
    included: {
      title: "What an Office Move Includes",
      items: [
        {
          title: "Workstations and desks",
          description:
            "Standard desks and shelving are taken apart, moved, and reassembled at the new office.",
        },
        {
          title: "Files and records",
          description:
            "Filing cabinets and boxed records are loaded in order, so each department's files land in the right place.",
        },
        {
          title: "IT equipment handled with care",
          description:
            "Monitors, computers, and printers are padded and wrapped for the trip.",
        },
        {
          title: "After-hours and weekend moves",
          description:
            "Schedule the move for evenings or weekends so your team doesn't lose working hours.",
        },
        {
          title: "One point of contact",
          description:
            "You get one contact who coordinates with your office manager from planning to the last box.",
        },
      ],
    },
  },
  {
    slug: "commercial-moving",
    label: "Commercial Moving",
    href: "/commercial-moving/",
    meta: {
      title: "Commercial Movers in Miami | ProElite Movers",
      description:
        "Commercial moves for Miami retail stores, warehouses, and business spaces, phased to keep you open, with access and timing confirmed before move day.",
    },
    hero: {
      eyebrow: "Commercial Moving",
      title: "Commercial Moving in Miami",
      description:
        "Relocating a store, showroom, or warehouse? We move fixtures, stock, and equipment on a schedule that keeps your doors open as long as possible.",
      image: image(
        "commercial-moving",
        "Box truck parked at an open warehouse dock door, with a pallet jack on the concrete floor",
      ),
    },
    included: {
      title: "What a Commercial Move Includes",
      items: [
        {
          title: "Retail, warehouse, and business spaces",
          description:
            "We move stores, showrooms, storage areas, and other commercial properties across Miami-Dade and Broward.",
        },
        {
          title: "Stock and shelving",
          description:
            "Boxed inventory and shelving units are loaded in a set order, so restocking at the new space goes faster.",
        },
        {
          title: "Loading-dock coordination",
          description:
            "We work with dock doors, loading zones, and the time slots your property manager assigns.",
        },
        {
          title: "Phased moves",
          description:
            "Move in stages so you can keep serving customers while the rest of the space is packed up.",
        },
        {
          title: "Fixture and furniture protection",
          description:
            "Counters, displays, and office furniture are padded and wrapped before they go on the truck.",
        },
      ],
    },
  },
  {
    slug: "small-moves",
    label: "Small Moves",
    href: "/small-moves/",
    meta: {
      title: "Small Moves in Miami | ProElite Movers",
      description:
        "Small moves in Miami for studios, one-bedroom apartments, and a few pieces of furniture, with a truck, two movers, and pads included in the hourly rate.",
    },
    hero: {
      eyebrow: "Small Moves",
      title: "Small Moves in Miami",
      description:
        "Moving a studio, a one-bedroom, or just a few pieces of furniture? You still get a full crew, a truck, and the same care as a big move.",
      image: image(
        "small-moves",
        "Packed boxes, bags and a blanket-wrapped piece of furniture ready to go in a condo",
      ),
    },
    included: {
      title: "What a Small Move Includes",
      items: [
        {
          title: "Studios and one-bedrooms",
          description:
            "Ideal for a studio, a one-bedroom apartment, a dorm-style room, or a condo with light furniture.",
        },
        {
          title: "A few big items",
          description:
            "Just bought a sofa, or moving a bed and dresser to a new place? That counts as a small move too.",
        },
        {
          title: "Truck, two movers, and tools",
          description:
            "Your rate includes the truck, two movers, moving pads, plastic wrap, and the tools for the job.",
        },
        {
          title: "Add-ons in the same booking",
          description:
            "Add packing, furniture assembly, or TV mounting to the same booking instead of hiring someone else.",
        },
      ],
    },
  },
  {
    slug: "large-moves",
    label: "Large Moves",
    href: "/large-moves/",
    meta: {
      title: "Large Home Movers in Miami | ProElite Movers",
      description:
        "Large moves for Miami houses and apartments with three or more bedrooms: extra movers, packing, furniture reassembly, and full home protection all day.",
    },
    hero: {
      eyebrow: "Large Moves",
      title: "Large Moves for Bigger Homes",
      description:
        "Moving a house or an apartment with three or more bedrooms? We plan the crew, the truck, and the timing so a big move stays on track.",
      image: image(
        "large-moves",
        "Moving truck loaded with plastic-wrapped furniture, boxes, a wire shelf and a bench",
      ),
    },
    included: {
      title: "What a Large Move Includes",
      items: [
        {
          title: "Extra movers when you need them",
          description:
            "Your rate starts with two movers. For larger homes, add movers so the job moves faster.",
        },
        {
          title: "Packing before move day",
          description:
            "Our packing service comes one to two days ahead, so move day is all about loading.",
        },
        {
          title: "Full furniture disassembly and reassembly",
          description:
            "Beds, tables, sectionals, and standard shelving are taken apart and rebuilt at your new home.",
        },
        {
          title: "Protection all day long",
          description:
            "Floor runners, door jamb covers, and corner guards stay in place at both homes for the whole move.",
        },
        {
          title: "Room-by-room placement",
          description:
            "Everything is unloaded and placed by room, so you can start settling in that night.",
        },
      ],
    },
  },
];

export const getMovingServicePage = (slug: MovingServiceSlug): MovingServicePage => {
  const page = movingServicePages.find((entry) => entry.slug === slug);
  if (!page) throw new Error(`Unknown moving service page: ${slug}`);
  return page;
};
