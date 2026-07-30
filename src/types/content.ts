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
  wordmark: { primary: string; secondary: string };
  phone: string;
  phoneHref: string;
  email: string;
  description: string;
}

export interface HeroSlide {
  src: string;
  alt: string;
}

export interface HeroContent {
  eyebrow: string;
  title: string;
  description: string;
  primaryCta: NavLink;
  secondaryCta: NavLink;
  rating: {
    score: string;
    reviewsLabel: string;
  };
  slides: HeroSlide[];
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
  image: string;
  imageAlt: string;
}

export interface IncludedContent {
  eyebrow: string;
  title: string;
  description: string;
  items: IncludedItem[];
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
