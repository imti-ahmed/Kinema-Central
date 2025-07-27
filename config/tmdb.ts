// TMDB Configuration
// Get your API key from: https://www.themoviedb.org/settings/api

export const TMDB_CONFIG = {
  // Replace 'YOUR_API_KEY_HERE' with your actual TMDB API key
  API_KEY: "87126dfcf5674197d41e48dae73a1fc6",

  // TMDB API base URLs - these shouldn't need to be changed
  BASE_URL: "https://api.themoviedb.org/3",
  IMAGE_BASE_URL: "https://image.tmdb.org/t/p",

  // Image sizes available from TMDB
  IMAGE_SIZES: {
    POSTER_SMALL: "w92",
    POSTER_MEDIUM: "w154",
    POSTER_LARGE: "w342",
    POSTER_ORIGINAL: "original",
    BACKDROP_SMALL: "w300",
    BACKDROP_MEDIUM: "w780",
    BACKDROP_LARGE: "w1280",
    BACKDROP_ORIGINAL: "original",
  },

  // API endpoints
  ENDPOINTS: {
    SEARCH_MOVIE: "search/movie",
    SEARCH_TV: "search/tv",
    SEARCH_MULTI: "search/multi",
    MOVIE_DETAILS: "movie",
    TV_DETAILS: "tv",
  },
};

// Helper function to check if API key is configured
export const isAPIKeyConfigured = (): boolean => {
  return (
    TMDB_CONFIG.API_KEY !== "YOUR_API_KEY_HERE" &&
    TMDB_CONFIG.API_KEY.length > 0
  );
};

// Helper function to build image URLs
export const buildImageUrl = (
  path: string | null,
  size: string = TMDB_CONFIG.IMAGE_SIZES.POSTER_SMALL,
): string | null => {
  if (!path) return null;
  return `${TMDB_CONFIG.IMAGE_BASE_URL}/${size}${path}`;
};

// Helper function to build API URLs
export const buildAPIUrl = (
  endpoint: string,
  params: Record<string, string> = {},
): string => {
  const url = new URL(`${TMDB_CONFIG.BASE_URL}/${endpoint}`);
  url.searchParams.set("api_key", TMDB_CONFIG.API_KEY);

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  return url.toString();
};