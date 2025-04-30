import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { account } from "@/lib/appwrite";
import React, { createContext, useEffect, useState } from "react";
import { ActivityIndicator, Image, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type User = Awaited<ReturnType<typeof account.get>>;
type Session = Awaited<ReturnType<typeof account.createEmailPasswordSession>>;

type AuthContextProps = {
  session: Session | undefined;
  user: User | undefined;
  signIn: ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<Session>();
  const [user, setUser] = useState<User>();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setLoading(true);
      const responseSession = await account.getSession("current");
      setSession(responseSession);

      const responseUser = await account.get();
      setUser(responseUser);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    try {
      setLoading(true);
      const responseSession = await account.createEmailPasswordSession(
        email,
        password
      );
      setSession(responseSession);

      const responseUser = await account.get();
      setUser(responseUser);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await account.deleteSession("current");
      setSession(undefined);
      setUser(undefined);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const contextData = { session, user, signIn, signOut };

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? (
        <SafeAreaView className="flex-1">
          <View className="flex-1 bg-primary">
            <Image source={images.bg} className="absolute z-0 w-full" />
            <Image
              source={icons.logo}
              className="w-12 h-10 mb-5 mx-auto mt-20"
            />
            <ActivityIndicator size="large" color="#0000ff" className="mt-5" />
          </View>
        </SafeAreaView>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
