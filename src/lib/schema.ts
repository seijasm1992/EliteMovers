import { site } from "../data/site";
import type { FAQItem, MovingServicePage, ServiceInfoPage } from "../types/content";

/**
 * Single source of the site's JSON-LD.
 * Structured data must match what the site shows: no street address, prices,
 * ratings, or license number until the owner confirms and publishes them.
 */
export type JsonLdNode = Record<string, unknown>;

const BASE_URL = "https://proelitemovers.com";
const CONTEXT = "https://schema.org";
const BUSINESS_ID = `${BASE_URL}/#business`;

const absoluteUrl = (path: string): string => new URL(path, BASE_URL).toString();

const MIAMI_DADE = { "@type": "AdministrativeArea", name: "Miami-Dade County, FL" };
const BROWARD = { "@type": "AdministrativeArea", name: "Broward County, FL" };
const FLORIDA = { "@type": "State", name: "Florida" };

/** City and state only: there is no office open to the public (spec 002). */
const [addressLocality, addressRegion] = site.location.split(", ");
const ADDRESS = { "@type": "PostalAddress", addressLocality, addressRegion, addressCountry: "US" };

/** Published in the "Do you work weekends and holidays?" answer of the FAQ. */
const OPENING_HOURS = {
  "@type": "OpeningHoursSpecification",
  dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
  opens: "07:00",
  closes: "20:00",
};

/** Hours are visible only on /faq/, so only that page declares them. */
export const businessSchema = ({ includeHours = false } = {}): JsonLdNode => ({
  "@context": CONTEXT,
  "@type": "MovingCompany",
  "@id": BUSINESS_ID,
  name: site.name,
  legalName: site.legalName,
  url: absoluteUrl("/"),
  logo: absoluteUrl("/images/brand/proelite-movers-logo.webp"),
  telephone: site.phone,
  email: site.email,
  address: ADDRESS,
  areaServed: [MIAMI_DADE, BROWARD, FLORIDA],
  ...(includeHours && { openingHoursSpecification: OPENING_HOURS }),
});

export const websiteSchema = (): JsonLdNode => ({
  "@context": CONTEXT,
  "@type": "WebSite",
  name: site.name,
  url: absoluteUrl("/"),
  publisher: { "@id": BUSINESS_ID },
});

export const serviceSchema = (page: MovingServicePage | ServiceInfoPage): JsonLdNode => ({
  "@context": CONTEXT,
  "@type": "Service",
  name: page.label,
  serviceType: page.label,
  description: page.hero.description,
  url: absoluteUrl(page.href),
  provider: { "@id": BUSINESS_ID },
  areaServed: page.slug === "long-distance-moving" ? [FLORIDA] : [MIAMI_DADE, BROWARD],
});

export const breadcrumbSchema = (label: string, href: string): JsonLdNode => ({
  "@context": CONTEXT,
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
    { "@type": "ListItem", position: 2, name: label, item: absoluteUrl(href) },
  ],
});

/** Only for pages that show every answer in their HTML. */
export const faqPageSchema = (items: FAQItem[]): JsonLdNode => ({
  "@context": CONTEXT,
  "@type": "FAQPage",
  mainEntity: items.map(({ question, answer }) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: { "@type": "Answer", text: answer },
  })),
});

/** Escapes opening angle brackets so the JSON is safe inside a script tag. */
export const serializeJsonLd = (node: JsonLdNode): string =>
  JSON.stringify(node).replace(/</g, "\\u003c");
