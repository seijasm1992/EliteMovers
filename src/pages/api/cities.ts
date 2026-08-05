import type { APIRoute } from "astro";
import { getSecret } from "astro:env/server";

export const prerender = false;

interface GeoapifyResult {
  city?: unknown;
  name?: unknown;
  state_code?: unknown;
  state?: unknown;
  country_code?: unknown;
  place_id?: unknown;
}

const json = (data: unknown, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "private, max-age=60",
  },
});

export const GET: APIRoute = async ({ url }) => {
  const query = url.searchParams.get("q")?.trim() ?? "";
  if (query.length < 3 || query.length > 160) {
    return json({ suggestions: [] });
  }

  // Keep compatibility with the existing Cloudflare variable name while
  // reading it at request time instead of baking it into the client bundle.
  const apiKey = getSecret("PUBLIC_GEOAPIFY_API_KEY")?.trim();
  if (!apiKey) {
    return json({ suggestions: [], message: "City suggestions are not configured." }, 503);
  }

  const params = new URLSearchParams({
    text: query,
    type: "city",
    filter: "countrycode:us",
    bias: "proximity:-80.1918,25.7617",
    limit: "5",
    format: "json",
    apiKey,
  });

  try {
    const response = await fetch(`https://api.geoapify.com/v1/geocode/autocomplete?${params}`);
    if (!response.ok) {
      return json({ suggestions: [], message: "City suggestions are temporarily unavailable." }, 502);
    }

    const data = await response.json() as { results?: GeoapifyResult[] };
    const suggestions = (data.results ?? []).flatMap((result, index) => {
      const city = typeof result.city === "string"
        ? result.city
        : typeof result.name === "string"
          ? result.name
          : "";
      if (!city) return [];

      const stateCode = typeof result.state_code === "string"
        ? result.state_code
        : typeof result.state === "string"
          ? result.state
          : "";
      const countryCode = typeof result.country_code === "string"
        ? result.country_code.toUpperCase()
        : "";
      const label = stateCode ? `${city}, ${stateCode}` : city;

      return [{
        id: typeof result.place_id === "string" ? result.place_id : `${label}-${index}`,
        label,
        sublabel: countryCode,
      }];
    });

    return json({ suggestions });
  } catch {
    return json({ suggestions: [], message: "City suggestions are temporarily unavailable." }, 502);
  }
};
