export interface StreamServer {
  name: string;
  movie: (id: number) => string;
  tv: (id: number, s: number, e: number) => string;
}

export const STREAM_SERVERS: StreamServer[] = [
  {
    name: "VidLink Pro",
    movie: (id: number) =>
      `https://vidlink.pro/movie/${id}?primaryColor=dc2626&secondaryColor=18181b&iconColor=ffffff`,
    tv: (id: number, s: number, e: number) =>
      `https://vidlink.pro/tv/${id}/${s}/${e}?primaryColor=dc2626&secondaryColor=18181b&iconColor=ffffff`,
  },
  {
    name: "VidSrc su",
    movie: (id: number) => `https://vidsrc.su/embed/movie/${id}`,
    tv: (id: number, s: number, e: number) =>
      `https://vidsrc.su/embed/tv/${id}/${s}/${e}`,
  },
  {
    name: "2embed",
    movie: (id: number) => `https://www.2embed.cc/embed/${id}`,
    tv: (id: number, s: number, e: number) =>
      `https://www.2embed.cc/embedtv/${id}&s=${s}&e=${e}`,
  },
  {
    name: "VidSrc to",
    movie: (id: number) => `https://vidsrc.to/embed/movie/${id}`,
    tv: (id: number, s: number, e: number) =>
      `https://vidsrc.to/embed/tv/${id}/${s}/${e}`,
  },
];

const PREFERRED_SERVER_KEY = "cinemapot_stream_server";

export const getDefaultServerIndex = (): number => {
  try {
    const saved = localStorage.getItem(PREFERRED_SERVER_KEY);
    if (saved !== null) {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed) && parsed >= 0 && parsed < STREAM_SERVERS.length) {
        return parsed;
      }
    }
  } catch {
    // Ignore localStorage access restrictions
  }
  return 0; // Default to Server 01 (VidLink Fast CDN)
};

export const savePreferredServerIndex = (index: number): void => {
  try {
    if (index >= 0 && index < STREAM_SERVERS.length) {
      localStorage.setItem(PREFERRED_SERVER_KEY, index.toString());
    }
  } catch {
    // Ignore localStorage access restrictions
  }
};
