import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { ClipPath, Defs, G, Path, Rect, Use } from "react-native-svg";

// Exact Figma heart ring path (viewBox 0 0 336 336, fill #FFB3CD)
const HEART_RING_PATH =
  "M148.96 26.7029C149.761 25.4172 150.754 24.2687 151.882 23.3239C153.01 22.3791 154.25 21.6567 155.532 21.1986L176.911 13.3155C177.089 13.2497 177.27 13.2219 177.443 13.2339C177.616 13.2458 177.777 13.2972 177.918 13.3851C178.058 13.4729 178.175 13.5955 178.262 13.7456C178.348 13.8957 178.403 14.0703 178.422 14.2594L180.708 36.9306C181.006 39.6652 180.263 42.6592 178.643 45.2541C177.023 47.8489 174.659 49.832 172.072 50.7671C169.484 51.7021 166.884 51.5125 164.844 50.24C162.804 48.9676 161.491 46.7164 161.194 43.9818L160.752 40.8571L157.733 41.8283C155.805 42.5184 153.856 42.589 152.133 42.0311C150.409 41.4732 148.989 40.3118 148.05 38.6935C147.112 37.0753 146.697 35.0727 146.859 32.9386C147.021 30.8046 147.752 28.6347 148.96 26.7029Z";

// Figma design reference width
const DESIGN_WIDTH = 393;

// Renders 24 hearts scaled to ringSize — viewBox stays 336×336 so SVG scales automatically
function HeartRing({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 336 336">
      <Defs>
        <ClipPath id="hrClip">
          <Rect
            width={40}
            height={40}
            fill="white"
            transform="translate(174 57.3994) rotate(-148)"
          />
        </ClipPath>
        <G id="hrInner">
          <G clipPath="url(#hrClip)">
            <Path d={HEART_RING_PATH} fill="#FFB3CD" />
          </G>
        </G>
      </Defs>
      <G>
        <Use href="#hrInner" />
        <Use href="#hrInner" transform="translate(49.0997 -37.6755) rotate(15)" />
        <Use href="#hrInner" transform="translate(106.278 -61.3594) rotate(30)" />
        <Use href="#hrInner" transform="translate(167.637 -69.4375) rotate(45)" />
        <Use href="#hrInner" transform="translate(228.996 -61.3594) rotate(60)" />
        <Use href="#hrInner" transform="translate(286.174 -37.6756) rotate(75)" />
        <Use href="#hrInner" transform="translate(335.274 0) rotate(90)" />
        <Use href="#hrInner" transform="translate(372.949 49.0997) rotate(105)" />
        <Use href="#hrInner" transform="translate(396.633 106.278) rotate(120)" />
        <Use href="#hrInner" transform="translate(404.711 167.637) rotate(135)" />
        <Use href="#hrInner" transform="translate(396.633 228.996) rotate(150)" />
        <Use href="#hrInner" transform="translate(372.949 286.174) rotate(165)" />
        <Use href="#hrInner" transform="translate(335.274 335.274) rotate(-180)" />
        <Use href="#hrInner" transform="translate(286.174 372.949) rotate(-165)" />
        <Use href="#hrInner" transform="translate(228.996 396.633) rotate(-150)" />
        <Use href="#hrInner" transform="translate(167.637 404.711) rotate(-135)" />
        <Use href="#hrInner" transform="translate(106.278 396.633) rotate(-120)" />
        <Use href="#hrInner" transform="translate(49.0997 372.949) rotate(-105)" />
        <Use href="#hrInner" transform="translate(0 335.274) rotate(-90)" />
        <Use href="#hrInner" transform="translate(-37.6755 286.174) rotate(-75)" />
        <Use href="#hrInner" transform="translate(-61.3594 228.996) rotate(-60)" />
        <Use href="#hrInner" transform="translate(-69.4375 167.637) rotate(-45)" />
        <Use href="#hrInner" transform="translate(-61.3594 106.278) rotate(-30)" />
        <Use href="#hrInner" transform="translate(-37.6755 49.0997) rotate(-15)" />
      </G>
    </Svg>
  );
}

// Avatar pair scaled relative to the ring size
function AvatarGroup({ scale }: { scale: number }) {
  const w = 162 * scale;
  const h = 150 * scale;
  const circleSize = 83 * scale;
  const radius = circleSize / 2;

  return (
    <View style={{ width: w, height: h }}>
      {/* Left profile circle */}
      <View
        style={{
          position: "absolute",
          left: 1.5 * scale,
          top: 13.5 * scale,
          width: circleSize,
          height: circleSize,
          borderRadius: radius,
          borderWidth: 3,
          borderColor: "#FFB3CD",
          overflow: "hidden",
        }}
      >
        <Image
          source={require("../../assets/images/hana.png")}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />
      </View>

      {/* Right profile circle */}
      <View
        style={{
          position: "absolute",
          left: 76.5 * scale,
          top: 52.5 * scale,
          width: circleSize,
          height: circleSize,
          borderRadius: radius,
          borderWidth: 3,
          borderColor: "#FFB3CD",
          overflow: "hidden",
        }}
      >
        <Image
          source={require("../../assets/images/janedoe.png")}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />
      </View>
    </View>
  );
}

export default function MadeForYouScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  // Ring scales to ~85% of screen width, matching Figma ratio (336/393)
  const ringSize = width * (336 / DESIGN_WIDTH);
  const avatarScale = ringSize / 336;

  return (
    <View className="flex-1 bg-[#FF4081]">
      {/* Header — back arrow only */}
      <View
        className="flex-row items-center px-5 h-6"
        style={{ marginTop: insets.top + 28 }}
      >
        <TouchableOpacity
          onPress={() =>
            router.push("/(tabs)/partner-pairing-success" as any)
          }
          activeOpacity={0.7}
          className="w-6"
        >
          <Feather name="arrow-left" size={24} color="#FAFAFA" />
        </TouchableOpacity>
      </View>

      {/* Title */}
      <Text className="font-inter font-medium text-2xl text-white tracking-[-0.3px] text-center mt-10 px-5">
        Made just for you and your partner
      </Text>

      {/* Heart ring + avatar group */}
      <View className="flex-1 items-center justify-center">
        <View style={{ width: ringSize, height: ringSize }}>
          {/* Heart ring — fills the container */}
          <View className="absolute inset-0">
            <HeartRing size={ringSize} />
          </View>

          {/* Avatar group — centered inside ring via flex */}
          <View className="absolute inset-0 items-center justify-center">
            <AvatarGroup scale={avatarScale} />
          </View>
        </View>
      </View>

      {/* Next button */}
      <View className="items-center pb-7">
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/index" as any)}
          activeOpacity={0.8}
          className="w-[250px] h-14 bg-[#FF82AD] rounded-full items-center justify-center"
        >
          <Text className="font-inter font-medium text-[15px] text-white">
            Next
          </Text>
        </TouchableOpacity>
      </View>

      {/* Home indicator */}
      <View
        className="bg-[#FF3378] items-center justify-end pt-2"
        style={{ paddingBottom: Math.max(insets.bottom, 8) + 3 }}
      >
        <View className="w-[134px] h-[5px] bg-[#FF99BC] rounded-full" />
      </View>
    </View>
  );
}
