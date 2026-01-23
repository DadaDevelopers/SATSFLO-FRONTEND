import React, { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
  type TextInputProps,
} from 'react-native';
import { SignupColors } from '@/constants/signup-theme';

type InputFieldProps = TextInputProps & {
  showPasswordToggle?: boolean;
};

export function InputField({
  showPasswordToggle = false,
  secureTextEntry,
  style,
  ...props
}: InputFieldProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, style]}
        placeholderTextColor={SignupColors.placeholderText}
        secureTextEntry={showPasswordToggle ? !isPasswordVisible : secureTextEntry}
        {...props}
      />
      {showPasswordToggle && (
        <TouchableOpacity
          style={styles.eyeButton}
          onPress={togglePasswordVisibility}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <EyeIcon visible={isPasswordVisible} />
        </TouchableOpacity>
      )}
    </View>
  );
}

function EyeIcon({ visible }: { visible: boolean }) {
  return (
    <View style={styles.eyeIcon}>
      {/* Eye shape */}
      <View style={[styles.eyeOuter, visible && styles.eyeOuterVisible]}>
        <View style={styles.eyeInner} />
      </View>
      {/* Strike through line when hidden */}
      {!visible && <View style={styles.eyeStrike} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SignupColors.inputBackground,
    borderWidth: 0.5,
    borderColor: SignupColors.inputBorder,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 19,
    width: '100%',
    height: 58,
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    color: '#333333',
    padding: 0,
  },
  eyeButton: {
    padding: 4,
  },
  eyeIcon: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyeOuter: {
    width: 18,
    height: 12,
    borderWidth: 1.5,
    borderColor: SignupColors.placeholderText,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyeOuterVisible: {
    borderColor: '#333333',
  },
  eyeInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: SignupColors.placeholderText,
  },
  eyeStrike: {
    position: 'absolute',
    width: 22,
    height: 1.5,
    backgroundColor: SignupColors.placeholderText,
    transform: [{ rotate: '45deg' }],
  },
});
