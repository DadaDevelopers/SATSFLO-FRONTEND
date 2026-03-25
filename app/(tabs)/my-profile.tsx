import { api } from "@/lib/api";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";

/* ---------------- COUNTRY DATA ---------------- */

const countries = [
  { name: "Nigeria", code: "+234", flag: "🇳🇬" },
  { name: "Kenya", code: "+254", flag: "🇰🇪" },
  { name: "Ghana", code: "+233", flag: "🇬🇭" },
  { name: "United States", code: "+1", flag: "🇺🇸" },
  { name: "United Kingdom", code: "+44", flag: "🇬🇧" },
  { name: "South Africa", code: "+27", flag: "🇿🇦" },
];

/* ---------------- CALENDAR ICON ---------------- */

function CalendarIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
      <Path
        d="M16.25 3.75H3.75C2.71 3.75 1.875 4.59 1.875 5.625V16.25C1.875 17.285 2.71 18.125 3.75 18.125H16.25C17.285 18.125 18.125 17.285 18.125 16.25V5.625C18.125 4.59 17.285 3.75 16.25 3.75Z"
        stroke="#666666"
        strokeWidth={1.25}
      />
    </Svg>
  );
}

/* ---------------- SCREEN ---------------- */

export default function MyProfileScreen() {
  const insets = useSafeAreaInsets();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [phone, setPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      const userJson = await AsyncStorage.getItem("user");
      if (userJson) {
        const stored = JSON.parse(userJson);
        setFullName(stored.name ?? "");
        setEmail(stored.email ?? "");
        setPhone(stored.phone ?? "");
        if (stored.date_of_birth) {
          const parts = stored.date_of_birth.split("T")[0].split("-");
          if (parts.length === 3)
            setDateOfBirth(`${parts[2]}-${parts[1]}-${parts[0]}`);
        }
      }
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) return;
      try {
        const { response, data } = await api.get("/users/profile", token);
        if (response.ok) {
          const profile = data?.data ?? data;
          setFullName(profile.name ?? "");
          setEmail(profile.email ?? "");
          setPhone(profile.phone ?? "");
          if (profile.date_of_birth) {
            const parts = profile.date_of_birth.split("T")[0].split("-");
            if (parts.length === 3)
              setDateOfBirth(`${parts[2]}-${parts[1]}-${parts[0]}`);
          }
          await AsyncStorage.setItem("user", JSON.stringify(profile));
        }
      } catch {}
    };
    loadProfile();
  }, []);
  const [modalVisible, setModalVisible] = useState(false);
  const [avatarModalVisible, setAvatarModalVisible] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const handleSave = async () => {
    if (!fullName.trim()) {
      Alert.alert("Validation Error", "Full name is required.");
      return;
    }
    if (!email.trim()) {
      Alert.alert("Validation Error", "Email is required.");
      return;
    }
    const token = await AsyncStorage.getItem("accessToken");
    if (!token) {
      Alert.alert("Error", "Session expired. Please log in again.");
      return;
    }
    // Convert DD-MM-YYYY display format to YYYY-MM-DD for API
    let dateForApi = dateOfBirth;
    if (dateOfBirth.includes("-")) {
      const parts = dateOfBirth.split("-");
      if (parts.length === 3 && parts[2].length === 4) {
        dateForApi = `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
    }
    try {
      const { response, data } = await api.put(
        "/users/profile",
        {
          name: fullName,
          phone: `${selectedCountry.code}${phone}`,
          date_of_birth: dateForApi,
        },
        token
      );
      if (response.ok) {
        const updated = data?.data ?? data;
        await AsyncStorage.setItem("user", JSON.stringify(updated));
        Alert.alert("Success", "Profile saved successfully.", [
          { text: "OK", onPress: () => router.push("/(tabs)/settings" as any) },
        ]);
      } else {
        Alert.alert("Error", data?.message || "Failed to save profile.");
      }
    } catch {
      Alert.alert("Error", "Error saving profile. Please try again.");
    }
  };

  const handleSelectCountry = (country: (typeof countries)[0]) => {
    setSelectedCountry(country);
    setModalVisible(false);
  };

  const pickFromGallery = async () => {
    setAvatarModalVisible(false);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) setProfileImage(result.assets[0].uri);
  };

  const takePhoto = async () => {
    setAvatarModalVisible(false);
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) setProfileImage(result.assets[0].uri);
  };

  return (
    <View className="flex-1 bg-[#FF4081]">
      <StatusBar barStyle="light-content" backgroundColor="#FF4081" />

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
          showsVerticalScrollIndicator={false}
        >
          {/* HEADER */}
          <View
            className="flex-row items-center px-5"
            style={{ marginTop: insets.top + 28 }}
          >
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/settings" as any)}
            >
              <Feather name="arrow-left" size={24} color="#FAFAFA" />
            </TouchableOpacity>

            <Text className="flex-1 text-center text-white font-inter font-medium text-xl">
              My Profile
            </Text>

            <View style={{ width: 24 }} />
          </View>

          {/* AVATAR */}
          <View className="items-center mt-10 mb-10">
            <View style={{ width: 84, height: 84 }}>
              <Image
                source={
                  profileImage
                    ? { uri: profileImage }
                    : require("@/assets/images/zuri.png")
                }
                style={{ width: 80, height: 80, borderRadius: 2000 }}
              />
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setAvatarModalVisible(true)}
                style={{
                  position: "absolute",
                  left: 59,
                  top: 59,
                  width: 16,
                  height: 16,
                  backgroundColor: "#F4DBE3",
                  borderRadius: 100,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Feather name="edit-2" size={8} color="#FF4081" />
              </TouchableOpacity>
            </View>
          </View>

          {/* FORM */}
          <View className="px-5 gap-5">
            {/* Full Name */}
            <View>
              <Text className="text-white text-md font-inter mb-1">
                Full Name
              </Text>
              <View className="bg-[#FFD6E4] rounded-lg px-3 h-12 justify-center">
                <TextInput value={fullName} onChangeText={setFullName} />
              </View>
            </View>

            {/* Email */}
            <View>
              <Text className="text-white text-md font-inter mb-1">Email</Text>
              <View className="bg-[#FFD6E4] rounded-lg px-3 h-12 justify-center">
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                />
              </View>
            </View>

            {/* Phone */}
            <View>
              <Text className="text-white text-md font-inter mb-1">
                Phone Number
              </Text>
              <View className="bg-[#FFD6E4] rounded-lg flex-row items-center px-3 h-12">
                <TouchableOpacity
                  onPress={() => setModalVisible(true)}
                  className="flex-row items-center mr-2"
                >
                  <Text style={{ fontSize: 18 }}>{selectedCountry.flag}</Text>
                  <Text className="ml-1">{selectedCountry.code}</Text>
                  <Feather name="chevron-down" size={16} color="#666" />
                </TouchableOpacity>
                <TextInput
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  style={{ flex: 1 }}
                />
              </View>
            </View>

            {/* DOB */}
            <View>
              <Text className="text-white text-md font-inter mb-1">
                Date of Birth
              </Text>
              <View className="bg-[#FFD6E4] rounded-lg flex-row items-center justify-between px-3 h-12">
                <TextInput
                  value={dateOfBirth}
                  onChangeText={setDateOfBirth}
                  placeholder="DD-MM-YYYY"
                  keyboardType="numeric"
                />
                <CalendarIcon />
              </View>
            </View>
          </View>

          {/* SAVE BUTTON */}
          <View
            style={{ alignItems: "center", marginTop: 96, paddingTop: 112 }}
          >
            <TouchableOpacity
              onPress={handleSave}
              activeOpacity={0.8}
              style={{
                width: 256,
                height: 56,
                backgroundColor: "#FF82AD",
                borderRadius: 9999,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "500" }}>Save</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* HOME INDICATOR */}
      <View
        style={{
          backgroundColor: "#FF3378",
          height: 34,
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

      {/* AVATAR ACTION SHEET */}
      <Modal visible={avatarModalVisible} animationType="slide" transparent>
        <View className="flex-1 bg-black/40 justify-end">
          <View className="bg-white rounded-t-3xl p-5">
            <Text className="text-lg font-semibold mb-4 text-center">
              Change Profile Photo
            </Text>
            <TouchableOpacity
              onPress={takePhoto}
              className="flex-row items-center py-4 border-b border-gray-100"
            >
              <Feather name="camera" size={20} color="#FF4081" />
              <Text className="ml-3 text-base text-gray-800">Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={pickFromGallery}
              className="flex-row items-center py-4"
            >
              <Feather name="image" size={20} color="#FF4081" />
              <Text className="ml-3 text-base text-gray-800">
                Upload from Gallery
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setAvatarModalVisible(false)}
              className="mt-4 items-center py-3 bg-[#FFD6E4] rounded-full"
            >
              <Text className="text-[#FF4081] font-medium">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* COUNTRY MODAL */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View className="flex-1 bg-black/40 justify-end">
          <View className="bg-white rounded-t-3xl p-5 max-h-[60%]">
            <Text className="text-lg font-semibold mb-4">Select Country</Text>
            <FlatList
              data={countries}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleSelectCountry(item)}
                  className="flex-row items-center py-3"
                >
                  <Text style={{ fontSize: 20 }}>{item.flag}</Text>
                  <Text className="ml-3 flex-1">{item.name}</Text>
                  <Text>{item.code}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="mt-4 items-center"
            >
              <Text className="text-pink-500 font-medium">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
