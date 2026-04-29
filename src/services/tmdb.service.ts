import tmdb from "../api/tmdb";

export const getTrendingMovies = async (timeWindow = "day", page = 1) => {
  const res = await tmdb.get(`/trending/movie/${timeWindow}`, {
    params: { page }
  });

  if (res.status !== 200) {
    throw new Error("TMDB trending fetch failed");
  }

  return res.data;
};

export const getPopularMovies = async (page = 1) => {
  const res = await tmdb.get("/movie/popular", {
    params: { page }
  });

  if (res.status !== 200) {
    throw new Error("TMDB popular fetch failed");
  }

  return res.data;
};

export const getNowPlayingMovies = async (page = 1) => {
  const res = await tmdb.get("/movie/now_playing", {
    params: { page }
  });

  if (res.status !== 200) {
    throw new Error("TMDB now playing fetch failed");
  }

  return res.data;
};

export const getRandomMovie = async () => {
  const res = await tmdb.get('/movie/top_rated');
  
  const movies = res?.data?.results;
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
    tmdb.get('/trending/all/day', { params: { page: 1 } }),
    tmdb.get('/trending/all/day', { params: { page: 2 } }),
  ]);

  const combined: any[] = [
    ...(page1?.data?.results ?? []),
    ...(page2?.data?.results ?? []),
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
 * Searches both movies and TV shows simultaneously via /search/multi.
 */
export const searchMulti = async (query: string, page = 1) => {
  const res = await tmdb.get('/search/multi', {
    params: { query, page, include_adult: false },
  });
  if (res.status !== 200) throw new Error('TMDB multi-search failed');
  // Filter out people results — only keep movie / tv
  const results = (res.data.results ?? []).filter(
    (r: any) => r.media_type === 'movie' || r.media_type === 'tv'
  );
  return { ...res.data, results };
};

export const getRelatedMovies = async (movieId: number, page = 1) => {
  const res = await tmdb.get(`/movie/${movieId}/recommendations`, {
    params: { page }
  });

  if (res.status !== 200) {
    throw new Error("TMDB related movies fetch failed");
  }

  return res.data.results; // array of MovieDetails
};

export const getMovieVideos = async (movieId: number) => {
  const res = await tmdb.get(`/movie/${movieId}/videos`);

  if (res.status !== 200) {
    throw new Error("TMDB movie videos fetch failed");
  }

  return res.data;
};

export const getTrendingTV = async (timeWindow = "day", page = 1) => {
  const res = await tmdb.get(`/trending/tv/${timeWindow}`, {
    params: { page }
  });
  return res.data;
};

export const getPopularTV = async (page = 1) => {
  const res = await tmdb.get("/tv/popular", {
    params: { page }
  });
  return res.data;
};

export const getTVDetails = async (tvId: number) => {
  const res = await tmdb.get(`/tv/${tvId}`, {
    params: {
      append_to_response: "credits,images,videos,content_ratings",
    },
  });
  return res.data;
};

export const getTVRecommendations = async (tvId: number, page = 1) => {
  const res = await tmdb.get(`/tv/${tvId}/recommendations`, {
    params: { page }
  });
  return res.data.results;
};

export const getTVSeasonDetails = async (tvId: number, seasonNumber: number) => {
  const res = await tmdb.get(`/tv/${tvId}/season/${seasonNumber}`);
  return res.data;
};

export const getMovieDetails = async (movieId: number) => {
  const res = await tmdb.get(`/movie/${movieId}`, {
    params: {
      append_to_response: "credits,images,videos",
    },
  });

  if (res.status !== 200) {
    throw new Error("TMDB movie details fetch failed");
  }
  return res.data;
};

