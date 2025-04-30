import { MovieCard } from "@/components/MovieCard";
import { Searchbar } from "@/components/Searchbar";
import { TrendingMovieCard } from "@/components/TrendingMovieCard";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { useFetchMovies, useFetchTrendingMovies } from "@/hooks/movies";
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { ActivityIndicator, Image, Text, View } from "react-native";

export default function Index() {
  const router = useRouter();

  const {
    data: trendingMovies,
    error: trendingMoviesError,
    isLoading: isTrendingMoviesLoading,
    isError: isTrendingMoviesError,
  } = useFetchTrendingMovies();

  const {
    data: movies,
    error: moviesError,
    isLoading: isMoviesLoading,
    isError: isMoviesError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useFetchMovies();

  const flatMovies = useMemo(() => {
    return movies?.pages.flatMap((p) => p.results) ?? [];
  }, [movies?.pages]);

  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute z-0 w-full" />
      <FlashList
        data={flatMovies}
        keyExtractor={(item, index) => `${item.id.toString()}-${index}`}
        renderItem={({ item }) => (
          <View className="w-full px-3.5 mb-8">
            <MovieCard movie={item} />
          </View>
        )}
        numColumns={3}
        horizontal={false}
        estimatedItemSize={120}
        className="w-full pt-20"
        contentContainerStyle={{ paddingBottom: 200, paddingHorizontal: 4 }}
        scrollEventThrottle={16}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.2}
        ListHeaderComponent={
          <>
            <Image source={icons.logo} className="w-12 h-10 mb-5 mx-auto" />

            {isMoviesLoading ? (
              <ActivityIndicator
                size="large"
                color="#0000ff"
                className="mt-10 self-center"
              />
            ) : isMoviesError || isTrendingMoviesError ? (
              <Text className="text-lg text-red-600 self-center">
                Error: {moviesError?.message || trendingMoviesError?.message}
              </Text>
            ) : (
              <>
                <Searchbar
                  onPress={() => router.push("/search")}
                  placeholder="Search for the movie"
                />

                {trendingMovies && (
                  <View className="mt-10">
                    <Text className="text-lg text-white font-bold mb-3 ml-5">
                      Trending Movies
                    </Text>

                    <FlashList
                      data={trendingMovies}
                      keyExtractor={(item) => item.id.toString()}
                      renderItem={({ item, index }) => (
                        <TrendingMovieCard movie={item} index={index} />
                      )}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      className="mb-4"
                      ItemSeparatorComponent={() => <View className="w-4" />}
                    />
                  </View>
                )}

                <Text className="text-lg text-white font-bold mt-5 ml-5 mb-2">
                  Latest Movies
                </Text>
              </>
            )}
          </>
        }
        ListFooterComponent={
          isFetchingNextPage ? (
            <View className="h-20 flex-row justify-center items-center">
              <ActivityIndicator size="large" color="#00f" />
            </View>
          ) : null
        }
      />
    </View>
  );
}
