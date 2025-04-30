import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { useAuth } from "@/hooks/auth";
import { Link } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function Profile() {
  const { session, signOut } = useAuth();

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

  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="w-full absolute z-0" />
      <Image source={icons.logo} className="w-12 h-10 mx-auto mt-20" />
      <View className="mt-20 mx-auto">
        <TouchableOpacity
          className="flex-row justify-center items-center py-2 bg-red-600 px-4 rounded-lg"
          onPress={signOut}
        >
          <Text className="text-lg text-white font-semibold">Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
