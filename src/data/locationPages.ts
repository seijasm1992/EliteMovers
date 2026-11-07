import type { LocationPage } from "../types/content";
import { site } from "./site";

/**
 * Miami page of the "Locations" menu (spec 008).
 * Single source of the URL for the page, the menu and the sitemap.
 * The visible content is the home "Service Area" section, unchanged.
 */
export const miamiPage: LocationPage = {
  label: "Miami",
  href: "/location/",
  meta: {
    title: `Miami & South Florida Service Area | ${site.name}`,
    description: `${site.name} handles moves in Miami-Dade, Broward, and throughout Florida, with crews based in Miami. Questions? Call ${site.phone}.`,
  },
};
