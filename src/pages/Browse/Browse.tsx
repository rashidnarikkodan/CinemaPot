import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Header from "../../components/common/Header";
import { fetchMovies } from "../../utils/fetchMovies";
import { searchMulti } from "../../services/tmdb.service";
import MovieCard from "../../components/movie/MovieCard";
import Loader from "../../components/common/Loader";
import type { MovieDetails } from "../../types/movie";
import { ROW_CONFIG } from "../../config/rowConfig";

const Browse = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [movies, setMovies] = useState<MovieDetails[]>([]);
  const [loading, setLoading] = useState(true);
  
  const query = searchParams.get("q");
  const type = searchParams.get("type") || "movie";

  useEffect(() => {
    const loadMovies = async () => {
      setLoading(true);
      try {
        if (query) {
          const data = await searchMulti(query);
          setMovies(data.results);
        } else {
          // Default browse behavior
          const config = ROW_CONFIG.find(r => r.mediaType === type) || ROW_CONFIG[0];
          const data = await fetchMovies(config);
          setMovies(data.results);
        }
      } catch (error) {
        console.error("Failed to load browse movies:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, [query, type]);

  return (
    <div className="min-h-screen bg-[#161616] text-white">
      <Header />
      
      <main className="pt-24 px-4 md:px-10 pb-20">
        <header className="mb-10">
          <h1 className="text-3xl font-bold">
            {query ? `Results for "${query}"` : type === "tv" ? "TV Shows" : "Movies"}
          </h1>
          <p className="text-zinc-400 mt-2 text-sm">
            {movies.length} titles found
          </p>
        </header>

        {loading ? (
          <div className="flex h-60 items-center justify-center">
            <Loader />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
            {movies.length > 0 ? (
              movies.map((movie: any) => {
                const media = movie.media_type || (type as "movie" | "tv");
                const title = movie.title || movie.name || movie.original_title;
                const date = movie.release_date || movie.first_air_date || "N/A";
                return (
                  <MovieCard 
                    key={movie.id} 
                    title={title}
                    posterPath={movie.poster_path}
                    releaseYear={date.split("-")[0]}
                    rating={movie.vote_average}
                    popularity={movie.popularity}
                    voteCount={movie.vote_count}
                    tmdbId={movie.id}
                    mediaType={media}
                    onClick={(id) => navigate(`/watch/${media}/${id}`)}
                  />
                );
              })
            ) : (

              <div className="col-span-full py-20 text-center">
                <p className="text-zinc-500 text-lg italic">No results found.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Browse;
