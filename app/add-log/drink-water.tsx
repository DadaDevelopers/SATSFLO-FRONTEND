import { useAddLog } from "@/context/add-log-context";
import { useResponsive } from "@/hooks/use-responsive";
import { api } from "@/lib/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle, Path, Rect } from "react-native-svg";

type CupStyle = "classic" | "tumbler" | "tall" | "mug";
type VolumeUnit = "ml" | "oz";

const ML_PER_OZ = 29.5735;
const mlToOz = (ml: number) => Math.round(ml / ML_PER_OZ);
const ozToMl = (oz: number) => Math.round(oz * ML_PER_OZ);

// Backend already accepts any positive integer for these — these bounds are
// just sanity limits so a mistyped value (e.g. an extra digit) doesn't save.
const TARGET_MIN_ML = 200;
const TARGET_MAX_ML = 10000;
const CUP_MIN_ML = 30;
const CUP_MAX_ML = 5000;

const CupIcon = ({ style, selected }: { style: CupStyle; selected: boolean }) => {
  const borderColor = selected ? "#FF4081" : "#FFE6EE";

  switch (style) {
    case "classic":
      return (
        <Svg width={50} height={50} viewBox="0 0 50 50" fill="none">
          <Rect x="0.5" y="0.5" width="49" height="49" rx="24.5" stroke={borderColor} />
          <Path d="M15.916 13.9578C15.8608 13.4464 16.2615 13 16.7759 13H33.2275C33.7419 13 34.1426 13.4464 34.0873 13.9578L31.6797 36.2281C31.6323 36.6672 31.2615 37 30.8199 37H19.1835C18.7418 37 18.3711 36.6672 18.3236 36.2281L15.916 13.9578Z" fill="#BBCAFF" />
          <Path d="M16.4609 15.5944C16.4609 15.5944 20.1557 15.2239 22.515 15.5945C24.8282 15.9578 25.8009 16.9424 28.1366 17.1079C30.4278 17.2703 33.542 15.5944 33.542 15.5944L31.5961 36.9998H18.4069L16.4609 15.5944Z" fill="#4770FD" />
          <Circle cx="20.784" cy="23.3782" r="0.432432" fill="#D9D9D9" />
          <Circle cx="28.7854" cy="26.6218" r="0.648649" fill="#D9D9D9" />
          <Circle cx="25.7606" cy="29.6487" r="0.432432" fill="#D9D9D9" />
          <Circle cx="28.3518" cy="32.6755" r="0.648649" fill="#D9D9D9" />
          <Circle cx="25.327" cy="24.4593" r="0.432432" fill="#D9D9D9" />
        </Svg>
      );
    case "tumbler":
      return (
        <Svg width={50} height={50} viewBox="0 0 50 50" fill="none">
          <Rect x="0.5" y="0.5" width="49" height="49" rx="24.5" stroke={borderColor} />
          <Path d="M29.792 15.3977C32.088 16.0652 34.068 17.5328 35.374 19.5347C36.681 21.5366 37.227 23.9402 36.914 26.3101C36.601 28.6799 35.449 30.8592 33.667 32.453C31.886 34.0468 29.592 34.9496 27.202 34.998L27.173 33.5692C29.222 33.5278 31.188 32.754 32.715 31.3879C34.242 30.0219 35.229 28.1541 35.497 26.1229C35.766 24.0917 34.178 22.0315 33.058 20.3157C31.361 18.5999 29.393 16.7699 29.393 16.7699L29.792 15.3977Z" fill="#4770FD" />
          <Path d="M12.104 13.9578C12.048 13.4464 12.449 13 12.963 13H29.415C29.929 13 30.33 13.4464 30.275 13.9578L27.867 36.2281C27.82 36.6672 27.449 37 27.007 37H15.371C14.929 37 14.559 36.6672 14.511 36.2281L12.104 13.9578Z" fill="#BBCAFF" />
          <Path d="M12.648 15.5944C12.648 15.5944 16.343 15.2239 18.702 15.5945C21.016 15.9578 21.988 16.9424 24.324 17.1079C26.615 17.2703 29.73 15.5944 29.73 15.5944L27.784 36.9998H14.594L12.648 15.5944Z" fill="#4770FD" />
          <Circle cx="16.971" cy="23.3782" r="0.432432" fill="#D9D9D9" />
          <Circle cx="24.973" cy="26.6218" r="0.648649" fill="#D9D9D9" />
          <Circle cx="21.948" cy="29.6487" r="0.432432" fill="#D9D9D9" />
          <Circle cx="24.539" cy="32.6755" r="0.648649" fill="#D9D9D9" />
          <Circle cx="21.514" cy="24.4593" r="0.432432" fill="#D9D9D9" />
        </Svg>
      );
    case "tall":
      return (
        <Svg width={50} height={50} viewBox="0 0 50 50" fill="none">
          <Rect x="0.5" y="0.5" width="49" height="49" rx="24.5" stroke={borderColor} />
          <Path d="M31.896 13.1989C33.044 13.5326 34.034 14.2664 34.687 15.2674C35.34 16.2683 35.613 17.4701 35.457 18.655C35.3 19.84 34.724 20.9296 33.834 21.7265C32.943 22.5234 31.796 22.9748 30.601 22.999L30.587 22.2846C31.611 22.2639 32.594 21.877 33.357 21.194C34.121 20.511 34.614 19.577 34.749 18.5614C34.883 17.5458 34.649 16.5158 34.089 15.6579C33.529 14.8 32.68 14.171 31.697 13.885L31.896 13.1989Z" fill="#4770FD" />
          <Path d="M24 37H27.88L32.878 29V13H24V37Z" fill="#4E75FC" />
          <Path d="M19.5 37H24V13H14.5V29L19.5 37Z" fill="#BBCAFF" />
        </Svg>
      );
    case "mug":
      return (
        <Svg width={50} height={50} viewBox="0 0 50 50" fill="none">
          <Rect x="0.5" y="0.5" width="49" height="49" rx="24.5" stroke={borderColor} />
          <Path d="M15.833 16.7719C15.786 16.3328 15.415 16 14.974 16H14.615C14.137 16 13.75 15.6128 13.75 15.1351V10.8649C13.75 10.3872 14.137 10 14.615 10H35.385C35.863 10 36.25 10.3872 36.25 10.8649V15.1351C36.25 15.6128 35.863 16 35.385 16H34.905C34.463 16 34.092 16.3328 34.045 16.7719L31.617 39.2281C31.57 39.6672 31.199 40 30.757 40H19.121C18.679 40 18.309 39.6672 18.261 39.2281L15.833 16.7719Z" fill="#BBCAFF" />
          <Path d="M16.75 16.6922C16.75 16.6922 18.646 15.135 21.053 16.6918C23.46 18.2487 25.46 18.1402 27.557 16.6921C29.653 15.2441 32.75 16.6918 32.75 16.6918L31.25 37L18.75 37L16.75 16.6922Z" fill="#4770FD" />
          <Circle cx="20.721" cy="26.3782" r="0.432432" fill="#D9D9D9" />
          <Circle cx="28.723" cy="29.6218" r="0.648649" fill="#D9D9D9" />
          <Circle cx="25.698" cy="32.6487" r="0.432432" fill="#D9D9D9" />
          <Circle cx="28.289" cy="35.6755" r="0.648649" fill="#D9D9D9" />
          <Circle cx="25.264" cy="27.4593" r="0.432432" fill="#D9D9D9" />
        </Svg>
      );
  }
};

