import { MovieCard } from "@/components/MovieCard";
import { Searchbar } from "@/components/Searchbar";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { useSearchMovies } from "@/hooks/movies";
import { FlashList } from "@shopify/flash-list";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, Text, View } from "react-native";

export default function Search() {
  const [query, setQuery] = useState("");
  const [debounceQuery, setDebounceQuery] = useState("");
  const {
    data: movies,
    error,
    isError,
    isLoading,
  } = useSearchMovies({ query: debounceQuery });

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (query.trim()) {
        setDebounceQuery(query);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [query]);

  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute z-0 w-full" />
      <FlashList
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View className="w-full px-3.5 mb-8">
            <MovieCard movie={item} />
          </View>
        )}
        numColumns={3}
        className="w-full"
        contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 4 }}
        ListHeaderComponent={
          <>
            <View className="w-full flex-row justify-center items-center mt-20">
              <Image source={icons.logo} className="w-12 h-10" />
            </View>

            <View className="mt-10">
              <Searchbar
                placeholder="Search movies..."
                value={query}
                onChangeText={(text) => setQuery(text)}
              />
            </View>

            <View className="mt-2">
              {isLoading && (
                <ActivityIndicator
                  size="large"
                  color="#0000ff"
                  className="my-4"
                />
              )}

              {isError && <Text>Error: {error.message}</Text>}

              {!isLoading &&
                !isError &&
                query.trim() &&
                movies &&
                movies?.length > 0 && (
                  <Text className="text-xl text-white font-bold mb-5">
                    Search Results for{" "}
                    <Text className="text-accent">{query}</Text>
                  </Text>
                )}
            </View>
          </>
        }
        ListEmptyComponent={
          !isLoading && !isError ? (
            <View className="mt-10 px-5">
              <Text className="text-center text-gray-500">
                {query.trim() ? "No Movies found" : "Search for a movie"}
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}
