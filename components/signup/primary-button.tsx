import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  type TouchableOpacityProps,
} from 'react-native';
import { SignupColors } from '@/constants/signup-theme';

type PrimaryButtonProps = TouchableOpacityProps & {
  title: string;
};

export function PrimaryButton({ title, style, disabled, ...props }: PrimaryButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.buttonDisabled, style]}
      disabled={disabled}
      activeOpacity={0.8}
      {...props}
    >
      <Text style={[styles.buttonText, disabled && styles.buttonTextDisabled]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 10,
    width: 250,
    height: 56,
    backgroundColor: SignupColors.buttonBackground,
    borderWidth: 0.5,
    borderColor: SignupColors.buttonBorder,
    borderRadius: 1000,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 18,
    textAlign: 'center',
    color: SignupColors.titleText,
  },
  buttonTextDisabled: {
    opacity: 0.8,
  },
});
