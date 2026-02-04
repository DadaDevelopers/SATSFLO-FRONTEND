import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { cn } from '@/lib/utils';

type SelectableOptionProps = {
  label: string;
  icon: React.ReactNode;
  selected: boolean;
  onPress: () => void;
  className?: string;
};

export function SelectableOption({
  label,
  icon,
  selected,
  onPress,
  className,
}: SelectableOptionProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className={cn('items-center justify-center', className)}
    >
      <View
        className={cn(
          'w-12 h-12 rounded-full items-center justify-center mb-1',
          selected ? 'bg-pink-200' : 'bg-transparent'
        )}
      >
        {icon}
      </View>
      <Text className="text-xs text-gray-600 text-center">{label}</Text>
    </TouchableOpacity>
  );
}
