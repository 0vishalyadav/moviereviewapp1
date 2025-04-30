import { AuthProvider } from "@/contexts/auth";
import "@/global.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <SafeAreaView className="flex-1">
          <StatusBar hidden={true} />
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="movies/[id]" options={{ headerShown: false }} />
            <Stack.Screen name="signIn" options={{ headerShown: false }} />
            <Stack.Screen name="signUp" options={{ headerShown: false }} />
          </Stack>
        </SafeAreaView>
      </QueryClientProvider>
    </AuthProvider>
  );
}
