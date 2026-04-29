import React from "react";
import { Star, TrendingUp, Users } from "lucide-react";

interface MovieCardProps {
  title: string;
  posterPath: string | null;
  releaseYear: string | number;
  runtime?: string | number;
  rating: number;
  popularity?: number;
  voteCount?: number;
  tmdbId: number;
  mediaType?: "movie" | "tv";
  onClick?: (id: number) => void;
}


const MovieCard: React.FC<MovieCardProps> = ({
  title,
  posterPath,
  releaseYear,
  runtime = "N/A",
  rating,
  popularity,
  voteCount,
  onClick,
  tmdbId,
  mediaType = "movie",
}) => {
  const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";
  const posterUrl = posterPath ? `${IMAGE_BASE}${posterPath}` : "https://via.placeholder.com/500x750?text=No+Poster";

  return (
    <div 
      className="group cursor-pointer flex flex-col gap-2"
      onClick={() => onClick?.(tmdbId)}
    >
      {/* A. Poster Area */}
      <div className="relative aspect-3/4 w-full overflow-hidden rounded-lg bg-zinc-800">
        <img
          src={posterUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center gap-3 p-4">
          <div className="flex items-center gap-1.5 text-yellow-500">
            <Star className="h-4 w-4 fill-current" />
            <span className="text-sm font-bold">{rating.toFixed(1)}</span>
          </div>
          {popularity && (
            <div className="flex items-center gap-1.5 text-zinc-300">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs">{Math.round(popularity)}</span>
            </div>
          )}
          {voteCount !== undefined && (
            <div className="flex items-center gap-1.5 text-zinc-300">
              <Users className="h-4 w-4" />
              <span className="text-xs">{voteCount.toLocaleString()}</span>
            </div>
          )}
        </div>
      </div>

      {/* B. Metadata Row */}
      <div className="flex items-center gap-2 text-[10px] sm:text-xs text-zinc-400 truncate">
        <span>{mediaType === "movie" ? "Movie" : "TV Series"}</span>
        <span>•</span>
        <span>{releaseYear}</span>
        {mediaType === "movie" && (
          <>
            <span>•</span>
            <span>{typeof runtime === 'number' ? `${runtime} min` : runtime}</span>
          </>
        )}
      </div>


      {/* C. Title Row */}
      <h3 className="text-sm font-medium text-white line-clamp-2 leading-snug">
        {title}
      </h3>
    </div>
  );
};

export default MovieCard;
