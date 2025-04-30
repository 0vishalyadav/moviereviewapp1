import { MyTextInput } from "@/components/MyTextInput";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { useAuth } from "@/hooks/auth";
import { Link, Redirect } from "expo-router";
import { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function SignIn() {
  const { session, signIn } = useAuth();

  if (session) {
    return <Redirect href="/" />;
  }

  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");

  const handleSubmit = async () => {
    if (emailValue && passwordValue) {
      await signIn({ email: emailValue, password: passwordValue });
    }
  };

  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="w-full absolute z-0" />
      <Image source={icons.logo} className="w-12 h-10 mx-auto mt-20" />

      <View className="mt-32 flex-col items-center justify-between px-8">
        <Text className="text-6xl font-semibold text-white italic">
          Sign In
        </Text>

        <View className="w-full mt-20">
          <MyTextInput
            label="Enter your email"
            placeholder="Eg: user@example.com"
            value={emailValue}
            onChangeText={(text) => setEmailValue(text)}
          />
        </View>

        <View className="w-full mt-10">
          <MyTextInput
            label="Enter your password"
            placeholder="Eg: 12345678"
            value={passwordValue}
            onChangeText={(text) => setPasswordValue(text)}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          className="w-full mt-10 px-3 py-4 bg-accent rounded-xl flex-row justify-center items-center"
          onPress={handleSubmit}
        >
          <Text className="text-lg font-bold">Sign In</Text>
        </TouchableOpacity>

        <Link href="/signUp" className="mt-5">
          <Text className="text-sm text-light-200 font-semibold underline">
            Don't have an account? Sign Up
          </Text>
        </Link>
      </View>

      <Link href="/" className="absolute top-5 left-5 z-50" asChild>
        <TouchableOpacity className="flex-row gap-x-1 items-center">
          <Image
            source={icons.arrow}
            tintColor="#fff"
            className="size-5 rotate-180 mt-0.5"
          />
          <Text className="text-sm text-white">Go to home</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}
