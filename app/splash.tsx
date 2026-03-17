import { Href, router } from "expo-router";
import { useEffect } from "react";
import { Image, View } from "react-native";

export default function SplashScreen() {
  useEffect(() => {
    setTimeout(() => {
      router.replace("/onboarding" as Href);
    }, 2000);
  }, []);

  return (
    <View className="flex-1 bg-[#FF4081] items-center justify-center">
      <Image
        source={require("../assets/images/Logo-square.png")}
        className="w-32 h-32 mb-5"
        resizeMode="contain"
      />
    </View>
  );
}
