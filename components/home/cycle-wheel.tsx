import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle, Defs, G, LinearGradient, Stop, Text as SvgText } from 'react-native-svg';

type CyclePhase = 'menstrual' | 'ovulation' | 'follicular' | 'luteal';

interface CycleWheelProps {
  currentDay: number;
  cycleLength: number;
  periodLength: number;
  daysUntilPeriod: number;
  currentDate: string;
  onEditPeriod?: () => void;
}

export function CycleWheel({
  currentDay,
  cycleLength = 31,
  periodLength = 5,
  daysUntilPeriod,
  currentDate,
  onEditPeriod,
}: CycleWheelProps) {
  const size = 300;
  const strokeWidth = 40;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  // Calculate phase ranges matching the SVG design
  const menstrualEnd = periodLength;
  const follicularEnd = Math.floor(cycleLength * 0.45);
  const ovulationEnd = Math.floor(cycleLength * 0.55);

  const getPhaseForDay = (day: number): CyclePhase => {
    if (day <= menstrualEnd) return 'menstrual';
    if (day <= follicularEnd) return 'follicular';
    if (day <= ovulationEnd) return 'ovulation';
    return 'luteal';
  };

  // Calculate positions for day numbers inside the ring
  const getDayPosition = (day: number, totalDays: number) => {
    const angle = ((day - 1) / totalDays) * 360 - 90;
    const radian = (angle * Math.PI) / 180;
    const labelRadius = radius; // Position at the center of the ring
    const x = center + labelRadius * Math.cos(radian);
    const y = center + labelRadius * Math.sin(radian);
    return { x, y };
  };

  return (
    <View style={styles.container}>
      <View style={{ width: size + 60, height: size + 60 }}>
        <Svg width={size + 60} height={size + 60} viewBox={`-30 -30 ${size + 60} ${size + 60}`}>
          <Defs>
            {/* Menstrual gradient - matching SVG red gradient */}
            <LinearGradient id="menstrualGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#F43B3B" />
              <Stop offset="100%" stopColor="#8E2222" />
            </LinearGradient>
            
            {/* Ovulation gradient - matching SVG yellow-orange gradient */}
            <LinearGradient id="ovulationGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#FFFF00" />
              <Stop offset="100%" stopColor="#FF8800" />
            </LinearGradient>
            
            {/* Follicular gradient - matching SVG pink gradient */}
            <LinearGradient id="follicularGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#EC59C0" />
              <Stop offset="100%" stopColor="#F7D5FF" />
            </LinearGradient>
            
            {/* Luteal gradient - matching SVG blue gradient */}
            <LinearGradient id="lutealGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#F0F0F1" />
              <Stop offset="100%" stopColor="#70A9FE" />
            </LinearGradient>
          </Defs>

          {/* Background circle */}
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke="#FFE6EE"
            strokeWidth={strokeWidth}
            fill="none"
          />

          {/* Menstrual phase */}
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke="url(#menstrualGrad)"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={`${(menstrualEnd / cycleLength) * circumference} ${circumference}`}
            strokeDashoffset={circumference * 0.25}
            strokeLinecap="butt"
          />

          {/* Follicular phase */}
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke="url(#follicularGrad)"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={`${((follicularEnd - menstrualEnd) / cycleLength) * circumference} ${circumference}`}
            strokeDashoffset={circumference * 0.25 - (menstrualEnd / cycleLength) * circumference}
            strokeLinecap="butt"
          />

          {/* Ovulation phase */}
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke="url(#ovulationGrad)"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={`${((ovulationEnd - follicularEnd) / cycleLength) * circumference} ${circumference}`}
            strokeDashoffset={circumference * 0.25 - (follicularEnd / cycleLength) * circumference}
            strokeLinecap="butt"
          />

          {/* Luteal phase */}
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke="url(#lutealGrad)"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={`${((cycleLength - ovulationEnd) / cycleLength) * circumference} ${circumference}`}
            strokeDashoffset={circumference * 0.25 - (ovulationEnd / cycleLength) * circumference}
            strokeLinecap="butt"
          />

          {/* Day numbers */}
          <G>
            {Array.from({ length: cycleLength }, (_, i) => {
              const day = i + 1;
              const { x, y } = getDayPosition(day, cycleLength);
              const isCurrentDay = day === currentDay;
              const phase = getPhaseForDay(day);

              const isInActivePhase = phase === 'menstrual' || phase === 'ovulation';
              const textColor = isInActivePhase ? '#FFFFFF' : '#7D7D7D';

              return (
                <G key={day}>
                  {isCurrentDay && (
                    <Circle
                      cx={x}
                      cy={y}
                      r={20}
                      fill="#EC59C0"
                    />
                  )}
                  <SvgText
                    x={x}
                    y={y + 4}
                    fontSize={11}
                    fontWeight="400"
                    textAnchor="middle"
                    fill={isCurrentDay ? '#FFFFFF' : textColor}
                  >
                    {day}
                  </SvgText>
                </G>
              );
            })}
          </G>

          {/* Inner circle */}
          <Circle
            cx={center}
            cy={center}
            r={radius - strokeWidth / 2 - 10}
            fill="url(#follicularGrad)"
          />
        </Svg>

        {/* Center content overlay */}
        <View className='bg-[#FF4081] font-inter' style={[styles.centerContent, {
          top: 70,
          left: 70,
          width: size - 80,
          height: size - 80,
          borderRadius: (size - 80) / 2,
        }]}>
          <Text style={styles.dateText}>
            Today: {currentDate}
          </Text>
          <Text style={styles.periodText}>
            {daysUntilPeriod} days until your{'\n'}next period
          </Text>
          <TouchableOpacity
            onPress={onEditPeriod}
            style={styles.editButton}
          >
            <Feather name="edit-2" size={10} color="#FFFFFF" />
            <Text style={styles.editButtonText}>Edit Period</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  centerContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 8,
  },
  periodText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 32,
    paddingHorizontal: 16,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius: 20,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
});