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
      image: "/images/included/wrapped-furniture-truck.jpeg",
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
      image: "/images/included/crew-loading-wrapped-items.jpeg",
      imageAlt: "Mover securing wrapped furniture inside a truck",
    },
    {
      id: "labor",
      title: "Crew, Truck, and Labor",
      description:
        "Your confirmed hourly rate covers the assigned crew, truck, loading, unloading, and standard moving labor.",
      includes: [
        "Hourly rate confirmed before move day",
        "Travel terms and hourly rate listed in your estimate",
        "Loading and unloading included",
        "Crew and truck included",
      ],
      image: "/images/included/truck-loading-ramp.jpeg",
      imageAlt: "Loaded moving truck with boxes and furniture on the ramp",
    },
    {
      id: "tracking",
      title: "Live Crew Tracking",
      description:
        "Track crew and truck status during your move when the service is available.",
      includes: [
        "Real-time status visibility",
        "Crew arrival updates",
        "Move-day location awareness",
      ],
      image: "/images/included/boxes-loading-ramp.jpeg",
      imageAlt: "Mover loading boxes into a truck using a ramp",
    },
    {
      id: "updates",
      title: "Automated Move Updates",
      description:
        "We send booking, reminder, arrival, and completion updates to the contact on file.",
      includes: [
        "Booking confirmation",
        "Pre-move reminders",
        "Move-day notifications",
        "Completion updates",
      ],
      image: "/images/included/storage-unit-loaded.jpeg",
      imageAlt: "Packed storage unit with bins and wrapped furniture",
    },
  ],
};
