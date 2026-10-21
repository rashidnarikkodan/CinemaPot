import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getMovieDetails, getRelatedMovies } from "../../services/tmdb.service";
import ProtectedHeader from "../../components/common/Header";
import EmbedPlayer from "./components/Embeded";
import MovieCard from "../../components/movie/MovieCard";
import type { Movie as TMovie, MovieDetails } from "../../types/movie";
import Details from "./components/Details";
import { STREAM_SERVERS, getDefaultServerIndex, savePreferredServerIndex } from "./components/servers";
import ServerSelect from "./components/ServerSelect";
import Skeleton from "../../components/common/Skeleton";

const Movie = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  // Use location state if available for instant rendering (prevents LCP delay)
  const stateMovie = location.state?.movie as TMovie | null;
  const [movie, setMovie] = useState<TMovie | null>(stateMovie || null);
  const [related, setRelated] = useState<MovieDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [server, setServer] = useState(getDefaultServerIndex);

  const handleSelectServer = (idx: number) => {
    setServer(idx);
    savePreferredServerIndex(idx);
  };

  // Sync state if id changes (like related movie click)
  useEffect(() => {
    if (stateMovie && stateMovie.id === parseInt(id || "")) {
      setMovie(stateMovie);
    } else {
      setMovie(null);
    }
    setRelated([]);
  }, [id, stateMovie]);

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

  // Show full page loader ONLY if we don't have ANY movie data (direct URL load)
  if (loading && !movie) {
    return (
      <div className="min-h-screen bg-black text-white">
        <ProtectedHeader />
        <main className="pt-20 md:pt-24 px-4 md:px-12 pb-24 md:pb-16">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-12 items-start">
            <div className="xl:col-span-3 space-y-12">
              <Skeleton className="aspect-video w-full rounded-xl animate-pulse" />
              <div className="space-y-3">
                <Skeleton className="w-24 h-4 rounded animate-pulse" />
                <div className="flex gap-2">
                  <Skeleton className="w-28 h-10 rounded-full animate-pulse" />
                  <Skeleton className="w-28 h-10 rounded-full animate-pulse" />
                </div>
              </div>
            </div>
            <Details media={null} loading={true} />
          </div>
        </main>
      </div>
    );
  }
  if (!movie) return <div className="h-screen w-full flex items-center justify-center bg-[#0a0a0a] text-white">Movie not found</div>;


  return (
    <div className="min-h-screen bg-black text-white">
      <ProtectedHeader />

      <main className="pt-20 md:pt-24 pb-24 md:pb-16">
        {/* Stream and Details Section */}
        <div className="px-4 md:px-12 pb-12">

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 xl:gap-12 items-start">

            {/* LEFT — STREAM PLAYER */}
            <div className="xl:col-span-3 space-y-6">
              <div className="group relative aspect-video w-full rounded-xl overflow-hidden bg-black shadow-[0_30px_60px_rgba(0,0,0,0.5)] border border-white/5 transition-all duration-700">
                <EmbedPlayer
                  id={movie.id}
                  server={server}
                  type="movie"
                  title={movie.title || movie.original_title}
                />
              </div>

              {/* SERVER SWITCHER DROPDOWN */}
              <div className="flex items-center justify-between">
                <ServerSelect
                  servers={STREAM_SERVERS}
                  selectedServer={server}
                  onSelectServer={handleSelectServer}
                />
              </div>
            </div>


            {/* RIGHT — DETAILS PANEL */}
            <Details media={movie} loading={loading} />
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
            {loading && related.length === 0 ? (
              Array(14).fill(0).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-[2/3] w-full rounded-2xl animate-pulse" />
                  <Skeleton variant="text" className="w-3/4 animate-pulse" />
                  <Skeleton variant="text" className="w-1/2 h-3 animate-pulse" />
                </div>
              ))
            ) : (
              related.slice(0, 14).map((m) => (
                <MovieCard
                  key={m.id}
                  title={m.title || m.original_title}
                  posterPath={m.poster_path}
                  releaseYear={m.release_date?.split("-")[0] || "N/A"}
                  releaseDate={m.release_date}
                  rating={m.vote_average}
                  popularity={m.popularity}
                  voteCount={m.vote_count}
                  tmdbId={m.id}
                  mediaType="movie"
                  onClick={(id) => navigate(`/watch/movie/${id}`, {
                    state: {
                      movie: {
                        id: m.id,
                        title: m.title || m.original_title,
                        poster_path: m.poster_path,
                        release_date: m.release_date,
                        vote_average: m.vote_average,
                        popularity: m.popularity,
                        vote_count: m.vote_count
                      }
                    }
                  })}
                />
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Movie;
