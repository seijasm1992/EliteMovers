import type { NavItem } from "../types/content";
import { movingServicePages } from "./movingServicePages";
import { miamiPage } from "./locationPages";

/** Primary navigation. Replace with Sanity `navigation` array later. */
export const navigation: NavItem[] = [
  {
    label: "Moving",
    href: "/#services",
    // Each Moving link opens its own service page (spec 007).
    children: movingServicePages.map(({ label, href }) => ({ label, href })),
  },
  {
    label: "Locations",
    href: "/#quote",
    // Opens the Miami page (spec 008).
    children: [{ label: miamiPage.label, href: miamiPage.href }],
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
