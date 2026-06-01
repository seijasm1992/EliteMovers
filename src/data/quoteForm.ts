import type { QuoteFormContent } from "../types/content";

/** Quote form copy + select options. Keep values in sync with quoteSchema.ts enums. */
export const quoteForm: QuoteFormContent = {
  section: {
    eyebrow: "Free, No-Obligation Quote",
    title: "Request My Free Quote",
    description:
      "Tell us about your move and we'll get back to you with a guaranteed flat-rate price — no hidden fees, ever.",
  },
  form: {
    title: "Get your moving quote with a clean and simple process.",
    continuePrompt: "Already started your request?",
    continueLink: { label: "Continue", href: "#quote" },
    fields: {
      fullName: { label: "Full Name", placeholder: "John Smith" },
      email: { label: "Email", placeholder: "name@example.com" },
      phone: { label: "Phone", placeholder: "(305) 555-0199" },
      moveType: { label: "Move Type" },
      originCity: { label: "Origin City", placeholder: "Miami, FL" },
      destinationCity: { label: "Destination City", placeholder: "Orlando, FL" },
      moveDate: { label: "Estimated Date" },
      homeSize: { label: "Move Size" },
      contactPreference: { label: "Contact Preference" },
      message: {
        label: "Message",
        placeholder: "Share any details that help us prepare your quote…",
      },
    },
    selectPlaceholder: "Select…",
    buttons: {
      clear: "Clear",
      submit: "Continue",
      submitting: "Sending…",
    },
    success: {
      title: "You're all set",
      message:
        "Thanks! Your quote request has been received. Our team will contact you shortly.",
      resetLabel: "Submit another request",
    },
    errorMessage:
      "Something went wrong sending your request. Please try again or call us directly.",
  },
  moveTypes: [
    { value: "local", label: "Local Move" },
    { value: "long-distance", label: "Long Distance Move" },
    { value: "office", label: "Office Move" },
    { value: "commercial", label: "Commercial Move" },
    { value: "small", label: "Small Move" },
    { value: "large", label: "Large Move" },
  ],
  homeSizes: [
    { value: "studio", label: "Studio" },
    { value: "1-bed", label: "1 Bedroom" },
    { value: "2-bed", label: "2 Bedrooms" },
    { value: "3-bed", label: "3 Bedrooms" },
    { value: "4-bed-plus", label: "4+ Bedrooms" },
    { value: "office", label: "Office / Commercial" },
  ],
  contactPreferences: [
    { value: "phone", label: "Phone call" },
    { value: "email", label: "Email" },
    { value: "text", label: "Text message" },
    { value: "any", label: "No preference" },
  ],
};
