import type { MovieRow as MovieRowType } from "../../types/row";

import MovieCard from "../movie/MovieCard";
import Skeleton from "../common/Skeleton";
import { ChevronLeft, ChevronRight, Flame, Film, Tv, Star, Gem, Globe, Shield, Smile, Ghost, Rocket, Trophy, PlayCircle, Compass, History } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getSeriesWatchUrl } from "../../utils/watchHistory";

type Props = {
  row: MovieRowType;
  isLoading: boolean;
  onClear?: () => void;
};

const getIconForTitle = (title?: string) => {
  if (!title) return <Film className="h-5 w-5 text-zinc-300" />;
  const t = title.toLowerCase();
  if (t.includes('recent') || t.includes('history') || t.includes('continue')) return <History className="h-5 w-5 text-red-500" />;
  if (t.includes('trending')) return <Flame className="h-5 w-5 text-red-500" />;
  if (t.includes('now playing') || t.includes('airing')) return <PlayCircle className="h-5 w-5 text-green-500" />;
  if (t.includes('new') || t.includes('latest')) return <Compass className="h-5 w-5 text-blue-500" />;
  if (t.includes('top rated')) return <Star className="h-5 w-5 text-yellow-500" />;
  if (t.includes('gem')) return <Gem className="h-5 w-5 text-purple-500" />;
  if (t.includes('popular')) return <Globe className="h-5 w-5 text-blue-400" />;
  if (t.includes('action')) return <Shield className="h-5 w-5 text-orange-500" />;
  if (t.includes('comedy')) return <Smile className="h-5 w-5 text-yellow-400" />;
  if (t.includes('horror') || t.includes('thriller')) return <Ghost className="h-5 w-5 text-zinc-400" />;
  if (t.includes('sci-fi')) return <Rocket className="h-5 w-5 text-indigo-400" />;
  if (t.includes('award')) return <Trophy className="h-5 w-5 text-yellow-500" />;
  if (t.includes('tv') || t.includes('series') || t.includes('anime')) return <Tv className="h-5 w-5 text-zinc-300" />;
  return <Film className="h-5 w-5 text-zinc-300" />;
};

const MovieRow = ({ row, isLoading, onClear }: Props) => {
  const navigate = useNavigate();

  const scroll = (direction: "left" | "right") => {
    const container = document.getElementById(`row-${row?.title || ''}`);
    if (container) {
      const scrollAmount = direction === "left" ? -500 : 500;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="relative px-6 md:px-12 py-6 overflow-x-hidden">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {getIconForTitle(row?.title)}
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white/90">
            {row?.title || 'Loading...'}
          </h2>
          {onClear && (
            <button
              onClick={onClear}
              className="ml-2 text-[11px] font-semibold text-zinc-400 hover:text-red-400 transition-colors uppercase tracking-wider px-2 py-0.5 rounded-md border border-white/10 hover:border-red-500/30"
              title="Clear watch history"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll("left")}
            className="w-10 h-10 flex items-center justify-center bg-black/30 hover:bg-black/60 rounded-l-3xl transition-colors"
          >
            <ChevronLeft className="h-6 w-6 text-white" />
          </button>

          <button
            onClick={() => scroll("right")}
            className="w-10 h-10 flex items-center justify-center bg-black/30 hover:bg-black/60 rounded-r-3xl transition-colors"
          >
            <ChevronRight className="h-6 w-6 text-white" />
          </button>
        </div>
      </div>

      <div className="relative">
        <div 
          id={`row-${row?.title || ''}`}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
        >
          {isLoading ? (
            Array(10).fill(0).map((_, idx) => (
              <div key={idx} className="w-36 sm:w-48 md:w-56 shrink-0 space-y-3">
                <Skeleton className="aspect-[2/3] w-full rounded-2xl" />
                <div className="px-1 space-y-2">
                  <Skeleton variant="text" className="w-3/4" />
                  <Skeleton variant="text" className="w-1/2 h-3" />
                </div>
              </div>
            ))
          ) : (
            row.movies?.map((movie) => {
              const title = (movie as any).title || (movie as any).name || (movie as any).original_title || "Untitled";
              const date = (movie as any).release_date || (movie as any).first_air_date || "N/A";
              const itemMediaType = (movie as any).media_type || row.mediaType || "movie";
              return (
                <div key={`${itemMediaType}-${movie.id}`} className="w-36 sm:w-48 md:w-56 shrink-0">
                  <MovieCard
                    title={title}
                    posterPath={movie.poster_path}
                    releaseYear={date !== "N/A" ? date.split("-")[0] : "N/A"}
                    releaseDate={(movie as any).release_date || (movie as any).first_air_date}
                    rating={movie.vote_average ?? 0}
                    popularity={movie.popularity}
                    voteCount={movie.vote_count}
                    tmdbId={movie.id}
                    mediaType={itemMediaType}
                    season={(movie as any).season}
                    episode={(movie as any).episode}
                    onClick={() => {
                      const targetUrl = itemMediaType === "tv"
                        ? getSeriesWatchUrl(movie.id)
                        : `/watch/${itemMediaType}/${movie.id}`;
                      navigate(targetUrl, {
                        state: {
                          movie: {
                            id: movie.id,
                            title: title,
                            poster_path: movie.poster_path,
                            release_date: date,
                            vote_average: movie.vote_average,
                            popularity: movie.popularity,
                            vote_count: movie.vote_count,
                            media_type: itemMediaType
                          }
                        }
                      });
                    }}
                  />
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};

export default MovieRow;

