import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
} from 'react-native-reanimated';
import { cn } from '@/lib/utils';

type CollapsibleSectionProps = {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  className?: string;
};

export function CollapsibleSection({
  title,
  children,
  defaultExpanded = false,
  className,
}: CollapsibleSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const rotation = useSharedValue(defaultExpanded ? 90 : 0);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
    rotation.value = withTiming(isExpanded ? 0 : 90, { duration: 200 });
  };

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View
      className={cn(
        'bg-white rounded-2xl overflow-hidden',
        className
      )}
    >
      <TouchableOpacity
        onPress={toggleExpanded}
        activeOpacity={0.7}
        className="flex-row justify-between items-center px-4 py-3"
      >
        <Text className="text-base font-medium text-gray-800">{title}</Text>
        <Animated.View style={chevronStyle}>
          <Text className="text-gray-400 text-lg">{'>'}</Text>
        </Animated.View>
      </TouchableOpacity>

      {isExpanded && (
        <View className="px-4 pb-4">
          {children}
        </View>
      )}
    </View>
  );
}
