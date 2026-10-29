export type MediaType = "movie" | "tv";

export type FetcherKey =
  | "popular"
  | "topRated"
  | "discover"
  | "trending"
  | "upcoming"
  | "nowPlaying"
  | "search";

export type RowConfig = {
  title: string;
  mediaType: MediaType;
  fetcher: FetcherKey;
  params?: Record<string, unknown>;
  options?: Record<string, unknown>;
};

export const ROW_CONFIG: RowConfig[] = [
  // ── Trending Today (highest freshness signal) ─────────────────────────────
  {
    title: "Trending Today — Movies",
    mediaType: "movie",
    fetcher: "trending",
    options: { timeWindow: "day" },
  },
  {
    title: "Trending Today — Series",
    mediaType: "tv",
    fetcher: "trending",
    options: { timeWindow: "day" },
  },

  // ── Now Playing / On Air ──────────────────────────────────────────────────
  {
    title: "Now Playing in Theaters",
    mediaType: "movie",
    fetcher: "nowPlaying",
  },
  {
    title: "Currently Airing Shows",
    mediaType: "tv",
    fetcher: "nowPlaying",
  },

  // ── New Releases (sorted by date, quality-gated) ─────────────────────────
  {
    title: "Latest Movie Releases",
    mediaType: "movie",
    fetcher: "discover",
    params: {
      sort_by: "primary_release_date.desc",
      "vote_count.gte": 80,
      "vote_average.gte": 5.5,
    },
  },
  {
    title: "Newest Series",
    mediaType: "tv",
    fetcher: "discover",
    params: {
      sort_by: "first_air_date.desc",
      "vote_count.gte": 50,
      "vote_average.gte": 5.5,
    },
  },

  // ── Upcoming ──────────────────────────────────────────────────────────────
  {
    title: "Coming Soon",
    mediaType: "movie",
    fetcher: "upcoming",
  },

  // ── Top Rated ─────────────────────────────────────────────────────────────
  {
    title: "Top Rated Movies",
    mediaType: "movie",
    fetcher: "topRated",
  },
  {
    title: "Top Rated Series",
    mediaType: "tv",
    fetcher: "topRated",
  },

  // ── Hidden Gems (high score, fewer votes = less mainstream) ──────────────
  {
    title: "Hidden Gem Movies",
    mediaType: "movie",
    fetcher: "discover",
    params: {
      sort_by: "vote_average.desc",
      "vote_count.gte": 200,
      "vote_count.lte": 2000,
      "vote_average.gte": 7.5,
    },
  },
  {
    title: "Hidden Gem Series",
    mediaType: "tv",
    fetcher: "discover",
    params: {
      sort_by: "vote_average.desc",
      "vote_count.gte": 100,
      "vote_count.lte": 1500,
      "vote_average.gte": 7.8,
    },
  },

  // ── Popular ───────────────────────────────────────────────────────────────
  {
    title: "Popular Movies",
    mediaType: "movie",
    fetcher: "popular",
  },
  {
    title: "Popular Series",
    mediaType: "tv",
    fetcher: "popular",
  },

  // ── Genre Rows ────────────────────────────────────────────────────────────
  {
    title: "Action & Adventure",
    mediaType: "movie",
    fetcher: "discover",
    params: {
      with_genres: "28,12",
      sort_by: "popularity.desc",
      "vote_count.gte": 200,
    },
  },
  {
    title: "Comedy Movies",
    mediaType: "movie",
    fetcher: "discover",
    params: {
      with_genres: "35",
      sort_by: "vote_average.desc",
      "vote_count.gte": 300,
    },
  },
  {
    title: "Horror & Thriller",
    mediaType: "movie",
    fetcher: "discover",
    params: {
      with_genres: "27,53",
      sort_by: "popularity.desc",
      "vote_count.gte": 150,
    },
  },
  {
    title: "Sci-Fi & Fantasy",
    mediaType: "movie",
    fetcher: "discover",
    params: {
      with_genres: "878,14",
      sort_by: "vote_average.desc",
      "vote_count.gte": 300,
    },
  },
  {
    title: "Crime & Drama Series",
    mediaType: "tv",
    fetcher: "discover",
    params: {
      with_genres: "80,18",
      sort_by: "vote_average.desc",
      "vote_count.gte": 200,
    },
  },
  {
    title: "Sci-Fi & Fantasy Series",
    mediaType: "tv",
    fetcher: "discover",
    params: {
      with_genres: "10765",
      sort_by: "popularity.desc",
      "vote_count.gte": 100,
    },
  },

  // ── Regional ─────────────────────────────────────────────────────────────
  {
    title: "Malayalam Hits",
    mediaType: "movie",
    fetcher: "discover",
    params: {
      with_original_language: "ml",
      sort_by: "popularity.desc",
      "vote_count.gte": 50,
    },
  },
  {
    title: "Anime Series",
    mediaType: "tv",
    fetcher: "discover",
    params: {
      with_original_language: "ja",
      with_genres: "16",
      sort_by: "popularity.desc",
      "vote_count.gte": 100,
    },
  },

  // ── Award-quality films ───────────────────────────────────────────────────
  {
    title: "Award-Winning Films",
    mediaType: "movie",
    fetcher: "discover",
    params: {
      sort_by: "vote_average.desc",
      "vote_count.gte": 1000,
      "vote_average.gte": 8.0,
    },
  },
];

