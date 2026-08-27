import { FlowDroplet, flowLevelLabel } from "@/components/add-log/flow-droplet";
import { useAddLog } from "@/context/add-log-context";
import { api } from "@/lib/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";

const MAX_CONTENT_WIDTH = 480;

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const MONTHS_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const DATE_ITEM_SIZE = 60;

const MEDICINE_IMAGES: Record<string, ReturnType<typeof require>> = {
  condom: require("@/assets/images/condom.png"),
  pill: require("@/assets/images/pill.png"),
  patch: require("@/assets/images/patch.png"),
  iud: require("@/assets/images/IUD.png"),
  implant: require("@/assets/images/implant.png"),
  vRing: require("@/assets/images/V-ring.png"),
  injection: require("@/assets/images/injection.png"),
  spermicide: require("@/assets/images/spermicide.png"),
};

const SYMPTOM_IMAGES: Record<string, ReturnType<typeof require>> = {
  cramps: require("@/assets/images/cramps.png"),
  fatigue: require("@/assets/images/fatigue.png"),
  bloating: require("@/assets/images/bloating.png"),
  headache: require("@/assets/images/headache.png"),
  bellyAches: require("@/assets/images/bellyaches.png"),
  acne: require("@/assets/images/acne.png"),
  soreBreasts: require("@/assets/images/sorebreasts.png"),
  cravings: require("@/assets/images/cravings.png"),
};

// Generate dates for the horizontal scroll
const generateDates = () => {
  const dates = [];
  const today = new Date();

  for (let i = -60; i <= 60; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push({
      date,
      day: date.getDate(),
      dayName: DAYS[date.getDay()],
      month: MONTHS_SHORT[date.getMonth()],
      isToday: i === 0,
    });
  }
  return dates;
};

