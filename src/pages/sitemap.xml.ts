import type { APIRoute } from "astro";

export const prerender = true;

const routes = ["/", "/get-a-quote/"];

export const GET: APIRoute = ({ site }) => {
  const baseUrl = site ?? new URL("https://proelitemovers.com");
  const urls = routes
    .map((route) => `  <url><loc>${new URL(route, baseUrl).toString()}</loc></url>`)
    .join("\n");
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

  return new Response(sitemap, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
