import type { PrivacyPolicyContent } from "../types/content";
import { site } from "./site";

export const privacyPolicy: PrivacyPolicyContent = {
  meta: {
    title: `Privacy Policy | ${site.name}`,
    description:
      `How ${site.name} measures visits to this site, which services we use, and why the details you send in a quote request never go into our analytics.`,
  },
  title: "Privacy Policy",
  updated: "November 5, 2026",
  sections: [
    {
      heading: "What we measure",
      paragraphs: [
        "We count visits to the pages of this site, and we count when someone taps to call us, taps to text us, or sends a quote request.",
        "For each of these we record the page where it happened and how the visit reached us, for example from a Google search, from our Google Business Profile, or by typing our address. This helps us see which pages are useful and whether people can find us.",
      ],
    },
    {
      heading: "Services we use",
      paragraphs: [
        "Cloudflare Web Analytics counts visits without using cookies. Cloudflare Zaraz loads our analytics tools and sends contact taps to Google Analytics 4.",
        "Google Analytics 4 shows us visits and contacts by page and by where the visit came from. Microsoft Clarity shows us how people use the pages, such as where they click and scroll, so we can fix what gets in the way.",
        "Google Analytics and Microsoft Clarity may use cookies to tell one visit from another. Each of these companies handles that data under its own privacy policy.",
      ],
    },
    {
      heading: "Your quote request",
      paragraphs: [
        "When you send a quote request, your name, phone number, email, cities, moving date, and move size come to us by email so we can reply to you.",
        "We use those details only to answer your request. We never send them to Google Analytics, Microsoft Clarity, or any other analytics tool.",
      ],
    },
    {
      heading: "Spam protection",
      paragraphs: [
        "Our quote form uses Cloudflare Turnstile to check that the request comes from a person and not an automated program.",
      ],
    },
    {
      heading: "Your choices",
      paragraphs: [
        "You can block or delete cookies in your browser settings, or use a content blocker. The site and the quote form keep working either way.",
      ],
    },
    {
      heading: "Questions",
      paragraphs: [
        `If you have any questions about this policy, email us at ${site.email}.`,
      ],
    },
  ],
};
