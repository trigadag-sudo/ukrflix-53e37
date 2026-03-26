const TMDB_API_KEY = process.env.TMDB_API_KEY || process.env.TMDB_API_KEY_1;
const TMDB_ACCESS_TOKEN = process.env.TMDB_ACCESS_TOKEN;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export default async (req, context) => {
  const url = new URL(req.url);
  const endpoint = url.searchParams.get("endpoint") || "movie/popular";
  const page = url.searchParams.get("page") || "1";
  const query = url.searchParams.get("query") || "";

  if (!TMDB_API_KEY && !TMDB_ACCESS_TOKEN) {
    return new Response(
      JSON.stringify({ error: "TMDB API key is not configured" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    let tmdbUrl = `${TMDB_BASE_URL}/${endpoint}?language=uk-UA&page=${page}`;
    if (!TMDB_ACCESS_TOKEN) {
      tmdbUrl += `&api_key=${TMDB_API_KEY}`;
    }
    if (query) {
      tmdbUrl += `&query=${encodeURIComponent(query)}`;
    }

    const fetchOptions = {};
    if (TMDB_ACCESS_TOKEN) {
      fetchOptions.headers = {
        Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
        accept: "application/json",
      };
    }

    const response = await fetch(tmdbUrl, fetchOptions);
    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=300",
      },
    });
  } catch (error) {
    console.error("Error fetching from TMDB:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch data from TMDB" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

export const config = {
  path: "/api/tmdb-proxy",
};
