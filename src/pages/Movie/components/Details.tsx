import { Star } from "lucide-react";
import Row from "./Row";
import type { Movie } from "../../../types/movie";


const Details = ({ media: movie }: { media: Movie }) => {
  if (!movie) return null;
  return (
    <div className="glass border border-white/5 rounded-xl p-6 space-y-6 sticky top-32">

      {/* Poster + Title */}
      <div className="flex gap-4">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          className="w-24 rounded-lg"
        />

        <div className="space-y-1">
          <h1 className="text-xl font-bold leading-tight">
            {movie.title || (movie as any).name}
          </h1>

          <p className="text-zinc-400 text-sm">
            {(movie.release_date || (movie as any).first_air_date)?.split("-")[0]} • {movie.runtime || (movie as any).episode_run_time?.[0] || "N/A"} min
          </p>

          <div className="flex items-center gap-2 text-yellow-400 text-sm">
            <Star className="h-4 w-4 fill-current" />
            {movie.vote_average?.toFixed(1) || "0.0"}
            <span className="text-zinc-500">
              ({movie.vote_count?.toLocaleString() || "0"})
            </span>
          </div>
        </div>
      </div>


      {/* Genres */}
      <div>
        <h3 className="text-sm text-zinc-400 mb-2">Genres</h3>

        <div className="flex flex-wrap gap-2">
          {movie.genres?.map(g => (
            <span
              key={g.id}
              className="px-2 py-1 text-xs bg-zinc-800 rounded"
            >
              {g.name}
            </span>
          ))}
        </div>
      </div>


      {/* Tagline */}
      {movie.tagline && (
        <p className="text-zinc-400 text-sm italic">
          "{movie.tagline}"
        </p>
      )}


      {/* Metadata Table */}
      <div className="space-y-3 text-sm">

        <Row label="Original Language">
          {movie.original_language?.toUpperCase() || "N/A"}
        </Row>

        <Row label="Status">
          {movie.status}
        </Row>

        <Row label="Popularity">
          {movie.popularity?.toFixed(0) || "0"}
        </Row>

        <Row label="Budget">
          ${movie.budget?.toLocaleString()}
        </Row>

        <Row label="Revenue">
          ${movie.revenue?.toLocaleString()}
        </Row>

        <Row label="Production">
          {movie.production_companies?.[0]?.name || "N/A"}
        </Row>

        <Row label="Country">
          {movie.production_countries
            ?.map(c => c.name)
            .join(", ")}
        </Row>

      </div>

    </div>

  )
}

export default Details;