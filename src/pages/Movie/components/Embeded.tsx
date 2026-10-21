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

const EmbedPlayer = ({
  id,
  server,
  type = "movie",
  season = 1,
  episode = 1,
}: EmbedPlayerProps) => {
  const selectedServer = STREAM_SERVERS[server] || STREAM_SERVERS[0];

  if (!selectedServer) {
    return (
      <div className="flex items-center justify-center h-full text-zinc-500">
        Server not available
      </div>
    );
  }

  const src =
    type === "tv"
      ? selectedServer.tv(id, season, episode)
      : selectedServer.movie(id);

  return (
    <div className="relative w-full h-full bg-black">
      <iframe
        key={`${server}-${id}-${season}-${episode}`}
        src={src}
        className="w-full h-full border-0"
        allowFullScreen
        referrerPolicy="no-referrer"
        loading="eager"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
      />
      {/* Invisible Safe Scroll Zones */}
      <div className="absolute top-0 left-0 w-full h-6 z-10 pointer-events-auto" />
      <div className="absolute top-0 left-0 w-8 h-full z-10 pointer-events-auto" />
      <div className="absolute top-0 right-0 w-8 h-full z-10 pointer-events-auto" />
    </div>
  );
};

export default EmbedPlayer;