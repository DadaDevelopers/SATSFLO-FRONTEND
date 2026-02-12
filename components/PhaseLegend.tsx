import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import Colors from "@/constants/colors";

interface PhaseItemProps {
  label: string;
  colors: [string, string];
  gradientStart?: { x: number; y: number };
  gradientEnd?: { x: number; y: number };
}

function PhaseItem({ label, colors, gradientStart, gradientEnd }: PhaseItemProps) {
  return (
    <View style={styles.item}>
      <LinearGradient
        colors={colors}
        start={gradientStart || { x: 0, y: 0 }}
        end={gradientEnd || { x: 1, y: 1 }}
        style={styles.dot}
      />
      <Text style={styles.label}>{label}</Text>
      <Feather name="info" size={9} color={Colors.text} style={styles.infoIcon} />
    </View>
  );
}

export default function PhaseLegend() {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <PhaseItem label="MenstrualPhase" colors={["#F43B3B", "#8E2222"]} />
        <PhaseItem label="Follicular Phase" colors={["#EC59C0", "#F7D5FF"]} />
      </View>
      <View style={styles.row}>
        <PhaseItem
          label="Ovulation Phase"
          colors={["#FFFF00", "#FF8800"]}
          gradientStart={{ x: 0, y: 0.5 }}
          gradientEnd={{ x: 1, y: 0.5 }}
        />
        <PhaseItem label="Luteal Phase" colors={["#F0F0F1", "#70A9FE"]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 30,
    gap: 14,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    width: "48%",
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  label: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    color: Colors.text,
    marginLeft: 4,
  },
  infoIcon: {
    marginLeft: 2,
    opacity: 0.7,
  },
});
