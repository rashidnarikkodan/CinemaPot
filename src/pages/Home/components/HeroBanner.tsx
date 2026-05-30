import { useEffect, useState } from "react";
import { getRandomFeatured } from "../../../services/tmdb.service";
import Header from "../../../components/common/Header";
import HeroContent from "./HeroContent";
import Skeleton from "../../../components/common/Skeleton";
import type { MovieDetails } from "../../../types/movie";

const HeroSkeleton = () => (
  <div className="relative min-h-[75vh] flex flex-col justify-center px-[5%] bg-zinc-950 pt-16">
    <Skeleton className="absolute inset-0" />
    <div className="relative z-10 max-w-2xl space-y-6">
      <Skeleton variant="text" className="w-48 h-6" />
      <Skeleton variant="text" className="w-full h-20 md:h-32" />
      <Skeleton variant="text" className="w-32 h-6" />
      <Skeleton variant="text" className="w-full h-24" />
      <div className="flex gap-4">
        <Skeleton className="w-40 h-12 rounded-2xl" />
        <Skeleton className="w-40 h-12 rounded-2xl" />
      </div>
    </div>
  </div>
);

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

  if (isLoading) return (
    <>
      <Header />
      <HeroSkeleton />
    </>
  );

  const desktopBg = `https://image.tmdb.org/t/p/original${movie?.backdrop_path || ""}`;
  const mobileBg = movie?.poster_path 
    ? `https://image.tmdb.org/t/p/original${movie.poster_path}` 
    : desktopBg;

  return (
    <div
      className="relative min-h-[75vh] md:min-h-[85vh] bg-zinc-950 overflow-hidden pt-16"
    >
      {/* Desktop Background Layer */}
      <div
        className="hidden md:block absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out opacity-80"
        style={{
          backgroundImage: `url(${desktopBg})`,
          transform: 'scale(1.05)',
        }}
      />
      
      {/* Mobile Background Layer */}
      <div
        className="block md:hidden absolute inset-0 bg-cover bg-top transition-opacity duration-1000 ease-in-out opacity-80"
        style={{
          backgroundImage: `url(${mobileBg})`,
        }}
      />

      <div
        className="pointer-events-none absolute inset-0 hidden md:block"
        style={{
          background:
            "radial-gradient(circle at 30% 50%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0.9) 100%)",
        }}
      />
      
      <div
        className="pointer-events-none absolute inset-0 block md:hidden"
        style={{
          background: "linear-gradient(to bottom, rgba(9,9,11,0.1) 0%, rgba(9,9,11,0.5) 40%, rgba(9,9,11,0.95) 75%, rgba(9,9,11,1) 100%)",
        }}
      />

      <Header />
      <div className="relative z-10">
        <HeroContent movie={movie} />
      </div>

      {/* Modern Cinematic Gradients */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-black/10" />
    </div>
  );
};

export default HeroBanner;
