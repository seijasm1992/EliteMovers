/**
 * Content type definitions.
 *
 * These shapes mirror what a future Sanity schema would return. Mock data in
 * `src/data/*` is typed against these interfaces, so migrating to a CMS later
 * only requires swapping the data source (e.g. an async `getX()` fetcher) while
 * components keep consuming the same shapes.
 */

export interface NavLink {
  label: string;
  href: string;
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavLink[];
}

export interface SiteConfig {
  name: string;
  legalName: string;
  wordmark: { primary: string; secondary: string };
  phone: string;
  phoneHref: string;
  email: string;
  location: string;
  description: string;
  /** License and insurance note shown in the footer and on the Licenses & Credentials page. */
  licenseNote: string;
}

export interface HeroContent {
  eyebrow: string;
  title: string;
  description: string;
  primaryCta: NavLink;
  secondaryCta: NavLink;
}

export interface GuaranteeCard {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface GuaranteeContent {
  eyebrow: string;
  title: string;
  subtitle: string;
  cards: GuaranteeCard[];
}

export interface MoveStep {
  number: string;
  title: string;
  description: string;
}

export interface StepsContent {
  eyebrow: string;
  title: string;
  subtitle: string;
  steps: MoveStep[];
}

export interface IncludedItem {
  id: string;
  title: string;
  description: string;
  includes: string[];
  /** Base path without extension; the accordion requests the -480/-720/-960 WebP variants. */
  image: string;
  imageAlt: string;
}

export interface IncludedContent {
  eyebrow: string;
  title: string;
  description: string;
  items: IncludedItem[];
}

export interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface MovingService {
  id: string;
  title: string;
  description: string;
  details: string;
  detailsExtended: string;
  highlights: string[];
  buttonLabel: string;
  image: string;
  imageAlt: string;
}

export interface MovingServicesContent {
  eyebrow: string;
  title: string;
  subtitle: string;
  services: MovingService[];
}

export interface FormFieldCopy {
  label: string;
  placeholder?: string;
}

export interface AboutHeroContent {
  eyebrow: string;
  title: string;
  subheadline: string;
  image: { src480: string; src720: string; alt: string };
}

export interface AboutStoryHighlight {
  icon: string;
  label: string;
  description: string;
}

export interface AboutStoryCard {
  id: string;
  layout: "wide" | "tall" | "default" | "media" | "cta";
  label: string;
  body: string;
  highlights?: AboutStoryHighlight[];
  image?: { src: string; alt: string };
  cta?: NavLink;
}

export interface AboutStorySection {
  eyebrow: string;
  title: string;
  cards: AboutStoryCard[];
}

export interface AboutTrustItem {
  icon: string;
  label: string;
}

export interface AboutTrustSection {
  items: AboutTrustItem[];
}

export interface AboutCityCard {
  id: string;
  name: string;
  href: string;
}

export interface AboutCitiesSection {
  eyebrow: string;
  title: string;
  cities: AboutCityCard[];
  longDistance: AboutCityCard;
}

export interface AboutFinalCtaSection {
  title: string;
  cta: NavLink;
}

export interface AboutPageContent {
  meta: { title: string; description: string };
  hero: AboutHeroContent;
  story: AboutStorySection;
  trust: AboutTrustSection;
  cities: AboutCitiesSection;
  finalCta: AboutFinalCtaSection;
}

export interface QuoteFormContent {
  section: {
    eyebrow: string;
    title: string;
    description: string;
  };
  form: {
    title: string;
    continuePrompt: string;
    continueLink: NavLink;
    fields: {
      originCity: FormFieldCopy;
      destinationCity: FormFieldCopy;
      moveDate: FormFieldCopy;
      homeSize: FormFieldCopy;
      fullName: FormFieldCopy;
      phone: FormFieldCopy;
      email: FormFieldCopy;
    };
    selectPlaceholder: string;
    buttons: {
      clear: string;
      submit: string;
      submitting: string;
    };
    success: {
      title: string;
      message: string;
      resetLabel: string;
    };
    errorMessage: string;
  };
}

export interface PrivacyPolicyContent {
  meta: { title: string; description: string };
  title: string;
  updated: string;
  sections: { heading: string; paragraphs: string[] }[];
}

/* ── Moving service pages (spec 007) ─────────────────────────────────── */

export type MovingServiceSlug =
  | "local-moving"
  | "long-distance-moving"
  | "office-moving"
  | "commercial-moving"
  | "small-moves"
  | "large-moves";

/** A Moving menu page: a header and a "What's included" list (spec 007, 2 sections). */
export interface MovingServicePage {
  slug: MovingServiceSlug;
  label: string;
  href: string;
  meta: { title: string; description: string };
  hero: {
    eyebrow: string;
    title: string;
    /** 2 to 3 sentences, specific to this service. */
    description: string;
    image: { src480: string; src720: string; src960: string; alt: string; width: number; height: number };
  };
  /** 3 to 5 items, specific to this service. */
  included: { title: string; items: { title: string; description: string }[] };
}

/* ── Location pages (spec 008) ───────────────────────────────────────── */

/** A Locations menu page: the "Service Area" section with its own text, plus local details. */
export interface LocationPage {
  label: string;
  href: string;
  meta: { title: string; description: string };
  hero: { eyebrow: string; title: string; description: string };
  included: { title: string; subtitle: string; items: { title: string; description: string }[] };
  buildings: { title: string; description: string; items: string[] };
}

/* ── Company pages (spec 009) ────────────────────────────────────────── */

/** A Company menu page. Its visible content is a home section, unchanged. */
export interface CompanyPage {
  label: string;
  href: string;
  meta: { title: string; description: string };
}

/* ── Service info pages (spec 010) ───────────────────────────────────── */

export type ServiceInfoSlug =
  | "packing-services"
  | "installation"
  | "high-value-items"
  | "furniture-protection"
  | "move-coordination";

export interface ServiceInfoStep {
  title: string;
  description: string;
}

/** A Services menu page: header, 3 steps and a one-line link to the quote page. */
export interface ServiceInfoPage {
  slug: ServiceInfoSlug;
  /** Menu label and H1 text. */
  label: string;
  href: string;
  meta: { title: string; description: string };
  hero: {
    /** 2 or 3 sentences, specific to this service. */
    description: string;
    image: { src480: string; src720: string; src960: string; alt: string; width: number; height: number };
  };
  /** Exactly 3 steps. */
  steps: { title: string; items: [ServiceInfoStep, ServiceInfoStep, ServiceInfoStep] };
  /** One line ending in →. Always links to /get-a-quote/. */
  closing: { text: string };
}
