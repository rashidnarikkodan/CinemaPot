import type { MovieDetails } from "./movie";

export type MovieRow = {
  title: string;
  movies: MovieDetails[];
  mediaType: "movie" | "tv";
};

