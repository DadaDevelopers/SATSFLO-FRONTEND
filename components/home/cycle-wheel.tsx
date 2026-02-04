import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, {
  Circle,
  Defs,
  G,
  LinearGradient,
  Path,
  Stop,
  Text as SvgText,
} from 'react-native-svg';

/* ---------------- types ---------------- */

type CyclePhase = 'menstrual' | 'follicular' | 'ovulation' | 'luteal';

interface CycleWheelProps {
  currentDay: number;
  cycleLength: number;
  periodLength: number;
  daysUntilPeriod: number;
  currentDate: string;
  onEditPeriod?: () => void;
}

/* ---------------- helpers ---------------- */

const polarToCartesian = (
  cx: number,
  cy: number,
  radius: number,
  angle: number
) => {
  const rad = ((angle - 90) * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(rad),
    y: cy + radius * Math.sin(rad),
  };
};

const createArcPath = (
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  endAngle: number
) => {
  const start = polarToCartesian(cx, cy, radius, endAngle);
  const end = polarToCartesian(cx, cy, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

  return `M ${start.x} ${start.y}
          A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
};

/* ---------------- component ---------------- */

export function CycleWheel({
  currentDay,
  cycleLength = 31,
  periodLength = 5,
  daysUntilPeriod,
  currentDate,
  onEditPeriod,
}: CycleWheelProps) {
  const SIZE = 320;
  const STROKE = 36;
  const RADIUS = (SIZE - STROKE) / 2;
  const CENTER = SIZE / 2;

  /* ---- phase boundaries (DESIGN MATCHED) ---- */

  const OVULATION_LENGTH = 2;

  const menstrualEnd = periodLength;
  const ovulationStart = Math.floor(cycleLength / 2) - 1;
  const ovulationEnd = ovulationStart + OVULATION_LENGTH;
  const follicularEnd = ovulationStart - 1;

  const getPhaseForDay = (day: number): CyclePhase => {
    if (day <= menstrualEnd) return 'menstrual';
    if (day <= follicularEnd) return 'follicular';
    if (day <= ovulationEnd) return 'ovulation';
    return 'luteal';
  };

  const createPhaseArc = (startDay: number, endDay: number) => {
    const startAngle = ((startDay - 1) / cycleLength) * 360 - 90;
    const endAngle = (endDay / cycleLength) * 360 - 90;
    return createArcPath(CENTER, CENTER, RADIUS, startAngle, endAngle);
  };

  const getDayPosition = (day: number) => {
    const angle = ((day - 1) / cycleLength) * 360 - 90;
    const rad = (angle * Math.PI) / 180;
    return {
      x: CENTER + (RADIUS + 2) * Math.cos(rad),
      y: CENTER + (RADIUS + 2) * Math.sin(rad),
    };
  };

  return (
    <View style={styles.container}>
      <Svg width={SIZE} height={SIZE}>
        <Defs>
          <LinearGradient id="menstrualGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#F43B3B" />
            <Stop offset="100%" stopColor="#8E2222" />
          </LinearGradient>

          <LinearGradient id="follicularGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#EC59C0" />
            <Stop offset="100%" stopColor="#F7D5FF" />
          </LinearGradient>

          <LinearGradient id="ovulationGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#FFD700" />
            <Stop offset="100%" stopColor="#FF8C00" />
          </LinearGradient>

          <LinearGradient id="lutealGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#F0F0F1" />
            <Stop offset="100%" stopColor="#70A9FE" />
          </LinearGradient>
        </Defs>

        {/* Base ring */}
        <Circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          stroke="#FFE6EE"
          strokeWidth={STROKE}
          fill="none"
        />

        {/* Phase arcs */}
        <Path d={createPhaseArc(1, menstrualEnd)} stroke="url(#menstrualGrad)" strokeWidth={STROKE} strokeLinecap="round" fill="none" />
        <Path d={createPhaseArc(menstrualEnd + 1, follicularEnd)} stroke="url(#follicularGrad)" strokeWidth={STROKE} strokeLinecap="round" fill="none" />
        <Path d={createPhaseArc(ovulationStart, ovulationEnd)} stroke="url(#ovulationGrad)" strokeWidth={STROKE} strokeLinecap="round" fill="none" />
        <Path d={createPhaseArc(ovulationEnd + 1, cycleLength)} stroke="url(#lutealGrad)" strokeWidth={STROKE} strokeLinecap="round" fill="none" />

        {/* Day numbers */}
        <G>
          {Array.from({ length: cycleLength }).map((_, i) => {
            const day = i + 1;
            const { x, y } = getDayPosition(day);
            const isToday = day === currentDay;

            return (
              <G key={day}>
                {isToday && <Circle cx={x} cy={y} r={18} fill="#EC59C0" />}
                <SvgText
                  x={x}
                  y={y + 4}
                  fontSize={11}
                  textAnchor="middle"
                  fill={isToday ? '#FFF' : '#7D7D7D'}
                >
                  {day}
                </SvgText>
              </G>
            );
          })}
        </G>

        {/* Inner circle */}
        <Circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS - STROKE / 2 - 12}
          fill="#FF4F8B"
        />
      </Svg>

      {/* Center content */}
      <View style={styles.center}>
        <Text style={styles.date}>Today: {currentDate}</Text>
        <Text style={styles.days}>
          {daysUntilPeriod} days until your{'\n'}next period
        </Text>

        <TouchableOpacity style={styles.button} onPress={onEditPeriod}>
          <Feather name="edit-2" size={12} color="#FFF" />
          <Text style={styles.buttonText}>Edit Period</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ---------------- styles ---------------- */

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  center: {
    position: 'absolute',
    alignItems: 'center',
  },
  date: {
    color: '#FFF',
    fontSize: 12,
    marginBottom: 6,
  },
  days: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 30,
  },
  button: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  buttonText: {
    color: '#FFF',
    marginLeft: 6,
    fontSize: 12,
  },
});