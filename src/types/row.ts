import type { MovieDetails, WatchHistoryItem } from "./movie";

export type MovieRow = {
  title: string;
  movies: (MovieDetails | WatchHistoryItem)[];
  mediaType: "movie" | "tv";
};

