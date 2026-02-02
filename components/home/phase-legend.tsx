import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Feather } from '@expo/vector-icons';

interface PhaseItemProps {
  label: string;
  gradientId: string;
  gradientColors: { start: string; end: string };
  startPercent?: string;
  endPercent?: string;
}

function PhaseItem({ label, gradientId, gradientColors, startPercent = '0%', endPercent = '100%' }: PhaseItemProps) {
  return (
    <View className="flex-row items-center gap-1">
      <Svg width={18} height={18}>
        <Defs>
          <LinearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset={startPercent} stopColor={gradientColors.start} />
            <Stop offset={endPercent} stopColor={gradientColors.end} />
          </LinearGradient>
        </Defs>
        <Circle cx={9} cy={9} r={9} fill={`url(#${gradientId})`} />
      </Svg>
      <Text className="text-white text-[13px] font-medium">{label}</Text>
      <Feather name="info" size={9} color="#FAFAFA" />
    </View>
  );
}

export function PhaseLegend() {
  return (
    <View className="flex-row flex-wrap justify-between px-4 mt-6">
      {/* Left column */}
      <View className="gap-5">
        <PhaseItem
          label="MenstrualPhase"
          gradientId="menstrualLegend"
          gradientColors={{ start: '#F43B3B', end: '#8E2222' }}
          startPercent="26.79%"
          endPercent="69.67%"
        />
        <PhaseItem
          label="Ovulation Phase"
          gradientId="ovulationLegend"
          gradientColors={{ start: '#FFFF00', end: '#FF8800' }}
          startPercent="13.59%"
          endPercent="92.99%"
        />
      </View>

      {/* Right column */}
      <View className="gap-5">
        <PhaseItem
          label="Follicular Phase"
          gradientId="follicularLegend"
          gradientColors={{ start: '#EC59C0', end: '#F7D5FF' }}
          startPercent="9.32%"
          endPercent="89.06%"
        />
        <PhaseItem
          label="Luteal Phase"
          gradientId="lutealLegend"
          gradientColors={{ start: '#F0F0F1', end: '#70A9FE' }}
          startPercent="10.58%"
          endPercent="90.95%"
        />
      </View>
    </View>
  );
}
