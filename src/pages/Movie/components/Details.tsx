import { Star } from "lucide-react";
import type { Movie } from "../../../types/movie";
import Skeleton from "../../../components/common/Skeleton";

type MediaDetails = Partial<Movie> & {
  name?: string;
  first_air_date?: string;
  episode_run_time?: number[];
  overview?: string;
};

const Details = ({
  media: movie,
  loading = false,
}: {
  media: MediaDetails | null;
  loading?: boolean;
}) => {
  if (!movie && !loading) return null;

  return (
    <div className="bg-[#111113] border border-white/5 rounded-xl p-5 space-y-4 sticky top-28 shadow-xl shadow-black/50 w-full">
      {/* Poster + Title */}
      <div className="flex gap-4">
        {movie?.poster_path ? (
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            className="w-20 sm:w-24 rounded-lg object-cover shadow-md shrink-0 aspect-[2/3]"
            fetchPriority="high"
            alt={movie.title || movie.name || "Poster"}
          />
        ) : (
          <Skeleton className="w-20 sm:w-24 h-32 rounded-lg shrink-0 animate-pulse" />
        )}

        <div className="space-y-1.5 flex-1 min-w-0">
          <h1 className="text-lg font-bold leading-tight line-clamp-2">
            {movie ? (
              movie.title || movie.name
            ) : (
              <Skeleton variant="text" className="w-3/4 h-6" />
            )}
          </h1>

          <div className="text-zinc-400 text-xs flex items-center gap-2">
            {movie ? (
              <>
                <span>
                  {(movie.release_date || movie.first_air_date)?.split("-")[0] ||
                    "N/A"}
                </span>
                <span>•</span>
                <span>
                  {movie.runtime || movie.episode_run_time?.[0] || "N/A"} min
                </span>
              </>
            ) : (
              <Skeleton variant="text" className="w-1/2 h-4" />
            )}
          </div>

          <div>
            {movie ? (
              <div className="flex items-center gap-1.5 text-yellow-400 text-xs font-semibold">
                <Star className="h-3.5 w-3.5 fill-current" />
                <span>{movie.vote_average?.toFixed(1) || "0.0"}</span>
                <span className="text-zinc-500 font-normal">
                  ({movie.vote_count?.toLocaleString() || "0"})
                </span>
              </div>
            ) : (
              <Skeleton variant="text" className="w-1/3 h-4" />
            )}
          </div>
        </div>
      </div>

      {/* Tagline */}
      {movie?.tagline && (
        <p className="text-zinc-400 text-xs italic border-l-2 border-red-600/60 pl-3">
          "{movie.tagline}"
        </p>
      )}

      {/* Genres */}
      <div className="flex flex-wrap gap-1.5">
        {movie?.genres ? (
          movie.genres.map((g) => (
            <span
              key={g.id}
              className="px-2.5 py-1 text-[11px] font-medium bg-zinc-800/80 border border-white/5 rounded-md text-zinc-300"
            >
              {g.name}
            </span>
          ))
        ) : loading ? (
          <>
            <Skeleton className="w-14 h-5 rounded-md" />
            <Skeleton className="w-16 h-5 rounded-md" />
            <Skeleton className="w-12 h-5 rounded-md" />
          </>
        ) : null}
      </div>

      {/* Storyline / Overview */}
      {(movie?.overview || loading) && (
        <div className="space-y-1.5 pt-3 border-t border-white/5">
          <h3 className="text-[11px] text-zinc-400 font-semibold uppercase tracking-wider">
            Storyline
          </h3>
          {movie?.overview ? (
            <p className="text-zinc-300 text-xs leading-relaxed max-h-56 overflow-y-auto pr-1">
              {movie.overview}
            </p>
          ) : (
            <div className="space-y-1.5">
              <Skeleton variant="text" className="w-full h-3" />
              <Skeleton variant="text" className="w-5/6 h-3" />
              <Skeleton variant="text" className="w-4/6 h-3" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Details;