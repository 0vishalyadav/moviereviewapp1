import { icons } from "@/constants/icons";
import { movieSchema } from "@/schemas/movies";
import { Link } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { z } from "zod";

export const MovieCard = ({
  movie,
}: {
  movie: Partial<z.infer<typeof movieSchema>>;
}) => {
  return (
    <Link
      href={{ pathname: "/movies/[id]", params: { id: movie.id! } }}
      asChild
    >
      <TouchableOpacity className="w-full">
        <Image
          source={{
            uri: movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : "https://placeholder.co/600x400/1a1a1a/ffffff.png",
          }}
          className="w-full h-52 rounded-lg"
          resizeMode="cover"
        />

        <Text className="text-sm text-white font-bold mt-2" numberOfLines={1}>
          {movie.title}
        </Text>

        <View className="flex-row items-center justify-start gap-x-1">
          <Image source={icons.star} className="size-4" />
          <Text className="text-xs text-white font-bold uppercase">
            {Math.round(movie.vote_average! / 2)}
          </Text>
        </View>

        <View className="flex-row items-center justify-between mt-1">
          <Text className="text-xs text-light-300 font-medium">
            {movie.release_date?.split("-")[0]}
          </Text>
          {/* <Text className="text-xs text-light-300 uppercase">Movie</Text> */}
        </View>
      </TouchableOpacity>
    </Link>
  );
};
