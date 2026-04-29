import { STREAM_SERVERS } from "./servers";

type EmbedPlayerProps = {
  id: number;
  server: number;
  type?: "movie" | "tv";
  season?: number;
  episode?: number;
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
    <iframe
      src={src}
      className="h-full w-full"
      allowFullScreen
      referrerPolicy="no-referrer"
    />
  );
};


export default EmbedPlayer;