import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from 'react-native';
import { SignupColors } from '@/constants/signup-theme';

type OtpInputProps = {
  length?: number;
  value: string;
  onChange: (value: string) => void;
};

export function OtpInput({ length = 4, value, onChange }: OtpInputProps) {
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

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
    <View style={styles.container}>
      {Array.from({ length }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.inputContainer,
            focusedIndex === index && styles.inputContainerFocused,
            value[index] && styles.inputContainerFilled,
          ]}
        >
          <TextInput
            ref={(ref) => (inputRefs.current[index] = ref)}
            style={styles.input}
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

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  inputContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: SignupColors.inputBackground,
    borderWidth: 1,
    borderColor: SignupColors.inputBorder,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainerFocused: {
    borderColor: SignupColors.titleText,
    borderWidth: 2,
  },
  inputContainerFilled: {
    backgroundColor: '#FFE0EB',
  },
  input: {
    fontSize: 24,
    fontWeight: '600',
    color: SignupColors.background,
    textAlign: 'center',
    width: '100%',
    height: '100%',
  },
});
