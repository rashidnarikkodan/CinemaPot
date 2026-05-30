
export const STREAM_SERVERS = [
  {
    name: "VidSrc.to",
    movie: (id: number) => `https://vidsrc.to/embed/movie/${id}`,
    tv: (id: number, s: number, e: number) =>
      `https://vidsrc.to/embed/tv/${id}/${s}/${e}`,
    isPremium: true,
  },
  {
    name: "Vidsrc.me",
    movie: (id: number) => `https://vidsrc.me/embed/movie/${id}`,
    tv: (id: number, s: number, e: number) =>
      `https://vidsrc.me/embed/tv/${id}/${s}/${e}`,
    isPremium: false,
  },
  {
    name: "VidLink",
    movie: (id: number) => `https://vidlink.pro/movie/${id}?autoplay=false`,
    tv: (id: number, s: number, e: number) =>
      `https://vidlink.pro/tv/${id}/${s}/${e}?autoplay=false`,
    isPremium: true,
  },
];

