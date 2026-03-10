import React from 'react';
import { View, Text } from 'react-native';

type TitleSectionProps = {
  title: string;
  subtitle: string;
  stepIndicator?: string;
  className?: string;
};

export function TitleSection({
  title,
  subtitle,
  stepIndicator,
  className = 'mb-5',
}: TitleSectionProps) {
  return (
    <View className={`gap-1 ${className}`}>
      <View className="flex-row justify-between items-center">
        <Text className="text-2xl font-semibold leading-[29px] text-signup-title flex-1">
          {title}
        </Text>
        {stepIndicator && (
          <Text className="text-lg font-semibold text-signup-title">{stepIndicator}</Text>
        )}
      </View>
      <Text className="text-base font-normal leading-6 text-signup-body">{subtitle}</Text>
    </View>
  );
}
