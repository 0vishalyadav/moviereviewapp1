import { MOVIE_QUERY_TAG, QUERY_KEY } from "@/constants/cache";
import {
  fetchMovieDetails,
  fetchMovies,
  fetchSavedMovie,
  fetchSavedMovies,
  fetchTrendingMovies,
  updateSavedMovie,
} from "@/data/movies";
import {
  movieDetailsSchema,
  moviesSchema,
  savedMovieSchema,
} from "@/schemas/movies";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { z } from "zod";

export const useFetchMovies = () => {
  return useInfiniteQuery({
    queryFn: ({ pageParam }) => fetchMovies({ pageParam }),
    queryKey: [QUERY_KEY.movies, MOVIE_QUERY_TAG.latest],
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.page <= lastPage.total_pages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
  });
};

export const useSearchMovies = ({ query }: { query?: string }) => {
  const queryClient = useQueryClient();
  const queryKey = [QUERY_KEY.movies, MOVIE_QUERY_TAG.search, query];

  return useQuery({
    queryFn: async () => {
      const cache = queryClient.getQueryData(queryKey);

      if (cache) {
        const { success, data } = await moviesSchema.safeParseAsync(cache);
        if (success) return data;
      }

      return (await fetchMovies({ query })).results;
    },
    queryKey,
    enabled: Boolean(query && query.length > 0),
    gcTime: 5 * 60 * 1000,
  });
};

export const useFetchTrendingMovies = () => {
  return useQuery({
    queryFn: fetchTrendingMovies,
    queryKey: [QUERY_KEY.movies, MOVIE_QUERY_TAG.trending],
    refetchIntervalInBackground: false,
  });
};

export const useFetchMovieDetails = (id: string) => {
  const queryClient = useQueryClient();
  const queryKey = [QUERY_KEY.movies, MOVIE_QUERY_TAG.details, id];

  return useQuery({
    queryFn: async () => {
      const cache = queryClient.getQueryData(queryKey);

      if (cache) {
        const { data, success } = await movieDetailsSchema.safeParseAsync(
          cache
        );
        if (success) return data;
      }

      return fetchMovieDetails({ id });
    },
    queryKey,
    enabled: Boolean(id),
  });
};

export const useFetchSavedMovies = ({ userId }: { userId: string }) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryFn: async () => {
      const savedMovies = await fetchSavedMovies({ userId });

      savedMovies.forEach((movie) =>
        queryClient.setQueryData<z.infer<typeof savedMovieSchema>>(
          [QUERY_KEY.movies, MOVIE_QUERY_TAG.saved, movie.movieId],
          movie
        )
      );

      return savedMovies;
    },
    queryKey: [QUERY_KEY.movies, MOVIE_QUERY_TAG.saved],
  });
};

export const useFetchSavedMovie = ({
  userId,
  movieId,
  initialData,
}: {
  userId: string;
  movieId: number;
  initialData?: z.infer<typeof savedMovieSchema>;
}) => {
  return useQuery({
    queryFn: () => fetchSavedMovie({ userId, movieId }),
    queryKey: [QUERY_KEY.movies, MOVIE_QUERY_TAG.saved, movieId],
    initialData: initialData,
    enabled: Boolean(userId !== "" && movieId != null),
    refetchOnMount: Boolean(initialData == null),
    refetchOnWindowFocus: Boolean(initialData == null),
  });
};

export const useSavedMovieMutation = ({
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      updateSavedMovie({
        userId,
        movieId,
        movieTitle,
        posterPath,
        documentId,
        voteAverage,
        releasedDate,
      }),
    onMutate: async () => {
      const baseKey = [QUERY_KEY.movies, MOVIE_QUERY_TAG.saved];

      await queryClient.cancelQueries({
        queryKey: baseKey,
      });

      await queryClient.cancelQueries({
        queryKey: [...baseKey, movieId],
      });

      const previousSavedMovie = queryClient.getQueryData([
        ...baseKey,
        movieId,
      ]) as z.infer<typeof savedMovieSchema>;

      const previousSavedMovies =
        (queryClient.getQueryData(baseKey) as
          | z.infer<typeof savedMovieSchema>[]
          | undefined) ?? [];

      if (documentId) {
        queryClient.removeQueries({
          queryKey: [...baseKey, movieId],
          exact: true,
        });
        queryClient.setQueryData(
          baseKey,
          previousSavedMovies.filter((movie) => movie.movieId !== movieId)
        );
      } else {
        const newSavedMovie = {
          movieId,
          userId,
          movieTitle,
          posterPath,
          voteAverage,
          releasedDate,
          $id: null,
        };

        queryClient.setQueryData([...baseKey, movieId], newSavedMovie);
        queryClient.setQueryData(baseKey, [
          ...previousSavedMovies,
          newSavedMovie,
        ]);
      }

      return { previousSavedMovie, previousSavedMovies };
    },
    onError: (err, variables, context) => {
      if (context) {
        queryClient.setQueryData(
          [QUERY_KEY.movies, MOVIE_QUERY_TAG.saved, movieId],
          context.previousSavedMovie
        );

        queryClient.setQueryData(
          [QUERY_KEY.movies, MOVIE_QUERY_TAG.saved],
          context.previousSavedMovies
        );
      }
    },
    onSuccess: (data) => {
      const previousSavedMovies =
        (queryClient.getQueryData([
          QUERY_KEY.movies,
          MOVIE_QUERY_TAG.saved,
        ]) as z.infer<typeof savedMovieSchema>[]) ?? [];

      if (data) {
        queryClient.setQueryData(
          [QUERY_KEY.movies, MOVIE_QUERY_TAG.saved],
          [
            ...previousSavedMovies.filter(
              (movie) => movie.movieId !== data.movieId
            ),
            data,
          ]
        );

        queryClient.setQueryData(
          [QUERY_KEY.movies, MOVIE_QUERY_TAG.saved, movieId],
          data
        );
      } else {
        queryClient.setQueryData(
          [QUERY_KEY.movies, MOVIE_QUERY_TAG.saved],
          previousSavedMovies.filter((movie) => movie.movieId !== movieId)
        );

        queryClient.removeQueries({
          queryKey: [QUERY_KEY.movies, MOVIE_QUERY_TAG.saved, movieId],
          exact: true,
        });
      }
    },
  });
};
