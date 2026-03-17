import { api } from "../lib/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Href, router } from "expo-router";
import { useEffect } from "react";
import { Image, View } from "react-native";

export default function SplashScreen() {
  useEffect(() => {
    const navigate = async () => {
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) {
        router.replace("/how-to-use" as Href);
        return;
      }
      // Route paired users directly to the partner dashboard
      try {
        const { response, data } = await api.get("/partner", token);
        if (response.ok && data?.data?.partner) {
          router.replace("/partner" as Href);
          return;
        }
      } catch {}
      router.replace("/(tabs)" as Href);
    };
    const timer = setTimeout(navigate, 2000);
    return () => clearTimeout(timer);
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
