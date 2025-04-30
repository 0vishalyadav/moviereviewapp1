import { SavedMovieCard } from "@/components/SavedMovieCard";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { useAuth } from "@/hooks/auth";
import { useFetchSavedMovies } from "@/hooks/movies";
import { FlashList } from "@shopify/flash-list";
import { Link } from "expo-router";
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Saved() {
  const { session } = useAuth();

  if (!session) {
    return (
      <View className="flex-1 bg-primary">
        <Image source={images.bg} className="w-full absolute z-0" />
        <Image source={icons.logo} className="w-12 h-10 mx-auto mt-20" />

        <View className="flex-1 flex-col justify-center items-center">
          <Text className="text-lg text-white font-bold">
            You are currently signed out !
          </Text>

          <Link href="/signIn" asChild>
            <TouchableOpacity className="flex-row gap-x-1 items-center">
              <Text className="text-base text-light-200 font-semibold">
                Please Sign In
              </Text>

              <Image
                source={icons.arrow}
                tintColor="#A8B5DB"
                className="size-5 mt-0.5"
              />
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    );
  }

  const {
    data: savedMovies,
    error,
    isLoading,
    isError,
  } = useFetchSavedMovies({
    userId: session.userId,
  });

  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="w-full absolute z-0" />

      <FlashList
        data={savedMovies}
        keyExtractor={(item, index) => `${item.movieId}-${index}`}
        renderItem={({ item }) => (
          <View className="w-full px-3.5 mb-8">
            <SavedMovieCard savedMovie={item} />
          </View>
        )}
        horizontal={false}
        numColumns={3}
        className="w-full pt-20"
        contentContainerStyle={{ paddingBottom: 200, paddingHorizontal: 4 }}
        ListHeaderComponent={() => (
          <>
            <Image source={icons.logo} className="w-12 h-10 mb-5 mx-auto" />
            <Text className="text-lg text-white font-bold mt-5 ml-5 mb-2">
              Saved Movies
            </Text>

            {isLoading && (
              <ActivityIndicator
                size="large"
                color="#0000ff"
                className="mt-10 self-center"
              />
            )}

            {isError && (
              <Text className="text-lg text-red-600 self-center">
                Error: {error.message}
              </Text>
            )}
          </>
        )}
      />
    </View>
  );
}
