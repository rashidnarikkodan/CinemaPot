import { useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Globe2,
  Film,
  Tv,
  Search,
  X,
  ChevronDown,
  Sparkles,
  SlidersHorizontal,
  Flame,
  Star,
  Calendar,
} from "lucide-react";
import Header from "../../components/common/Header";
import MovieCard from "../../components/movie/MovieCard";
import Skeleton from "../../components/common/Skeleton";
import {
  POPULAR_LANGUAGES,
  getLanguageByCode,
  getLanguageName,
} from "../../config/languages";
import { getMoviesByLanguage, searchByLanguage } from "../../services/tmdb.service";
import { getSeriesWatchUrl } from "../../utils/watchHistory";
import type { MovieDetails } from "../../types/movie";

type MediaTypeFilter = "movie" | "tv" | "all";
type SortOption = "popularity.desc" | "vote_average.desc" | "primary_release_date.desc";

const Languages = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // URL state
  const langParam = searchParams.get("lang") || "ml";
  const queryParam = searchParams.get("q") || "";
  const typeParam = (searchParams.get("type") as MediaTypeFilter) || "movie";
  const sortParam = (searchParams.get("sort") as SortOption) || "popularity.desc";

  // Local state
  const [selectedLanguage, setSelectedLanguage] = useState<string>(langParam);
  const [searchQuery, setSearchQuery] = useState<string>(queryParam);
  const [mediaType, setMediaType] = useState<MediaTypeFilter>(typeParam);
  const [sortBy, setSortBy] = useState<SortOption>(sortParam);

  const [movies, setMovies] = useState<MovieDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync state when URL params change externally (e.g. Back/Forward)
  useEffect(() => {
    if (langParam !== selectedLanguage) setSelectedLanguage(langParam);
    if (queryParam !== searchQuery) setSearchQuery(queryParam);
    if (typeParam !== mediaType) setMediaType(typeParam);
    if (sortParam !== sortBy) setSortBy(sortParam);
  }, [langParam, queryParam, typeParam, sortParam]);

  // Update URL helper
  const updateUrlParams = (updates: {
    lang?: string;
    q?: string;
    type?: MediaTypeFilter;
    sort?: SortOption;
  }) => {
    const newParams = new URLSearchParams(searchParams);

    const nextLang = updates.lang !== undefined ? updates.lang : selectedLanguage;
    const nextQ = updates.q !== undefined ? updates.q : searchQuery;
    const nextType = updates.type !== undefined ? updates.type : mediaType;
    const nextSort = updates.sort !== undefined ? updates.sort : sortBy;

    if (nextLang) newParams.set("lang", nextLang);
    else newParams.delete("lang");

    if (nextQ.trim()) newParams.set("q", nextQ.trim());
    else newParams.delete("q");

    if (nextType && nextType !== "movie") newParams.set("type", nextType);
    else newParams.delete("type");

    if (nextSort && nextSort !== "popularity.desc") newParams.set("sort", nextSort);
    else newParams.delete("sort");

    setSearchParams(newParams);
  };

  // Fetch movies by language or search within language
  const fetchLanguageContent = useCallback(
    async (page: number, append = false) => {
      if (append) setLoadingMore(true);
      else setLoading(true);

      try {
        let results: MovieDetails[] = [];
        let pages = 1;
        let count = 0;

        if (searchQuery.trim().length >= 2) {
          // Search within selected language
          const data = await searchByLanguage({
            query: searchQuery.trim(),
            language: selectedLanguage,
            mediaType: mediaType,
            page,
          });
          results = data.results ?? [];
          pages = data.total_pages ?? 1;
          count = data.total_results ?? results.length;
        } else {
          // Discover by language
          if (mediaType === "all") {
            const [movieData, tvData] = await Promise.all([
              getMoviesByLanguage({
                language: selectedLanguage,
                mediaType: "movie",
                page,
                sortBy,
              }),
              getMoviesByLanguage({
                language: selectedLanguage,
                mediaType: "tv",
                page,
                sortBy,
              }),
            ]);

            const merged = [
              ...(movieData?.results ?? []).map((m: MovieDetails) => ({ ...m, media_type: "movie" as const })),
              ...(tvData?.results ?? []).map((t: MovieDetails) => ({ ...t, media_type: "tv" as const })),
            ].sort((a, b) => (b.popularity || 0) - (a.popularity || 0));

            results = merged;
            pages = Math.max(movieData?.total_pages || 1, tvData?.total_pages || 1);
            count = (movieData?.total_results || 0) + (tvData?.total_results || 0);
          } else {
            const data = await getMoviesByLanguage({
              language: selectedLanguage,
              mediaType,
              page,
              sortBy,
            });
            results = (data?.results ?? []).map((m: MovieDetails) => ({
              ...m,
              media_type: mediaType,
            }));
            pages = data?.total_pages ?? 1;
            count = data?.total_results ?? results.length;
          }
        }

        setTotalPages(pages);
        setTotalResults(count);
        setMovies((prev) => (append ? [...prev, ...results] : results));
      } catch (err) {
        console.error("Failed to load language content:", err);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [selectedLanguage, searchQuery, mediaType, sortBy]
  );

  // Trigger load on filter changes
  useEffect(() => {
    setCurrentPage(1);
    fetchLanguageContent(1, false);
  }, [fetchLanguageContent]);

  // Handle Search Input Change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      updateUrlParams({ q: value });
    }, 350);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    updateUrlParams({ q: "" });
  };

  const handleLanguageSelect = (code: string) => {
    setSelectedLanguage(code);
    updateUrlParams({ lang: code });
  };

  const handleMediaTypeChange = (type: MediaTypeFilter) => {
    setMediaType(type);
    updateUrlParams({ type });
  };

  const handleSortChange = (sort: SortOption) => {
    setSortBy(sort);
    updateUrlParams({ sort });
  };

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchLanguageContent(nextPage, true);
  };

  const activeLangObj = getLanguageByCode(selectedLanguage);
  const activeLangName = getLanguageName(selectedLanguage);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Header />

      <main className="pt-20 md:pt-28 px-4 md:px-10 pb-28 md:pb-24 max-w-7xl mx-auto">
        {/* ─── Hero / Header Section ────────────────────────────────────────── */}
        <div className="relative mb-8 rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-zinc-900/90 via-[#141416]/80 to-zinc-950/90 p-6 md:p-10 shadow-2xl backdrop-blur-xl">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/15 border border-red-500/25 text-red-400 text-xs font-semibold tracking-wider uppercase mb-3">
                <Globe2 size={14} className="animate-pulse" />
                Language Explorer
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight flex items-center gap-3">
                {activeLangName}
                {activeLangObj?.nativeName && activeLangObj.nativeName !== activeLangName && (
                  <span className="text-xl md:text-2xl text-zinc-400 font-normal">
                    ({activeLangObj.nativeName})
                  </span>
                )}
              </h1>
              <p className="mt-2 text-sm md:text-base text-zinc-400 max-w-2xl">
                Browse popular blockbusters, top-rated hits, and search specifically within{" "}
                <span className="text-white font-medium">{activeLangName}</span> cinema.
              </p>
            </div>

            {/* In-Language Search Input */}
            <div className="w-full md:w-80 lg:w-96">
              <div className="relative flex items-center">
                <Search
                  size={18}
                  className="absolute left-4 text-zinc-400 pointer-events-none"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder={`Search ${activeLangName} titles…`}
                  className="w-full rounded-2xl bg-black/50 border border-white/15 pl-11 pr-10 py-3.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all shadow-inner"
                />
                {searchQuery && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute right-3.5 p-1 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                    aria-label="Clear search"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ─── Language Selector Pills ──────────────────────────────────── */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-zinc-400">
              <Sparkles size={14} className="text-red-500" />
              <span>Select Language</span>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide select-none">
              {POPULAR_LANGUAGES.map((lang) => {
                const isActive = selectedLanguage.toLowerCase() === lang.code.toLowerCase();
                return (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageSelect(lang.code)}
                    className={`
                      group flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold shrink-0
                      transition-all duration-200 active:scale-95 cursor-pointer border
                      ${
                        isActive
                          ? "bg-red-600 text-white border-red-500 shadow-lg shadow-red-950/50 scale-[1.02]"
                          : "bg-white/[0.04] text-zinc-300 border-white/8 hover:bg-white/[0.08] hover:text-white hover:border-white/15"
                      }
                    `}
                    aria-pressed={isActive}
                  >
                    <span>{lang.name}</span>
                    {lang.nativeName !== lang.name && (
                      <span
                        className={`text-[11px] px-1.5 py-0.5 rounded-md font-normal transition-colors ${
                          isActive
                            ? "bg-black/25 text-white/90"
                            : "bg-white/5 text-zinc-400 group-hover:text-zinc-300"
                        }`}
                      >
                        {lang.nativeName}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ─── Controls & Filters Row ───────────────────────────────────────── */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          {/* Media Type Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/[0.04] border border-white/10">
            <button
              onClick={() => handleMediaTypeChange("movie")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                mediaType === "movie"
                  ? "bg-red-600 text-white shadow-md shadow-red-950/40"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Film size={14} />
              Movies
            </button>
            <button
              onClick={() => handleMediaTypeChange("tv")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                mediaType === "tv"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-950/40"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Tv size={14} />
              Series
            </button>
            <button
              onClick={() => handleMediaTypeChange("all")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                mediaType === "all"
                  ? "bg-purple-600 text-white shadow-md shadow-purple-950/40"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Sparkles size={14} />
              All
            </button>
          </div>

          {/* Sort & Status Controls */}
          <div className="flex items-center gap-3">
            {!searchQuery && (
              <div className="flex items-center gap-1.5 text-xs">
                <SlidersHorizontal size={14} className="text-zinc-500" />
                <span className="text-zinc-400 hidden sm:inline">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value as SortOption)}
                  className="bg-zinc-900 border border-white/10 text-zinc-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-white/30 cursor-pointer"
                >
                  <option value="popularity.desc">🔥 Most Popular</option>
                  <option value="vote_average.desc">⭐ Top Rated</option>
                  <option value="primary_release_date.desc">📅 Latest Releases</option>
                </select>
              </div>
            )}

            <div className="text-xs font-medium text-zinc-500">
              {loading ? (
                <div className="h-4 w-20 bg-white/5 rounded animate-pulse" />
              ) : (
                <span>
                  {totalResults} {mediaType === "tv" ? "series" : "title"}
                  {totalResults !== 1 ? "s" : ""}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ─── Grid ─────────────────────────────────────────────────────────── */}
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
        ) : movies.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
              {movies.map((movie: MovieDetails) => {
                const media = movie.media_type || (mediaType === "tv" ? "tv" : "movie");
                const title = movie.title || movie.name || movie.original_title;
                const date = movie.release_date || movie.first_air_date || "N/A";

                return (
                  <MovieCard
                    key={`${movie.id}-${media}`}
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
                      const targetUrl =
                        media === "tv" ? getSeriesWatchUrl(id) : `/watch/${media}/${id}`;
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
              })}
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
            {currentPage < totalPages && (
              <div className="mt-12 flex justify-center">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 px-8 py-3 text-sm font-semibold text-zinc-300 hover:bg-white/10 hover:text-white hover:border-white/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 cursor-pointer shadow-lg"
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
        ) : (
          <div className="col-span-full flex flex-col items-center gap-4 py-24 text-center">
            <div className="p-4 rounded-full bg-white/5 border border-white/10">
              <Search size={40} className="text-zinc-500" />
            </div>
            <p className="text-lg font-semibold text-zinc-300">
              {searchQuery
                ? `No ${activeLangName} titles found for "${searchQuery}"`
                : `No titles found in ${activeLangName}`}
            </p>
            <p className="text-sm text-zinc-500 max-w-sm">
              {searchQuery
                ? "Try searching with alternate spellings, or switch to another language."
                : "Try selecting a different language or media category above."}
            </p>
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="mt-2 px-5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Languages;
