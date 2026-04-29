import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTVDetails, getTVRecommendations, getTVSeasonDetails } from "../../services/tmdb.service";
import ProtectedHeader from "../../components/common/Header";
import EmbedPlayer from "../Movie/components/Embeded";
import Loader from "../../components/common/Loader";
import MovieCard from "../../components/movie/MovieCard";
import type { MovieDetails } from "../../types/movie";
import Details from "../Movie/components/Details";
import { STREAM_SERVERS } from "../Movie/components/servers";

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
    setSeason(s);
    setEpisode(1);
    if (series) {
      const data = await getTVSeasonDetails(series.id, s);
      setSeasonData(data);
    }
  };

  if (loading) return <div className="h-screen w-full flex items-center justify-center bg-[#0a0a0a]"><Loader /></div>;
  if (!series) return <div className="h-screen w-full flex items-center justify-center bg-[#0a0a0a] text-white">Series not found</div>;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <ProtectedHeader />
      
      <main className="pt-20">
        <div className="px-4 md:px-10 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* LEFT — STREAM PLAYER & SELECTORS */}
            <div className="lg:col-span-2">
              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black border border-zinc-800 shadow-2xl">
                <EmbedPlayer id={series.id} server={server} type="tv" season={season} episode={episode} />
              </div>

              {/* SERVER SWITCHER */}
              <div className="flex flex-wrap justify-center gap-1 mt-8">
                {STREAM_SERVERS.map((s, i) => (
                  <button
                    key={s.name}
                    onClick={() => setServer(i)}
                    className={`px-3 py-2 rounded-sm text-sm border transition
                      ${server === i
                        ? "bg-red-600 border-red-600 text-white"
                        : "bg-zinc-900 border-zinc-700 hover:bg-zinc-800"}
                    `}
                  >
                    <span className="text-[16px]">Server {i + 1}</span>
                  </button>
                ))}
              </div>

              {/* SEASON & EPISODE SELECTOR */}
              <div className="mt-10 bg-zinc-900/50 rounded-2xl p-6 border border-zinc-800">
                <div className="flex items-center gap-4 mb-6">
                  <h3 className="text-xl font-semibold">Select Episode</h3>
                  <select 
                    value={season}
                    onChange={(e) => handleSeasonChange(parseInt(e.target.value))}
                    className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 outline-none focus:border-red-600 transition"
                  >
                    {series.seasons.filter((s: any) => s.season_number > 0).map((s: any) => (
                      <option key={s.id} value={s.season_number}>
                        Season {s.season_number}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {seasonData?.episodes.map((ep: any) => (
                    <button
                      key={ep.id}
                      onClick={() => setEpisode(ep.episode_number)}
                      className={`p-3 rounded-xl border text-left transition ${
                        episode === ep.episode_number
                          ? "bg-red-600/20 border-red-600 text-white"
                          : "bg-zinc-800/40 border-zinc-700 text-zinc-400 hover:bg-zinc-800"
                      }`}
                    >
                      <p className="text-xs font-bold uppercase tracking-wider opacity-60">EP {ep.episode_number}</p>
                      <p className="text-sm font-medium truncate">{ep.name}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT — DETAILS PANEL */}
            <Details media={series} />

          </div>
        </div>

        {/* Related Series Grid */}
        <section className="px-4 md:px-10 pb-20 border-t border-zinc-900 pt-12">
          <h2 className="text-2xl font-bold mb-8">Related Shows</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
            {related.slice(0, 12).map((m) => (
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
