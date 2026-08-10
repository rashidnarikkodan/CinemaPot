import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getTVDetails, getTVRecommendations, getTVSeasonDetails } from "../../services/tmdb.service";
import ProtectedHeader from "../../components/common/Header";
import EmbedPlayer from "../Movie/components/Embeded";
import MovieCard from "../../components/movie/MovieCard";
import type { MovieDetails } from "../../types/movie";
import Details from "../Movie/components/Details";
import { STREAM_SERVERS } from "../Movie/components/servers";
import { Play } from "lucide-react";
import Skeleton from "../../components/common/Skeleton";

interface Season {
  id: number;
  season_number: number;
  name: string;
}

interface Episode {
  id: number;
  episode_number: number;
  name: string;
  air_date?: string;
  still_path: string | null;
}

interface SeasonData {
  id: number;
  season_number: number;
  name: string;
  episodes: Episode[];
}

interface TVDetails extends MovieDetails {
  name: string;
  original_name: string;
  seasons: Season[];
}

const Series = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  // Use location state if available for instant rendering (prevents LCP delay)
  const stateSeries = location.state?.movie as TVDetails | null;
  const [series, setSeries] = useState<TVDetails | null>(stateSeries || null);
  const [related, setRelated] = useState<MovieDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [server, setServer] = useState(0);

  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const [seasonData, setSeasonData] = useState<SeasonData | null>(null);
  const [isSeasonLoading, setIsSeasonLoading] = useState(false);

  // Sync state if id changes (like related series click)
  useEffect(() => {
    if (stateSeries && stateSeries.id === parseInt(id || "")) {
      setSeries(stateSeries);
    } else {
      setSeries(null);
    }
    setRelated([]);
    setSeason(1);
    setEpisode(1);
    setSeasonData(null);
  }, [id, stateSeries]);

  useEffect(() => {
    const fetchSeriesData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const seriesId = parseInt(id);
        const [details, relatedSeries] = await Promise.all([
          getTVDetails(seriesId),
          getTVRecommendations(seriesId)
        ]);
        setSeries(details);
        setRelated(relatedSeries);

        // Load first season data
        const sData = await getTVSeasonDetails(seriesId, 1);
        setSeasonData(sData);
      } catch (error) {
        console.error("Failed to fetch series data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSeriesData();
    window.scrollTo(0, 0);
  }, [id]);

  const handleSeasonChange = async (s: number) => {
    if (s === season) return;
    setIsSeasonLoading(true);
    setSeason(s);
    setEpisode(1);
    try {
      if (series) {
        const data = await getTVSeasonDetails(series.id, s);
        setSeasonData(data);
      }
    } finally {
      setIsSeasonLoading(false);
    }
  };

  // Show full page loader ONLY if we don't have ANY series data (direct URL load)
  if (loading && !series) {
    return (
      <div className="min-h-screen bg-black text-white">
        <ProtectedHeader />
        <main className="pt-24 px-4 md:px-12 pb-16">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-12 items-start">
            <div className="xl:col-span-3 space-y-12">
              <Skeleton className="aspect-video w-full rounded-xl animate-pulse" />
              <div className="space-y-6">
                <div className="space-y-3">
                  <Skeleton className="w-24 h-4 rounded animate-pulse" />
                  <div className="flex gap-2">
                    <Skeleton className="w-28 h-10 rounded-full animate-pulse" />
                    <Skeleton className="w-28 h-10 rounded-full animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
            <Details media={null} loading={true} />
          </div>
        </main>
      </div>
    );
  }

  if (!series) return <div className="h-screen w-full flex items-center justify-center bg-black text-white">Series not found</div>;

  return (
    <div className="min-h-screen bg-black text-white selection:bg-red-600/30">
      <ProtectedHeader />

      <main className="pt-24 px-4 md:px-12 pb-24">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-12 items-start">

          {/* LEFT — PLAYER & CONTENT */}
          <div className="xl:col-span-3 space-y-12">

            {/* 1. PLAYER SECTION */}
            <div className="group relative aspect-video w-full rounded-xl overflow-hidden bg-black shadow-[0_30px_60px_rgba(0,0,0,0.5)] border border-white/5 transition-all duration-700">
              <EmbedPlayer 
                id={series.id} 
                server={server} 
                type="tv" 
                season={season} 
                episode={episode} 
                title={series.name || series.original_name}
                backdrop={series.backdrop_path ?? undefined}
              />
            </div>

            {/* 2. SERVER & SEASON NAVIGATION */}
            <div className="space-y-6">
              
              {/* SERVER SWITCHER */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
                  Select Server
                </div>

                <div className="flex flex-wrap gap-2">
                  {STREAM_SERVERS.map((s, i) => (
                    <button
                      key={s.name}
                      onClick={() => setServer(i)}
                      className={`group relative px-4 py-2 md:px-6 md:py-3 rounded-full text-[10px] md:text-[11px] font-black uppercase tracking-widest transition-all duration-300
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
              </div>

              {/* SEASON SELECTOR */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
                  Select Season
                </div>

                <div className="flex flex-wrap gap-2">
                  {loading && !series?.seasons ? (
                    Array(3).fill(0).map((_, i) => (
                      <Skeleton key={i} className="w-20 h-10 rounded-full animate-pulse" />
                    ))
                  ) : (
                    series.seasons?.filter((s) => s.season_number > 0).map((s) => (
                      <button
                        key={s.id}
                        onClick={() => handleSeasonChange(s.season_number)}
                        className={`group relative px-4 py-2 md:px-6 md:py-3 rounded-full text-[10px] md:text-[11px] font-black uppercase tracking-widest transition-all duration-300
                          ${season === s.season_number
                            ? "bg-white text-black shadow-lg"
                            : "bg-zinc-900/50 border border-white/5 text-zinc-400 hover:text-white hover:bg-zinc-800"}
                        `}
                      >
                        Season {s.season_number}
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* EPISODE LIST */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
                    Episodes ({seasonData?.episodes?.length || 0})
                  </div>
                  <div className="text-[9px] font-black uppercase tracking-widest text-red-600/80 bg-red-600/5 px-2 py-1 rounded">
                    S{season} E{episode}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {isSeasonLoading || (loading && !seasonData) ? (
                    Array(6).fill(0).map((_, i) => (
                      <div key={i} className="h-20 bg-zinc-900/30 rounded-lg animate-pulse border border-white/5" />
                    ))
                  ) : (
                    seasonData?.episodes.map((ep) => {
                      const isReleased = ep.air_date ? new Date(ep.air_date) <= new Date() : false;

                      return (
                        <button
                          key={ep.id}
                          disabled={!isReleased}
                          onClick={() => {
                            if (!isReleased) return;
                            setEpisode(ep.episode_number);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className={`group relative flex items-center gap-3 p-2.5 rounded-lg border transition-all duration-300 text-left
                            ${!isReleased ? "opacity-40 grayscale cursor-not-allowed" : ""}
                            ${episode === ep.episode_number
                              ? "bg-red-600/10 border-red-600 text-white"
                              : "bg-zinc-900/20 border-white/5 text-zinc-500 hover:bg-zinc-800/40 hover:border-white/10"}
                          `}
                        >
                          {/* Episode Thumbnail */}
                          <div className="relative shrink-0 w-24 aspect-video rounded-md overflow-hidden bg-zinc-800 shadow-sm">
                            <img
                              src={ep.still_path ? `https://image.tmdb.org/t/p/w185${ep.still_path}` : series.backdrop_path ? `https://image.tmdb.org/t/p/w185${series.backdrop_path}` : ""}
                              alt=""
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                            {episode === ep.episode_number && isReleased && (
                              <div className="absolute inset-0 bg-red-600/20 flex items-center justify-center">
                                <Play className="w-5 h-5 text-white fill-white" />
                              </div>
                            )}

                            {!isReleased && (
                              <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex items-center justify-center">
                                <span className="text-[7px] font-black uppercase text-white tracking-[0.05em]">Locked</span>
                              </div>
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0 pr-1">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className={`text-[8px] font-black uppercase tracking-widest ${episode === ep.episode_number ? 'text-red-500' : 'text-zinc-600'}`}>
                                EP {ep.episode_number}
                              </span>
                            </div>
                            <h4 className={`font-bold truncate text-[13px] ${episode === ep.episode_number ? 'text-white' : 'text-zinc-400'}`}>
                              {ep.name}
                            </h4>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT — DETAILS PANEL */}
          <Details media={series} loading={loading} />
        </div>

        {/* Related Shows */}
        <section className="mt-32 pt-16 border-t border-white/5 bg-gradient-to-b from-transparent to-zinc-950/30">
          <div className="flex flex-col gap-1 mb-12">
            <h2 className="text-3xl font-black italic tracking-tight uppercase">You May Also Like</h2>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Recommended Series</p>
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
                  title={m.name || m.original_title}
                  posterPath={m.poster_path}
                  releaseYear={m.first_air_date?.split("-")[0] || "N/A"}
                  releaseDate={m.first_air_date}
                  rating={m.vote_average}
                  popularity={m.popularity}
                  voteCount={m.vote_count}
                  tmdbId={m.id}
                  mediaType="tv"
                  onClick={(id) => navigate(`/watch/tv/${id}`, {
                    state: {
                      movie: {
                        id: m.id,
                        title: m.name || m.original_title,
                        name: m.name || m.original_title,
                        poster_path: m.poster_path,
                        first_air_date: m.first_air_date,
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

export default Series;
