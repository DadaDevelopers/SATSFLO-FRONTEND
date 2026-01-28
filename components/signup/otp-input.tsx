import React, { useRef, useState } from 'react';
import {
  View,
  TextInput,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
  useWindowDimensions,
} from 'react-native';
import { cn } from '@/lib/utils';

type OtpInputProps = {
  length?: number;
  value: string;
  onChange: (value: string) => void;
};

export function OtpInput({ length = 4, value, onChange }: OtpInputProps) {
  const { width } = useWindowDimensions();
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  // Calculate responsive size based on screen width
  // Leave space for padding (32px total) and gaps between inputs
  const availableWidth = width - 64; // 32px padding on each side
  const gapWidth = 12 * (length - 1); // 12px gap between inputs
  const boxSize = Math.min(Math.floor((availableWidth - gapWidth) / length), 64);

  const handleChange = (text: string, index: number) => {
    // Only allow digits
    const digit = text.replace(/[^0-9]/g, '').slice(-1);

    // Create new value array
    const newValue = value.split('');
    newValue[index] = digit;

    // Update value
    const newValueString = newValue.join('').slice(0, length);
    onChange(newValueString);

    // Move to next input if digit entered
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number
  ) => {
    if (e.nativeEvent.key === 'Backspace') {
      if (!value[index] && index > 0) {
        // Move to previous input if current is empty
        inputRefs.current[index - 1]?.focus();

        // Clear previous input
        const newValue = value.split('');
        newValue[index - 1] = '';
        onChange(newValue.join(''));
      }
    }
  };

  const handleFocus = (index: number) => {
    setFocusedIndex(index);
  };

  const handleBlur = () => {
    setFocusedIndex(null);
  };

  return (
    <View className="flex-row justify-center items-center gap-3 w-full">
      {Array.from({ length }).map((_, index) => (
        <View
          key={index}
          className={cn(
            'rounded-xl bg-signup-input-bg border border-signup-input-border justify-center items-center',
            focusedIndex === index && 'border-2 border-signup-title',
            value[index] && 'bg-[#FFE0EB]'
          )}
          style={{ width: boxSize, height: boxSize }}
        >
          <TextInput
            ref={(ref) => (inputRefs.current[index] = ref)}
            className="text-xl font-semibold text-signup-bg text-center w-full h-full"
            value={value[index] || ''}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            onFocus={() => handleFocus(index)}
            onBlur={handleBlur}
            keyboardType="number-pad"
            maxLength={1}
            selectTextOnFocus
          />
        </View>
      ))}
    </View>
  );
}
