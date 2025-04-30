import { SaveMovieButton } from "@/components/SaveMovieButton";
import { icons } from "@/constants/icons";
import { useFetchMovieDetails } from "@/hooks/movies";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function MovieDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const {
    data: movieDetails,
    error: movieDetailsError,
    isLoading: isMovieDetailsLoading,
    isError: isMovieDetailsError,
    isSuccess: isMovieDetailsSuccess,
  } = useFetchMovieDetails(id as string);

  return (
    <View className="flex-1 bg-primary">
      {isMovieDetailsError && (
        <View className="flex-1 justify-center items-center">
          <Text className="text-sm text-red-600 font-bold self-center">
            Error: {movieDetailsError.message}
          </Text>
        </View>
      )}

      {isMovieDetailsLoading && (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}

      {isMovieDetailsSuccess && (
        <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
          <View className="relative">
            <Image
              source={{
                uri: `https://image.tmdb.org/t/p/w500${movieDetails?.poster_path}`,
              }}
              className="w-full h-[550px]"
              resizeMode="stretch"
            />

            <View className="absolute z-50 top-10 right-6">
              <SaveMovieButton
                movieId={parseInt(id as string)}
                movieTitle={movieDetails.title!}
                posterPath={movieDetails.poster_path!}
                voteAverage={movieDetails.vote_average!}
                releasedDate={movieDetails.release_date!}
              />
            </View>
          </View>

          <View className="flex-col items-start justify-center mt-5 px-5">
            <Text className="text-xl text-white font-bold">
              {movieDetails?.title}
            </Text>
            <View className="flex-row items-center gap-x-1 mt-2">
              <Text className="text-light-200 text-sm">
                {movieDetails?.release_date?.split("-")[0]}
              </Text>
              <Text className="text-light-200 text-sm">
                {movieDetails?.runtime}m
              </Text>
            </View>
            <View className="flex-row items-center bg-dark-100 px-2 py-1 rounded-md gap-x-1 mt-2">
              <Image source={icons.star} className="size-4" />
              <Text className="text-sm text-white font-bold">
                {Math.round(movieDetails?.vote_average ?? 0)} / 10
              </Text>
              <Text className="text-sm text-light-300">
                ({movieDetails?.vote_count} votes)
              </Text>
            </View>
            <MovieInfo label="Overview" value={movieDetails?.overview} />

            <MovieInfo
              label="Genres"
              value={movieDetails?.genres?.map((g) => g.name).join(" - ")}
            />

            <View className="flex flex-row w-1/2 justify-between">
              <MovieInfo
                label="Budget"
                value={`${
                  movieDetails?.budget
                    ? `$${movieDetails.budget / 1_000_000} million`
                    : ""
                }`}
              />
              <MovieInfo
                label="Revenue"
                value={`${
                  movieDetails?.revenue
                    ? `$${Math.round(movieDetails.revenue / 1_000_000)} million`
                    : ""
                }`}
              />
            </View>

            <MovieInfo
              label="Production Companies"
              value={movieDetails?.production_companies
                ?.map((p) => p.name)
                .join(" - ")}
            />
          </View>
        </ScrollView>
      )}

      <TouchableOpacity
        className="flex flex-row items-center justify-center absolute bottom-5 right-0 left-0 py-3.5 bg-accent rounded-lg mx-5 z-50"
        onPress={() => router.back()}
      >
        <Image
          source={icons.arrow}
          className="size-5 mt-0.5 mr-1 rotate-180"
          tintColor="#fff"
        />
        <Text className="text-base text-white font-semibold">Go Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const MovieInfo = ({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) => {
  return (
    <View className="flex-col items-start justify-center mt-5">
      <Text className="text-light-200 text-sm font-normal">{label}</Text>
      <Text className="text-light-100 text-sm font-bold mt-2">
        {value ? value : "N/A"}
      </Text>
    </View>
  );
};
