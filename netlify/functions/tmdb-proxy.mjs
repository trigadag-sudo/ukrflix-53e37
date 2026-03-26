const TMDB_API_KEY = process.env.TMDB_API_KEY || process.env.TMDB_API_KEY_1;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export default async (req, context) => {
  const url = new URL(req.url);
  const endpoint = url.searchParams.get("endpoint") || "movie/popular";
  const page = url.searchParams.get("page") || "1";
  const query = url.searchParams.get("query") || "";

  if (!TMDB_API_KEY) {
    return new Response(
      JSON.stringify({ error: "TMDB API key is not configured" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    let tmdbUrl = `${TMDB_BASE_URL}/${endpoint}?api_key=${TMDB_API_KEY}&language=uk-UA&page=${page}`;
    if (query) {
      tmdbUrl += `&query=${encodeURIComponent(query)}`;
    }

    const response = await fetch(tmdbUrl);
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
