 import { ROW_CONFIG } from "../config/rowConfig";
import { fetchMovies } from "./fetchMovies";
import type { MovieRow } from "../types/row";

export async function fetchRows(): Promise<MovieRow[]> {
  return Promise.all(
    ROW_CONFIG.map(async (row) => {
      const data = await fetchMovies(row);

      return {
        title: row.title,
        movies: data.results,
        mediaType: row.mediaType,
      };

    })
  );
}

