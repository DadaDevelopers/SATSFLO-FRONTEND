import React from 'react';
import { View, useWindowDimensions, ViewStyle, StyleSheet } from 'react-native';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  maxWidth?: number;
  className?: string;
  style?: ViewStyle;
  centerOnDesktop?: boolean;
}

/**
 * A responsive container that centers content and constrains max-width on larger screens.
 * On mobile, it takes full width. On desktop/tablet, it centers with a max-width.
 */
export function ResponsiveContainer({
  children,
  maxWidth = 480,
  className = '',
  style,
  centerOnDesktop = true,
}: ResponsiveContainerProps) {
  const { width } = useWindowDimensions();
  const isDesktop = width > maxWidth;

  return (
    <View
      className={`flex-1 ${className}`}
      style={[
        isDesktop && centerOnDesktop
          ? {
              maxWidth,
              width: '100%',
              alignSelf: 'center',
            }
          : undefined,
        style,
      ]}
    >
      {children}
    </View>
  );
}

/**
 * A wrapper for screens that provides responsive behavior with background.
 * Useful for screens where you want the background to extend full width
 * but content to be constrained.
 */
export function ResponsiveScreen({
  children,
  maxWidth = 480,
  backgroundColor = '#FF4081',
  className = '',
}: {
  children: React.ReactNode;
  maxWidth?: number;
  backgroundColor?: string;
  className?: string;
}) {
  const { width } = useWindowDimensions();
  const isDesktop = width > maxWidth;

  if (!isDesktop) {
    return (
      <View className={`flex-1 ${className}`} style={{ backgroundColor }}>
        {children}
      </View>
    );
  }

  return (
    <View className="flex-1 flex-row" style={{ backgroundColor: '#f5f5f5' }}>
      {/* Centered content container */}
      <View
        style={{
          flex: 1,
          maxWidth,
          alignSelf: 'center',
          marginHorizontal: 'auto',
          backgroundColor,
          minHeight: '100%',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 5,
        }}
      >
        {children}
      </View>
    </View>
  );
}

/**
 * Hook to get responsive values based on screen width
 */
export function useResponsive() {
  const { width, height } = useWindowDimensions();

  return {
    width,
    height,
    isMobile: width < 640,
    isTablet: width >= 640 && width < 1024,
    isDesktop: width >= 1024,
    // Helper to get different values based on screen size
    responsive: <T,>(mobile: T, tablet?: T, desktop?: T): T => {
      if (width >= 1024 && desktop !== undefined) return desktop;
      if (width >= 640 && tablet !== undefined) return tablet;
      return mobile;
    },
  };
}
