import React, { useEffect } from "react";
import { View } from "react-native";
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

function CurrentDayPulse({ x, y, scale }: { x: number; y: number; scale: number }) {
  const pulseHalf = 22 * scale;
  const pulseSize = pulseHalf * 2;

  const scaleAnim = useSharedValue(1);
  const opacity = useSharedValue(0.35);

  useEffect(() => {
    scaleAnim.value = withRepeat(
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
    transform: [{ scale: scaleAnim.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          position: "absolute" as const,
          left: x - pulseHalf,
          top: y - pulseHalf,
          width: pulseSize,
          height: pulseSize,
          borderRadius: pulseHalf,
          backgroundColor: Colors.currentDay,
        },
        pulseStyle,
      ]}
    />
  );
}

export interface CycleTrackerProps {
  currentDay: number;
  cycleLength: number;
  periodLength?: number;
  ovulationDay?: number;
  size?: number;
}

export function CycleTracker({
  currentDay,
  cycleLength,
  periodLength = 5,
  ovulationDay,
  size = 320,
}: CycleTrackerProps) {
  // Use real cycle length for all ring math
  const totalDays = Math.max(cycleLength, 21);
  const anglePerDay = 360 / totalDays;

  // Default ovulation day: roughly cycleLength - 14 (luteal phase is ~14 days)
  const ovDay = ovulationDay ?? Math.max(periodLength + 2, totalDays - 14);

  // Clamp currentDay to valid range
  const safeCurrentDay = Math.min(Math.max(currentDay, 1), totalDays);

  const scale = size / 320;
  const CX = size / 2;
  const CY = size / 2;
  const RING_WIDTH = 38 * scale;
  const PATCH_WIDTH = RING_WIDTH;
  const PATH_RADIUS = 131 * scale;
  const CAP_ANGLE = ((PATCH_WIDTH / 2) / PATH_RADIUS) * (180 / Math.PI);
  const RING_CAP_ANGLE = ((RING_WIDTH / 2) / PATH_RADIUS) * (180 / Math.PI);
  const RING_GAP_ANGLE = 3 + RING_CAP_ANGLE;
  const DIVIDER_RADIUS = 106 * scale;
  const DIVIDER_WIDTH = 3.5 * scale;
  const INNER_CIRCLE_RADIUS = PATH_RADIUS - RING_WIDTH / 2 - 12 * scale;

  // Dynamic angle helpers using real cycle length
  const dayStartAngle = (day: number) => -90 + (day - 1) * anglePerDay;
  const dayMidAngle = (day: number) => -90 + (day - 0.5) * anglePerDay;

  // Phase day boundaries (1-indexed, inclusive)
  const menstrualEnd = Math.min(periodLength, ovDay - 1);       // menstrual: day 1 → periodLength
  const follicularEnd = ovDay;                                   // follicular base: day 1 → ovDay
  const ovulStart = Math.max(menstrualEnd + 2, ovDay - 2);      // ovulation window: ovDay-2 to ovDay+2
  const ovulEnd = Math.min(totalDays - 1, ovDay + 2);
  const lutStart = ovDay + 1;                                    // luteal: ovDay+1 → totalDays

  // Compute positions for all day numbers on the ring
  const dayPositions = Array.from({ length: totalDays }, (_, i) => {
    const day = i + 1;
    const angle = dayMidAngle(day);
    const pos = polarToXY(CX, CY, PATH_RADIUS, angle);
    return { day, x: pos.x, y: pos.y };
  });

  const currentPos = dayPositions.find((d) => d.day === safeCurrentDay);

  // Phase arc paths
  const follicularBaseArc = createArc(
    CX, CY, PATH_RADIUS,
    dayStartAngle(1) + CAP_ANGLE,
    dayStartAngle(follicularEnd + 1) - CAP_ANGLE
  );
  const menstrualArc = createArc(
    CX, CY, PATH_RADIUS,
    dayStartAngle(1) + CAP_ANGLE,
    dayStartAngle(menstrualEnd + 1) - CAP_ANGLE
  );
  const ovulationArc = createArc(
    CX, CY, PATH_RADIUS,
    dayStartAngle(ovulStart) + CAP_ANGLE,
    dayStartAngle(ovulEnd + 1) - CAP_ANGLE
  );
  const lutealArc = createArc(
    CX, CY, PATH_RADIUS,
    dayStartAngle(lutStart) + GAP_ANGLE / 2,
    dayStartAngle(1) + 360 - GAP_ANGLE / 2
  );

  // Gradient endpoints for luteal arc (used in userSpaceOnUse gradient)
  const lutealStartPt = polarToXY(CX, CY, PATH_RADIUS, dayStartAngle(lutStart));
  const lutealEndPt = polarToXY(CX, CY, PATH_RADIUS, dayStartAngle(1) + 360);

  // Divider lines at the follicular/luteal phase boundary
  const folDivStart = dayStartAngle(1) + GAP_ANGLE / 2;
  const folDivEnd = dayStartAngle(follicularEnd + 1) - GAP_ANGLE / 2;
  const folDivMid = (folDivStart + folDivEnd) / 2;
  const lutDivStart = dayStartAngle(lutStart) + GAP_ANGLE / 2;
  const lutDivEnd = dayStartAngle(1) + 360 - GAP_ANGLE / 2;
  const lutDivMid = (lutDivStart + lutDivEnd) / 2;

  const dividerSegments = [
    { sAngle: folDivStart, eAngle: folDivMid, fromColor: Colors.follicular.end, toColor: Colors.follicular.start, id: "div_fol1" },
    { sAngle: folDivMid, eAngle: folDivEnd, fromColor: Colors.follicular.start, toColor: Colors.follicular.end, id: "div_fol2" },
    { sAngle: lutDivStart, eAngle: lutDivMid, fromColor: Colors.luteal.end, toColor: Colors.luteal.start, id: "div_lut1" },
    { sAngle: lutDivMid, eAngle: lutDivEnd, fromColor: Colors.luteal.start, toColor: Colors.luteal.end, id: "div_lut2" },
  ].map((seg) => {
    const arc = createArc(CX, CY, DIVIDER_RADIUS, seg.sAngle, seg.eAngle);
    const startPt = polarToXY(CX, CY, DIVIDER_RADIUS, seg.sAngle);
    const endPt = polarToXY(CX, CY, DIVIDER_RADIUS, seg.eAngle);
    return { ...seg, arc, startPt, endPt };
  });

  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Defs>
          <LinearGradient id="grad_menstrual" x1="0.2" y1="0" x2="0.8" y2="1">
            <Stop offset="0%" stopColor="#FF3838" />
            <Stop offset="100%" stopColor="#9B1B1B" />
          </LinearGradient>
          <LinearGradient id="grad_ovulation" x1="0" y1="0.5" x2="1" y2="0.5">
            <Stop offset="0%" stopColor={Colors.ovulation.start} />
            <Stop offset="100%" stopColor={Colors.ovulation.end} />
          </LinearGradient>
          <LinearGradient
            id="grad_luteal"
            x1={lutealStartPt.x}
            y1={lutealStartPt.y}
            x2={lutealEndPt.x}
            y2={lutealEndPt.y}
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset="0%" stopColor={Colors.luteal.start} />
            <Stop offset="100%" stopColor={Colors.luteal.end} />
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

        {/* Ring background */}
        <Path
          d={createArc(CX, CY, PATH_RADIUS, -90 + RING_GAP_ANGLE, -90 + 360 - RING_GAP_ANGLE)}
          fill="none"
          stroke={Colors.ringBackground}
          strokeWidth={RING_WIDTH}
          strokeLinecap="round"
        />

        {/* Inner filled circle */}
        <Circle cx={CX} cy={CY} r={INNER_CIRCLE_RADIUS} fill={Colors.innerCircle} />

        {/* Phase arcs — drawn in layer order */}
        {/* Follicular base (pink) */}
        <Path d={follicularBaseArc} fill="none" stroke="#FFCCDD" strokeWidth={PATCH_WIDTH} strokeLinecap="round" />
        {/* Luteal (grey → blue) */}
        <Path d={lutealArc} fill="none" stroke="url(#grad_luteal)" strokeWidth={PATCH_WIDTH} strokeLinecap="round" />
        {/* Menstrual (red gradient) — drawn over follicular */}
        <Path d={menstrualArc} fill="none" stroke="url(#grad_menstrual)" strokeWidth={PATCH_WIDTH} strokeLinecap="round" />
        {/* Ovulation (gold/orange) */}
        <Path d={ovulationArc} fill="none" stroke="url(#grad_ovulation)" strokeWidth={PATCH_WIDTH} strokeLinecap="round" />

        {/* Divider lines at phase boundaries */}
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

        {/* Day numbers */}
        {dayPositions.map(({ day, x, y }) => {
          if (day === safeCurrentDay) return null;
          return (
            <SvgText
              key={day}
              x={x}
              y={y + 4 * scale}
              fontSize={11 * scale}
              fontFamily="Manrope_500Medium"
              fontWeight="500"
              fill={Colors.textMuted}
              textAnchor="middle"
            >
              {day}
            </SvgText>
          );
        })}

        {/* Current day indicator */}
        {currentPos && (
          <G>
            <Circle
              cx={currentPos.x}
              cy={currentPos.y}
              r={18 * scale}
              fill={Colors.currentDay}
            />
            <SvgText
              x={currentPos.x}
              y={currentPos.y + 4 * scale}
              fontSize={12 * scale}
              fontFamily="Manrope_700Bold"
              fontWeight="700"
              fill="#FFFFFF"
              textAnchor="middle"
            >
              {safeCurrentDay}
            </SvgText>
          </G>
        )}
      </Svg>
      {currentPos && (
        <CurrentDayPulse x={currentPos.x} y={currentPos.y} scale={scale} />
      )}
    </View>
  );
}
