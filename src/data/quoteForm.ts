import type { QuoteFormContent } from "../types/content";

export const quoteForm: QuoteFormContent = {
  section: {
    eyebrow: "Free moving cost calculator",
    title: "Get your rate",
    description: "Start with the two locations for your move.",
  },
  form: {
    title: "Get Your Free Moving Quote",
    continuePrompt: "",
    continueLink: { label: "", href: "#hero-quote" },
    fields: {
      originCity: { label: "Origin City", placeholder: "City or ZIP code" },
      destinationCity: { label: "Destination City", placeholder: "City or ZIP code" },
      moveDate: { label: "Moving Date", placeholder: "MM / DD / YYYY" },
      homeSize: { label: "Move Size" },
      fullName: { label: "Full Name", placeholder: "Your full name" },
      phone: { label: "Phone", placeholder: "(305) 000-0000" },
      email: { label: "Email", placeholder: "you@email.com" },
    },
    selectPlaceholder: "Select location",
    buttons: { clear: "", submit: "Get My Free Quote", submitting: "Sending…" },
    success: {
      title: "Quote request received",
      message: "We'll use these details to prepare your moving estimate.",
      resetLabel: "Start over",
    },
    errorMessage: "Something went wrong. Please try again.",
  },
};
