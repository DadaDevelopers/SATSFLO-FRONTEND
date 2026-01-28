import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { cn } from '@/lib/utils';

type CheckboxProps = {
  checked: boolean;
  onToggle: () => void;
  label: string;
  className?: string;
};

export function Checkbox({ checked, onToggle, label, className }: CheckboxProps) {
  return (
    <TouchableOpacity
      className={cn('flex-row items-center gap-1', className)}
      onPress={onToggle}
      activeOpacity={0.7}
    >
      <View
        className={cn(
          'w-5 h-5 border-[1.5px] border-signup-checkbox-border rounded justify-center items-center',
          checked && 'bg-signup-button-border border-signup-button-border'
        )}
      >
        {checked && (
          <View className="w-3 h-[10px] relative">
            {/* Checkmark short line */}
            <View
              className="absolute w-[5px] h-0.5 bg-signup-title bottom-[3px] left-0"
              style={{ transform: [{ rotate: '45deg' }] }}
            />
            {/* Checkmark long line */}
            <View
              className="absolute w-[10px] h-0.5 bg-signup-title bottom-1 left-[3px]"
              style={{ transform: [{ rotate: '-45deg' }] }}
            />
          </View>
        )}
      </View>
      <Text className="text-xs font-normal leading-[18px] text-signup-body">{label}</Text>
    </TouchableOpacity>
  );
}
