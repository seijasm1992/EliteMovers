import type { IncludedContent } from "../types/content";

/**
 * Included services accordion.
 * Images live in public/images/included and can later be swapped for Sanity
 * image URLs without changing the component.
 */
export const includedServices: IncludedContent = {
  eyebrow: "Included With Your Move",
  title: "What's Included in Your Hourly Rate",
  description:
    "Every service below is included in your hourly rate unless your written estimate states otherwise.",
  items: [
    {
      id: "labor",
      title: "Crew, Truck, and Labor",
      description:
        "Your confirmed hourly rate covers a truck, two movers, loading, unloading, moving pads, plastic wrap, and the tools for the move.",
      includes: [
        "Truck and two movers",
        "Moving pads and plastic wrap during the move",
        "Tools needed for the move",
        "Loading and unloading included",
        "Hourly rate confirmed before move day",
        "Travel terms and hourly rate listed in your estimate",
        "Extra movers available when you book",
      ],
      image: "/images/included/stacked-boxes-hand-truck",
      imageAlt: "Rows of stacked moving boxes inside a truck, with a red hand truck ready to load",
    },
    {
      id: "furniture",
      title: "Furniture Disassembly and Reassembly",
      description:
        "The crew takes apart standard furniture when needed and reassembles it at the destination.",
      includes: [
        "Bed frames and headboards",
        "Tables and desks",
        "Standard shelves and bookcases",
        "Couches, sofas, and sectionals",
        "TV takedown when being moved",
        "Wall-mounting available as an installation add-on",
      ],
      image: "/images/included/wrapped-furniture-truck",
      imageAlt: "Wrapped furniture secured inside a moving truck",
    },
    {
      id: "protection",
      title: "Wall, Floor, and Door Protection",
      description:
        "We protect high-traffic areas before the move begins, helping prevent scratches, dents, and damage during the process.",
      includes: [
        "Floor runners",
        "Door jamb protection",
        "Corner protection",
        "Elevator and hallway protection when required",
      ],
      image: "/images/included/padded-wrapped-furniture-truck",
      imageAlt: "Furniture protected with padded covers, bubble wrap and moving blankets inside a moving truck",
    },
    {
      id: "tracking",
      title: "Live Crew Tracking",
      description:
        "Track crew and truck status during your move when the service is available.",
      includes: [
        "Real-time crew and truck status",
        "Crew arrival updates",
        "Location updates on move day",
      ],
      image: "/images/included/boxes-loading-ramp",
      imageAlt: "Mover loading boxes into a truck using a ramp",
    },
    {
      id: "updates",
      title: "Move Updates from Booking to Completion",
      description:
        "We send booking, reminder, arrival, and completion updates to the contact on file.",
      includes: [
        "Booking confirmation",
        "Pre-move reminders",
        "Move-day notifications",
        "Completion updates",
      ],
      image: "/images/included/storage-unit-loaded",
      imageAlt: "Packed storage unit with bins and wrapped furniture",
    },
  ],
};
