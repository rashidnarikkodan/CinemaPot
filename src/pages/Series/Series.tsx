import { useEffect, useState, memo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTVDetails, getTVRecommendations, getTVSeasonDetails } from "../../services/tmdb.service";
import ProtectedHeader from "../../components/common/Header";
import EmbedPlayer from "../Movie/components/Embeded";
import Loader from "../../components/common/Loader";
import MovieCard from "../../components/movie/MovieCard";
import type { MovieDetails } from "../../types/movie";
import Details from "../Movie/components/Details";
import { STREAM_SERVERS } from "../Movie/components/servers";
import { Play, Layers, Monitor, ChevronRight } from "lucide-react";

const Series = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [series, setSeries] = useState<any | null>(null);
  const [related, setRelated] = useState<MovieDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [server, setServer] = useState(0);

  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const [seasonData, setSeasonData] = useState<any>(null);
  const [isSeasonLoading, setIsSeasonLoading] = useState(false);

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

  if (loading) return <Loader />;
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
                backdrop={series.backdrop_path}
              />
            </div>

            {/* 2. SERVER & SEASON NAVIGATION */}
            <div className="space-y-6">
              
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
              </div>

              {/* SEASON SELECTOR */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
                  Select Season
                </div>

                <div className="flex overflow-x-auto snap-x snap-mandatory gap-2 pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 w-[calc(100%+2rem)] md:w-full">
                  {series.seasons.filter((s: any) => s.season_number > 0).map((s: any) => (
                    <button
                      key={s.id}
                      onClick={() => handleSeasonChange(s.season_number)}
                      className={`group relative snap-start shrink-0 px-6 py-3 rounded-full text-[11px] font-black uppercase tracking-widest transition-all duration-300
                        ${season === s.season_number
                          ? "bg-white text-black shadow-lg"
                          : "bg-zinc-900/50 border border-white/5 text-zinc-400 hover:text-white hover:bg-zinc-800"}
                      `}
                    >
                      Season {s.season_number}
                    </button>
                  ))}
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
                  {isSeasonLoading ? (
                    Array(6).fill(0).map((_, i) => (
                      <div key={i} className="h-20 bg-zinc-900/30 rounded-lg animate-pulse border border-white/5" />
                    ))
                  ) : (
                    seasonData?.episodes.map((ep: any) => {
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
          <Details media={series} />
        </div>

        {/* Related Shows */}
        <section className="mt-32 pt-16 border-t border-white/5 bg-gradient-to-b from-transparent to-zinc-950/30">
          <div className="flex flex-col gap-1 mb-12">
            <h2 className="text-3xl font-black italic tracking-tight uppercase">You May Also Like</h2>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Recommended Series</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-6">
            {related.slice(0, 14).map((m) => (
              <MovieCard
                key={m.id}
                title={m.name || m.original_title}
                posterPath={m.poster_path}
                releaseYear={m.first_air_date?.split("-")[0] || "N/A"}
                rating={m.vote_average}
                popularity={m.popularity}
                voteCount={m.vote_count}
                tmdbId={m.id}
                mediaType="tv"
                onClick={(id) => navigate(`/watch/tv/${id}`)}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Series;
