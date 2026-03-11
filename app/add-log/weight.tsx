import { useAddLog } from "@/context/add-log-context";
import { useResponsive } from "@/hooks/use-responsive";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";

export default function WeightScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isDesktop, containerStyle, outerBackgroundColor } = useResponsive();
  const { getCurrentDayData, setWeight, setWeightUnit } = useAddLog();
  const dayData = getCurrentDayData();

  const [localWeight, setLocalWeight] = useState(dayData.weight || "");
  const [localUnit, setLocalUnit] = useState(dayData.weightUnit);

  useEffect(() => {
    setLocalWeight(dayData.weight || "");
    setLocalUnit(dayData.weightUnit);
  }, [dayData.weight, dayData.weightUnit]);

  const increment = () => {
    const currentValue = parseFloat(localWeight) || 0;
    const newValue = Math.round((currentValue + 0.1) * 10) / 10;
    setLocalWeight(newValue.toString());
  };

  const decrement = () => {
    const currentValue = parseFloat(localWeight) || 0;
    const newValue = Math.max(0, Math.round((currentValue - 0.1) * 10) / 10);
    setLocalWeight(newValue > 0 ? newValue.toString() : "");
  };

  const clearValue = () => {
    setLocalWeight("");
  };

  const handleSave = () => {
    setWeight(localWeight);
    setWeightUnit(localUnit);
    router.back();
  };

  const handleInputChange = (text: string) => {
    // Allow only numbers and decimal point
    const filtered = text.replace(/[^0-9.]/g, "");
    // Prevent multiple decimal points
    const parts = filtered.split(".");
    if (parts.length > 2) {
      return;
    }
    setLocalWeight(filtered);
  };

  return (
    <View
      className="flex-1"
      style={{
        backgroundColor: outerBackgroundColor,
        paddingTop: isDesktop ? 20 : insets.top,
        paddingBottom: isDesktop ? 20 : 0,
      }}
    >
      <View className="flex-1" style={containerStyle}>
        {/* Header */}
        <View className="flex-row items-center px-4 py-4">
          <TouchableOpacity onPress={() => router.back()} className="p-2">
            <Svg width={18} height={15} viewBox="0 0 18 15" fill="none">
              <Path
                d="M0.219376 6.96993L6.96937 0.219934C7.11011 0.0792027 7.30098 0.000141144 7.5 0.000141144C7.69902 0.000141144 7.88989 0.0792027 8.03063 0.219934C8.17136 0.360664 8.25042 0.551536 8.25042 0.750559C8.25042 0.949582 8.17136 1.14045 8.03063 1.28118L2.56031 6.75056L17.25 6.75056C17.4489 6.75056 17.6397 6.82958 17.7803 6.97023C17.921 7.11088 18 7.30165 18 7.50056C18 7.69947 17.921 7.89024 17.7803 8.03089C17.6397 8.17154 17.4489 8.25056 17.25 8.25056L2.56031 8.25056L8.03063 13.7199C8.17136 13.8607 8.25042 14.0515 8.25042 14.2506C8.25042 14.4496 8.17136 14.6405 8.03063 14.7812C7.88989 14.9219 7.69902 15.001 7.5 15.001C7.30098 15.001 7.11011 14.9219 6.96937 14.7812L0.219376 8.03119C0.149643 7.96153 0.0943222 7.87881 0.0565796 7.78776C0.018837 7.69672 -0.000589371 7.59912 -0.000589371 7.50056C-0.000589371 7.402 0.018837 7.3044 0.0565796 7.21335C0.0943222 7.12231 0.149643 7.03959 0.219376 6.96993Z"
                fill="white"
              />
            </Svg>
          </TouchableOpacity>
          <Text className="flex-1 text-center text-white text-xl font-medium mr-10">
            Weight
          </Text>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          {/* Weight Input Card */}
          <View className="px-4">
            <View
              style={{
                backgroundColor: "#FFE5EE",
                borderRadius: 24,
                padding: 16,
              }}
            >
              {/* Unit Toggle */}
              <View
                className="flex-row items-center rounded-[10px] bg-white mb-6"
                style={{ padding: 2, height: 44 }}
              >
                <TouchableOpacity
                  onPress={() => setLocalUnit("kg")}
                  className="items-center justify-center rounded-lg"
                  style={{
                    width: 155,
                    height: 40,
                    backgroundColor:
                      localUnit === "kg" ? "#FFE4ED" : "transparent",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Inter",
                      fontWeight: "400",
                      fontSize: 14,
                      lineHeight: 20,
                      color: "#000000",
                    }}
                  >
                    kg
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setLocalUnit("lb")}
                  className="flex-1 items-center justify-center rounded-lg"
                  style={{
                    height: 40,
                    backgroundColor:
                      localUnit === "lb" ? "#FFE4ED" : "transparent",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Inter",
                      fontWeight: "400",
                      fontSize: 14,
                      lineHeight: 20,
                      color: "#000000",
                      textAlign: "center",
                    }}
                  >
                    lb
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Value Display with Input */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                {/* Minus Button */}
                <TouchableOpacity onPress={decrement}>
                  <Svg width={40} height={40} viewBox="0 0 20 20" fill="none">
                    <Path
                      d="M10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20C15.5228 20 20 15.5228 20 10C20 4.47715 15.5228 0 10 0Z"
                      fill="#FFBAD2"
                    />
                    <Path
                      d="M5.71484 10.7142V9.28564H14.2863V10.7142H5.71484Z"
                      fill="#FF4081"
                    />
                  </Svg>
                </TouchableOpacity>

                {/* Value + Unit */}
                <View style={{ flex: 1, alignItems: "center" }}>
                  <TextInput
                    value={localWeight}
                    onChangeText={handleInputChange}
                    placeholder="0.0"
                    placeholderTextColor="#999"
                    keyboardType="decimal-pad"
                    style={{
                      fontSize: 40,
                      fontWeight: "300",
                      color: "#1E1E1E",
                      textAlign: "center",
                      minWidth: 80,
                    }}
                  />
                  <Text style={{ color: "#999", fontSize: 13, marginTop: 2 }}>
                    {localUnit}
                  </Text>
                </View>

                {/* Trash */}
                <TouchableOpacity
                  onPress={clearValue}
                  style={{ marginRight: 12 }}
                >
                  <Svg width={24} height={24} viewBox="0 0 24 24">
                    <Path
                      d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z"
                      stroke="#999"
                      strokeWidth={1.5}
                      fill="none"
                    />
                    <Path
                      d="M10 11v6M14 11v6"
                      stroke="#999"
                      strokeWidth={1.5}
                    />
                  </Svg>
                </TouchableOpacity>

                {/* Plus Button */}
                <TouchableOpacity onPress={increment}>
                  <Svg width={40} height={40} viewBox="0 0 20 20" fill="none">
                    <Path
                      d="M10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20C15.5228 20 20 15.5228 20 10C20 4.47715 15.5228 0 10 0Z"
                      fill="#FFBAD2"
                    />
                    <Path
                      d="M9.28571 10.7143H5V9.28571H9.28571V5H10.7143V9.28571H15V10.7143H10.7143V15H9.28571V10.7143Z"
                      fill="#FF4081"
                    />
                  </Svg>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>

        {/* Save Button */}
        <View style={{ alignItems: "center" }}>
          <TouchableOpacity
            onPress={handleSave}
            style={{
              width: 250,
              height: 56,
              backgroundColor: "#FF82AD",
              borderWidth: 0.5,
              borderColor: "#FF669A",
              borderRadius: 1000,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 20,
            }}
            activeOpacity={0.8}
          >
            <Text
              style={{
                fontFamily: "Inter",
                fontWeight: "500",
                fontSize: 15,
                lineHeight: 18,
                color: "#FFFFFF",
                textAlign: "center",
              }}
            >
              Save
            </Text>
          </TouchableOpacity>

          {/* Home indicator strip */}
          <View
            style={{
              width: "100%",
              height: 34 + (isDesktop ? 0 : insets.bottom),
              backgroundColor: "#FF3378",
              alignItems: "center",
              justifyContent: "flex-end",
              paddingBottom: 8,
            }}
          >
            <View
              style={{
                width: 134,
                height: 5,
                backgroundColor: "#FF99BC",
                borderRadius: 100,
              }}
            />
          </View>
        </View>
      </View>
    </View>
  );
}
