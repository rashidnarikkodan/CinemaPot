import type { MovieDetails } from "../../../types/movie";
import { MonitorPlayIcon as Play } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { getSeriesWatchUrl } from "../../../utils/watchHistory";


type Props = {
  movie: MovieDetails | null;
};

const HeroContent = ({ movie }: Props) => {
  const navigate = useNavigate();
  if (!movie) return null;
  const title = movie.title || movie.name || movie.original_title;
  const mediaType = movie.media_type || 'movie';

  const overview =
    movie.overview?.length > 180
      ? movie.overview.slice(0, 180) + "..."
      : movie.overview;

  return (
    <div className="px-5 md:pl-[5%] pb-6 md:pb-16 lg:pb-20 text-white relative z-10 max-w-3xl flex flex-col justify-end">
      {/* Title */}
      <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black leading-tight mb-3 md:mb-5 tracking-tight drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)] animate-in fade-in slide-in-from-left-6 duration-1000">
        {title}
      </h1>

      {/* Overview */}
      {overview && (
        <p className="mb-6 md:mb-8 max-w-xl text-sm md:text-base lg:text-lg leading-relaxed text-zinc-300 font-medium line-clamp-3 md:line-clamp-3 animate-in fade-in slide-in-from-left-4 duration-1000 delay-300">
          {overview}
        </p>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 md:gap-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
        <button
          onClick={() => {
            const targetUrl = mediaType === "tv" ? getSeriesWatchUrl(movie.id) : `/watch/${mediaType}/${movie.id}`;
            navigate(targetUrl);
          }}
          className="group relative flex items-center justify-center gap-2 md:gap-3 overflow-hidden rounded-2xl bg-white px-6 py-3.5 md:px-10 md:py-4 text-black font-black uppercase tracking-widest text-xs transition-all hover:scale-105 active:scale-95 shadow-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <Play className="relative z-10 w-4 h-4 md:w-5 md:h-5 group-hover:text-white" />
          <span className="relative z-10 group-hover:text-white">Watch Now</span>
        </button>

        <button className="flex items-center justify-center gap-2 md:gap-3 rounded-2xl bg-zinc-800/80 backdrop-blur-md px-6 py-3.5 md:px-10 md:py-4 text-white font-black uppercase tracking-widest text-xs transition-all hover:bg-zinc-700 border border-white/5">
          More Info
        </button>
      </div>
    </div>
  );
};

export default HeroContent;
