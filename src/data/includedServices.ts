import type { IncludedContent } from "../types/content";

/**
 * "What's Included in Every Elite Move" accordion.
 * NOTE: images currently reuse the existing hero photos as temporary mocks.
 * Replace each `image` with a dedicated /images/included-*.jpg file (or a Sanity
 * image URL) — the component needs no changes.
 */
export const includedServices: IncludedContent = {
  eyebrow: "Standard With Every Move",
  title: "What's Included in Every Elite Move",
  description:
    "Every service below comes standard — no add-ons, no upgrades, no surprises. This is how a stress-free move should work.",
  items: [
    {
      id: "furniture",
      title: "Furniture Disassembly & Reassembly",
      description:
        "We handle the standard disassembly and reassembly of your furniture — no tools or stress on your end.",
      includes: [
        "Bed frames & headboards",
        "Tables & desks",
        "Standard shelves and bookcases",
        "Couches, sofas, and sectionals",
        "TV takedown when being moved",
        "Wall-mounting available as an installation add-on",
      ],
      image: "/1M.jpg",
      imageAlt: "Crew reassembling a bed frame in a new home",
    },
    {
      id: "protection",
      title: "Walls, Floor & Door Protection",
      description:
        "We protect high-traffic areas before the move begins, helping prevent scratches, dents, and damage during the process.",
      includes: [
        "Floor runners",
        "Door jamb protection",
        "Corner protection",
        "Elevator and hallway protection when required",
      ],
      image: "/2M.jpg",
      imageAlt: "Floor runners and door jamb protection installed before a move",
    },
    {
      id: "labor",
      title: "All Travel & Labor",
      description:
        "Your flat-rate move includes the crew, travel, loading, unloading, and standard labor needed to complete the job.",
      includes: [
        "No hourly surprises",
        "No fuel surcharge surprises",
        "Loading and unloading included",
        "Crew and truck included",
      ],
      image: "/3M.jpg",
      imageAlt: "Movers loading a truck with the full crew included",
    },
    {
      id: "tracking",
      title: "Live Crew Tracking",
      description:
        "Stay informed during your move with real-time crew and truck tracking when available.",
      includes: [
        "Real-time status visibility",
        "Crew arrival updates",
        "Move-day location awareness",
      ],
      image: "/4M.jpg",
      imageAlt: "Phone showing live tracking of a moving truck",
    },
    {
      id: "updates",
      title: "Automated Move Updates",
      description:
        "Receive clear updates before and during your move so you always know what comes next.",
      includes: [
        "Booking confirmation",
        "Pre-move reminders",
        "Move-day notifications",
        "Completion updates",
      ],
      image: "/1M.jpg",
      imageAlt: "Customer receiving automated move-day notifications",
    },
  ],
};
