import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import {
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";

export default function StartPartnershipScreen() {
  const insets = useSafeAreaInsets();

  const handleBack = () => {
    router.back();
  };

  const handleStartJourney = () => {
    // Proceed to the core dashboard
    router.replace("/partner" as any);
  };

  return (
    <View className="flex-1 bg-[#FF4081]" style={{ paddingTop: insets.top }}>
      <StatusBar barStyle="light-content" backgroundColor="#FF4081" />

      <ScrollView
        className="flex-1 relative overflow-hidden"
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Floating Background Bubbles (Behind Phone) */}
        <View
          className="absolute top-[18%] -left-8 w-[120px] h-[120px] rounded-full pointer-events-none"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.03)",
            borderWidth: 1.5,
            borderColor: "rgba(255, 255, 255, 0.35)",
          }}
        />

        {/* Header Section */}
        <View className="flex-row items-center px-6 py-4">
          <TouchableOpacity onPress={handleBack} className="p-2 -ml-2 z-10">
            <Feather name="arrow-left" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Hero Title */}
        <Text className="text-white text-[24px] font-medium text-center px-8 mt-4 mb-4 leading-8">
          You are all set to start your partnership journey!
        </Text>

        {/* Simulated Phone Device Frame */}
        <View className="items-center flex-1 justify-center -mt-4 relative mb-28">
          {/* Phone Outer Bezel */}
          <View
            className="rounded-[30px] p-[6px] shadow-2xl overflow-hidden shadow-black"
            style={{
              backgroundColor: "#22024C",
              width: "65%", // Scaled down phone frame
              aspectRatio: 9 / 19.5, // Standard modern phone ratio
              elevation: 10,
            }}
          >
            {/* Phone Screen Screen Area */}
            <LinearGradient
              colors={["#59007F", "#2A0835", "#000000"]}
              className="flex-1 rounded-[24px] relative overflow-hidden"
            >
              {/* Inner Simulated Notch */}
              <View className="absolute top-2 left-0 right-0 items-center z-10">
                <View className="w-16 h-4 bg-black rounded-full" />
              </View>

              {/* Simulated Internal Content (Miniaturized Babe's Cycle) */}
              <View className="pt-[44px] px-4 flex-1">
                {/* Internal Header */}
                <View className="flex-row items-center justify-between mb-8 relative w-full">
                  <Feather
                    name="arrow-left"
                    size={12}
                    color="#FFFFFF"
                    className="z-10"
                  />
                  <View className="absolute left-0 right-0 items-center pointer-events-none">
                    <Text className="text-white text-[10px] font-medium">
                      Babe`&apos;`s Cycle
                    </Text>
                  </View>
                  <View style={{ width: 12 }} />
                </View>

                <View className="items-center">
                  <Text className="text-white text-[8px] font-medium mb-1">
                    Next Ovulation
                  </Text>
                  <Text
                    className="text-white font-black mb-1 letter-spacing-1.5"
                    style={{
                      fontSize: 24,
                      fontFamily: "Segoe UI",
                      letterSpacing: 1,
                    }}
                  >
                    7 Days Left
                  </Text>
                  <Text className="text-white text-[10px] mb-8">
                    Next period: 15 days left
                  </Text>

                  {/* Mini Cycle Phase Card */}
                  <View className="bg-[#F5DFFF] rounded-[8px] w-full p-[12px] mb-4">
                    <Text className="text-[#A63ED1] text-[12px] font-bold mb-1">
                      Cycle Phase
                    </Text>
                    <Text className="text-[#666666] text-[9px] leading-[13px] mb-2">
                      My love is in the ovulation period. Keep in touch and stay
                      connected .
                    </Text>
                    <Text className="text-[#212121] font-bold text-[10px]">
                      Cycle Day 12
                    </Text>
                  </View>
                </View>
              </View>

              {/* Simulated Bottom Tab Bar */}
              <View className="absolute bottom-0 left-0 right-0 h-[48px] bg-[#1C0625] flex-row justify-around items-center px-1 rounded-b-[24px]">
                <View className="items-center justify-center flex-1">
                  <Svg
                    width={14}
                    height={14}
                    viewBox="0 0 20 20"
                    fill="none"
                    style={{ marginBottom: 2 }}
                  >
                    <Path
                      d="M2.5 8.33333L10 2.5L17.5 8.33333V16.6667C17.5 17.1087 17.3244 17.5326 17.0118 17.8452C16.6993 18.1577 16.2754 18.3333 15.8333 18.3333H4.16667C3.72464 18.3333 3.30072 18.1577 2.98816 17.8452C2.67559 17.5326 2.5 17.1087 2.5 16.6667V8.33333Z"
                      fill="#FF4081"
                    />
                  </Svg>
                  <Text className="text-[#FF4081] text-[6px] font-medium">
                    Home
                  </Text>
                </View>
                <View className="items-center justify-center flex-1 opacity-70">
                  <Feather
                    name="calendar"
                    size={14}
                    color="#9E9E9E"
                    style={{ marginBottom: 2 }}
                  />
                  <Text className="text-[#9E9E9E] text-[6px] font-medium">
                    Calendar
                  </Text>
                </View>
                <View className="items-center justify-center flex-1 opacity-70">
                  <Feather
                    name="settings"
                    size={14}
                    color="#9E9E9E"
                    style={{ marginBottom: 2 }}
                  />
                  <Text className="text-[#9E9E9E] text-[6px] font-medium">
                    Settings
                  </Text>
                </View>
                {/* Simulated Home Indicator */}
                <View className="absolute bottom-1 left-0 right-0 items-center">
                  <View className="w-12 h-1 bg-[#3E215D] rounded-full" />
                </View>
              </View>
            </LinearGradient>
          </View>
        </View>

        {/* Floating Bubbles (In Front of Phone) */}
        <View
          className="absolute top-[38%] left-[45%] w-[160px] h-[160px] rounded-full pointer-events-none"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.03)",
            borderWidth: 1.5,
            borderColor: "rgba(255, 255, 255, 0.35)",
            marginLeft: -40,
            marginTop: -30,
          }}
        />
        <View
          className="absolute bottom-[28%] -right-[5%] w-[90px] h-[90px] rounded-full pointer-events-none"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.03)",
            borderWidth: 1.5,
            borderColor: "rgba(255, 255, 255, 0.35)",
          }}
        />
        <View
          className="absolute bottom-[8%] -left-[10%] w-[140px] h-[140px] rounded-full pointer-events-none"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.03)",
            borderWidth: 1.5,
            borderColor: "rgba(255, 255, 255, 0.35)",
          }}
        />
      </ScrollView>

      {/* Bottom Action Button Container Fixed at Bottom */}
      <View className="absolute bottom-10 left-0 right-0 px-10">
        <TouchableOpacity
          onPress={handleStartJourney}
          className="w-full bg-[#FF82AD] rounded-full py-4 items-center justify-center shadow-md shadow-[#FF4081]/50"
          activeOpacity={0.8}
        >
          <Text className="text-white text-[16px] font-medium tracking-wide">
            Start partnership journey
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
