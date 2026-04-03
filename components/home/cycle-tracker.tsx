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

function dayStartAngle(day: number, totalDays: number): number {
  return -90 + (day - 1) * (360 / totalDays);
}

function dayMidAngle(day: number, totalDays: number): number {
  return -90 + (day - 0.5) * (360 / totalDays);
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

function getFontWeight(day: number, currentDay: number): string {
  if (day === currentDay) return "700";
  return "500";
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
  periodLength: number;
  cycleStartDate?: Date;
  size?: number;
}

export function CycleTracker({ currentDay, cycleLength = 28, periodLength = 5, cycleStartDate, size = 320 }: CycleTrackerProps) {
  const scale = size / 320;
  const CX = size / 2;
  const CY = size / 2;
  const RING_WIDTH = 38 * scale;
  const PATCH_WIDTH = RING_WIDTH;
  const PATH_RADIUS = 131 * scale;
  const CAP_ANGLE = (PATCH_WIDTH / 2) / PATH_RADIUS * (180 / Math.PI);
  const RING_CAP_ANGLE = (RING_WIDTH / 2) / PATH_RADIUS * (180 / Math.PI);
  const RING_GAP_ANGLE = 3 + RING_CAP_ANGLE;
  const DIVIDER_RADIUS = 106 * scale;
  const DIVIDER_WIDTH = 3.5 * scale;
  const INNER_CIRCLE_RADIUS = PATH_RADIUS - RING_WIDTH / 2 - 12 * scale;

  // Dynamic phase boundaries based on user's cycle/period data
  const menstrualEnd = periodLength;                          // e.g. day 1-5
  const ovulationStart = Math.round(cycleLength / 2) - 1;    // e.g. day 13
  const ovulationEnd = ovulationStart + 2;                   // e.g. day 15
  const lutealStart = ovulationEnd + 1;                      // e.g. day 16
  // Divider sits between follicular+ovulation half and luteal half
  const dividerDay = lutealStart;

  // If cycleStartDate is provided, show real calendar day-of-month numbers
  const getLabel = (cycleDay: number): number => {
    if (!cycleStartDate) return cycleDay;
    const d = new Date(cycleStartDate);
    d.setDate(cycleStartDate.getDate() + (cycleDay - 1));
    return d.getDate();
  };

  const dayPositions = [];
  for (let day = 1; day <= cycleLength; day++) {
    const angle = dayMidAngle(day, cycleLength);
    const pos = polarToXY(CX, CY, PATH_RADIUS, angle);
    dayPositions.push({ day, label: getLabel(day), x: pos.x, y: pos.y });
  }

  const currentPos = dayPositions.find((d) => d.day === currentDay);

  // Phase arcs — follicular base covers days 1 to ovulationEnd (pink background)
  const follicularBaseArc = createArc(CX, CY, PATH_RADIUS, dayStartAngle(1, cycleLength) + CAP_ANGLE, dayStartAngle(dividerDay, cycleLength) - CAP_ANGLE);
  const menstrualArc = createArc(CX, CY, PATH_RADIUS, dayStartAngle(1, cycleLength) + CAP_ANGLE, dayStartAngle(menstrualEnd + 1, cycleLength) - CAP_ANGLE);
  const ovulationArc = createArc(CX, CY, PATH_RADIUS, dayStartAngle(ovulationStart, cycleLength) + CAP_ANGLE, dayStartAngle(dividerDay, cycleLength) - CAP_ANGLE);

  // Divider gradient lines between the two halves
  const folStart = dayStartAngle(1, cycleLength) + GAP_ANGLE / 2;
  const folEnd = dayStartAngle(dividerDay, cycleLength) - GAP_ANGLE / 2;
  const folMid = (folStart + folEnd) / 2;
  const lutStart = dayStartAngle(dividerDay, cycleLength) + GAP_ANGLE / 2;
  const lutEnd = dayStartAngle(1, cycleLength) + 360 - GAP_ANGLE / 2;
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

        {/* Phase arcs */}
        <Path d={follicularBaseArc} fill="none" stroke="#FFCCDD" strokeWidth={PATCH_WIDTH} strokeLinecap="round" />
        <Path d={menstrualArc} fill="none" stroke="url(#grad_menstrual)" strokeWidth={PATCH_WIDTH} strokeLinecap="round" />
        <Path d={ovulationArc} fill="none" stroke="url(#grad_ovulation)" strokeWidth={PATCH_WIDTH} strokeLinecap="round" />

        {/* Divider lines */}
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
        {dayPositions.map(({ day, label, x, y }) => {
          if (day === currentDay) return null;
          const inMenstrual = day >= 1 && day <= menstrualEnd;
          const inOvulation = day >= ovulationStart && day <= ovulationEnd;
          const textColor = (inMenstrual || inOvulation) ? "#FFFFFF" : Colors.textMuted;
          return (
            <SvgText
              key={day}
              x={x}
              y={y + 4 * scale}
              fontSize={11 * scale}
              fontFamily="Manrope_500Medium"
              fontWeight={getFontWeight(day, currentDay)}
              fill={textColor}
              textAnchor="middle"
            >
              {label}
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
              {currentPos.label}
            </SvgText>
          </G>
        )}
      </Svg>
      {currentPos && <CurrentDayPulse x={currentPos.x} y={currentPos.y} scale={scale} />}
    </View>
  );
}
