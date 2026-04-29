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

const Movie = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<TMovie | null>(null);
  const [related, setRelated] = useState<MovieDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [server, setServer] = useState(0);

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
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <ProtectedHeader />
      
      <main className="pt-20">
        {/* Back Button */}
     <div className="px-4 md:px-10 pb-12">

  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

    {/* LEFT — STREAM PLAYER */}
    <div className="lg:col-span-2">
      <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black border border-zinc-800 shadow-2xl">
        <EmbedPlayer id={movie.id} server={server} type="movie" />
      </div>

          {/* SERVER SWITCHER */}
      <div className="flex flex-wrap justify-center gap-1 mt-8">
        {STREAM_SERVERS.map((s, i) => {
            return (
              <button
              key={s.name}
              onClick={() => setServer(i)}
              className={`px-3 py-2  ${i==0?'sm:rounded-l-full':i==STREAM_SERVERS.length-1?'sm:rounded-r-full':''} rounded-sm text-sm border transition
                ${server === i
                ? "bg-red-600 border-red-600 text-white"
                : "bg-zinc-900 border-zinc-700 hover:bg-zinc-800"}
                `}
                >
            <span className="text-[16px]">
            Server {i+1}
            </span>
          </button>
        )
        })}
      </div>
    </div>


    {/* RIGHT — DETAILS PANEL */}
    <Details media={movie} />
  </div>
</div>

        {/* Related Movies Grid */}


        <section className="px-4 md:px-10 pb-20 border-t border-zinc-900 pt-12">
          <h2 className="text-2xl font-bold mb-8">Related Content</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
            {related.slice(0, 12).map((m) => (
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
