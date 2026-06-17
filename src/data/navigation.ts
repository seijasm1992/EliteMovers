import type { NavItem } from "../types/content";

/** Primary navigation. Replace with Sanity `navigation` array later. */
export const navigation: NavItem[] = [
  {
    label: "Moving",
    href: "#moving",
    children: [
      { label: "Local Moving", href: "#local-moving" },
      { label: "Long Distance Moving", href: "#long-distance-moving" },
      { label: "Office Moving", href: "#office-moving" },
      { label: "Commercial Moving", href: "#commercial-moving" },
      { label: "Small Moves", href: "#small-moves" },
      { label: "Large Moves", href: "#large-moves" },
    ],
  },
  {
    label: "Locations",
    href: "#locations",
    children: [{ label: "Miami", href: "#miami" }],
  },
  {
    label: "Services",
    href: "#services",
    children: [
      { label: "Packing Services", href: "#packing-services" },
      { label: "Installation", href: "#installation" },
      { label: "High-Value Items", href: "#high-value-items" },
      { label: "Furniture Protection", href: "#furniture-protection" },
      { label: "Storage Solutions", href: "#storage-solutions" },
      { label: "Move Coordination", href: "#move-coordination" },
    ],
  },
  {
    label: "Company",
    href: "#company",
    children: [
      { label: "About", href: "#about" },
      { label: "Licenses & Credentials", href: "#licenses" },
      { label: "FAQ", href: "#faq" },
    ],
  },
];
