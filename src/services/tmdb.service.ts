import tmdb from "../api/tmdb";
import type { MovieDetails } from "../types/movie";

// Performance Cache: Stores results and deduplicates in-flight requests
const cache = new Map<string, { data: unknown; timestamp: number }>();
const inFlight = new Map<string, Promise<unknown>>();

/**
 * Standardizes fetch with Caching & Deduplication
 * @param url The API endpoint
 * @param params Request parameters
 * @param ttl Time to live in milliseconds (default 5 minutes)
 */
const fetchWithCache = async <T = any>(url: string, params: Record<string, unknown> = {}, ttl = 5 * 60 * 1000): Promise<T> => {
  const cacheKey = JSON.stringify({ url, params });

  // 1. Check if request is already in-flight (Deduplication)
  if (inFlight.has(cacheKey)) {
    return inFlight.get(cacheKey) as Promise<T>;
  }

  // 2. Check Cache
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < ttl) {
    return cached.data as T;
  }

  // 3. Perform Request
  const requestPromise = tmdb.get(url, { params }).then(res => {
    if (res.status !== 200) throw new Error(`TMDB Fetch Failed: ${url}`);

    // Store in cache
    cache.set(cacheKey, { data: res.data, timestamp: Date.now() });
    inFlight.delete(cacheKey);
    return res.data as T;
  }).catch(err => {
    inFlight.delete(cacheKey);
    throw err;
  });

  inFlight.set(cacheKey, requestPromise);
  return requestPromise as Promise<T>;
};

export const getTrendingMovies = async (timeWindow = "day", page = 1) => {
  return fetchWithCache(`/trending/movie/${timeWindow}`, { page });
};

export const getPopularMovies = async (page = 1) => {
  return fetchWithCache("/movie/popular", { page });
};

export const getNowPlayingMovies = async (page = 1) => {
  return fetchWithCache("/movie/now_playing", { page });
};

export const getRandomMovie = async () => {
  const data = await fetchWithCache('/movie/top_rated');
  const movies = data?.results;
  if (!Array.isArray(movies) || movies.length === 0) return null;

  // Mix multiple entropy sources
  const entropy =
    Date.now() ^
    performance.now() ^
    Math.floor(Math.random() * 1e9);

  const randomIndex = Math.abs(entropy) % movies.length;
  return movies[randomIndex];
};

/**
 * Picks a random featured item from trending/all (movies + TV combined).
 * Prefers items that have a backdrop_path and a decent rating (>= 6.5).
 */
export const getRandomFeatured = async () => {
  // Fetch two pages for a wider pool
  const [page1, page2] = await Promise.all([
    fetchWithCache('/trending/all/day', { page: 1 }),
    fetchWithCache('/trending/all/day', { page: 2 }),
  ]);

  const combined: MovieDetails[] = [
    ...(page1?.results ?? []),
    ...(page2?.results ?? []),
  ];

  // Quality filter: must have backdrop + decent rating
  const quality = combined.filter(
    (item) =>
      item.backdrop_path &&
      item.vote_average >= 6.5 &&
      item.vote_count >= 100 &&
      (item.media_type === 'movie' || item.media_type === 'tv')
  );

  const pool = quality.length > 0 ? quality : combined;
  if (pool.length === 0) return null;

  const entropy = Date.now() ^ Math.floor(Math.random() * 1e9);
  return pool[Math.abs(entropy) % pool.length];
};

/**
 * Searches both movies and Series simultaneously via /search/multi.
 */
export const searchMulti = async (query: string, page = 1) => {
  const data = await fetchWithCache('/search/multi', { query, page, include_adult: false });
  // Filter out people results — only keep movie / tv
  const results = (data.results ?? []).filter(
    (r: MovieDetails) => r.media_type === 'movie' || r.media_type === 'tv'
  );
  return { ...data, results };
};

export const getRelatedMovies = async (movieId: number, page = 1) => {
  const data = await fetchWithCache(`/movie/${movieId}/recommendations`, { page });

  return data.results; // array of MovieDetails
};

export const getMovieVideos = async (movieId: number) => {
  return fetchWithCache(`/movie/${movieId}/videos`);
};

export const getTrendingTV = async (timeWindow = "day", page = 1) => {
  return fetchWithCache(`/trending/tv/${timeWindow}`, { page });
};

export const getPopularTV = async (page = 1) => {
  return fetchWithCache("/tv/popular", { page });
};

export const getTVDetails = async (tvId: number) => {
  return fetchWithCache(`/tv/${tvId}`, {
    append_to_response: "credits,images,videos,content_ratings",
  });
};

export const getTVRecommendations = async (tvId: number, page = 1) => {
  const data = await fetchWithCache(`/tv/${tvId}/recommendations`, { page });
  return data.results;
};

export const getTVSeasonDetails = async (tvId: number, seasonNumber: number) => {
  return fetchWithCache(`/tv/${tvId}/season/${seasonNumber}`);
};

export const getMovieDetails = async (movieId: number) => {
  return fetchWithCache(`/movie/${movieId}`, {
    append_to_response: "credits,images,videos",
  });
};

/**
 * Searches for production companies by name via /search/company.
 */
export const searchCompany = async (query: string, page = 1) => {
  return fetchWithCache('/search/company', { query, page });
};

/**
 * Fetches movies associated with a specific production company via /discover/movie.
 */
export const getMoviesByCompany = async (companyId: number, page = 1) => {
  return fetchWithCache('/discover/movie', {
    with_companies: companyId,
    sort_by: 'popularity.desc',
    page,
  });
};
