import { api } from "@/lib/api";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";

const PENCIL_PATH =
    "M15.2586 3.85762L11.768 0.366217C11.6519 0.250114 11.5141 0.158014 11.3624 0.0951779C11.2107 0.0323417 11.0482 0 10.884 0C10.7198 0 10.5572 0.0323417 10.4056 0.0951779C10.2539 0.158014 10.1161 0.250114 10 0.366217L0.366412 10.0006C0.249834 10.1162 0.157407 10.2539 0.0945056 10.4056C0.0316038 10.5573 -0.000518312 10.72 6.32418e-06 10.8842V14.3756C6.32418e-06 14.7071 0.131702 15.0251 0.366123 15.2595C0.600543 15.4939 0.918486 15.6256 1.25001 15.6256H4.74141C4.90563 15.6261 5.0683 15.594 5.21999 15.5311C5.37168 15.4682 5.50935 15.3758 5.62501 15.2592L15.2586 5.62559C15.3747 5.50952 15.4668 5.3717 15.5296 5.22003C15.5925 5.06835 15.6248 4.90578 15.6248 4.74161C15.6248 4.57743 15.5925 4.41486 15.5296 4.26319C15.4668 4.11151 15.3747 3.9737 15.2586 3.85762ZM4.74141 14.3756H1.25001V10.8842L8.12501 4.00919L11.6164 7.50059L4.74141 14.3756ZM12.5 6.61622L9.0086 3.12559L10.8836 1.25059L14.375 4.74122L12.5 6.61622Z";

export default function PartnerNicknameScreen() {
    const insets = useSafeAreaInsets();
    const [nickname1, setNickname1] = useState("");
    const [nickname2, setNickname2] = useState("");

    return (
        <View className="flex-1 bg-[#FF4081]">
            {/* Header — back arrow + Skip */}
            <View
                className="flex-row items-center justify-between px-5 h-6"
                style={{ marginTop: insets.top + 28 }}
            >
                <TouchableOpacity
                    onPress={() => router.push("/(tabs)/whats-your-partner-name" as any)}
                    activeOpacity={0.7}
                    className="w-6 h-6 items-center justify-center"
                >
                    <Feather name="arrow-left" size={24} color="#FAFAFA" />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => router.push("/start-partnership" as any)}
                    activeOpacity={0.7}
                >
                    <Text className="font-inter font-medium text-[14px] text-[#FAFAFA] tracking-[-0.3px]">
                        Skip
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Title */}
            <Text className="font-inter font-medium text-2xl text-white tracking-[-0.3px] text-center mt-10 px-5">
                Any nickname you have for your partner?
            </Text>

            {/* Input field 1 */}
            <View className="flex-row items-center mx-5 mt-7 bg-[#FFD6E4] border-[0.5px] border-[#CC0045] rounded-xl px-4 h-[58px]">
                <TextInput
                    value={nickname1}
                    onChangeText={setNickname1}
                    placeholder="Bae"
                    placeholderTextColor="#09090980"
                    className="flex-1 font-inter font-medium text-[14px] text-[#090909]"
                />
                <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
                    <Path d={PENCIL_PATH} fill="#666666" />
                </Svg>
            </View>

            {/* Input field 2 */}
            <View className="flex-row items-center mx-5 mt-4 bg-[#FFD6E4] border-[0.5px] border-[#CC0045] rounded-xl px-4 h-[58px]">
                <TextInput
                    value={nickname2}
                    onChangeText={setNickname2}
                    placeholder="My baby"
                    placeholderTextColor="#09090980"
                    className="flex-1 font-inter font-medium text-[14px] text-[#090909]"
                />
                <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
                    <Path d={PENCIL_PATH} fill="#666666" />
                </Svg>
            </View>

            <TouchableOpacity activeOpacity={0.7} className="mt-4 mx-5">
                <Text className="font-inter font-medium text-[14px] text-white underline">
                    + Add nickname
                </Text>
            </TouchableOpacity>

            {/* Spacer */}
            <View className="flex-1" />

            {/* Next button */}
            <View className="items-center pb-7">
                <TouchableOpacity
                    onPress={async () => {
                      try {
                        const token = await AsyncStorage.getItem("accessToken");
                        if (token) {
                          const { response, data } = await api.put(
                            "/partner/nickname",
                            { my_nickname: nickname1, partner_nickname: nickname2 },
                            token
                          );
                          if (!response.ok) {
                            Alert.alert("Error", data?.message || "Could not save nicknames.");
                            return;
                          }
                        }
                      } catch {
                        Alert.alert("Error", "Could not save. Please try again.");
                        return;
                      }
                      router.push("/start-partnership" as any);
                    }}
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
