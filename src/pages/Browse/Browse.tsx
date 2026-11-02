import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Building2, Film, Tv, ChevronDown, Search, Flame, Star, Compass, History, Sparkles, Globe2 } from "lucide-react";
import Header from "../../components/common/Header";
import { fetchMovies } from "../../utils/fetchMovies";
import { searchMulti, getMoviesByCompany, searchByLanguage, getMoviesByLanguage } from "../../services/tmdb.service";
import { getWatchHistory, getSeriesWatchUrl } from "../../utils/watchHistory";
import { POPULAR_LANGUAGES, getLanguageName } from "../../config/languages";
import MovieCard from "../../components/movie/MovieCard";
import Skeleton from "../../components/common/Skeleton";
import type { MovieDetails } from "../../types/movie";
import { ROW_CONFIG } from "../../config/rowConfig";

// ─── Company Banner ───────────────────────────────────────────────────────────

const CompanyBanner = ({
  name,
  movieCount,
}: {
  name: string;
  movieCount: number;
}) => (
  <div className="mb-10 flex items-center gap-5 rounded-2xl border border-white/8 bg-gradient-to-r from-purple-950/40 via-zinc-900/60 to-zinc-900/40 px-6 py-5 backdrop-blur-sm">
    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-purple-600/20 border border-purple-500/20">
      <Building2 size={26} className="text-purple-400" />
    </div>
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-purple-400 mb-0.5">
        Production Company
      </p>
      <h1 className="text-2xl font-black text-white leading-tight">{name}</h1>
      {movieCount > 0 && (
        <p className="mt-1 text-sm text-zinc-400">
          {movieCount} movie{movieCount !== 1 ? "s" : ""} found
        </p>
      )}
    </div>
  </div>
);

// ─── Page Header ──────────────────────────────────────────────────────────────

const PageHeader = ({
  query,
  type,
  sort,
  lang,
  total,
  loading = false,
}: {
  query: string | null;
  type: string;
  sort: string | null;
  lang: string | null;
  total: number;
  loading?: boolean;
}) => {
  let icon = type === "tv" ? <Tv size={22} className="text-blue-400" /> : <Film size={22} className="text-red-400" />;
  if (type === "all") {
    icon = <Sparkles size={22} className="text-red-500" />;
  }
  if (lang) {
    icon = <Globe2 size={22} className="text-red-500" />;
  }

  const langLabel = lang ? getLanguageName(lang) : "";

  let title = query
    ? lang
      ? `Results for "${query}" in ${langLabel}`
      : `Results for "${query}"`
    : lang
      ? `${langLabel} ${type === "tv" ? "Series" : "Movies"}`
      : type === "tv"
        ? "Series"
        : type === "all"
          ? "Movies & Series"
          : "Movies";

  if (sort === "new") {
    icon = <Flame size={22} className="text-red-500" />;
    title = lang ? `Latest ${langLabel} Releases` : "New & Popular";
  } else if (sort === "top") {
    icon = <Star size={22} className="text-yellow-400" />;
    title = lang
      ? `Top Rated ${langLabel} ${type === "tv" ? "Series" : "Movies"}`
      : type === "tv"
        ? "Top Series"
        : "Top Rated Movies";
  } else if (sort === "trending") {
    icon = <Compass size={22} className="text-blue-400" />;
    title = lang ? `Trending ${langLabel} Titles` : type === "tv" ? "Trending Series" : "Trending Now";
  } else if (sort === "history") {
    icon = <History size={22} className="text-red-500" />;
    title = "Recently Watched";
  }

  return (
    <div className="mb-8 md:mb-10 flex items-center gap-4">
      <span>{icon}</span>
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">{title}</h1>
        {loading ? (
          <div className="h-4 w-28 bg-white/5 rounded animate-pulse mt-1" />
        ) : (
          <p className="text-zinc-500 mt-1 text-sm font-medium">
            {total} title{total !== 1 ? "s" : ""} found
          </p>
        )}
      </div>
    </div>
  );
};

// ─── Empty State ──────────────────────────────────────────────────────────────

const EmptyState = () => (
  <div className="col-span-full flex flex-col items-center gap-4 py-24 text-zinc-600">
    <Search size={48} className="opacity-20" />
    <p className="text-lg italic text-zinc-500">No results found.</p>
    <p className="text-sm text-zinc-600">Try a different search term or filter.</p>
  </div>
);

