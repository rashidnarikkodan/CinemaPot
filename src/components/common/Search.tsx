import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Film, Tv, Building2, Star, ArrowRight, X, TrendingUp } from "lucide-react";
import { searchCompany } from "../../services/tmdb.service";
import type { CompanySearchResult, MovieDetails } from "../../types/movie";
import { fetchMovies } from "../../utils/fetchMovies";

// ─── Types ────────────────────────────────────────────────────────────────────

type SearchTab = "movie" | "tv" | "company";

interface ResultItem {
  id: number;
  title: string;
  year: string;
  mediaType: SearchTab;
  poster?: string | null;
  rating?: number;
  overview?: string;
  // company-specific
  logoPath?: string | null;
  originCountry?: string;
}

// ─── Animated Spinner ─────────────────────────────────────────────────────────

const Spinner = () => (
  <div className="flex items-center justify-center py-10">
    <div
      className="h-8 w-8 rounded-full border-2 border-zinc-700 border-t-red-500 animate-spin"
      aria-label="Loading"
    />
  </div>
);

// ─── Empty State ──────────────────────────────────────────────────────────────

const EmptyState = ({ query }: { query: string }) => (
  <div className="flex flex-col items-center gap-3 py-10 text-zinc-500">
    <Search size={36} className="opacity-30" />
    <p className="text-sm">
      No results for <span className="text-zinc-300 font-semibold">"{query}"</span>
    </p>
    <p className="text-xs text-zinc-600">Try a different keyword or tab</p>
  </div>
);

// ─── Idle Placeholder ─────────────────────────────────────────────────────────

