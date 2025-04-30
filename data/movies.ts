import {
  config as appwriteConfig,
  database,
  savedMoviesAttr,
} from "@/lib/appwrite";
import {
  movieDetailsSchema,
  moviesSchema,
  savedMovieSchema,
} from "@/schemas/movies";
import { ID, Permission, Query, Role } from "react-native-appwrite";
import { z } from "zod";

export const config = {
  base_url: "https://api.themoviedb.org/3",
  api_key: process.env.EXPO_PUBLIC_TMDB_API_KEY!,
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.EXPO_PUBLIC_TMDB_API_KEY!}`,
  },
};

export const fetchMovies = async ({
  query,
  pageParam = 1,
}: {
  query?: string;
  pageParam?: number;
}) => {
  try {
    const endpoint = query
      ? `${config.base_url}/search/movie?query=${encodeURIComponent(query)}`
      : `${config.base_url}/discover/movie?sort_by=popularity.desc&page=${pageParam}`;

    const response = await fetch(endpoint, {
      method: "GET",
      headers: config.headers,
    });

    if (!response.ok) {
      // @ts-ignore
      throw new Error("Failed to fetch movies", response.statusText);
    }

    const data = await response.json();

    const { data: parsedData, success } = await z
      .object({
        page: z.number(),
        total_pages: z.number(),
        results: moviesSchema,
      })
      .safeParseAsync(data);

    if (!success) throw new Error("Failed to parse data");

    return parsedData;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch movies. Please try again!");
  }
};

export const fetchTrendingMovies = async () => {
  const response = await fetch(`${config.base_url}/trending/movie/day`, {
    method: "GET",
    headers: config.headers,
  });

  if (!response.ok) throw new Error("Failed to fetch trending movies");

  const data = await response.json();

  const { data: parsedData, success } = await moviesSchema.safeParseAsync(
    data.results
  );

  if (!success) throw new Error("Failed to fetch trending movies");

  return parsedData;
};

export const fetchMovieDetails = async ({ id }: { id: string }) => {
  try {
    const endpoint = `${config.base_url}/movie/${id}`;
    const response = await fetch(endpoint, {
      method: "GET",
      headers: config.headers,
    });

    if (!response.ok) throw new Error("Failed to fetch movie details");

    const data = await response.json();

    return data as z.infer<typeof movieDetailsSchema>;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch movie details. Please try again!");
  }
};

export const fetchSavedMovies = async ({ userId }: { userId: string }) => {
  try {
    const response = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.col.savedMovies,
      [Query.equal(savedMoviesAttr.userId, userId)]
    );

    const { data: parsedData, success } = await z
      .array(savedMovieSchema)
      .safeParseAsync(response.documents);

    if (!success) throw new Error("Failed to parse saved movies data");

    return parsedData;
  } catch (error) {
    throw new Error("Failed to fetch saved movies");
  }
};

export const fetchSavedMovie = async ({
  userId,
  movieId,
}: {
  userId: string;
  movieId: number;
}) => {
  try {
    const response = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.col.savedMovies,
      [
        Query.equal(savedMoviesAttr.userId, userId),
        Query.equal(savedMoviesAttr.movieId, movieId),
        Query.limit(1),
      ]
    );

    if (response.total === 0) return null;

    const { data: parsedData, success } = await savedMovieSchema.safeParseAsync(
      response.documents[0]
    );

    if (!success) throw new Error("Failed to parse saved movie data");

    return parsedData;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch saved movie");
  }
};

export const updateSavedMovie = async ({
  userId,
  movieId,
  movieTitle,
  posterPath,
  voteAverage,
  releasedDate,
  documentId,
}: {
  userId: string;
  movieId: number;
  movieTitle: string;
  posterPath: string;
  voteAverage: number;
  releasedDate: string;
  documentId?: string;
}) => {
  try {
    const response = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.col.savedMovies,
      [
        Query.equal(savedMoviesAttr.userId, userId),
        Query.equal(savedMoviesAttr.movieId, movieId),
        Query.limit(1),
      ]
    );

    // save the movie
    if (response.total === 0) {
      const newSavedMovie = await database.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.col.savedMovies,
        ID.unique(),
        { movieId, userId, posterPath, movieTitle, voteAverage, releasedDate },
        [
          Permission.read(Role.user(userId)),
          Permission.write(Role.user(userId)),
          Permission.update(Role.user(userId)),
          Permission.delete(Role.user(userId)),
        ]
      );

      const { data, success } = await savedMovieSchema.safeParseAsync(
        newSavedMovie
      );

      if (!success) throw new Error("Failed to parse saved movie data");

      return data;
    } else {
      if (documentId) {
        await database.deleteDocument(
          appwriteConfig.databaseId,
          appwriteConfig.col.savedMovies,
          documentId
        );

        return null;
      }
    }
  } catch (error) {
    console.log(error);
    throw new Error("Failed to save movie data");
  }
};
