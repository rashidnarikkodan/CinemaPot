
export interface WatchHistoryItem {
  id: number;
  title: string;
  poster_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  vote_count?: number;
  popularity?: number;
  media_type: "movie" | "tv";
}

export interface MovieDetails{
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  id: number;
  media_type: "movie" | "tv";
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  release_date: string;
  first_air_date?: string;
  title: string;
  name?: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
  runtime?: number;
};


export type Movie = {
  adult: boolean;
  backdrop_path: string | null;

  belongs_to_collection: MovieCollection | null;

  budget: number;
  genres: Genre[];

  homepage: string;
  id: number;
  imdb_id: string | null;

  origin_country: string[];

  original_language: string;
  original_title: string;

  overview: string;

  popularity: number;

  poster_path: string | null;

  production_companies: ProductionCompany[];

  production_countries: ProductionCountry[];

  release_date: string;

  revenue: number;

  runtime: number | null;

  spoken_languages: SpokenLanguage[];

  status: string;

  tagline: string | null;

  title: string;

  video: boolean;

  vote_average: number;

  vote_count: number;
};

export type MovieCollection = {
  id: number;
  name: string;
  poster_path: string | null;
  backdrop_path: string | null;
};
export type Genre = {
  id: number;
  name: string;
};
export type ProductionCompany = {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
};
export type ProductionCountry = {
  iso_3166_1: string;
  name: string;
};
export type SpokenLanguage = {
  english_name: string;
  iso_639_1: string;
  name: string;
};

export type CompanySearchResult = {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string;
};