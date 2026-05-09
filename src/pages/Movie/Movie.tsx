import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMovieDetails, getRelatedMovies } from "../../services/tmdb.service";
import ProtectedHeader from "../../components/common/Header";
import EmbedPlayer from "./components/Embeded";
import Loader from "../../components/common/Loader";
import MovieCard from "../../components/movie/MovieCard";
import type { Movie as TMovie, MovieDetails } from "../../types/movie";
import Details from "./components/Details";
import { STREAM_SERVERS } from "./components/servers";
import { ChevronDown, Server as ServerIcon } from "lucide-react";

const Movie = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<TMovie | null>(null);
  const [related, setRelated] = useState<MovieDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [server, setServer] = useState(0);
  const [isServerDropdownOpen, setIsServerDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchMovieData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const movieId = parseInt(id);
        const [details, relatedMovies] = await Promise.all([
          getMovieDetails(movieId),
          getRelatedMovies(movieId)
        ]);
        setMovie(details);
        setRelated(relatedMovies);
      } catch (error) {
        console.error("Failed to fetch movie data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return <div className="h-screen w-full flex items-center justify-center bg-[#0a0a0a]"><Loader /></div>;
  if (!movie) return <div className="h-screen w-full flex items-center justify-center bg-[#0a0a0a] text-white">Movie not found</div>;


  return (
    <div className="min-h-screen bg-black text-white">
      <ProtectedHeader />

      <main className="pt-24">
        {/* Back Button */}
        <div className="px-4 md:px-12 pb-16">

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-12 items-start">

            {/* LEFT — STREAM PLAYER */}
            <div className="xl:col-span-3 space-y-12">
              <div className="group relative aspect-video w-full rounded-xl overflow-hidden bg-black shadow-[0_30px_60px_rgba(0,0,0,0.5)] border border-white/5 transition-all duration-700">
                <EmbedPlayer
                  id={movie.id}
                  server={server}
                  type="movie"
                  title={movie.title || (movie as any).original_title}
                />
              </div>

              {/* SERVER SWITCHER */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
                  Select Server
                </div>

                <div className="flex overflow-x-auto snap-x snap-mandatory gap-2 pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 w-[calc(100%+2rem)] md:w-full">
                  {STREAM_SERVERS.map((s, i) => (
                    <button
                      key={s.name}
                      onClick={() => setServer(i)}
                      className={`group relative snap-start shrink-0 px-6 py-3 rounded-full text-[11px] font-black uppercase tracking-widest transition-all duration-300
                        ${server === i
                          ? "bg-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.3)]"
                          : "bg-zinc-900/50 border border-white/5 text-zinc-400 hover:text-white hover:bg-zinc-800"}
                      `}
                    >
                      <span className="flex items-center gap-2">
                        {server === i && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                        Server 0{i + 1}
                      </span>
                    </button>
                  ))}
                </div>

                <p className="text-[9px] text-zinc-700 font-bold uppercase tracking-widest mt-2">
                  Optimization: 4K HDR 10bit Processing
                </p>
              </div>
            </div>


            {/* RIGHT — DETAILS PANEL */}
            <Details media={movie} />
          </div>
        </div>

        {/* Related Content Grid */}
        <section className="px-4 md:px-12 pb-24 border-t border-white/5 pt-16 bg-gradient-to-b from-transparent to-zinc-950/30">
          <div className="flex items-center justify-between mb-12">
            <div className="space-y-1">
              <h2 className="text-3xl font-black italic tracking-tight uppercase">Related Content</h2>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Selected by our cinema algorithm</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-6">
            {related.slice(0, 14).map((m) => (
              <MovieCard
                key={m.id}
                title={m.title || m.original_title}
                posterPath={m.poster_path}
                releaseYear={m.release_date?.split("-")[0] || "N/A"}
                rating={m.vote_average}
                popularity={m.popularity}
                voteCount={m.vote_count}
                tmdbId={m.id}
                mediaType="movie"
                onClick={(id) => navigate(`/watch/movie/${id}`)}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Movie;
