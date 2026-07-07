import type { MovieDetails } from "../../../types/movie";
import { MonitorPlayIcon as Play } from "lucide-react";
import { useNavigate } from 'react-router-dom'


type Props = {
  movie: MovieDetails | null;
};

const HeroContent = ({ movie }: Props) => {
  const navigate = useNavigate()
  if (!movie) return null;
  const title = movie.title || movie.name || movie.original_title;
  const year = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : movie.first_air_date ? new Date(movie.first_air_date).getFullYear() : null;
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : null;
  const mediaType = movie.media_type || 'movie';

  const overview =
    movie.overview?.length > 180
      ? movie.overview.slice(0, 180) + "..."
      : movie.overview;

  return (
    <div className="pl-[5%] py-[35vh] text-white relative z-10 max-w-3xl">
      {/* Brand Overlay */}
      <div className="flex items-center gap-3 mb-8 animate-in fade-in slide-in-from-left-4 duration-700">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600 shadow-xl shadow-red-900/40 rotate-3">
          <img src="/favicon.png" alt='Logo' className="w-5 h-5" />
        </div>
        <span className="text-[12px] font-black tracking-[0.3em] text-zinc-400 uppercase italic">
          Cinema<span className="text-red-600">Pot</span> <span className="mx-2 text-zinc-800">•</span> {mediaType === 'tv' ? 'Exclusive Series' : 'Cinema Original'}
        </span>
      </div>

      {/* Title */}
      <h1 className="text-6xl md:text-8xl font-black leading-tight mb-8 tracking-tight drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)] animate-in fade-in slide-in-from-left-6 duration-1000">
        {title}
      </h1>

      {/* Meta row */}
      <div className="mb-6 flex items-center gap-6 text-sm font-bold text-zinc-300 animate-in fade-in duration-1000 delay-300">
        {year && <span className="px-3 py-1 bg-white/10 rounded-full border border-white/5">{year}</span>}
        {rating && (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-yellow-500/10 text-yellow-500 rounded-full border border-yellow-500/20 italic">
            <span className="text-lg">★</span> {rating}
          </span>
        )}
        <span className="px-3 py-1 bg-red-600/10 text-red-500 rounded-full border border-red-600/20 uppercase tracking-tighter">4K Ultra HD</span>
      </div>

      {/* Overview */}
      {overview && (
        <p className="mb-10 max-w-xl text-lg leading-relaxed text-zinc-400 font-medium animate-in fade-in slide-in-from-left-4 duration-1000 delay-500">
          {overview}
        </p>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-700">
        <button
          onClick={() => navigate(`/watch/${mediaType}/${movie.id}`)}
          className="group relative flex items-center gap-3 overflow-hidden rounded-2xl bg-white px-10 py-4 text-black font-black uppercase tracking-widest text-xs transition-all hover:scale-105 active:scale-95 shadow-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <Play className="relative z-10 w-5 h-5 group-hover:text-white" />
          <span className="relative z-10 group-hover:text-white">Watch Now</span>
        </button>

        <button className="flex items-center gap-3 rounded-2xl bg-zinc-800/80 backdrop-blur-md px-10 py-4 text-white font-black uppercase tracking-widest text-xs transition-all hover:bg-zinc-700 border border-white/5">
          More Info
        </button>
      </div>
    </div>
  );
};

export default HeroContent;
