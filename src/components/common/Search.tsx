import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { ChevronRight } from "lucide-react";
import { fetchMovies } from "../../utils/fetchMovies";
import type { MovieDetails } from "../../types/movie";

interface Movie {
  id: number;
  title: string;
  year: string;
  genre: string;
  poster?: string;
}

const SearchModal = ({onClose}:{onClose:()=>void}) => {
  const navigate = useNavigate();

  const [results, setResults] = useState<Movie[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams()
  const query = searchParams.get("q") || "";
  const [searchTerm, setSearchTerm] = useState(query||"");


  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const performSearch = async (query: string) => {
    setIsLoading(true);

    try {
      const data = await fetchMovies({
        title: "Search",
        mediaType: "movie",
        fetcher: "search",
        params: { query },
      });

      const formatted = data.results.map((m: MovieDetails) => ({
        id: m.id,
        title: m.title || m.name || "",
        year: (m.release_date || m.first_air_date || "").split("-")[0],
        genre: "Movie",
        poster: m.poster_path || undefined,
      }));

      setResults(formatted);
      setShowDropdown(true);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      if (value.trim().length > 1) {
        performSearch(value.trim());
      } else {
        setResults([]);
        setShowDropdown(false);
      }
    }, 400);
  };

  const handleSelectResult = (movie: Movie) => {
    setShowDropdown(false);
    setSearchTerm("");
    navigate(`/browse/${movie.id}`);
  };

  const handleSeeMore = () => {
    setShowDropdown(false);
    onClose();

    if (!searchTerm.trim()) {
      navigate("/browse");
      return;
    }

    navigate(`/browse?q=${encodeURIComponent(searchTerm.trim())}`);
  };

  useEffect(() => {
    const escHandler = (e: KeyboardEvent) => {
      if (e.key === "Escape") navigate(-1);
    };

    window.addEventListener("keydown", escHandler);

    return () => {
      window.removeEventListener("keydown", escHandler);
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [navigate]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-32">

      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={()=>{
          onClose()
        }}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg px-4">

        <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-[#181818] shadow-xl">

          {/* Search Row */}
          <div className="flex items-center">
            <div className="flex flex-1 items-center gap-3 px-4 py-4">
              <span className="text-red-400">
                <Search />
              </span>

              <input
              onKeyDown={(e)=>{
                if(e.key === "Enter"){
                  handleSeeMore()
                }
              }}
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search movies"
                autoFocus
                className="flex-1 bg-transparent text-white placeholder-zinc-500 outline-none"
              />
                  <button
                    onClick={handleSeeMore}
                    className="rounded-full border absolute right-7 py-1 border-red-400 px-3 text-xs text-red-400 hover:bg-red-600 hover:text-white"
                  >
                    <ChevronRight />
                  </button>
            </div>
          </div>

        </div>

        {/* Dropdown */}
        {showDropdown && (
          <div className="absolute left-4 right-4 top-full mt-2 z-50 overflow-hidden rounded-2xl border border-zinc-800 bg-[#181818] shadow-xl">

            {isLoading && (
              <div className="py-6 text-center text-zinc-400">
                Searching...
              </div>
            )}

            {!isLoading && (
              <>
                <ul className="max-h-120 overflow-auto">

                  {results.slice(0, 10).map((movie) => (
                    <li
                      key={movie.id}
                      onClick={() => handleSelectResult(movie)}
                      className="flex cursor-pointer items-center gap-4 px-4 py-4 hover:bg-[#202020] transition-colors"
                    >

                      {movie.poster ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w92${movie.poster}`}
                          alt={movie.title}
                          className="h-14 w-10 rounded object-cover shadow-lg"
                        />
                      ) : (
                        <div className="flex h-14 w-10 items-center justify-center rounded bg-zinc-700 text-[10px] text-zinc-500">
                          No Image
                        </div>
                      )}

                      <div className="text-left">
                        <div className="font-semibold text-white">
                          {movie.title}
                        </div>

                        <div className="text-xs text-zinc-400">
                          {movie.year} • {movie.genre}
                        </div>
                      </div>

                    </li>
                  ))}

                </ul>

                
              </>
            )}

          </div>
        )}

      </div>
    </div>
  );
};

export default SearchModal;
