export const STREAM_SERVERS = [
  {
    name: "VidLink",
    movie: (id: number) => `https://vidlink.pro/movie/${id}?autoplay=false`,
    tv: (id: number, s: number, e: number) =>
      `https://vidlink.pro/tv/${id}/${s}/${e}?autoplay=false`,
    isPremium: true,
  },
  {
    name: "RiveStream",
    movie: (id: number) => `https://rivestream.org/embed?type=movie&id=${id}`,
    tv: (id: number, s: number, e: number) =>
      `https://rivestream.org/embed?type=tv&id=${id}&season=${s}&episode=${e}`,
    isPremium: true,
  },
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
];
