import { icons } from "@/constants/icons";
import { savedMovieSchema } from "@/schemas/movies";
import { Link } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { z } from "zod";
import { SaveMovieButton } from "./SaveMovieButton";

export const SavedMovieCard = ({
  savedMovie,
}: {
  savedMovie: z.infer<typeof savedMovieSchema>;
}) => {
  return (
    <Link
      href={{ pathname: "/movies/[id]", params: { id: savedMovie.movieId } }}
      asChild
    >
      <TouchableOpacity className="w-full">
        <Image
          source={{
            uri: savedMovie.posterPath
              ? `https://image.tmdb.org/t/p/w500${savedMovie.posterPath}`
              : "https://placeholder.co/600x400/1a1a1a/ffffff.png",
          }}
          className="w-full h-52 rounded-lg"
          resizeMode="cover"
        />

        <Text className="text-sm text-white font-bold mt-2" numberOfLines={1}>
          {savedMovie.movieTitle}
        </Text>

        <View className="flex-row items-center justify-start gap-x-1">
          <Image source={icons.star} className="size-4" />
          <Text className="text-xs text-white font-bold uppercase">
            {Math.round(savedMovie.voteAverage! / 2)}
          </Text>
        </View>

        <View className="flex-row items-center justify-between mt-1">
          <Text className="text-xs text-light-300 font-medium">
            {savedMovie.releasedDate?.split("-")[0]}
          </Text>
          {/* <Text className="text-xs text-light-300 uppercase">Movie</Text> */}
        </View>

        <View className="absolute top-2 right-2">
          <SaveMovieButton
            movieId={savedMovie.movieId}
            movieTitle={savedMovie.movieTitle}
            posterPath={savedMovie.posterPath}
            voteAverage={savedMovie.voteAverage}
            releasedDate={savedMovie.releasedDate}
            iconClassName="size-3.5"
            buttonClassName="p-3"
            initialData={savedMovie}
          />
        </View>
      </TouchableOpacity>
    </Link>
  );
};
