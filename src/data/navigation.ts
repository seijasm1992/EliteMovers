import type { NavItem } from "../types/content";
import { movingServicePages } from "./movingServicePages";
import { serviceInfoPages } from "./serviceInfoPages";
import { miamiPage } from "./locationPages";
import { faqPage, licensesPage } from "./companyPages";

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
    // Each Services link opens its own page; Storage Solutions was removed (spec 010).
    children: serviceInfoPages.map(({ label, href }) => ({ label, href })),
  },
  {
    label: "Company",
    href: "/about-us/",
    // Licenses & Credentials and FAQ open their own pages (spec 009).
    children: [
      { label: "About", href: "/about-us/" },
      { label: licensesPage.label, href: licensesPage.href },
      { label: faqPage.label, href: faqPage.href },
    ],
  },
];
