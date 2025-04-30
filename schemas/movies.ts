import { z } from "zod";

export const movieSchema = z.object({
  id: z.number(),
  title: z.string(),
  adult: z.boolean(),
  backdrop_path: z.string().nullish(),
  genre_ids: z.array(z.number()),
  original_language: z.string(),
  original_title: z.string(),
  overview: z.string(),
  popularity: z.number(),
  poster_path: z.string().nullish(),
  release_date: z.string(),
  video: z.boolean(),
  vote_average: z.number(),
  vote_count: z.number(),
});

export const moviesSchema = z.array(movieSchema);

export const movieMetricSchema = z.object({
  $id: z.string(),
  searchTerm: z.string(),
  searchCount: z.number(),
  posterUrl: z.string(),
  movieId: z.number(),
  movieTitle: z.string(),
});

export const movieMetricsSchema = z.array(movieMetricSchema);

export const movieDetailsSchema = z.object({
  adult: z.boolean().nullish(),
  backdrop_path: z.string().nullish(),
  belongs_to_collection: z.string().nullish(),
  budget: z.number().nullish(),
  genres: z
    .array(
      z.object({
        id: z.number().nullish(),
        name: z.string().nullish(),
      })
    )
    .nullish(),
  homepage: z.string().nullish(),
  id: z.number().nullish(),
  imdb_id: z.string().nullish(),
  original_language: z.string().nullish(),
  original_title: z.string().nullish(),
  overview: z.string().nullish(),
  popularity: z.number().nullish(),
  poster_path: z.string().nullish(),
  production_companies: z
    .array(
      z.object({
        id: z.number().nullish(),
        logo_path: z.string().nullish(),
        name: z.string().nullish(),
        origin_country: z.string().nullish(),
      })
    )
    .nullish(),
  production_countries: z
    .array(
      z.object({
        iso_3166_1: z.string().nullish(),
        name: z.string().nullish(),
      })
    )
    .nullish(),
  release_date: z.string().nullish(),
  revenue: z.number().nullish(),
  runtime: z.number().nullish(),
  spoken_languages: z
    .array(
      z.object({
        english_name: z.string().nullish(),
        iso_639_1: z.string().nullish(),
        name: z.string().nullish(),
      })
    )
    .nullish(),
  status: z.string().nullish(),
  tagline: z.string().nullish(),
  title: z.string().nullish(),
  video: z.boolean().nullish(),
  vote_average: z.number().nullish(),
  vote_count: z.number().nullish(),
});

export const savedMovieSchema = z.object({
  $id: z.string(),
  userId: z.string(),
  movieId: z.number(),
  posterPath: z.string(),
  movieTitle: z.string(),
  voteAverage: z.number(),
  releasedDate: z.string(),
});