export default function AddLogScreen() {
  const router = useRouter();
  const { date: paramDate } = useLocalSearchParams<{ date: string }>();
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const isDesktop = screenWidth > MAX_CONTENT_WIDTH;
  const today = new Date();
  const flatListRef = useRef<FlatList>(null);
  const dates = React.useMemo(() => generateDates(), []);

  // Get state from context
  const {
    selectedDate,
    setSelectedDate,
    getCurrentDayData,
    setPeriodStart,
    setPeriodEnd,
    setFlowLevel,
    addWater,
    setWaterIntake,
    waterTarget,
    cupCapacity,
    isDateInPeriod,
    saveCurrentDay,
    dayLogs,
  } = useAddLog();

  const dayData = getCurrentDayData();

  // Calendar state (local)
  const [calendarExpanded, setCalendarExpanded] = useState(false);
  const [viewingMonth, setViewingMonth] = useState(selectedDate.getMonth());
  const [viewingYear, setViewingYear] = useState(selectedDate.getFullYear());
  const chevronRotation = useSharedValue(0);

  // Period edit modal state
  const [periodEditModalVisible, setPeriodEditModalVisible] = useState(false);
  const [editingPeriodType, setEditingPeriodType] = useState<"start" | "end">(
    "start",
  );
  const [editModalMonth, setEditModalMonth] = useState(today.getMonth());
  const [editModalYear, setEditModalYear] = useState(today.getFullYear());

  // Track the last handled param date so we only overwrite context selectedDate when paramDate explicitly changes
  const lastHandledParamDate = useRef<string | null>(null);

  useEffect(() => {
    if (paramDate && paramDate !== lastHandledParamDate.current) {
      lastHandledParamDate.current = paramDate;
      const parts = paramDate.split("-");
      if (parts.length === 3) {
        const d = new Date(
          parseInt(parts[0]),
          parseInt(parts[1]) - 1,
          parseInt(parts[2]),
        );
        if (!isNaN(d.getTime())) {
          setSelectedDate(d);
        }
      }
    }
  }, [paramDate, setSelectedDate]);

  // Keep viewing month/year and FlatList scroll position anchored to selectedDate
  useEffect(() => {
    setViewingMonth(selectedDate.getMonth());
    setViewingYear(selectedDate.getFullYear());

    const todayMidnight = new Date();
    todayMidnight.setHours(0, 0, 0, 0);

    const selMidnight = new Date(selectedDate);
    selMidnight.setHours(0, 0, 0, 0);

    const diffDays = Math.round(
      (selMidnight.getTime() - todayMidnight.getTime()) / (1000 * 60 * 60 * 24),
    );
    const zeroIndex = dates.findIndex((d) => d.isToday);
    const targetIndex = (zeroIndex >= 0 ? zeroIndex : 60) + diffDays;

    if (targetIndex >= 0 && targetIndex < dates.length) {
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({
          index: targetIndex,
          animated: false,
          viewPosition: 0.5,
        });
      }, 100);
    }
  }, [selectedDate, dates]);

  // Toggle calendar
  const toggleCalendar = () => {
    setCalendarExpanded(!calendarExpanded);
    chevronRotation.value = withTiming(calendarExpanded ? 0 : 180, {
      duration: 200,
    });
  };

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${chevronRotation.value}deg` }],
  }));

  // Handle period start
  const handlePeriodStart = () => {
    setPeriodStart(!dayData.periodStart);
  };

  // Handle period end
  const handlePeriodEnd = () => {
    if (!dayData.periodStart && !isDateInPeriod(selectedDate)) {
      Alert.alert("No Period Started", "Please mark a period start first.");
      return;
    }
    setPeriodEnd(!dayData.periodEnd);
  };

  // Handle date selection from horizontal scroll
  const handleDateSelectFromScroll = (date: Date, index: number) => {
    setSelectedDate(date);
    setViewingMonth(date.getMonth());
    setViewingYear(date.getFullYear());

    // Center the selected date
    flatListRef.current?.scrollToIndex({
      index,
      animated: true,
      viewPosition: 0.5,
    });
  };

  // Render date item for FlatList
  const renderDateItem = ({
    item,
    index,
  }: {
    item: (typeof dates)[0];
    index: number;
  }) => {
    const isSelected = item.date.toDateString() === selectedDate.toDateString();
    const isPeriodDay = isDateInPeriod(item.date);

    return (
      <TouchableOpacity
        onPress={() => handleDateSelectFromScroll(item.date, index)}
        className="items-center mx-1"
        style={{ width: DATE_ITEM_SIZE }}
      >
        <Text
          style={{
            fontSize: 12,
            marginBottom: 4,
            fontWeight: "500",
            color: isSelected ? "#FFFFFF" : "rgba(255,255,255,0.8)",
          }}
        >
          {item.dayName}
        </Text>
        <View
          style={{
            width: 43,
            height: 43,
            borderRadius: 21.5,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: isSelected ? "#FF4081" : "transparent",
            borderWidth: isSelected ? 2 : 0.5,
            borderColor: isSelected ? "#CC1775" : "#FFE5EE",
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",
              color: isSelected ? "#FFFFFF" : "#090909",
            }}
          >
            {item.day}
          </Text>
        </View>
        {isPeriodDay && !isSelected && (
          <View className="w-1.5 h-1.5 rounded-full bg-pink-300 mt-1" />
        )}
      </TouchableOpacity>
    );
  };

  // Month days
  const getMonthDays = () => {
    const daysInMonth = new Date(viewingYear, viewingMonth + 1, 0).getDate();
    const startingDay = new Date(viewingYear, viewingMonth, 1).getDay();
    const days: ({
      date: number;
      fullDate: Date;
      isSelected: boolean;
      isPeriodDay: boolean;
      isToday: boolean;
    } | null)[] = [];
    for (let i = 0; i < startingDay; i++) days.push(null);
    for (let day = 1; day <= daysInMonth; day++) {
      const fullDate = new Date(viewingYear, viewingMonth, day);
      days.push({
        date: day,
        fullDate,
        isSelected: fullDate.toDateString() === selectedDate.toDateString(),
        isPeriodDay: isDateInPeriod(fullDate),
        isToday: fullDate.toDateString() === today.toDateString(),
      });
    }
    return days;
  };

  const handleDateSelect = (fullDate: Date) => {
    setSelectedDate(fullDate);
    setViewingMonth(fullDate.getMonth());
    setViewingYear(fullDate.getFullYear());
  };

  // Handle opening period edit modal
  const handleEditPeriod = () => {
    setEditModalMonth(selectedDate.getMonth());
    setEditModalYear(selectedDate.getFullYear());
    setPeriodEditModalVisible(true);
  };

  // Get days for edit modal calendar
  const getEditModalDays = () => {
    const daysInMonth = new Date(
      editModalYear,
      editModalMonth + 1,
      0,
    ).getDate();
    const startingDay = new Date(editModalYear, editModalMonth, 1).getDay();
    const days: ({
      date: number;
      fullDate: Date;
      isSelected: boolean;
      isPeriodDay: boolean;
      isToday: boolean;
    } | null)[] = [];
    for (let i = 0; i < startingDay; i++) days.push(null);
    for (let day = 1; day <= daysInMonth; day++) {
      const fullDate = new Date(editModalYear, editModalMonth, day);
      days.push({
        date: day,
        fullDate,
        isSelected: fullDate.toDateString() === selectedDate.toDateString(),
        isPeriodDay: isDateInPeriod(fullDate),
        isToday: fullDate.toDateString() === today.toDateString(),
      });
    }
    return days;
  };

  // Handle date selection in edit modal
  const handleEditModalDateSelect = (fullDate: Date) => {
    setSelectedDate(fullDate);
    if (editingPeriodType === "start") {
      setPeriodStart(true);
    } else {
      setPeriodEnd(true);
    }
    setPeriodEditModalVisible(false);
  };

  const editModalDays = getEditModalDays();

  const monthDays = getMonthDays();

  // Labels
  const symptomLabels: Record<string, string> = {
    cramps: "Cramps",
    fatigue: "Fatigue",
    bloating: "Bloating",
    headache: "Headache",
    bellyAches: "Belly aches",
    acne: "Acne",
    soreBreasts: "Sore breasts",
    cravings: "Cravings",
  };
  const moodLabels: Record<string, string> = {
    normal: "Normal",
    happy: "Happy",
    calm: "Calm",
    hyped: "Hyped",
    inLove: "In love",
    peaceful: "Peaceful",
    lonely: "Lonely",
    angry: "Angry",
    silly: "Silly",
    sad: "Sad",
    relaxed: "Relaxed",
  };
  const moodEmojis: Record<string, string> = {
    normal: "😐",
    happy: "😊",
    calm: "😌",
    hyped: "🤩",
    inLove: "😍",
    peaceful: "😇",
    lonely: "😢",
    angry: "😠",
    silly: "😜",
    sad: "😔",
    relaxed: "🙂",
  };
  const medicineLabels: Record<string, string> = {
    condom: "Condom",
    pill: "Pill",
    patch: "Patch",
    iud: "IUD",
    implant: "Implant",
    vRing: "V-Ring",
    injection: "Injection",
    spermicide: "Spermicide",
  };

  const formatDateStr = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const handleSave = async () => {
    const dateStr = formatDateStr(selectedDate);
    try {
      // Perform the save
      await saveCurrentDay();

      const token = await AsyncStorage.getItem("accessToken");
      if (token) {
        if (dayData.periodStart) {
          await api.post("/cycles/start", { start_date: dateStr }, token);
        }
        if (dayData.periodEnd) {
          await api.post("/cycles/end", { end_date: dateStr }, token);
        }
      }
      router.navigate({
        pathname: "/(tabs)/calendar",
        params: { date: dateStr },
      } as any);
    } catch (error) {
      console.error("Error saving log:", error);
      Alert.alert(
        "Sync Error",
        "Saved locally, but failed to sync with server. Please check your connection.",
        [{ text: "OK", onPress: () => router.navigate("/(tabs)/calendar" as any) }],
      );
    }
  };

  // Edit pen icon component
  const EditPenIcon = () => (
    <Svg width={12} height={12} viewBox="0 0 12 12">
      <Path
        d="M1.33333 10.6667H2.28333L8.8 4.15L7.85 3.2L1.33333 9.71667V10.6667ZM0 12V9.16667L8.8 0.383333C8.93333 0.261111 9.08056 0.166667 9.24167 0.1C9.40278 0.0333333 9.57222 0 9.75 0C9.92778 0 10.1 0.0333333 10.2667 0.1C10.4333 0.166667 10.5778 0.266667 10.7 0.4L11.6167 1.33333C11.75 1.45556 11.8472 1.6 11.9083 1.76667C11.9694 1.93333 12 2.1 12 2.26667C12 2.44444 11.9694 2.61389 11.9083 2.775C11.8472 2.93611 11.75 3.08333 11.6167 3.21667L2.83333 12H0ZM8.31667 3.68333L7.85 3.2L8.8 4.15L8.31667 3.68333Z"
        fill="#666666"
      />
    </Svg>
  );

  // Play triangle icon for Start button
  const PlayIcon = ({ color }: { color: string }) => (
    <Svg width={12} height={12} viewBox="0 0 24 24">
      <Path d="M5 3l14 9-14 9V3z" fill={color} />
    </Svg>
  );

  // Square icon for End button
  const StopIcon = ({ color }: { color: string }) => (
    <Svg width={10} height={10} viewBox="0 0 24 24">
      <Path d="M4 4h16v16H4V4z" fill={color} />
    </Svg>
  );

  // Section component
  const Section = ({
    title,
    onPress,
    onEditPress,
    children,
    showChevron = true,
    showEditIcon = false,
  }: {
    title: string;
    onPress?: () => void;
    onEditPress?: () => void;
    children: React.ReactNode;
    showChevron?: boolean;
    showEditIcon?: boolean;
  }) => (
    <View
      style={{ backgroundColor: "#FFE5EE" }}
      className="rounded-2xl mb-3 overflow-hidden"
    >
      <TouchableOpacity
        onPress={onPress}
        disabled={!onPress}
        className="flex-row justify-between items-center px-4 py-3"
        activeOpacity={onPress ? 0.7 : 1}
      >
        <Text className="text-base font-medium text-gray-800">{title}</Text>
        {showChevron && <Text className="text-gray-400 text-lg">{">"}</Text>}
        {showEditIcon && (
          <TouchableOpacity
            onPress={onEditPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <EditPenIcon />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
      <View className="px-4 pb-4">{children}</View>
    </View>
  );

  // Calculate cups
  const cupsCount = Math.ceil(waterTarget / cupCapacity);
  const cups = Array(Math.min(cupsCount, 5)).fill(cupCapacity);

  // Responsive wrapper for desktop

  return (
    <View
      className="flex-1"
      style={{
        backgroundColor: isDesktop ? "#f5f5f5" : "#FF4081",
        paddingTop: isDesktop ? 20 : insets.top,
        paddingBottom: isDesktop ? 20 : 0,
      }}
    >
      {/* Desktop background with centered content */}
      <View
        className="flex-1"
        style={
          isDesktop
            ? {
                maxWidth: MAX_CONTENT_WIDTH,
                maxHeight: 844, // iPhone 14 Pro height
                width: "100%",
                alignSelf: "center",
                backgroundColor: "#FF4081",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 16,
                elevation: 8,
                borderRadius: 24,
                overflow: "hidden",
              }
            : undefined
        }
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-3">
          <TouchableOpacity
            onPress={() => router.canGoBack() ? router.back() : router.replace("/(tabs)")}
            className="p-2"
          >
            <Text className="text-white text-2xl">×</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={toggleCalendar}
            className="flex-row items-center"
          >
            <Text className="text-white text-lg font-semibold">
              {selectedDate.toDateString() === today.toDateString()
                ? "Today"
                : `${MONTHS[selectedDate.getMonth()]} ${selectedDate.getDate()}`}
            </Text>
            <Animated.View style={chevronStyle} className="ml-2">
              <Text className="text-white text-sm">▼</Text>
            </Animated.View>
          </TouchableOpacity>
          <TouchableOpacity className="p-2">
            <Text className="text-white text-xl">⋮</Text>
          </TouchableOpacity>
        </View>

        {/* Calendar */}
        {calendarExpanded ? (
          <View className="px-4 pb-4">
            <View className="flex-row items-center justify-between mb-4">
              <TouchableOpacity
                onPress={() => {
                  if (viewingMonth === 0) {
                    setViewingMonth(11);
                    setViewingYear((y) => y - 1);
                  } else {
                    setViewingMonth((m) => m - 1);
                  }
                }}
                className="p-2"
              >
                <Text className="text-white text-xl">{"<"}</Text>
              </TouchableOpacity>
              <Text className="text-white text-base font-semibold">
                {MONTHS[viewingMonth]} {viewingYear}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  if (viewingMonth === 11) {
                    setViewingMonth(0);
                    setViewingYear((y) => y + 1);
                  } else {
                    setViewingMonth((m) => m + 1);
                  }
                }}
                className="p-2"
              >
                <Text className="text-white text-xl">{">"}</Text>
              </TouchableOpacity>
            </View>
            <View className="flex-row justify-around mb-2">
              {DAYS.map((day) => (
                <Text
                  key={day}
                  className="text-white/70 text-xs w-10 text-center"
                >
                  {day}
                </Text>
              ))}
            </View>
            <View className="flex-row flex-wrap">
              {monthDays.map((day, i) => (
                <View key={i} className="w-[14.28%] items-center mb-2">
                  {day ? (
                    <TouchableOpacity
                      onPress={() => handleDateSelect(day.fullDate)}
                    >
                      <View
                        className={`w-9 h-9 rounded-full items-center justify-center ${day.isSelected ? "bg-white" : day.isPeriodDay ? "bg-pink-700" : day.isToday ? "bg-pink-300" : ""}`}
                      >
                        <Text
                          className={`text-base ${day.isSelected ? "text-pink-500 font-semibold" : "text-white"}`}
                        >
                          {day.date}
                        </Text>
                      </View>
                      {day.isPeriodDay && (
                        <View className="w-1.5 h-1.5 rounded-full bg-white mt-0.5 self-center" />
                      )}
                    </TouchableOpacity>
                  ) : (
                    <View className="w-9 h-9" />
                  )}
                </View>
              ))}
            </View>
          </View>
        ) : (
          <View className="pb-4">
            {/* Horizontal scrollable date selector */}
            <FlatList
              ref={flatListRef}
              horizontal
              data={dates}
              keyExtractor={(item) => item.date.toISOString()}
              renderItem={renderDateItem}
              extraData={{ selectedDate, dayLogs }}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16 }}
              getItemLayout={(data, index) => ({
                length: DATE_ITEM_SIZE + 8,
                offset: (DATE_ITEM_SIZE + 8) * index,
                index,
              })}
              onScrollToIndexFailed={(info) => {
                setTimeout(() => {
                  flatListRef.current?.scrollToIndex({
                    index: info.index,
                    animated: true,
                    viewPosition: 0.5,
                  });
                }, 100);
              }}
              snapToInterval={DATE_ITEM_SIZE + 8}
              decelerationRate="fast"
            />
          </View>
        )}

        <ScrollView
          className="flex-1 px-4"
          contentContainerStyle={{ paddingBottom: 100, paddingTop: 12 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Period */}
          <Section
            title="Period"
            showChevron={false}
            showEditIcon={true}
            onEditPress={handleEditPeriod}
          >
            <View className="flex-row gap-2">
              {/* Start Button */}
              <TouchableOpacity
                onPress={handlePeriodStart}
                className="flex-1 flex-row items-center justify-center rounded-full"
                style={{
                  backgroundColor: dayData.periodStart ? "#EC4899" : "#FFBAD2",
                  height: 30,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  gap: 5,
                  marginEnd: 20,
                }}
              >
                <PlayIcon color={dayData.periodStart ? "#FFFFFF" : "#1C1B1F"} />
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "500",
                    color: dayData.periodStart ? "#FFFFFF" : "#FF4081",
                  }}
                >
                  Start
                </Text>
              </TouchableOpacity>

              {/* End Button */}
              <TouchableOpacity
                onPress={handlePeriodEnd}
                className="flex-1 flex-row items-center justify-center rounded-full"
                style={{
                  backgroundColor: dayData.periodEnd ? "#0134E4" : "#B9C9FF",
                  height: 30,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  gap: 5,
                }}
              >
                <StopIcon color={dayData.periodEnd ? "#FFFFFF" : "#1C1B1F"} />
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "500",
                    color: dayData.periodEnd ? "#FFFFFF" : "#0134E4",
                  }}
                >
                  End
                </Text>
              </TouchableOpacity>
            </View>
          </Section>

          {/* Flow */}
          <Section title="Flow" showChevron={false}>
            <View className="flex-row justify-around">
              {(["light", "medium", "heavy", "veryHeavy"] as const).map(
                (level) => (
                  <TouchableOpacity
                    key={level}
                    onPress={() =>
                      setFlowLevel(dayData.flowLevel === level ? null : level)
                    }
                    className="items-center"
                  >
                    <FlowDroplet
                      level={level}
                      selected={dayData.flowLevel === level}
                    />
                    <Text
                      className={`text-sm mt-1 ${dayData.flowLevel === level ? "text-pink-500 font-medium" : "text-gray-600"}`}
                    >
                      {flowLevelLabel(level)}
                    </Text>
                  </TouchableOpacity>
                ),
              )}
            </View>
          </Section>

          {/* Symptoms */}
          <Section
            title="Symptoms"
            onPress={() => router.push("/add-log/symptoms")}
          >
            {dayData.symptoms.length > 0 ? (
              <View className="flex-row flex-wrap">
                {dayData.symptoms.map((s) => (
                  <View key={s} className="flex-row items-center mr-4 mb-2 gap-2">
                    <Image source={SYMPTOM_IMAGES[s] as any} style={{ width: 18, height: 18, tintColor: "#EC4899" }} resizeMode="contain" />
                    <Text className="text-pink-500 text-sm font-medium">{symptomLabels[s]}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text className="text-gray-400 text-sm">Tap to add symptoms</Text>
            )}
          </Section>

          {/* Moods */}
          <Section title="Moods" onPress={() => router.push("/add-log/moods")}>
            {dayData.moods.length > 0 ? (
              <View className="flex-row flex-wrap">
                {dayData.moods.map((m) => (
                  <View key={m} className="flex-row items-center mr-4 mb-2">
                    <Text className="text-2xl mr-1">{moodEmojis[m]}</Text>
                    <Text className="text-pink-500 text-sm">
                      {moodLabels[m]}
                    </Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text className="text-gray-400 text-sm">Tap to add moods</Text>
            )}
          </Section>

          {/* Medicine */}
          <Section
            title="Medicine"
            onPress={() => router.push("/add-log/medicine")}
          >
            {dayData.medicine.length > 0 ? (
              <View className="flex-row flex-wrap">
                {dayData.medicine.map((m) => (
                  <View key={m} className="items-center mr-4 mb-2">
                    <Image
                      source={MEDICINE_IMAGES[m] as any}
                      style={{ width: 40, height: 40 }}
                      resizeMode="contain"
                    />
                    <Text className="text-pink-500 text-xs mt-1">
                      {medicineLabels[m]}
                    </Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text className="text-gray-400 text-sm">Tap to add medicine</Text>
            )}
          </Section>

          {/* Note */}
          <Section title="Note" onPress={() => router.push("/add-log/notes")}>
            {dayData.note ? (
              <Text className="text-gray-600 text-sm" numberOfLines={2}>
                {dayData.note}
              </Text>
            ) : (
              <Text className="text-gray-400 text-sm">Tap to write a note</Text>
            )}
          </Section>

          {/* Weight */}
          <TouchableOpacity
            onPress={() => router.push("/add-log/weight")}
            style={{ backgroundColor: "#FFE5EE" }}
            className="rounded-2xl mb-3 flex-row justify-between items-center px-4 py-4"
          >
            <Text className="text-base font-medium text-gray-800">Weight</Text>
            <View className="flex-row items-center">
              {dayData.weight ? (
                <Text className="text-pink-500 font-medium mr-2">
                  {dayData.weight} {dayData.weightUnit}
                </Text>
              ) : (
                <Text className="text-gray-400 mr-2">Tap to add</Text>
              )}
              <Text className="text-gray-400">{">"}</Text>
            </View>
          </TouchableOpacity>

          {/* Temperature */}
          <TouchableOpacity
            onPress={() => router.push("/add-log/temperature")}
            style={{ backgroundColor: "#FFE5EE" }}
            className="rounded-2xl mb-3 flex-row justify-between items-center px-4 py-4"
          >
            <Text className="text-base font-medium text-gray-800">
              Temperature
            </Text>
            <View className="flex-row items-center">
              {dayData.temperature ? (
                <Text className="text-pink-500 font-medium mr-2">
                  {dayData.temperature} °{dayData.temperatureUnit}
                </Text>
              ) : (
                <Text className="text-gray-400 mr-2">Tap to add</Text>
              )}
              <Text className="text-gray-400">{">"}</Text>
            </View>
          </TouchableOpacity>

          {/* Drink Water */}
          <Section
            title="Drink water"
            onPress={() => router.push("/add-log/drink-water")}
          >
            <View className="flex-row items-center mb-3" style={{ gap: 6 }}>
              <TextInput
                value={String(dayData.waterIntake)}
                onChangeText={(text) => {
                  const n = parseInt(text, 10);
                  if (!isNaN(n)) setWaterIntake(n);
                  else if (text === "") setWaterIntake(0);
                }}
                keyboardType="numeric"
                className="text-pink-500 text-lg font-semibold"
                style={{ minWidth: 40, padding: 0 }}
              />
              <Text className="text-pink-500 text-lg font-semibold">
                / {waterTarget} ml
              </Text>
            </View>
            <View className="flex-row justify-around">
              {cups.map((amount, i) => {
                const cupFilled = dayData.waterIntake >= (i + 1) * amount;
                return (
                  <TouchableOpacity
                    key={i}
                    onPress={() => {
                      if (cupFilled) {
                        setWaterIntake(i * amount);
                      } else {
                        addWater(amount);
                      }
                    }}
                    className="items-center"
                  >
                    <Svg width={60} height={60} viewBox="0 0 60 60" fill="none">
                      {/* Circle border */}
                      <Path
                        d="M30 58C45.464 58 58 45.464 58 30C58 14.536 45.464 2 30 2C14.536 2 2 14.536 2 30C2 45.464 14.536 58 30 58Z"
                        stroke={cupFilled ? "#FF4081" : "#FFE4ED"}
                        strokeWidth={2}
                        fill="none"
                      />
                      {/* Glass body */}
                      <Path d="M20 18L22 44H38L40 18H20Z" fill="#BBCAFF" />
                      {/* Water fill */}
                      <Path
                        d="M21.5 30L22 44H38L38.5 30H21.5Z"
                        fill="#4770FD"
                      />
                      {/* Bubble dots */}
                      <Path
                        d="M28 35C28.5523 35 29 34.5523 29 34C29 33.4477 28.5523 33 28 33C27.4477 33 27 33.4477 27 34C27 34.5523 27.4477 35 28 35Z"
                        fill="#BBCAFF"
                      />
                      <Path
                        d="M33 38C33.5523 38 34 37.5523 34 37C34 36.4477 33.5523 36 33 36C32.4477 36 32 36.4477 32 37C32 37.5523 32.4477 38 33 38Z"
                        fill="#BBCAFF"
                      />
                    </Svg>
                    <Text
                      style={{
                        fontSize: 11,
                        marginTop: 4,
                        color: cupFilled ? "#FF4081" : "#666666",
                      }}
                    >
                      {amount}ml
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Section>
        </ScrollView>

        {/* Save */}
        <View style={{ alignItems: "center", backgroundColor: "#FF3378" }}>
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
              marginTop: 16,
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
        </View>
      </View>

      {/* Period Edit Modal */}
      <Modal
        visible={periodEditModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPeriodEditModalVisible(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center px-4">
          <View className="bg-white rounded-3xl w-full max-w-sm overflow-hidden">
            {/* Modal Header */}
            <View className="px-4 py-4" style={{ backgroundColor: "#FF4081" }}>
              <View className="flex-row justify-between items-center mb-4">
                <TouchableOpacity
                  onPress={() => setPeriodEditModalVisible(false)}
                >
                  <Text className="text-white text-lg">×</Text>
                </TouchableOpacity>
                <Text className="text-white text-lg font-semibold">
                  Edit Period
                </Text>
                <View className="w-4" />
              </View>

              {/* Start/End Toggle */}
              <View
                className="flex-row rounded-full p-1"
                style={{ backgroundColor: "rgba(255,255,255,0.3)" }}
              >
                <TouchableOpacity
                  onPress={() => setEditingPeriodType("start")}
                  className={`flex-1 py-2 rounded-full ${editingPeriodType === "start" ? "bg-white" : ""}`}
                >
                  <Text
                    style={{
                      color:
                        editingPeriodType === "start" ? "#FF4081" : "#FFFFFF",
                    }}
                    className="text-center font-medium"
                  >
                    Start Date
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setEditingPeriodType("end")}
                  className={`flex-1 py-2 rounded-full ${editingPeriodType === "end" ? "bg-white" : ""}`}
                >
                  <Text
                    style={{
                      color:
                        editingPeriodType === "end" ? "#FF4081" : "#FFFFFF",
                    }}
                    className="text-center font-medium"
                  >
                    End Date
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Calendar */}
            <View className="p-4">
              {/* Month Navigation */}
              <View className="flex-row items-center justify-between mb-4">
                <TouchableOpacity
                  onPress={() => {
                    if (editModalMonth === 0) {
                      setEditModalMonth(11);
                      setEditModalYear((y) => y - 1);
                    } else {
                      setEditModalMonth((m) => m - 1);
                    }
                  }}
                  className="p-2"
                >
                  <Text style={{ color: "#FF4081" }} className="text-xl">
                    {"<"}
                  </Text>
                </TouchableOpacity>
                <Text className="text-gray-800 text-base font-semibold">
                  {MONTHS[editModalMonth]} {editModalYear}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    if (editModalMonth === 11) {
                      setEditModalMonth(0);
                      setEditModalYear((y) => y + 1);
                    } else {
                      setEditModalMonth((m) => m + 1);
                    }
                  }}
                  className="p-2"
                >
                  <Text style={{ color: "#FF4081" }} className="text-xl">
                    {">"}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Day Headers */}
              <View className="flex-row justify-around mb-2">
                {DAYS.map((day) => (
                  <Text
                    key={day}
                    className="text-gray-400 text-xs w-10 text-center"
                  >
                    {day}
                  </Text>
                ))}
              </View>

              {/* Days Grid */}
              <View className="flex-row flex-wrap">
                {editModalDays.map((day, i) => (
                  <View key={i} className="w-[14.28%] items-center mb-2">
                    {day ? (
                      <TouchableOpacity
                        onPress={() => handleEditModalDateSelect(day.fullDate)}
                      >
                        <View
                          style={{
                            backgroundColor: day.isSelected
                              ? "#FF4081"
                              : day.isPeriodDay
                                ? "rgba(255, 64, 129, 0.2)"
                                : day.isToday
                                  ? "#f3f4f6"
                                  : "transparent",
                          }}
                          className="w-9 h-9 rounded-full items-center justify-center"
                        >
                          <Text
                            style={{
                              color: day.isSelected
                                ? "#FFFFFF"
                                : day.isPeriodDay
                                  ? "#FF4081"
                                  : "#1f2937",
                            }}
                            className={`text-sm ${day.isSelected ? "font-semibold" : ""}`}
                          >
                            {day.date}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ) : (
                      <View className="w-9 h-9" />
                    )}
                  </View>
                ))}
              </View>
            </View>

            {/* Cancel Button */}
            <View className="px-4 pb-4">
              <TouchableOpacity
                onPress={() => setPeriodEditModalVisible(false)}
                className="bg-gray-100 py-3 rounded-full"
              >
                <Text className="text-center text-gray-600 font-medium">
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
