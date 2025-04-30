import { icons } from "@/constants/icons";
import { useAuth } from "@/hooks/auth";
import { useFetchSavedMovie, useSavedMovieMutation } from "@/hooks/movies";
import { savedMovieSchema } from "@/schemas/movies";
import { Image, TouchableOpacity } from "react-native";
import { z } from "zod";

export const SaveMovieButton = ({
  movieId,
  movieTitle,
  posterPath,
  voteAverage,
  releasedDate,
  iconClassName,
  buttonClassName,
  initialData,
}: {
  movieId: number;
  movieTitle: string;
  posterPath: string;
  voteAverage: number;
  releasedDate: string;
  iconClassName?: string;
  buttonClassName?: string;
  initialData?: z.infer<typeof savedMovieSchema>;
}) => {
  const { session } = useAuth();

  if (!session) return null;

  const {
    data: savedMovie,
    isLoading: isSavedMovieLoading,
    isError: isSavedMovieError,
  } = useFetchSavedMovie({
    userId: session.userId,
    movieId,
    initialData,
  });

  const saveMovie = useSavedMovieMutation({
    userId: session.userId,
    movieId,
    movieTitle,
    posterPath,
    voteAverage,
    releasedDate,
    documentId: savedMovie?.$id,
  });

  return (
    <TouchableOpacity
      className={`p-3 rounded-full ${buttonClassName} ${
        savedMovie ? "bg-accent" : "bg-primary"
      }`}
      disabled={isSavedMovieLoading || isSavedMovieError || saveMovie.isPending}
      onPress={async () => await saveMovie.mutateAsync()}
    >
      <Image
        source={icons.save}
        tintColor={"#fff"}
        className={`size-5 ${iconClassName}`}
      />
    </TouchableOpacity>
  );
};