const IdlePlaceholder = ({ tab }: { tab: SearchTab }) => {
  const hints: Record<SearchTab, { icon: React.ReactNode; text: string }> = {
    movie: { icon: <Film size={32} />, text: "Search for movies — try \"Inception\" or \"Dune\"" },
    tv:    { icon: <Tv size={32} />,   text: "Search TV shows — try \"Breaking Bad\" or \"Severance\"" },
    company: { icon: <Building2 size={32} />, text: "Search studios — try \"Marvel\", \"A24\" or \"Pixar\"" },
  };
  const { icon, text } = hints[tab];
  return (
    <div className="flex flex-col items-center gap-3 py-10 text-zinc-600">
      <span className="opacity-30">{icon}</span>
      <p className="text-xs text-center px-4">{text}</p>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const SearchModal = ({ onClose }: { onClose: () => void }) => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<SearchTab>("movie");
  const [results, setResults] = useState<ResultItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // ── Search logic ─────────────────────────────────────────────────────────

  const performSearch = useCallback(async (query: string, tab: SearchTab) => {
    setIsLoading(true);
    setHasSearched(true);
    setFocusedIndex(-1);

    try {
      if (tab === "company") {
        const data = await searchCompany(query);
        const formatted: ResultItem[] = (data.results ?? [])
          .slice(0, 8)
          .map((c: CompanySearchResult) => ({
            id: c.id,
            title: c.name,
            year: c.origin_country,
            mediaType: "company" as SearchTab,
            logoPath: c.logo_path,
            originCountry: c.origin_country,
          }));
        setResults(formatted);
      } else {
        const data = await fetchMovies({
          title: "Search",
          mediaType: tab,
          fetcher: "search",
          params: { query },
        });
        const formatted: ResultItem[] = (data.results as MovieDetails[])
          .slice(0, 10)
          .map((m) => ({
            id: m.id,
            title: m.title || m.name || "",
            year: (m.release_date || m.first_air_date || "").split("-")[0],
            mediaType: tab,
            poster: m.poster_path,
            rating: m.vote_average,
            overview: m.overview,
          }));
        setResults(formatted);
      }
    } catch (err) {
      console.error("Search failed:", err);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ── Debounced input handler ───────────────────────────────────────────────

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (value.trim().length < 2) {
      setResults([]);
      setHasSearched(false);
      setIsLoading(false);
      return;
    }

    debounceRef.current = setTimeout(() => {
      performSearch(value.trim(), activeTab);
    }, 300);
  };

  // Re-search when tab switches if there's a query
  const handleTabChange = (tab: SearchTab) => {
    setActiveTab(tab);
    setResults([]);
    setHasSearched(false);
    setFocusedIndex(-1);
    if (searchTerm.trim().length >= 2) {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        performSearch(searchTerm.trim(), tab);
      }, 150);
    }
  };

  // ── Result selection ──────────────────────────────────────────────────────

  const handleSelectResult = (item: ResultItem) => {
    onClose();
    if (item.mediaType === "company") {
      navigate(`/browse?company=${item.id}&company_name=${encodeURIComponent(item.title)}`);
    } else {
      navigate(`/browse/${item.id}`);
    }
  };

  const handleSeeMore = () => {
    onClose();
    if (!searchTerm.trim()) {
      navigate("/browse");
      return;
    }
    if (activeTab === "company") {
      navigate(`/browse?q=${encodeURIComponent(searchTerm.trim())}&type=company`);
    } else {
      navigate(`/browse?q=${encodeURIComponent(searchTerm.trim())}&type=${activeTab}`);
    }
  };

  // ── Keyboard navigation ───────────────────────────────────────────────────

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === "Enter") {
      if (focusedIndex >= 0 && results[focusedIndex]) {
        handleSelectResult(results[focusedIndex]);
      } else {
        handleSeeMore();
      }
    }
  };

  // Scroll focused item into view
  useEffect(() => {
    if (focusedIndex < 0 || !listRef.current) return;
    const items = listRef.current.querySelectorAll("li[data-index]");
    const el = items[focusedIndex] as HTMLElement;
    el?.scrollIntoView({ block: "nearest" });
  }, [focusedIndex]);

  // ── Global Escape key & Body Scroll Lock ──────────────────────────────────

  useEffect(() => {
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", esc);
    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      window.removeEventListener("keydown", esc);
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [onClose]);

  // ── Tabs config ───────────────────────────────────────────────────────────

  const tabs: { id: SearchTab; label: string; icon: React.ReactNode }[] = [
    { id: "movie",   label: "Movies",    icon: <Film   size={13} /> },
    { id: "tv",      label: "TV Shows",  icon: <Tv     size={13} /> },
    { id: "company", label: "Studios",   icon: <Building2 size={13} /> },
  ];

  const showDropdown = isLoading || hasSearched;

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 px-4">

      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal shell */}
      <div
        className="relative w-full max-w-xl"
        style={{ animation: "searchModalIn 0.2s cubic-bezier(0.16,1,0.3,1) both" }}
      >
        <style>{`
          @keyframes searchModalIn {
            from { opacity:0; transform: translateY(-16px) scale(0.97); }
            to   { opacity:1; transform: translateY(0)     scale(1);    }
          }
          @keyframes resultSlideIn {
            from { opacity:0; transform: translateX(-8px); }
            to   { opacity:1; transform: translateX(0);    }
          }
        `}</style>

        {/* ── Card ───────────────────────────────────────────────────────── */}
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0f0f0f] shadow-2xl shadow-black/60">

          {/* ── Search input row ──────────────────────────────────────────── */}
          <div className="flex items-center gap-3 px-4 py-4 border-b border-white/5">
            <Search size={18} className="shrink-0 text-red-500" />
            <input
              ref={inputRef}
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              placeholder="Search movies, series, and studios…"
              autoFocus
              className="flex-1 bg-transparent text-white text-[15px] placeholder-zinc-500 outline-none"
              aria-label="Search"
              aria-autocomplete="list"
              role="combobox"
              aria-expanded={showDropdown}
            />
            {searchTerm ? (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setResults([]);
                  setHasSearched(false);
                  inputRef.current?.focus();
                }}
                className="text-zinc-500 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/10"
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="text-zinc-500 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/10"
                aria-label="Close search"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* ── Category Filter Buttons (Restored for All Devices) ────────── */}
          <div className="flex gap-1.5 px-4 pt-3 pb-2.5 border-b border-white/5 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`
                  flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0
                  transition-all duration-200
                  ${activeTab === tab.id
                    ? "bg-red-600 text-white shadow-lg shadow-red-900/40"
                    : "text-zinc-400 hover:text-white hover:bg-white/8 border border-white/10"
                  }
                `}
                aria-pressed={activeTab === tab.id}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* ── Results area ─────────────────────────────────────────────── */}
          <div className="max-h-[60vh] overflow-y-auto">

            {/* Loading */}
            {isLoading && <Spinner />}

            {/* No results */}
            {!isLoading && hasSearched && results.length === 0 && (
              <EmptyState query={searchTerm} />
            )}

            {/* Idle */}
            {!isLoading && !hasSearched && (
              <IdlePlaceholder tab={activeTab} />
            )}

            {/* Results list */}
            {!isLoading && results.length > 0 && (
              <ul ref={listRef} role="listbox" aria-label="Search results">
                {results.map((item, idx) => (
                  <li
                    key={item.id}
                    data-index={idx}
                    role="option"
                    aria-selected={focusedIndex === idx}
                    onClick={() => handleSelectResult(item)}
                    onMouseEnter={() => setFocusedIndex(idx)}
                    className={`
                      flex items-center gap-4 px-4 py-3 cursor-pointer
                      transition-all duration-150 border-b border-white/4 last:border-0
                      ${focusedIndex === idx ? "bg-white/8" : "hover:bg-white/5"}
                    `}
                    style={{ animation: `resultSlideIn 0.18s ${idx * 0.04}s both` }}
                  >
                    {/* Thumbnail */}
                    {item.mediaType === "company" ? (
                      <div className="flex h-12 w-16 items-center justify-center rounded-lg bg-zinc-800/80 border border-white/8 overflow-hidden shrink-0">
                        {item.logoPath ? (
                          <img
                            src={`https://image.tmdb.org/t/p/w92${item.logoPath}`}
                            alt={item.title}
                            className="max-h-8 max-w-[52px] object-contain filter brightness-[1.15]"
                          />
                        ) : (
                          <Building2 size={22} className="text-zinc-600" />
                        )}
                      </div>
                    ) : (
                      <div className="relative h-14 w-10 shrink-0 overflow-hidden rounded-md shadow-lg">
                        {item.poster ? (
                          <img
                            src={`https://image.tmdb.org/t/p/w92${item.poster}`}
                            alt={item.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-zinc-800 text-zinc-600">
                            {activeTab === "tv" ? <Tv size={16} /> : <Film size={16} />}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[14px] text-white truncate leading-tight">
                        {item.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        {item.year && (
                          <span className="text-[11px] text-zinc-500">{item.year}</span>
                        )}
                        {item.mediaType !== "company" && item.rating !== undefined && item.rating > 0 && (
                          <>
                            <span className="text-zinc-700">·</span>
                            <span className="flex items-center gap-0.5 text-[11px] text-amber-400 font-medium">
                              <Star size={9} fill="currentColor" />
                              {item.rating.toFixed(1)}
                            </span>
                          </>
                        )}
                        {item.mediaType !== "company" && (
                          <>
                            <span className="text-zinc-700">·</span>
                            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                              item.mediaType === "tv"
                                ? "bg-blue-600/20 text-blue-400"
                                : "bg-red-600/20 text-red-400"
                            }`}>
                              {item.mediaType === "tv" ? "TV" : "FILM"}
                            </span>
                          </>
                        )}
                        {item.mediaType === "company" && item.originCountry && (
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-purple-600/20 text-purple-400">
                            {item.originCountry || "Studio"}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Arrow */}
                    <ArrowRight
                      size={14}
                      className={`shrink-0 transition-all duration-150 ${
                        focusedIndex === idx
                          ? "text-red-400 translate-x-0.5"
                          : "text-zinc-700"
                      }`}
                    />
                  </li>
                ))}
              </ul>
            )}

            {/* See more footer */}
            {!isLoading && results.length > 0 && (
              <button
                onClick={handleSeeMore}
                className="flex w-full items-center justify-center gap-2 py-3 text-[13px] text-zinc-400 hover:text-white hover:bg-white/5 transition-all duration-200 border-t border-white/5 group"
              >
                <TrendingUp size={14} className="group-hover:text-red-400 transition-colors" />
                Browse all results for <span className="text-white font-medium">"{searchTerm}"</span>
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform text-red-500" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
