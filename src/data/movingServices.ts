import type { MovingServicesContent } from "../types/content";

export const movingServicesContent: MovingServicesContent = {
  eyebrow: "What We Do",
  title: "Our Services",
  subtitle:
    "From cross-country relocations to office transitions, every move is handled with the same care, precision, and flat-rate transparency.",
  services: [
    {
      id: "long-distance-moving",
      title: "Long Distance Moving",
      description:
        "Reliable long-distance moving services designed to make your relocation smooth, safe, and stress-free.",
      details:
        "Relocating across cities or states demands more than a truck and a timeline — it requires a team that treats your move like a milestone, not a transaction. Our long-distance specialists coordinate every leg of the journey with precision.",
      detailsExtended:
        "From the first inventory walkthrough to the final box in your new home, you receive clear communication, dedicated crew support, and a locked flat rate with no fuel surcharges or hidden fees along the way.",
      highlights: [
        "Door-to-door loading, transport, and unloading",
        "Dedicated move coordinator from quote to delivery",
        "Flat-rate pricing with no hourly surprises",
        "Careful handling for furniture, fragile items, and valuables",
        "Flexible scheduling for interstate and cross-country moves",
      ],
      buttonLabel: "More Info",
      image: "/4M.jpg",
      imageAlt: "Moving truck on the highway for a long-distance relocation",
    },
    {
      id: "residential-moving",
      title: "Residential Moving",
      description:
        "Professional home moving services for apartments, condos, and houses of all sizes.",
      details:
        "Whether you are upgrading to a larger home, downsizing, or starting fresh in a new neighborhood, our residential crew brings structure and calm to what can feel overwhelming. Every room is treated with the same level of attention.",
      detailsExtended:
        "We protect floors, doorways, and walls before a single item is lifted, then handle disassembly, packing support, and placement in your new space — so you can focus on settling in, not stressing out.",
      highlights: [
        "Apartments, condos, townhomes, and single-family homes",
        "Furniture disassembly and reassembly included",
        "Floor, wall, and doorway protection on every move",
        "Efficient loading and room-by-room placement",
        "Same flat-rate standard as every Elite move",
      ],
      buttonLabel: "More Info",
      image: "/2M.jpg",
      imageAlt: "Couple sitting among moving boxes in their new home",
    },
    {
      id: "business-moving",
      title: "Business Moving",
      description:
        "Efficient business moving solutions that help minimize downtime and keep your operations moving.",
      details:
        "Office relocations require tight coordination — equipment, workstations, files, and teams all need to arrive in the right order, at the right time. Our commercial moving division plans around your business hours to keep disruption to a minimum.",
      detailsExtended:
        "We work with office managers, facilities teams, and business owners to build a move plan that protects sensitive equipment, respects deadlines, and gets your team back to work as quickly as possible.",
      highlights: [
        "Offices, retail spaces, and commercial properties",
        "After-hours and weekend scheduling available",
        "IT equipment, desks, and filing systems handled with care",
        "Phased move plans to reduce operational downtime",
        "Dedicated point of contact throughout the project",
      ],
      buttonLabel: "More Info",
      image: "/3M.jpg",
      imageAlt: "Warehouse worker organizing boxes for a business move",
    },
  ],
};

/** @deprecated Use movingServicesContent.services */
export const movingServices = movingServicesContent.services;