// ─── Main Browse Component ────────────────────────────────────────────────────

const Browse = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [movies, setMovies] = useState<MovieDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const query = searchParams.get("q");
  const type = searchParams.get("type") || "movie";
  const sort = searchParams.get("sort");
  const lang = searchParams.get("lang");
  const companyId = searchParams.get("company");
  const companyName = searchParams.get("company_name") || "Production Company";

  const isCompanyMode = Boolean(companyId);

  // ── Data fetcher ──────────────────────────────────────────────────────────

  const loadMovies = useCallback(
    async (page: number, append = false) => {
      if (append) setLoadingMore(true);
      else setLoading(true);

      try {
        let results: MovieDetails[] = [];
        let pages = 1;

        if (isCompanyMode && companyId) {
          const data = await getMoviesByCompany(Number(companyId), page);
          results = data.results ?? [];
          pages = data.total_pages ?? 1;
        } else if (sort === "history") {
          results = getWatchHistory() as unknown as MovieDetails[];
          pages = 1;
        } else if (lang) {
          if (query) {
            const data = await searchByLanguage({
              query,
              language: lang,
              mediaType: type as "movie" | "tv" | "all",
              page,
            });
            results = data.results ?? [];
            pages = data.total_pages ?? 1;
          } else {
            const data = await getMoviesByLanguage({
              language: lang,
              mediaType: type === "tv" ? "tv" : "movie",
              page,
              sortBy: sort === "top" ? "vote_average.desc" : sort === "new" ? "primary_release_date.desc" : "popularity.desc",
            });
            results = (data?.results ?? []).map((m: MovieDetails) => ({
              ...m,
              media_type: type as "movie" | "tv",
            }));
            pages = data?.total_pages ?? 1;
          }
        } else if (query) {
          if (type === "movie") {
            const data = await fetchMovies({
              title: "Search",
              mediaType: "movie",
              fetcher: "search",
              params: { query },
            }, page);
            results = data.results ?? [];
            pages = data.total_pages ?? 1;
          } else if (type === "tv") {
            const data = await fetchMovies({
              title: "Search",
              mediaType: "tv",
              fetcher: "search",
              params: { query },
            }, page);
            results = data.results ?? [];
            pages = data.total_pages ?? 1;
          } else {
            const data = await searchMulti(query, page);
            results = data.results ?? [];
            pages = data.total_pages ?? 1;
          }
        } else {
          let config = ROW_CONFIG.find((r) => r.mediaType === type) || ROW_CONFIG[0];
          if (sort === "new") {
            config =
              ROW_CONFIG.find(
                (r) => r.fetcher === "discover" && r.mediaType === (type as "movie" | "tv")
              ) ||
              ROW_CONFIG.find((r) => r.fetcher === "discover") ||
              config;
          } else if (sort === "top") {
            config =
              ROW_CONFIG.find(
                (r) => r.fetcher === "topRated" && r.mediaType === (type as "movie" | "tv")
              ) ||
              ROW_CONFIG.find((r) => r.fetcher === "topRated") ||
              config;
          } else if (sort === "trending") {
            config =
              ROW_CONFIG.find(
                (r) => r.fetcher === "trending" && r.mediaType === (type as "movie" | "tv")
              ) ||
              ROW_CONFIG[0];
          }
          const data = await fetchMovies(config, page);
          results = data.results ?? [];
          pages = data.total_pages ?? 1;
        }

        setTotalPages(pages);
        setMovies((prev) => (append ? [...prev, ...results] : results));
      } catch (err) {
        console.error("Failed to load browse movies:", err);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [query, type, sort, lang, companyId, isCompanyMode]
  );

  // Reset and reload on params change
  useEffect(() => {
    setMovies([]);
    setCurrentPage(1);
    setTotalPages(1);
    loadMovies(1, false);
  }, [loadMovies]);

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    loadMovies(nextPage, true);
  };

  const handleLanguageFilter = (code?: string) => {
    const nextParams = new URLSearchParams(searchParams);
    if (!code) {
      nextParams.delete("lang");
    } else {
      nextParams.set("lang", code);
    }
    navigate(`/browse?${nextParams.toString()}`);
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Header />

      <main className="pt-20 md:pt-28 px-4 md:px-10 pb-28 md:pb-24">
        {/* Company banner OR standard header */}
        {isCompanyMode ? (
          <CompanyBanner name={companyName} movieCount={movies.length} />
        ) : (
          <div>
            <PageHeader
              query={query}
              type={type}
              sort={sort}
              lang={lang}
              total={movies.length}
              loading={loading}
            />

            {/* Quick Language Filter Pills in Browse */}
            <div className="mb-8 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide select-none">
              <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 mr-1 shrink-0 uppercase tracking-wider">
                <Globe2 size={13} className="text-red-500" />
                <span>Languages:</span>
              </div>
              <button
                onClick={() => handleLanguageFilter()}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all border cursor-pointer ${
                  !lang
                    ? "bg-red-600 text-white border-red-500 shadow-md shadow-red-950/40"
                    : "bg-white/[0.04] text-zinc-400 border-white/5 hover:text-white hover:bg-white/[0.08]"
                }`}
              >
                All Languages
              </button>
              {POPULAR_LANGUAGES.map((l) => {
                const isActive = lang?.toLowerCase() === l.code.toLowerCase();
                return (
                  <button
                    key={l.code}
                    onClick={() => handleLanguageFilter(isActive ? undefined : l.code)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all border flex items-center gap-1.5 cursor-pointer ${
                      isActive
                        ? "bg-red-600 text-white border-red-500 shadow-md shadow-red-950/40"
                        : "bg-white/[0.04] text-zinc-400 border-white/5 hover:text-white hover:bg-white/[0.08]"
                    }`}
                  >
                    <span>{l.name}</span>
                    {l.nativeName !== l.name && (
                      <span className="text-[10px] opacity-70 font-normal">{l.nativeName}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
            {Array(18)
              .fill(0)
              .map((_, idx) => (
                <div key={idx} className="space-y-3">
                  <Skeleton className="aspect-[2/3] w-full rounded-2xl" />
                  <div className="px-1 space-y-2">
                    <Skeleton variant="text" className="w-3/4 h-3.5" />
                    <Skeleton variant="text" className="w-1/2 h-2.5" />
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
              {movies.length > 0 ? (
                movies.map((movie: MovieDetails) => {
                  const media =
                    movie.media_type || (isCompanyMode ? "movie" : (type as "movie" | "tv"));
                  const title =
                    movie.title || movie.name || movie.original_title;
                  const date =
                    movie.release_date || movie.first_air_date || "N/A";
                  return (
                    <MovieCard
                      key={movie.id}
                      title={title}
                      posterPath={movie.poster_path}
                      releaseYear={date.split("-")[0]}
                      releaseDate={movie.release_date || movie.first_air_date}
                      rating={movie.vote_average}
                      popularity={movie.popularity}
                      voteCount={movie.vote_count}
                      tmdbId={movie.id}
                      mediaType={media}
                      onClick={(id) => {
                        const targetUrl = media === "tv" ? getSeriesWatchUrl(id) : `/watch/${media}/${id}`;
                        navigate(targetUrl, {
                          state: {
                            movie: {
                              id: movie.id,
                              title,
                              poster_path: movie.poster_path,
                              release_date: date,
                              vote_average: movie.vote_average,
                              popularity: movie.popularity,
                              vote_count: movie.vote_count,
                            },
                          },
                        });
                      }}
                    />
                  );
                })
              ) : (
                <EmptyState />
              )}
            </div>

            {/* Skeleton placeholders while loading more */}
            {loadingMore && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5 mt-4 sm:mt-5">
                {Array(6)
                  .fill(0)
                  .map((_, idx) => (
                    <div key={idx} className="space-y-3">
                      <Skeleton className="aspect-[2/3] w-full rounded-2xl" />
                      <div className="px-1 space-y-2">
                        <Skeleton variant="text" className="w-3/4 h-3.5" />
                        <Skeleton variant="text" className="w-1/2 h-2.5" />
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {/* Load More Button */}
            {movies.length > 0 && currentPage < totalPages && (
              <div className="mt-12 flex justify-center">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 px-8 py-3 text-sm font-semibold text-zinc-300 hover:bg-white/10 hover:text-white hover:border-white/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                >
                  {loadingMore ? (
                    <span className="text-zinc-400 animate-pulse">Loading more titles…</span>
                  ) : (
                    <>
                      <ChevronDown size={16} />
                      Load More
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Browse;
