import { images } from "@/constants/images";
import { movieSchema } from "@/schemas/movies";
import MaskedView from "@react-native-masked-view/masked-view";
import { Link } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { z } from "zod";

export const TrendingMovieCard = ({
  movie,
  index,
}: {
  movie: z.infer<typeof movieSchema>;
  index: number;
}) => {
  return (
    <Link href={{ pathname: "/movies/[id]", params: { id: movie.id } }} asChild>
      <TouchableOpacity className="w-36 relative pl-5">
        <Image
          source={{
            uri: movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : "https://placeholder.co/600x400/1a1a1a/ffffff.png",
          }}
          className="w-full h-48 rounded-lg"
        />

        <View className="absolute -bottom-[68%] -left-2 px-2 py-1 rounded-full">
          <MaskedView
            maskElement={
              <Text className="text-6xl font-bold text-white">{index + 1}</Text>
            }
          >
            <Image
              source={images.rankingGradient}
              className="size-18"
              resizeMode="cover"
            />
          </MaskedView>
        </View>

        <Text className="text-sm text-white font-bold mt-2" numberOfLines={1}>
          {movie.title}
        </Text>
      </TouchableOpacity>
    </Link>
  );
};
