import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SignupColors } from '@/constants/signup-theme';

type BackButtonProps = {
  onPress?: () => void;
};

export function BackButton({ onPress }: BackButtonProps) {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.back();
    }
  };

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={handlePress}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <View style={styles.arrow}>
        <View style={styles.arrowLine} />
        <View style={styles.arrowHeadTop} />
        <View style={styles.arrowHeadBottom} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrow: {
    width: 18,
    height: 15,
    justifyContent: 'center',
  },
  arrowLine: {
    width: 16,
    height: 2,
    backgroundColor: SignupColors.titleText,
    borderRadius: 1,
  },
  arrowHeadTop: {
    position: 'absolute',
    width: 8,
    height: 2,
    backgroundColor: SignupColors.titleText,
    borderRadius: 1,
    left: 0,
    top: 2,
    transform: [{ rotate: '-45deg' }, { translateX: -1 }],
  },
  arrowHeadBottom: {
    position: 'absolute',
    width: 8,
    height: 2,
    backgroundColor: SignupColors.titleText,
    borderRadius: 1,
    left: 0,
    bottom: 2,
    transform: [{ rotate: '45deg' }, { translateX: -1 }],
  },
});
