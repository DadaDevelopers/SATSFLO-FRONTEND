import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Svg, {
  Circle,
  Path,
  Text as SvgText,
  Defs,
  LinearGradient,
  Stop,
  G,
} from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  withSequence,
} from "react-native-reanimated";
import Colors from "@/constants/colors";

const TOTAL_DAYS = 31;
const SIZE = 320;
const CX = SIZE / 2;
const CY = SIZE / 2;
const RING_WIDTH = 38;
const PATCH_WIDTH = RING_WIDTH;
const PATH_RADIUS = 131;
const ANGLE_PER_DAY = 360 / TOTAL_DAYS;
const CAP_ANGLE = (PATCH_WIDTH / 2) / PATH_RADIUS * (180 / Math.PI);
const RING_CAP_ANGLE = (RING_WIDTH / 2) / PATH_RADIUS * (180 / Math.PI);
const RING_GAP_ANGLE = 3 + RING_CAP_ANGLE;

const DIVIDER_RADIUS = 106;
const DIVIDER_WIDTH = 3.5;
const GAP_ANGLE = 3;

function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

function polarToXY(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = degToRad(angleDeg);
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function dayStartAngle(day: number): number {
  return -90 + (day - 1) * ANGLE_PER_DAY;
}

function dayMidAngle(day: number): number {
  return -90 + (day - 0.5) * ANGLE_PER_DAY;
}

function createArc(
  cx: number,
  cy: number,
  r: number,
  startDeg: number,
  endDeg: number
): string {
  const start = polarToXY(cx, cy, r, startDeg);
  const end = polarToXY(cx, cy, r, endDeg);
  const sweep = endDeg - startDeg;
  const largeArc = sweep > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`;
}

function getTextColor(day: number, currentDay: number): string {
  if (day === currentDay) return "#FFFFFF";
  if (day >= 1 && day <= 5) return "#FFFFFF";
  if (day >= 10 && day <= 16) return "#FFFFFF";
  return "#000000";
}

function getFontWeight(day: number, currentDay: number): string {
  if (day === currentDay) return "700";
  return "500";
}

function CurrentDayPulse({ x, y }: { x: number; y: number }) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.35);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.6, { duration: 1400, easing: Easing.out(Easing.ease) }),
        withTiming(1, { duration: 1400, easing: Easing.in(Easing.ease) })
      ),
      -1,
      false
    );
    opacity.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 1400, easing: Easing.out(Easing.ease) }),
        withTiming(0.35, { duration: 1400, easing: Easing.in(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          position: "absolute" as const,
          left: x - 22,
          top: y - 22,
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: Colors.currentDay,
        },
        pulseStyle,
      ]}
    />
  );
}

interface CycleTrackerProps {
  currentDay: number;
  cycleLength: number;
}

export default function CycleTracker({ currentDay }: CycleTrackerProps) {
  const dayPositions = [];
  for (let day = 1; day <= TOTAL_DAYS; day++) {
    const angle = dayMidAngle(day);
    const pos = polarToXY(CX, CY, PATH_RADIUS, angle);
    dayPositions.push({ day, x: pos.x, y: pos.y });
  }

  const currentPos = dayPositions.find((d) => d.day === currentDay);

  const follicularBaseArc = createArc(CX, CY, PATH_RADIUS, dayStartAngle(1) + CAP_ANGLE, dayStartAngle(17) - CAP_ANGLE);
  const menstrualArc = createArc(CX, CY, PATH_RADIUS, dayStartAngle(1) + CAP_ANGLE, dayStartAngle(6) - CAP_ANGLE);
  const ovulationArc = createArc(CX, CY, PATH_RADIUS, dayStartAngle(10) + CAP_ANGLE, dayStartAngle(17) - CAP_ANGLE);

  const folStart = dayStartAngle(1) + GAP_ANGLE / 2;
  const folEnd = dayStartAngle(17) - GAP_ANGLE / 2;
  const folMid = (folStart + folEnd) / 2;
  const lutStart = dayStartAngle(17) + GAP_ANGLE / 2;
  const lutEnd = dayStartAngle(1) + 360 - GAP_ANGLE / 2;
  const lutMid = (lutStart + lutEnd) / 2;

  const dividerSegments = [
    { sAngle: folStart, eAngle: folMid, fromColor: Colors.follicular.end, toColor: Colors.follicular.start, id: "div_fol1" },
    { sAngle: folMid, eAngle: folEnd, fromColor: Colors.follicular.start, toColor: Colors.follicular.end, id: "div_fol2" },
    { sAngle: lutStart, eAngle: lutMid, fromColor: Colors.luteal.end, toColor: Colors.luteal.start, id: "div_lut1" },
    { sAngle: lutMid, eAngle: lutEnd, fromColor: Colors.luteal.start, toColor: Colors.luteal.end, id: "div_lut2" },
  ].map((seg) => {
    const arc = createArc(CX, CY, DIVIDER_RADIUS, seg.sAngle, seg.eAngle);
    const startPt = polarToXY(CX, CY, DIVIDER_RADIUS, seg.sAngle);
    const endPt = polarToXY(CX, CY, DIVIDER_RADIUS, seg.eAngle);
    return { ...seg, arc, startPt, endPt };
  });

  return (
    <View style={styles.container}>
      <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
        <Defs>
          <LinearGradient id="grad_menstrual" x1="0.2" y1="0" x2="0.8" y2="1">
            <Stop offset="0%" stopColor="#FF3838" />
            <Stop offset="100%" stopColor="#9B1B1B" />
          </LinearGradient>
          <LinearGradient id="grad_ovulation" x1="0" y1="0.5" x2="1" y2="0.5">
            <Stop offset="0%" stopColor="#FFE600" />
            <Stop offset="100%" stopColor="#FF7A00" />
          </LinearGradient>
          {dividerSegments.map((seg) => (
            <LinearGradient
              key={seg.id}
              id={seg.id}
              x1={seg.startPt.x}
              y1={seg.startPt.y}
              x2={seg.endPt.x}
              y2={seg.endPt.y}
              gradientUnits="userSpaceOnUse"
            >
              <Stop offset="0%" stopColor={seg.fromColor} />
              <Stop offset="100%" stopColor={seg.toColor} />
            </LinearGradient>
          ))}
        </Defs>

        <Path
          d={createArc(CX, CY, PATH_RADIUS, -90 + RING_GAP_ANGLE, -90 + 360 - RING_GAP_ANGLE)}
          fill="none"
          stroke="#ffe5ee"
          strokeWidth={RING_WIDTH}
          strokeLinecap="round"
        />

        <Path d={follicularBaseArc} fill="none" stroke="#FFCCDD" strokeWidth={PATCH_WIDTH} strokeLinecap="round" />
        <Path d={menstrualArc} fill="none" stroke="url(#grad_menstrual)" strokeWidth={PATCH_WIDTH} strokeLinecap="round" />
        <Path d={ovulationArc} fill="none" stroke="url(#grad_ovulation)" strokeWidth={PATCH_WIDTH} strokeLinecap="round" />

        {dividerSegments.map((seg) => (
          <Path
            key={seg.id}
            d={seg.arc}
            fill="none"
            stroke={`url(#${seg.id})`}
            strokeWidth={DIVIDER_WIDTH}
            strokeLinecap="round"
          />
        ))}

        {dayPositions.map(({ day, x, y }) => {
          if (day === currentDay) return null;
          return (
            <SvgText
              key={day}
              x={x}
              y={y + 4}
              fontSize={11}
              fontFamily="Manrope_500Medium"
              fontWeight={getFontWeight(day, currentDay)}
              fill={getTextColor(day, currentDay)}
              textAnchor="middle"
            >
              {day}
            </SvgText>
          );
        })}

        {currentPos && (
          <G>
            <Circle
              cx={currentPos.x}
              cy={currentPos.y}
              r={18}
              fill={Colors.currentDay}
            />
            <SvgText
              x={currentPos.x}
              y={currentPos.y + 4}
              fontSize={12}
              fontFamily="Manrope_700Bold"
              fontWeight="700"
              fill="#FFFFFF"
              textAnchor="middle"
            >
              {currentDay}
            </SvgText>
          </G>
        )}
      </Svg>
      {currentPos && <CurrentDayPulse x={currentPos.x} y={currentPos.y} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SIZE,
    height: SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
});
