import type { MovieRow as MovieRowType } from "../../types/row";

import MovieCard from "../movie/MovieCard";
import { ChevronLeft, ChevronRight, Flame, Film, Tv, Star, Gem, Globe, Shield, Smile, Ghost, Rocket, Trophy, PlayCircle, Compass } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Loader from '../common/Loader'

type Props = {
  row: MovieRowType;
  isLoading: boolean;
};

const getIconForTitle = (title?: string) => {
  if (!title) return <Film className="h-5 w-5 text-zinc-300" />;
  const t = title.toLowerCase();
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
  if (t.includes('tv') || t.includes('anime')) return <Tv className="h-5 w-5 text-zinc-300" />;
  return <Film className="h-5 w-5 text-zinc-300" />;
};

const MovieRow = ({ row, isLoading }: Props) => {

  const navigate = useNavigate();

  const scroll = (direction: "left" | "right") => {
    const container = document.getElementById(`row-${row?.title || ''}`);
    if (container) {
      const scrollAmount = direction === "left" ? -500 : 500;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };
  const skelton = Array(10).fill(0)

  return (
    <section className="relative px-6 md:px-12 py-6 overflow-x-hidden">
      <div className="mb-4 flex items-center justify-between">
  <div className="flex items-center gap-2">
    {getIconForTitle(row?.title)}
    <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white/90">
      {row?.title || 'Loading...'}
    </h2>
  </div>

  <div className="flex items-center gap-2">
    <button
      onClick={() => scroll("left")}
      className="w-10 h-10 flex items-center justify-center bg-black/30 hover:bg-black/60 rounded-l-3xl"
    >
      <ChevronLeft className="h-6 w-6 text-white" />
    </button>

    <button
      onClick={() => scroll("right")}
      className="w-10 h-10 flex items-center justify-center bg-black/30 hover:bg-black/60 rounded-r-3xl"
    >
      <ChevronRight className="h-6 w-6 text-white" />
    </button>
  </div>
</div>

      <div className="relative">
        {/* Scroll Arrows */}

        <div 
          id={`row-${row?.title || ''}`}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
        >
          {isLoading?skelton.map((_,idx)=>{
              return (
              <div key={idx} className="w-36 sm:w-48 md:w-56 shrink-0">
              <Loader/>
              </div>
              )
          })
          
          :row.movies?.map((movie) => {
            const title = movie.title || movie.name || movie.original_title;
            const date = movie.release_date || movie.first_air_date || "N/A";
            return (
            <div key={movie.id} className="w-36 sm:w-48 md:w-56 shrink-0">
              <MovieCard
                title={title}
                posterPath={movie.poster_path}
                releaseYear={date.split("-")[0]}
                rating={movie.vote_average}
                popularity={movie.popularity}
                voteCount={movie.vote_count}
                tmdbId={movie.id}
                mediaType={row.mediaType}
                onClick={(id) => navigate(`/watch/${row.mediaType}/${id}`)}
              />
            </div>)
}
          )}

        </div>
      </div>
    </section>
  );
};

export default MovieRow;