export default function DrinkWaterScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isDesktop, containerStyle, outerBackgroundColor } = useResponsive();
  const {
    waterTarget,
    setWaterTarget,
    cupCapacity,
    setCupCapacity,
    cupStyle,
    setCupStyle,
  } = useAddLog();

  const [localTarget, setLocalTarget] = useState(waterTarget);
  const [localCupCapacity, setLocalCupCapacity] = useState(cupCapacity);
  const [localCupStyle, setLocalCupStyle] = useState(cupStyle);
  const [unit, setUnit] = useState<VolumeUnit>("ml");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // localTarget/localCupCapacity are always stored in ml (matching the
  // backend); these just format/parse for whichever unit is displayed.
  const formatForUnit = (ml: number) => (unit === "oz" ? mlToOz(ml) : ml);
  const parseFromUnit = (value: number) => (unit === "oz" ? ozToMl(value) : value);

  useEffect(() => {
    setLocalTarget(waterTarget);
    setLocalCupCapacity(cupCapacity);
    setLocalCupStyle(cupStyle);
  }, [waterTarget, cupCapacity, cupStyle]);

  useEffect(() => {
    const loadWaterSettings = async () => {
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) return;
      setLoading(true);
      setError(null);
      try {
        const { response, data } = await api.get("/water-settings", token);
        if (response.ok) {
          const d = data?.data ?? data;
          if (d?.water_target) {
            setLocalTarget(d.water_target);
            setWaterTarget(d.water_target);
          }
          if (d?.cup_capacity) {
            setLocalCupCapacity(d.cup_capacity);
            setCupCapacity(d.cup_capacity);
          }
          if (d?.cup_style) {
            setLocalCupStyle(d.cup_style);
            setCupStyle(d.cup_style);
          }
        } else {
          setError("Failed to load water settings.");
        }
      } catch {
        setError("Network error. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };
    loadWaterSettings();
  }, []);

  const handleSave = async () => {
    if (!localCupStyle) {
      Alert.alert("Validation", "Please select a cup style.");
      return;
    }
    if (!Number.isInteger(localTarget) || localTarget < TARGET_MIN_ML || localTarget > TARGET_MAX_ML) {
      Alert.alert(
        "Validation",
        `Please enter a daily target between ${formatForUnit(TARGET_MIN_ML)} and ${formatForUnit(TARGET_MAX_ML)} ${unit}.`,
      );
      return;
    }
    if (!Number.isInteger(localCupCapacity) || localCupCapacity < CUP_MIN_ML || localCupCapacity > CUP_MAX_ML) {
      Alert.alert(
        "Validation",
        `Please enter a cup capacity between ${formatForUnit(CUP_MIN_ML)} and ${formatForUnit(CUP_MAX_ML)} ${unit}.`,
      );
      return;
    }

    const token = await AsyncStorage.getItem("accessToken");
    if (!token) {
      Alert.alert("Error", "Session expired. Please log in again.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const { response } = await api.put(
        "/water-settings",
        {
          water_target: localTarget,
          cup_capacity: localCupCapacity,
          cup_style: localCupStyle,
        },
        token
      );
      if (response.ok) {
        setWaterTarget(localTarget);
        setCupCapacity(localCupCapacity);
        setCupStyle(localCupStyle);
        router.back();
      } else {
        Alert.alert("Error", "Failed to save water settings. Please try again.");
      }
    } catch {
      Alert.alert("Error", "Network error. Please check your connection.");
    } finally {
      setSaving(false);
    }
  };

  const cupStyles: CupStyle[] = ["classic", "tumbler", "tall", "mug"];

  const targetStep = unit === "oz" ? ozToMl(1) : 50;
  const cupStep = unit === "oz" ? ozToMl(1) : 25;

  const adjustTarget = (deltaMl: number) => {
    setLocalTarget((v) => Math.min(TARGET_MAX_ML, Math.max(TARGET_MIN_ML, v + deltaMl)));
  };
  const adjustCupCapacity = (deltaMl: number) => {
    setLocalCupCapacity((v) => Math.min(CUP_MAX_ML, Math.max(CUP_MIN_ML, v + deltaMl)));
  };
  const handleTargetTextChange = (text: string) => {
    const n = parseInt(text, 10);
    if (!isNaN(n)) setLocalTarget(parseFromUnit(n));
    else if (text === "") setLocalTarget(0);
  };
  const handleCupCapacityTextChange = (text: string) => {
    const n = parseInt(text, 10);
    if (!isNaN(n)) setLocalCupCapacity(parseFromUnit(n));
    else if (text === "") setLocalCupCapacity(0);
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
          <Text className="flex-1 text-center text-white text-xl font-semibold mr-10">
            Drink Water
          </Text>
        </View>

        {/* Content */}
        <View style={{ flex: 1 }}>

        {/* Loading indicator */}
        {loading && (
          <View style={{ alignItems: "center", paddingVertical: 12 }}>
            <ActivityIndicator color="#FF4081" />
            <Text style={{ color: "#FF4081", fontSize: 12, marginTop: 4 }}>
              Loading settings...
            </Text>
          </View>
        )}

        {/* Error message */}
        {error && (
          <View style={{ marginHorizontal: 16, marginBottom: 8, backgroundColor: "#FFE5EE", borderRadius: 8, padding: 10 }}>
            <Text style={{ color: "#CC0045", fontSize: 13, textAlign: "center" }}>{error}</Text>
          </View>
        )}

        {/* Settings Card */}
        <View className="px-4 mb-4">
          <View className="bg-[#FFE5EE] rounded-3xl p-4">
            {/* Capacity Units */}
            <View className="flex-row justify-between items-center py-3">
              <Text className="text-gray-700 text-base">Capacity units</Text>
              <View className="flex-row bg-white rounded-full p-1">
                {(["ml", "oz"] as VolumeUnit[]).map((u) => (
                  <TouchableOpacity
                    key={u}
                    onPress={() => setUnit(u)}
                    style={{
                      paddingHorizontal: 14,
                      paddingVertical: 6,
                      borderRadius: 999,
                      backgroundColor: unit === u ? "#FF4081" : "transparent",
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: "600",
                        color: unit === u ? "#FFFFFF" : "#666666",
                      }}
                    >
                      {u}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Target */}
            <View className="flex-row justify-between items-center py-3">
              <Text className="text-gray-700 text-base">Target</Text>
              <View className="flex-row items-center" style={{ gap: 10 }}>
                <TouchableOpacity onPress={() => adjustTarget(-targetStep)} hitSlop={8}>
                  <Text style={{ fontSize: 20, color: "#FF4081", fontWeight: "600" }}>−</Text>
                </TouchableOpacity>
                <TextInput
                  value={String(formatForUnit(localTarget))}
                  onChangeText={handleTargetTextChange}
                  keyboardType="numeric"
                  style={{
                    minWidth: 48,
                    textAlign: "center",
                    color: "#FF4081",
                    fontWeight: "600",
                    fontSize: 16,
                    paddingVertical: 0,
                  }}
                />
                <Text className="text-pink-500 font-medium">{unit}</Text>
                <TouchableOpacity onPress={() => adjustTarget(targetStep)} hitSlop={8}>
                  <Text style={{ fontSize: 20, color: "#FF4081", fontWeight: "600" }}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Cup Capacity */}
            <View className="flex-row justify-between items-center py-3">
              <Text className="text-gray-700 text-base">Cup capacity</Text>
              <View className="flex-row items-center" style={{ gap: 10 }}>
                <TouchableOpacity onPress={() => adjustCupCapacity(-cupStep)} hitSlop={8}>
                  <Text style={{ fontSize: 20, color: "#FF4081", fontWeight: "600" }}>−</Text>
                </TouchableOpacity>
                <TextInput
                  value={String(formatForUnit(localCupCapacity))}
                  onChangeText={handleCupCapacityTextChange}
                  keyboardType="numeric"
                  style={{
                    minWidth: 40,
                    textAlign: "center",
                    color: "#FF4081",
                    fontWeight: "600",
                    fontSize: 16,
                    paddingVertical: 0,
                  }}
                />
                <Text className="text-pink-500 font-medium">{unit}</Text>
                <TouchableOpacity onPress={() => adjustCupCapacity(cupStep)} hitSlop={8}>
                  <Text style={{ fontSize: 20, color: "#FF4081", fontWeight: "600" }}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Cup Style Selection */}
        <View className="px-4">
          <View className="bg-[#FFE5EE] rounded-3xl p-4">
            <Text className="text-gray-800 font-medium mb-4">
              Select cup style
            </Text>
            <View className="flex-row justify-around">
              {cupStyles.map((style) => (
                <TouchableOpacity
                  key={style}
                  onPress={() => setLocalCupStyle(style)}
                >
                  <CupIcon style={style} selected={localCupStyle === style} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
        </View>{/* end Content */}

        {/* Save Button */}
        <View style={{ alignItems: "center" }}>
          <TouchableOpacity
            onPress={handleSave}
            disabled={saving || loading}
            style={{
              width: 250,
              height: 56,
              backgroundColor: saving || loading ? "#FFB3CC" : "#FF82AD",
              borderWidth: 0.5,
              borderColor: "#FF669A",
              borderRadius: 1000,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 20,
            }}
            activeOpacity={0.8}
          >
            {saving ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
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
            )}
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
          />
        </View>
      </View>
    </View>
  );
}
