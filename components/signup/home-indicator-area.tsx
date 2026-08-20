import React from 'react';
import { Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function HomeIndicatorArea() {
  const insets = useSafeAreaInsets();

  // Calculate bottom padding - use safe area on iOS, fixed height on Android
  const bottomPadding = Platform.OS === 'ios' ? Math.max(insets.bottom, 8) : 8;

  return (
    <View
      className="bg-signup-home-indicator-bg justify-end items-center"
      style={{ paddingBottom: bottomPadding, paddingTop: 8 }}
    />
  );
}
