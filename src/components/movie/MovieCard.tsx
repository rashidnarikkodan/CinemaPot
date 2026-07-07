import React, { memo } from "react";
import { Star, TrendingUp, Users } from "lucide-react";
import { getMovieDetails, getTVDetails } from "../../services/tmdb.service";

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
  priority?: boolean; // For LCP optimization
}

/**
 * Memoized MovieCard to prevent re-renders in large lists
 */
const MovieCard: React.FC<MovieCardProps> = memo(({
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
  priority = false
}) => {
  const IMAGE_BASE = "https://image.tmdb.org/t/p/";
  
  // Performance: Prefetch data on hover (Intent-based loading)
  const handleMouseEnter = () => {
    if (mediaType === 'movie') {
      getMovieDetails(tmdbId);
      import("../../pages/Movie/Movie");
    } else {
      getTVDetails(tmdbId);
      import("../../pages/Series/Series");
    }

    // Prefetch LCP image to HTTP cache
    if (posterPath) {
      const img = new Image();
      img.src = `https://image.tmdb.org/t/p/w500${posterPath}`;
    }
  };

  // Adaptive Image Loading Strategy
  const posterUrl = posterPath 
    ? `${IMAGE_BASE}w342${posterPath}` 
    : "https://via.placeholder.com/342x513?text=No+Poster";
    
  const srcSet = posterPath 
    ? `${IMAGE_BASE}w185${posterPath} 185w, ${IMAGE_BASE}w342${posterPath} 342w, ${IMAGE_BASE}w500${posterPath} 500w`
    : undefined;

  return (
    <div 
      className="group cursor-pointer flex flex-col gap-3"
      onClick={() => onClick?.(tmdbId)}
      onMouseEnter={handleMouseEnter}
    >
      {/* A. Poster Area */}
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-2xl bg-zinc-900 shadow-premium group-hover:shadow-red-900/20 transition-all duration-500">
        <img
          src={posterUrl}
          srcSet={srcSet}
          sizes="(max-width: 640px) 185px, (max-width: 1024px) 342px, 500px"
          alt={title}
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
          loading={priority ? "eager" : "lazy"}
          decoding="async"
        />
        
        {/* Modern Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-5">
          <div className="flex flex-col gap-3 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2 py-1 bg-yellow-500 rounded-lg text-black">
                <Star className="h-3.5 w-3.5 fill-current" />
                <span className="text-[11px] font-black">{rating.toFixed(1)}</span>
              </div>
              <span className="text-[10px] font-black text-white uppercase tracking-widest px-2 py-1 bg-white/10 rounded-lg backdrop-blur-md">
                {mediaType === 'movie' ? 'Movie' : 'Series'}
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              {popularity && (
                <div className="flex items-center gap-1.5 text-zinc-300">
                  <TrendingUp className="h-3.5 w-3.5" />
                  <span className="text-[11px] font-bold">{Math.round(popularity)}</span>
                </div>
              )}
              {voteCount !== undefined && (
                <div className="flex items-center gap-1.5 text-zinc-300">
                  <Users className="h-3.5 w-3.5" />
                  <span className="text-[11px] font-bold">{voteCount > 1000 ? (voteCount/1000).toFixed(1) + 'k' : voteCount}</span>
                </div>
              )}
            </div>
            
            <button className="w-full py-2.5 bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-red-600 hover:text-white transition-colors">
              View Details
            </button>
          </div>
        </div>
      </div>

      {/* C. Info Section */}
      <div className="px-1">
        <h3 className="text-[15px] font-bold text-zinc-100 line-clamp-1 group-hover:text-red-500 transition-colors duration-300 mb-1">
          {title}
        </h3>
        <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-zinc-500">
          <span>{releaseYear}</span>
          <span className="w-1 h-1 rounded-full bg-zinc-700" />
          <span>{mediaType === "movie" && typeof runtime === 'number' ? `${runtime}m` : 'HD'}</span>
        </div>
      </div>
    </div>
  );
});

MovieCard.displayName = "MovieCard";

export default MovieCard;
