import type { LocationPage } from "../types/content";
import { site } from "./site";

/**
 * Miami page of the "Locations" menu (spec 008).
 * Single source of the URL for the page, the menu and the sitemap.
 * Never add dollar amounts or ratings here: rates are given only when quoting.
 */
export const miamiPage: LocationPage = {
  label: "Miami",
  href: "/location/",
  meta: {
    title: `Movers in Miami & South Florida | ${site.name}`,
    description: `Hourly movers in Miami-Dade and Broward. Truck, two movers, moving pads, plastic wrap, and tools included. Call ${site.phone} or request a quote.`,
  },
  hero: {
    eyebrow: "Miami Movers",
    title: "Movers in Miami and South Florida",
    description:
      "ProElite Movers is a Miami moving company for apartments, condos, houses, and offices in Miami-Dade and Broward. Every move is billed by the hour, and your rate is confirmed before move day.",
  },
  included: {
    title: "What Your Hourly Rate Covers",
    subtitle:
      "Our hourly rates are based on moves in Miami-Dade and Broward. Moving somewhere else, or need something extra? Contact us directly and we'll go over it.",
    items: [
      {
        title: "Truck and two movers",
        description: "Your rate covers the truck and a two-person crew, including loading and unloading.",
      },
      {
        title: "Moving pads and plastic wrap",
        description: "Furniture is padded and wrapped during the move, so it arrives the way it left.",
      },
      {
        title: "The tools for the job",
        description: "The crew brings what the move requires, including the tools to take standard furniture apart and put it back together.",
      },
      {
        title: "Extra movers when you need them",
        description: "Have a bigger load? You can add more movers when you book.",
      },
      {
        title: "Floor and door protection",
        description: "Floors, door jambs, and corners are covered before the first item moves.",
      },
      {
        title: "No deposit to book",
        description: "We don't require a deposit or a signed contract to book your move.",
      },
    ],
  },
  buildings: {
    title: "Moving in a Miami Condo or Apartment",
    description:
      "Condo and apartment buildings in Miami often require elevator reservations and set move hours. We plan the day around your building's rules.",
    items: [
      "We review building access, stairs, elevators, and parking before move day.",
      "Hallways and elevators get protection when your building requires it.",
      "The crew arrives 10 to 15 minutes early, checks access points, and plans the loading order.",
    ],
  },
};
