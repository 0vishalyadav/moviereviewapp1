import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { Tabs } from "expo-router";
import { Image, ImageBackground, Text, View } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          marginHorizontal: 20,
          marginBottom: 30,
          backgroundColor: "#0f0D23",
          borderRadius: 50,
          height: 52,
          borderWidth: 1,
          borderColor: "#0f0d23",
          overflow: "hidden",
        },

        tabBarItemStyle: {
          width: "100%",
          height: "100%",
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={"home"} focused={focused} title="Home" />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          headerShown: false,
          title: "Search",
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={"search"} focused={focused} title="Search" />
          ),
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          headerShown: false,
          title: "Saved",
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={"save"} focused={focused} title="Saved" />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          title: "Profile",
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={"person"} focused={focused} title="Profile" />
          ),
        }}
      />
    </Tabs>
  );
}

function TabIcon({
  icon,
  focused,
  title,
}: {
  icon: keyof typeof icons;
  focused: boolean;
  title: string;
}) {
  if (focused) {
    return (
      <ImageBackground
        source={images.highlight}
        className="w-full h-full mt-3 min-w-[120px] min-h-[52px] flex flex-row items-center justify-center rounded-full overflow-hidden"
      >
        <Image source={icons[icon]} tintColor="#151312" className="size-5" />
        <Text className="text-secondary text-base font-semibold ml-2">
          {title}
        </Text>
      </ImageBackground>
    );
  }

  return (
    <View className="flex flex-row w-full items-center justify-center rounded-full mt-3">
      <Image source={icons[icon]} tintColor="#A8B5DB" className="size-5" />
    </View>
  );
}
