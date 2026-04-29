import { Star } from "lucide-react";
import Row from "./Row";
import type { Movie } from "../../../types/movie";
import type { TV } from "../../../types/tv";

interface DetailsProps {
  media: Movie | TV;
}

const Details = ({ media }: DetailsProps) => {
  const isTV = 'name' in media;
  const title = isTV ? (media as TV).name : (media as Movie).title;
  const date = isTV ? (media as TV).first_air_date : (media as Movie).release_date;
  const runtime = isTV 
    ? (media as TV).episode_run_time?.[0] 
    : (media as Movie).runtime;

  return (
    <div className="space-y-6">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-6">
        {/* Poster + Title */}
        <div className="flex gap-4">
          <img
            src={`https://image.tmdb.org/t/p/w500${media.poster_path}`}
            className="w-24 rounded-lg object-cover"
            alt={title}
          />

          <div className="space-y-1">
            <h1 className="text-xl font-bold leading-tight">{title}</h1>

            <p className="text-zinc-400 text-sm">
              {date?.split("-")[0]} • {runtime ? `${runtime} min` : isTV ? `${(media as TV).number_of_seasons} Seasons` : "N/A"}
            </p>

            <div className="flex items-center gap-2 text-yellow-400 text-sm">
              <Star className="h-4 w-4 fill-current" />
              {media.vote_average?.toFixed(1)}
              <span className="text-zinc-500">
                ({media.vote_count?.toLocaleString()})
              </span>
            </div>
          </div>
        </div>

        {/* Genres */}
        <div>
          <h3 className="text-sm text-zinc-400 mb-2">Genres</h3>
          <div className="flex flex-wrap gap-2">
            {media.genres?.map((g) => (
              <span key={g.id} className="px-2 py-1 text-xs bg-zinc-800 rounded">
                {g.name}
              </span>
            ))}
          </div>
        </div>

        {/* Tagline */}
        {media.tagline && (
          <p className="text-zinc-400 text-sm italic">"{media.tagline}"</p>
        )}

        {/* Metadata Table */}
        <div className="space-y-3 text-sm">
          <Row label="Original Language">
            {media.original_language?.toUpperCase()}
          </Row>

          <Row label="Status">{media.status}</Row>

          <Row label="Popularity">{media.popularity?.toFixed(0)}</Row>

          {isTV && (
            <>
              <Row label="Seasons">{(media as TV).number_of_seasons}</Row>
              <Row label="Episodes">{(media as TV).number_of_episodes}</Row>
            </>
          )}

          {!isTV && (media as Movie).budget > 0 && (
            <Row label="Budget">${(media as Movie).budget?.toLocaleString()}</Row>
          )}

          {!isTV && (media as Movie).revenue > 0 && (
            <Row label="Revenue">${(media as Movie).revenue?.toLocaleString()}</Row>
          )}

          <Row label="Production">
            {media.production_companies?.[0]?.name || "N/A"}
          </Row>

          <Row label="Country">
            {media.production_countries?.map((c) => c.name).join(", ") || "N/A"}
          </Row>
        </div>
      </div>
    </div>
  );
};

export default Details;