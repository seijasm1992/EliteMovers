export type ContactEvent = "contact_call" | "contact_text" | "contact_form";

declare global {
  interface Window {
    zaraz?: { track: (name: string, properties?: Record<string, unknown>) => void };
  }
}

/** Sends a contact event to Cloudflare Zaraz. Does nothing when Zaraz is not loaded. */
export const trackContact = (event: ContactEvent): void => {
  try {
    window.zaraz?.track(event, { page_path: window.location.pathname });
  } catch {
    // Analytics must never break the page.
  }
};
