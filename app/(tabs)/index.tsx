import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import CycleTracker from "@/components/CycleTracker";
import PhaseLegend from "@/components/PhaseLegend";
import Colors from "@/constants/colors";

const CURRENT_DAY = 26;
const CYCLE_LENGTH = 31;
const DAYS_UNTIL_PERIOD = 13;

function formatDate(): string {
  const now = new Date();
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  const day = now.getDate();
  const suffix =
    day === 1 || day === 21 || day === 31
      ? "st"
      : day === 2 || day === 22
        ? "nd"
        : day === 3 || day === 23
          ? "rd"
          : "th";
  return `${months[now.getMonth()]} ${day}${suffix}`;
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: topPadding + 10,
            paddingBottom: Platform.OS === "web" ? 34 + 76 : 100,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <MaterialCommunityIcons name="water" size={22} color="#CC0045" />
          </View>
          <Text style={styles.appTitle}>SatsFlo</Text>
          <View style={styles.bellIcon}>
            <Feather name="bell" size={20} color={Colors.text} />
          </View>
        </View>

        <View style={styles.trackerSection}>
          <View style={styles.trackerWrapper}>
            <CycleTracker currentDay={CURRENT_DAY} cycleLength={CYCLE_LENGTH} />

            <View style={styles.centerContent}>
              <Text style={styles.todayText}>Today: {formatDate()}</Text>
              <Text style={styles.daysText}>
                {DAYS_UNTIL_PERIOD} days until your{"\n"}next period
              </Text>
              <Pressable style={styles.editButton}>
                <Feather name="edit-2" size={10} color={Colors.white} />
                <Text style={styles.editButtonText}>Edit Period</Text>
              </Pressable>
            </View>
          </View>
        </View>

        <PhaseLegend />

        <View style={styles.giftSection}>
          <Pressable style={styles.giftButton}>
            <Feather name="gift" size={20} color={Colors.white} />
            <Text style={styles.giftText}>Gift Token</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#CC0045",
    alignItems: "center",
    justifyContent: "center",
  },
  appTitle: {
    fontFamily: "Inter_500Medium",
    fontSize: 24,
    color: Colors.white,
    letterSpacing: -0.3,
  },
  bellIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.text,
    alignItems: "center",
    justifyContent: "center",
  },
  trackerSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  trackerWrapper: {
    width: 320,
    height: 320,
    alignItems: "center",
    justifyContent: "center",
  },
  centerContent: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  todayText: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    color: Colors.white,
    marginBottom: 6,
  },
  daysText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 20,
    color: Colors.text,
    textAlign: "center",
    lineHeight: 30,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.text,
    gap: 5,
    marginTop: 12,
  },
  editButtonText: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    color: Colors.white,
  },
  giftSection: {
    marginTop: 28,
    alignItems: "center",
  },
  giftButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 5,
    backgroundColor: Colors.primary,
  },
  giftText: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    color: Colors.white,
  },
});
