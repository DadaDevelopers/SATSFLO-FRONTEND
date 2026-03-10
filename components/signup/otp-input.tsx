import React, { useRef, useState } from 'react';
import {
  View,
  TextInput,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from 'react-native';

type OtpInputProps = {
  length?: number;
  value: string;
  onChange: (value: string) => void;
};

export function OtpInput({ length = 4, value, onChange }: OtpInputProps) {
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  const handleChange = (text: string, index: number) => {
    const digit = text.replace(/[^0-9]/g, '').slice(-1);
    const newValue = value.split('');
    newValue[index] = digit;
    const newValueString = newValue.join('').slice(0, length);
    onChange(newValueString);
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
        inputRefs.current[index - 1]?.focus();
        const newValue = value.split('');
        newValue[index - 1] = '';
        onChange(newValue.join(''));
      }
    }
  };

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 12, width: '100%' }}>
      {Array.from({ length }).map((_, index) => (
        <View
          key={index}
          style={{
            width: 55,
            height: 64,
            borderRadius: 24,
            backgroundColor: focusedIndex === index ? '#FFCAD9' : '#F4DBE3',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <TextInput
            ref={(ref) => { inputRefs.current[index] = ref; }}
            style={{
              width: '100%',
              height: '100%',
              textAlign: 'center',
              fontSize: 24,
              fontWeight: '600',
              color: '#FF4081',
              padding: 0,
            }}
            value={value[index] || ''}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            onFocus={() => setFocusedIndex(index)}
            onBlur={() => setFocusedIndex(null)}
            keyboardType="number-pad"
            maxLength={1}
            selectTextOnFocus
          />
        </View>
      ))}
    </View>
  );
}
