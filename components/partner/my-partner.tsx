import { BottomNavigation } from "@/components/home/bottom-navigation";
import { api } from "@/lib/api";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import {
  default as React,
  default as React,
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  StatusBar,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type TabName = "home" | "calendar" | "add" | "chat" | "settings";

interface PartnerInfo {
  partner: { username: string; avatar?: string } | null;
  my_nickname: string;
  partner_nickname: string;
  partner_mode_enabled: boolean;
  connected_since: string;
}

interface PartnerSettings {
  share_period_dates: boolean;
  share_fertile_window: boolean;
  share_symptoms_moods: boolean;
  share_cycle_insights: boolean;
  share_sex_drive: boolean;
}

export default function MyPartnerScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<TabName>("settings");

  // Data state
  const [partnerInfo, setPartnerInfo] = useState<PartnerInfo | null>(null);
  const [settings, setSettings] = useState<PartnerSettings>({
    share_period_dates: true,
    share_fertile_window: true,
    share_symptoms_moods: false,
    share_cycle_insights: false,
    share_sex_drive: false,
  });

  // UI state
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [unpairingLoading, setUnpairingLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showUnpairModal, setShowUnpairModal] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) {
        setErrorMessage("Session expired. Please log in again.");
        setLoading(false);
        return;
      }

      const [partnerRes, settingsRes] = await Promise.all([
        api.get("/partner", token),
        api.get("/partner/settings", token),
      ]);

      if (partnerRes.response.ok) {
        const d = partnerRes.data?.data ?? partnerRes.data;
        setPartnerInfo(d);
      } else {
        setErrorMessage(
          partnerRes.data?.message ?? "Failed to load partner info.",
        );
      }

      if (settingsRes.response.ok) {
        const s = settingsRes.data?.data ?? settingsRes.data;
        setSettings({
          share_period_dates: s.share_period_dates ?? true,
          share_fertile_window: s.share_fertile_window ?? true,
          share_symptoms_moods: s.share_symptoms_moods ?? false,
          share_cycle_insights: s.share_cycle_insights ?? false,
          share_sex_drive: s.share_sex_drive ?? false,
        });
      }
    } catch {
      setErrorMessage("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleToggle = async (field: keyof PartnerSettings, value: boolean) => {
    const prev = settings[field];
    // Optimistic update
    setSettings((s) => ({ ...s, [field]: value }));
    setSavingSettings(true);
    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) return;
      const updated = { ...settings, [field]: value };
      const { response, data } = await api.put(
        "/partner/settings",
        updated,
        token,
      );
      if (!response.ok) {
        // Revert on failure
        setSettings((s) => ({ ...s, [field]: prev }));
        Alert.alert("Error", data?.message ?? "Could not update settings.");
      }
    } catch {
      setSettings((s) => ({ ...s, [field]: prev }));
      Alert.alert("Error", "Network error. Please try again.");
    } finally {
      setSavingSettings(false);
    }
  };

  const confirmUnpair = async () => {
    setShowUnpairModal(false);
    setUnpairingLoading(true);
    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) return;
      const { response, data } = await api.delete("/partner", {}, token);
      if (response.ok) {
        router.replace("/(tabs)/settings");
      } else {
        Alert.alert(
          "Unpair Failed",
          data?.message ?? "Could not unpair. Please try again.",
        );
      }
    } catch {
      Alert.alert("Error", "Network error. Please try again.");
    } finally {
      setUnpairingLoading(false);
    }
  };

  const handleBack = () => router.back();

  const handleTabPress = (tab: TabName) => {
    setActiveTab(tab);
    switch (tab) {
      case "home":
        router.push("/(tabs)");
        break;
      case "calendar":
        router.push("/calendar");
        break;
      case "add":
        router.push("/add-log");
        break;
      case "chat":
        router.push("/(tabs)/thread");
        break;
      case "settings":
        router.push("/(tabs)/settings");
        break;
    }
  };

  const handleGiftTokenPress = () => {
    router.push("/(tabs)/gift-token-wallet");
  };

  const pairedDuration = () => {
    if (!partnerInfo?.connected_since) return "Paired recently";
    const since = new Date(partnerInfo.connected_since);
    const now = new Date();
    const days = Math.floor(
      (now.getTime() - since.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (days === 0) return "Paired today";
    if (days === 1) return "Paired for 1 day";
    return `Paired for ${days} days`;
  };

  const PermissionRow = ({
    label,
    field,
  }: {
    label: string;
    field: keyof PartnerSettings;
  }) => (
    <View className="flex-row items-center justify-between px-5 py-[14px]">
      <Text className="text-[#1E1E1E] font-medium text-[15px] flex-1 mr-2">
        {label}
      </Text>
      <Switch
        value={settings[field]}
        onValueChange={(v) => handleToggle(field, v)}
        trackColor={{ false: "#E5E5EA", true: "#FF4081" }}
        thumbColor={"#FFFFFF"}
        ios_backgroundColor="#E5E5EA"
        disabled={savingSettings}
      />
    </View>
  );

  return (
    <View
      className="flex-1"
      style={{ paddingTop: insets.top, backgroundColor: "#FF4081" }}
    >
      <StatusBar barStyle="light-content" backgroundColor="#FF4081" />

      {/* Header */}
      <View className="flex-row items-center px-6 py-4">
        <TouchableOpacity onPress={handleBack} className="p-2 -ml-2">
          <Feather name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-white text-xl font-bold mr-6">
          My Partner
        </Text>
        {savingSettings && <ActivityIndicator size="small" color="#FFFFFF" />}
      </View>

      {/* Loading state */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text className="text-white mt-4 text-base">
            Loading partner info...
          </Text>
        </View>
      ) : errorMessage ? (
        <View className="flex-1 items-center justify-center px-8">
          <Feather name="wifi-off" size={48} color="rgba(255,255,255,0.6)" />
          <Text className="text-white text-center mt-4 text-base">
            {errorMessage}
          </Text>
          <TouchableOpacity
            onPress={fetchData}
            className="mt-6 bg-white rounded-full px-8 py-3"
            activeOpacity={0.8}
          >
            <Text className="text-[#FF4081] font-semibold text-base">
              Retry
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: 120,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Profile Card */}
          <View className="bg-white rounded-[24px] p-6 items-center mt-6 shadow-sm">
            {/* Overlapping Avatars */}
            <View className="flex-row items-center justify-center mb-4 relative h-16 w-32">
              <View className="w-[60px] h-[60px] rounded-full bg-gray-200 border-[3px] border-white absolute left-5 z-10 overflow-hidden shadow-sm">
                <Image
                  source={{ uri: "https://i.pravatar.cc/150?img=5" }}
                  className="w-full h-full"
                />
              </View>
              <View className="w-[60px] h-[60px] rounded-full bg-gray-300 border-[3px] border-white absolute right-5 z-0 overflow-hidden shadow-sm">
                <Image
                  source={{ uri: "https://i.pravatar.cc/150?img=11" }}
                  className="w-full h-full"
                />
              </View>
              <View className="absolute -top-1 right-8 bg-white rounded-full p-1 shadow-sm z-20 border border-gray-100">
                <Feather name="heart" size={14} color="#FF4081" />
              </View>
            </View>

            <Text className="text-[20px] font-bold text-[#1E1E1E] mb-1">
              {partnerInfo?.my_nickname && partnerInfo?.partner_nickname
                ? `${partnerInfo.my_nickname} & ${partnerInfo.partner_nickname}`
                : partnerInfo?.partner?.username
                  ? `You & ${partnerInfo.partner.username}`
                  : "You & Your Partner"}
            </Text>
            <Text className="text-[#616161] text-[14px] mb-6">
              {pairedDuration()}
            </Text>

            {/* Stop Pairing */}
            <View className="w-full border-t border-[#F5F5F5] pt-4">
              <TouchableOpacity
                onPress={() => setShowUnpairModal(true)}
                className="flex-row items-center justify-between"
                activeOpacity={0.7}
                disabled={unpairingLoading}
              >
                <View className="flex-row items-center">
                  <View className="mr-3">
                    {unpairingLoading ? (
                      <ActivityIndicator size="small" color="#FF3B30" />
                    ) : (
                      <Feather name="link-2" size={20} color="#FF3B30" />
                    )}
                  </View>
                  <Text className="text-[#FF3B30] text-[15px] font-medium">
                    {unpairingLoading ? "Unpairing..." : "Stop pairing"}
                  </Text>
                </View>
                <Feather name="chevron-right" size={20} color="#C7C7CC" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Permissions Section */}
          <View className="mt-8 mb-6">
            <Text className="text-white/90 text-xs font-semibold uppercase tracking-wider mb-3 ml-2">
              My partner's view
            </Text>
            <Text className="text-white/70 text-xs ml-2 mb-3">
              Control what your partner can see about your cycle
            </Text>

            <View className="bg-white rounded-[24px] overflow-hidden shadow-sm">
              <PermissionRow
                label="Period start and end dates"
                field="share_period_dates"
              />
              <View className="h-px bg-[#F5F5F5] mx-5" />
              <PermissionRow
                label="Fertile window and ovulation"
                field="share_fertile_window"
              />
              <View className="h-px bg-[#F5F5F5] mx-5" />
              <PermissionRow
                label="Symptoms and moods"
                field="share_symptoms_moods"
              />
              <View className="h-px bg-[#F5F5F5] mx-5" />
              <PermissionRow
                label="Full cycle insights"
                field="share_cycle_insights"
              />
              <View className="h-px bg-[#F5F5F5] mx-5" />
              <PermissionRow label="Sex drive" field="share_sex_drive" />
            </View>

            {savingSettings && (
              <View className="flex-row items-center mt-3 ml-2">
                <ActivityIndicator size="small" color="rgba(255,255,255,0.8)" />
                <Text className="text-white/80 text-xs ml-2">
                  Saving preferences…
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      )}

      {/* Floating Gift Token Button */}
      {!loading && !errorMessage && (
        <View className="absolute bottom-28 left-0 right-0 items-center">
          <TouchableOpacity
            onPress={handleGiftTokenPress}
            className="flex-row items-center justify-center px-6 py-3 rounded-full"
            style={{
              backgroundColor: "#FF4081",
              borderWidth: 1,
              borderColor: "#FFB4CD",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 8,
              elevation: 5,
            }}
            activeOpacity={0.8}
          >
            <Feather name="gift" size={20} color="#FFFFFF" />
            <Text className="text-white text-base font-medium ml-2">
              Gift Token
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Bottom Navigation */}
      <BottomNavigation activeTab={activeTab} onTabPress={handleTabPress} />

      {/* Unpair Confirmation Modal */}
      <Modal
        visible={showUnpairModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowUnpairModal(false)}
      >
        <View className="flex-1 justify-end bg-black/40">
          <View className="bg-[#FFF0F5] w-full rounded-t-[32px] pt-4 pb-8 px-6 items-center">
            <View className="w-12 h-1.5 bg-[#E5E5EA] rounded-full mb-8" />
            <Text className="text-[22px] font-bold text-[#1E1E1E] mb-3">
              Unpair with Partner
            </Text>
            <Text className="text-center text-[#616161] text-[15px] mb-8 leading-[22px]">
              Are you sure you want to unpair with your partner? This action
              cannot be undone.
            </Text>
            <View className="w-full flex-row gap-3">
              <TouchableOpacity
                onPress={() => setShowUnpairModal(false)}
                className="flex-1 py-[14px] rounded-full border-[1.5px] border-[#FF4081] items-center justify-center bg-white"
                activeOpacity={0.7}
              >
                <Text className="text-[#FF4081] font-semibold text-[16px]">
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={confirmUnpair}
                className="flex-1 py-[14px] rounded-full bg-[#FF4081] items-center justify-center shadow-sm"
                activeOpacity={0.7}
              >
                <Text className="text-white font-semibold text-[16px]">
                  Yes, Unpair
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
