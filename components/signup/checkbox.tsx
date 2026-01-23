import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { SignupColors } from '@/constants/signup-theme';

type CheckboxProps = {
  checked: boolean;
  onToggle: () => void;
  label: string;
};

export function Checkbox({ checked, onToggle, label }: CheckboxProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onToggle}
      activeOpacity={0.7}
    >
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked && (
          <View style={styles.checkmark}>
            <View style={styles.checkmarkShort} />
            <View style={styles.checkmarkLong} />
          </View>
        )}
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderColor: SignupColors.checkboxBorder,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: SignupColors.buttonBorder,
    borderColor: SignupColors.buttonBorder,
  },
  checkmark: {
    width: 12,
    height: 10,
    position: 'relative',
  },
  checkmarkShort: {
    position: 'absolute',
    width: 5,
    height: 2,
    backgroundColor: SignupColors.titleText,
    bottom: 3,
    left: 0,
    transform: [{ rotate: '45deg' }],
  },
  checkmarkLong: {
    position: 'absolute',
    width: 10,
    height: 2,
    backgroundColor: SignupColors.titleText,
    bottom: 4,
    left: 3,
    transform: [{ rotate: '-45deg' }],
  },
  label: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 18,
    color: SignupColors.bodyText,
  },
});
