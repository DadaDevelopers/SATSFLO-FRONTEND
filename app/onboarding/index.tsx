import TopWave from "@/components/TopWave";
import { router } from "expo-router";
import {
  Image,
  Pressable,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function OnboardingScreen() {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const imageHeight = height * 0.52;
  const imageTop = insets.top + 16;

  const waveTop = Math.round(imageTop + imageHeight * 0.75);
  const waveHeight = Math.round(imageHeight * 0.25 + 20);
  // Overlap card 2px into wave to close any subpixel rendering gap
  const cardTop = waveTop + waveHeight - 2;

  return (
    <View style={{ flex: 1, backgroundColor: "#FF4081" }}>
      {/* Image — behind the wave */}
      <View
        style={{
          position: "absolute",
          top: imageTop,
          left: 0,
          right: 0,
          alignItems: "center",
          zIndex: 0,
        }}
      >
        <Image
          source={require("../../assets/images/miniscreen.png")}
          style={{ width: width * 0.75, height: imageHeight }}
          resizeMode="contain"
        />
      </View>

      {/* Wave — covers image's bottom quarter, curve visible against pink bg */}
      <View
        style={{
          position: "absolute",
          top: waveTop,
          left: 0,
          right: 0,
          zIndex: 1,
        }}
      >
        <TopWave fillHeight={waveHeight} />
      </View>

      {/* Card — starts exactly where wave ends */}
      <View
        style={{
          position: "absolute",
          top: cardTop,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "#FFDBE7",
          paddingHorizontal: 32,
          paddingTop: 16,
        }}
      >
        <Text className="text-2xl font-poppins font-semibold text-[#212121] text-center leading-8 mb-3">
          Empower Your Wellness{"\n"}Journey!
        </Text>
        <Text className="text-sm font-inter text-[#666666] text-center leading-5 mb-4 px-4">
          Log your cycle, track your symptoms, and monitor your moods in one
          seamless experience.
        </Text>
        <View className="flex-row justify-center mb-5">
          <View className="w-3 h-[5px] rounded-full bg-[#FF4081] mx-[1.5px]" />
          <View className="w-[5px] h-[5px] rounded-full bg-[#FFE9F1] mx-[1.5px]" />
          <View className="w-[5px] h-[5px] rounded-full bg-[#FFE9F1] mx-[1.5px]" />
        </View>
        <View className="flex-row w-full gap-3">
          <Pressable
            onPress={() => router.replace("/(auth)/signup")}
            className="flex-1 py-4 rounded-full bg-[#FFEBF2] items-center justify-center active:opacity-80"
          >
            <Text className="text-[#FF4081] font-medium text-[15px]">Skip</Text>
          </Pressable>
          <Pressable
            onPress={() => router.push("/onboarding/screen2")}
            className="flex-1 py-4 rounded-full bg-[#FF4081] items-center justify-center active:opacity-80"
          >
            <Text className="text-white font-medium text-[15px]">Continue</Text>
          </Pressable>
        </View>
        <View style={{ flex: 1 }} />
        {/* Home indicator */}
        <View
          style={{
            backgroundColor: "#FF3378",
            alignItems: "center",
            paddingTop: 8,
            paddingBottom: Math.max(insets.bottom, 8) + 3,
            marginHorizontal: -32,
          }}
        />
      </View>
    </View>
  );
}
