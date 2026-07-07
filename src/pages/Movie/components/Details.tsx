import { Star } from "lucide-react";
import Row from "./Row";
import type { Movie } from "../../../types/movie";
import Skeleton from "../../../components/common/Skeleton";

type MediaDetails = Partial<Movie> & {
  name?: string;
  first_air_date?: string;
  episode_run_time?: number[];
};

const Details = ({ media: movie, loading = false }: { media: MediaDetails | null; loading?: boolean }) => {
  if (!movie && !loading) return null;
  return (
    <div className="bg-[#111113] border border-white/5 rounded-xl p-6 space-y-6 sticky top-32 shadow-xl shadow-black/50 w-full">

      {/* Poster + Title */}
      <div className="flex gap-4">
        {movie?.poster_path ? (
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            className="w-24 rounded-lg object-cover"
            fetchPriority="high"
            alt={movie.title || movie.name || "Poster"}
          />
        ) : (
          <Skeleton className="w-24 h-36 rounded-lg shrink-0 animate-pulse" />
        )}

        <div className="space-y-2 flex-1">
          <h1 className="text-xl font-bold leading-tight">
            {movie ? (movie.title || movie.name) : <Skeleton variant="text" className="w-3/4 h-6" />}
          </h1>

          <div className="text-zinc-400 text-sm">
            {movie ? (
              <>
                {(movie.release_date || movie.first_air_date)?.split("-")[0]} • {movie.runtime || movie.episode_run_time?.[0] || "N/A"} min
              </>
            ) : (
              <Skeleton variant="text" className="w-1/2 h-4" />
            )}
          </div>

          <div>
            {movie ? (
              <div className="flex items-center gap-2 text-yellow-400 text-sm">
                <Star className="h-4 w-4 fill-current" />
                {movie.vote_average?.toFixed(1) || "0.0"}
                <span className="text-zinc-500">
                  ({movie.vote_count?.toLocaleString() || "0"})
                </span>
              </div>
            ) : (
              <Skeleton variant="text" className="w-1/3 h-4" />
            )}
          </div>
        </div>
      </div>


      {/* Genres */}
      <div>
        <h3 className="text-sm text-zinc-400 mb-2 font-semibold">Genres</h3>

        <div className="flex flex-wrap gap-2">
          {movie?.genres ? (
            movie.genres.map(g => (
              <span
                key={g.id}
                className="px-2 py-1 text-xs bg-zinc-800 rounded text-zinc-200"
              >
                {g.name}
              </span>
            ))
          ) : loading ? (
            <>
              <Skeleton className="w-16 h-6 rounded" />
              <Skeleton className="w-20 h-6 rounded" />
              <Skeleton className="w-12 h-6 rounded" />
            </>
          ) : (
            <span className="text-xs text-zinc-500">N/A</span>
          )}
        </div>
      </div>


      {/* Tagline */}
      {(movie?.tagline || loading) && (
        <div>
          {movie?.tagline ? (
            <p className="text-zinc-400 text-sm italic">
              "{movie.tagline}"
            </p>
          ) : (
            <Skeleton variant="text" className="w-full h-4" />
          )}
        </div>
      )}


      {/* Metadata Table */}
      <div className="space-y-3 text-sm">

        <Row label="Original Language">
          {movie?.original_language ? movie.original_language.toUpperCase() : (loading ? <Skeleton className="w-12 h-4 inline-block" /> : "N/A")}
        </Row>

        <Row label="Status">
          {movie?.status || (loading ? <Skeleton className="w-16 h-4 inline-block" /> : "N/A")}
        </Row>

        <Row label="Popularity">
          {movie?.popularity !== undefined ? movie.popularity.toFixed(0) : (loading ? <Skeleton className="w-10 h-4 inline-block" /> : "0")}
        </Row>

        <Row label="Budget">
          {movie?.budget !== undefined ? `$${movie.budget.toLocaleString()}` : (loading ? <Skeleton className="w-20 h-4 inline-block" /> : "N/A")}
        </Row>

        <Row label="Revenue">
          {movie?.revenue !== undefined ? `$${movie.revenue.toLocaleString()}` : (loading ? <Skeleton className="w-20 h-4 inline-block" /> : "N/A")}
        </Row>

        <Row label="Production">
          {movie?.production_companies?.[0]?.name || (loading ? <Skeleton className="w-24 h-4 inline-block" /> : "N/A")}
        </Row>

        <Row label="Country">
          {movie?.production_countries ? (
            movie.production_countries.map(c => c.name).join(", ")
          ) : (loading ? <Skeleton className="w-32 h-4 inline-block" /> : "N/A")}
        </Row>

      </div>

    </div>
  );
};

export default Details;