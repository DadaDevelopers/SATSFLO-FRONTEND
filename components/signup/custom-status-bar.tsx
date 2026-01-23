import React from 'react';
import { StyleSheet, View, Text, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SignupColors } from '@/constants/signup-theme';

export function CustomStatusBar() {
  const insets = useSafeAreaInsets();

  // Only show custom status bar on iOS with notch
  if (Platform.OS !== 'ios' || insets.top < 44) {
    return null;
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top - 37 }]}>
      {/* Left Side - Time */}
      <View style={styles.leftSide}>
        <Text style={styles.time}>9:41</Text>
      </View>

      {/* Center - Dynamic Island */}
      <View style={styles.centerSide}>
        <View style={styles.dynamicIsland} />
      </View>

      {/* Right Side - Icons */}
      <View style={styles.rightSide}>
        <View style={styles.iconsContainer}>
          {/* Signal Bars */}
          <View style={styles.signalContainer}>
            <View style={[styles.signalBar, styles.signalBar1]} />
            <View style={[styles.signalBar, styles.signalBar2]} />
            <View style={[styles.signalBar, styles.signalBar3]} />
            <View style={[styles.signalBar, styles.signalBar4]} />
          </View>

          {/* WiFi */}
          <View style={styles.wifiContainer}>
            <View style={styles.wifiArc1} />
            <View style={styles.wifiArc2} />
            <View style={styles.wifiDot} />
          </View>

          {/* Battery */}
          <View style={styles.batteryContainer}>
            <View style={styles.batteryOutline}>
              <View style={styles.batteryFill} />
            </View>
            <View style={styles.batteryTip} />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    height: 59,
    backgroundColor: '#FFFFFF',
  },
  leftSide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 10,
    paddingBottom: 3,
  },
  time: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.32,
    color: '#090909',
  },
  centerSide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dynamicIsland: {
    width: 125,
    height: 37,
    backgroundColor: SignupColors.homeIndicator,
    borderRadius: 100,
  },
  rightSide: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 11,
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  // Signal bars
  signalContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 1,
    height: 12,
  },
  signalBar: {
    width: 3,
    backgroundColor: '#090909',
    borderRadius: 1,
  },
  signalBar1: {
    height: 4,
  },
  signalBar2: {
    height: 6,
  },
  signalBar3: {
    height: 9,
  },
  signalBar4: {
    height: 12,
  },
  // WiFi
  wifiContainer: {
    width: 17,
    height: 12,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  wifiArc1: {
    position: 'absolute',
    top: 0,
    width: 17,
    height: 9,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderWidth: 2,
    borderBottomWidth: 0,
    borderColor: '#090909',
  },
  wifiArc2: {
    position: 'absolute',
    top: 4,
    width: 11,
    height: 6,
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
    borderWidth: 2,
    borderBottomWidth: 0,
    borderColor: '#090909',
  },
  wifiDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#090909',
  },
  // Battery
  batteryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  batteryOutline: {
    width: 25,
    height: 13,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(9, 9, 9, 0.35)',
    padding: 2,
    justifyContent: 'center',
  },
  batteryFill: {
    flex: 1,
    backgroundColor: '#090909',
    borderRadius: 2,
  },
  batteryTip: {
    width: 1.4,
    height: 4,
    backgroundColor: 'rgba(9, 9, 9, 0.4)',
    marginLeft: 1,
    borderRadius: 1,
  },
});
