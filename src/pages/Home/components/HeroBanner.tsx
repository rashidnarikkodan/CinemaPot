import { useEffect, useState } from "react";
import { getRandomFeatured } from "../../../services/tmdb.service";
import Header from "../../../components/common/Header";
import HeroContent from "./HeroContent";
import Loader from "../../../components/common/Loader";
import type { MovieDetails } from "../../../types/movie";

const HeroBanner = () => {
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovie = async () => {
      const m = await getRandomFeatured();
      setMovie(m);
      setLoading(false);
    };
    fetchMovie();
  }, []);

  if (isLoading) return <Loader />;

  const backgroundImage = `https://image.tmdb.org/t/p/w1280${movie ? movie.backdrop_path : ""
    }`;

  return (
    <div
      className="relative min-h-full bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at center, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.7) 70%, rgba(0,0,0,0.9) 100%)",
        }}
      />

      <Header />
      <HeroContent
        movie={movie}
      />

      <div
        className="
      pointer-events-none
      absolute bottom-0 left-0 right-0
      h-48
      bg-linear-to-b
      from-transparent
      via-[#050505]/30
      to-[#161616]
    "
      />

      {/* Blur layer */}
      <div
        className="
      pointer-events-none
      absolute bottom-0 left-0 right-0
      backdrop-blur-xs
      bg-[#000000]/10
    "
      />
    </div>
  );
};


export default HeroBanner;
