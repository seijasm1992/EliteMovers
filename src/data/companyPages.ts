import type { CompanyPage } from "../types/content";
import { site } from "./site";

/**
 * Company menu pages (spec 009).
 * Single source of the URL and metadata for each page, the menu and the sitemap.
 * The visible content is the matching home section, unchanged.
 */
export const licensesPage: CompanyPage = {
  label: "Licenses & Credentials",
  href: "/licenses-and-credentials/",
  meta: {
    title: `Licenses & Credentials | ${site.name}`,
    description: `Licensed and insured in Florida. An hourly rate confirmed before move day, furniture and property protection, and a background-checked crew from ${site.name}.`,
  },
};

export const faqPage: CompanyPage = {
  label: "FAQ",
  href: "/faq/",
  meta: {
    title: `Moving FAQ: Hourly Rates, Scheduling & More | ${site.name}`,
    description: `Answers about hourly billing, deposits, scheduling, service areas, insurance, and getting ready for your move with ${site.name} in Miami.`,
  },
};
