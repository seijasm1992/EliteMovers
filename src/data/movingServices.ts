import type { MovingServicesContent } from "../types/content";

export const movingServicesContent: MovingServicesContent = {
  eyebrow: "What We Do",
  title: "Our Services",
  subtitle:
    "We handle homes, apartments, offices, and long-distance moves throughout Florida, all billed by the hour.",
  services: [
    {
      id: "long-distance-moving",
      title: "Long Distance Moving",
      description:
        "Planned loading, transport, and delivery for moves outside the Miami area.",
      details:
        "For moves within Florida, our crew plans the route, loading order, and delivery window before move day. Interstate moves are coordinated through a partner in our referral network.",
      detailsExtended:
        "We confirm the inventory, access details, travel terms, hourly rate, and delivery contact in writing before the truck is loaded.",
      highlights: [
        "Door-to-door loading, transport, and unloading",
        "One contact for scheduling and delivery updates",
        "Hourly rate and travel terms confirmed in writing",
        "Careful handling for furniture, fragile items, and valuables",
        "Flexible scheduling for interstate and cross-country moves",
      ],
      buttonLabel: "More Info",
      image: "/service-long-distance.webp",
      imageAlt: "Pro Elite Movers crew loading wrapped furniture for a long-distance move",
    },
    {
      id: "residential-moving",
      title: "Residential Moving",
      description:
        "Moving crews for apartments, condos, townhomes, and houses.",
      details:
        "Our residential crew reviews building access, stairs, elevators, parking, and the items that need disassembly before move day.",
      detailsExtended:
        "Before loading, we protect the main walkways and wrap the furniture. At the destination, we place items by room and reassemble the standard pieces listed in your estimate.",
      highlights: [
        "Apartments, condos, townhomes, and single-family homes",
        "Furniture disassembly and reassembly included",
        "Floor, wall, and doorway protection on every move",
        "Efficient loading and room-by-room placement",
        "Hourly rate confirmed before move day",
      ],
      buttonLabel: "More Info",
      image: "/service-residential.webp",
      imageAlt: "Packed boxes and household items prepared for a residential move",
    },
    {
      id: "business-moving",
      title: "Business Moving",
      description:
        "Office and commercial moves scheduled around your operating hours.",
      details:
        "We plan the loading order for workstations, files, equipment, and shared spaces with your office or facilities contact.",
      detailsExtended:
        "After-hours and weekend scheduling is available. Equipment handling, floor access, loading zones, and completion times are confirmed before the move.",
      highlights: [
        "Offices, retail spaces, and commercial properties",
        "After-hours and weekend scheduling available",
        "IT equipment, desks, and filing systems handled with care",
        "Phased move plans to reduce operational downtime",
        "Hourly rate confirmed before move day",
        "Dedicated point of contact throughout the project",
      ],
      buttonLabel: "More Info",
      image: "/service-business.webp",
      imageAlt: "Commercial warehouse space prepared for a business move",
    },
  ],
};

/** @deprecated Use movingServicesContent.services */
export const movingServices = movingServicesContent.services;
