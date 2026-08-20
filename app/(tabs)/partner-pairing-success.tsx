import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { ClipPath, Defs, G, Path, Rect } from "react-native-svg";

// Exact Figma heart background (viewBox 0 0 393 376)
const LARGE_HEART_PATH =
  "M415.75 113.414C415.784 128.294 412.866 143.033 407.167 156.778C401.468 170.523 393.1 183.002 382.547 193.492L208.133 370.485C206.679 371.961 204.946 373.133 203.035 373.934C201.124 374.734 199.072 375.146 197 375.146C194.928 375.146 192.877 374.734 190.966 373.934C189.054 373.133 187.321 371.961 185.867 370.485L11.4534 193.492C-9.81058 172.254 -21.7668 143.439 -21.7851 113.386C-21.8034 83.3323 -9.88233 54.5025 11.3557 33.2385C32.5937 11.9746 61.409 0.0183354 91.4624 2.10709e-05C121.516 -0.0182933 150.346 11.9028 171.61 33.1409L197 56.8713L222.567 33.0627C238.435 17.2734 258.625 6.53939 280.589 2.21569C302.552 -2.10801 325.305 0.17248 345.973 8.76927C366.642 17.3661 384.3 31.8937 396.719 50.5182C409.138 69.1427 415.76 91.0291 415.75 113.414Z";

// Exact Figma decorative leaf paths (viewBox 0 0 162 150)
const LEAF_TOP_RIGHT =
  "M86.8822 24.4227C87.6825 23.1369 88.6754 21.9884 89.8034 21.0436C90.9314 20.0988 92.1722 19.3764 93.4539 18.9183L114.833 11.0352C115.011 10.9694 115.192 10.9417 115.365 10.9536C115.538 10.9656 115.699 11.017 115.84 11.1048C115.98 11.1926 116.097 11.3152 116.184 11.4653C116.27 11.6154 116.325 11.79 116.344 11.9791L118.63 34.6503C118.927 37.3849 118.184 40.379 116.565 42.9738C114.945 45.5687 112.581 47.5517 109.994 48.4868C107.406 49.4218 104.806 49.2323 102.766 47.9598C100.726 46.6873 99.4132 44.4361 99.1161 41.7015L98.6734 38.5768L95.6547 39.548C93.7266 40.2381 91.7778 40.3087 90.0545 39.7508C88.3312 39.1929 86.9106 38.0315 85.972 36.4132C85.0335 34.795 84.619 32.7924 84.781 30.6584C84.943 28.5243 85.6742 26.3544 86.8822 24.4227Z";

const LEAF_BOTTOM_LEFT =
  "M74.2889 125.19C73.4631 126.46 72.4475 127.588 71.3008 128.51C70.1541 129.432 68.8992 130.13 67.6085 130.562L46.0761 138.016C45.8966 138.079 45.7152 138.103 45.5427 138.087C45.3701 138.072 45.2098 138.017 45.071 137.927C44.9322 137.836 44.8177 137.711 44.7342 137.559C44.6508 137.408 44.5999 137.232 44.5847 137.042L42.7515 114.33C42.5091 111.59 43.3118 108.611 44.9831 106.049C46.6543 103.488 49.0572 101.552 51.6631 100.669C54.269 99.7858 56.8645 100.027 58.8786 101.34C60.8927 102.653 62.1604 104.93 62.4029 107.67L62.783 110.803L65.8205 109.893C67.762 109.241 69.7118 109.209 71.4236 109.802C73.1354 110.394 74.5325 111.583 75.4386 113.22C76.3446 114.857 76.7189 116.867 76.5143 118.998C76.3097 121.128 75.5353 123.283 74.2889 125.19Z";

// Avatar group: decorative leaves (SVG) + profile circles (RN Images)
// Matches Figma SVG: width=162, height=150, viewBox 0 0 162 150
function AvatarGroup() {
  return (
    <View style={{ width: 162, height: 150 }}>
      {/* SVG layer — clipped decorative leaves, rendered behind circles */}
      <View style={{ position: "absolute", top: 0, left: 0 }}>
        <Svg width={162} height={150} viewBox="0 0 162 150">
          <Defs>
            <ClipPath id="clip0">
              <Rect
                width={40}
                height={40}
                fill="white"
                transform="translate(111.922 55.1191) rotate(-148)"
              />
            </ClipPath>
            <ClipPath id="clip1">
              <Rect
                width={40}
                height={40}
                fill="white"
                transform="translate(49.8711 94) rotate(33.1451)"
              />
            </ClipPath>
          </Defs>

          {/* Decorative leaf — top right */}
          <G clipPath="url(#clip0)">
            <Path d={LEAF_TOP_RIGHT} fill="#FFE6EE" />
          </G>

          {/* Decorative leaf — bottom left */}
          <G clipPath="url(#clip1)">
            <Path d={LEAF_BOTTOM_LEFT} fill="#FFE6EE" />
          </G>
        </Svg>
      </View>

      {/* Left profile circle — x=1.5, y=13.5, w=83, h=83, rx=41.5 */}
      <View
        style={{
          position: "absolute",
          left: 1.5,
          top: 13.5,
          width: 83,
          height: 83,
          borderRadius: 41.5,
          borderWidth: 3,
          borderColor: "#FFB3CD",
          overflow: "hidden",
        }}
      >
        <View style={{ width: "100%", height: "100%", backgroundColor: "#FFE6EE", alignItems: "center", justifyContent: "center" }}>
          <Feather name="user" size={36} color="#FF82AD" />
        </View>
      </View>

      {/* Right profile circle — x=76.5, y=52.5, w=83, h=83, rx=41.5 */}
      <View
        style={{
          position: "absolute",
          left: 76.5,
          top: 52.5,
          width: 83,
          height: 83,
          borderRadius: 41.5,
          borderWidth: 3,
          borderColor: "#FFB3CD",
          overflow: "hidden",
        }}
      >
        <View style={{ width: "100%", height: "100%", backgroundColor: "#FFE6EE", alignItems: "center", justifyContent: "center" }}>
          <Feather name="user" size={36} color="#FF82AD" />
        </View>
      </View>
    </View>
  );
}

export default function PartnerPairingSuccessScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-[#FF4081]">
      {/* Header — back arrow only */}
      <View
        className="flex-row items-center px-5 h-6"
        style={{ marginTop: insets.top + 28 }}
      >
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/generate-invite" as any)}
          activeOpacity={0.7}
          className="w-6"
        >
          <Feather name="arrow-left" size={24} color="#FAFAFA" />
        </TouchableOpacity>
      </View>

      {/* Title */}
      <Text className="font-inter font-medium text-2xl text-white tracking-[-0.3px] text-center mt-10">
        Partner pairing successful
      </Text>

      {/* Heart + avatar group */}
      <View className="flex-1 items-center justify-center">
        {/* Large heart background — exact Figma SVG */}
        <Svg width={393} height={376} viewBox="0 0 393 376">
          <Path d={LARGE_HEART_PATH} fill="#FF578F" />
        </Svg>

        {/* Avatar group absolutely centered over the heart */}
        <View className="absolute">
          <AvatarGroup />
        </View>
      </View>

      {/* Next button */}
      <View className="items-center pb-7">
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/made-for-you" as any)}
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
      </View>
    </View>
  );
}
