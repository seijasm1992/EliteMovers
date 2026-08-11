import type { NavItem } from "../types/content";

/** Primary navigation. Replace with Sanity `navigation` array later. */
export const navigation: NavItem[] = [
  {
    label: "Moving",
    href: "/#services",
    children: [
      { label: "Local Moving", href: "/#residential-moving" },
      { label: "Long Distance Moving", href: "/#long-distance-moving" },
      { label: "Office Moving", href: "/#business-moving" },
      { label: "Commercial Moving", href: "/#business-moving" },
      { label: "Small Moves", href: "/#residential-moving" },
      { label: "Large Moves", href: "/#residential-moving" },
    ],
  },
  {
    label: "Locations",
    href: "/#quote",
    children: [{ label: "Miami", href: "/#quote" }],
  },
  {
    label: "Services",
    href: "/#included",
    children: [
      { label: "Packing Services", href: "/#included" },
      { label: "Installation", href: "/#included" },
      { label: "High-Value Items", href: "/#included" },
      { label: "Furniture Protection", href: "/#included" },
      { label: "Storage Solutions", href: "/#included" },
      { label: "Move Coordination", href: "/#included" },
    ],
  },
  {
    label: "Company",
    href: "/#guarantee",
    children: [
      { label: "About", href: "/about-us/" },
      { label: "Licenses & Credentials", href: "/#guarantee" },
      { label: "FAQ", href: "/#faq" },
    ],
  },
];
