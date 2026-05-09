import { STREAM_SERVERS } from "./servers";

type EmbedPlayerProps = {
  id: number;
  server: number;
  type?: "movie" | "tv";
  season?: number;
  episode?: number;
  title?: string;
  backdrop?: string;
};

const EmbedPlayer = ({ id, server, type = "movie", season = 1, episode = 1 }: EmbedPlayerProps) => {
  const selectedServer = STREAM_SERVERS[server];

  if (!selectedServer) {
    return <div className="flex items-center justify-center h-full text-zinc-500">Server not available</div>;
  }

  const src = type === "tv" 
    ? selectedServer.tv(id, season, episode)
    : selectedServer.movie(id);

  return (
    <div className="relative w-full h-full">
      <iframe
        src={src}
        className="w-full h-full"
        allowFullScreen
        referrerPolicy="no-referrer"
      />
      {/* Invisible Safe Scroll Zones (Thinner to prevent blocking controls) */}
      <div className="absolute top-0 left-0 w-full h-6 z-10 pointer-events-auto" /> {/* Top edge */}
      <div className="absolute top-0 left-0 w-8 h-full z-10 pointer-events-auto" /> {/* Left edge */}
      <div className="absolute top-0 right-0 w-8 h-full z-10 pointer-events-auto" /> {/* Right edge */}
    </div>
  );
};

export default EmbedPlayer;