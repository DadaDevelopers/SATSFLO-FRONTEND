import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const { width } = Dimensions.get('window');

type TopTab = 'Threads' | 'Chats' | 'Groups';

interface ChatListHeaderProps {
  activeTab: TopTab;
  onTabChange: (tab: TopTab) => void;
}

export function ChatListHeader({ activeTab, onTabChange }: ChatListHeaderProps) {
  return (
    <View style={styles.headerContainer}>
      {/* Tab Labels - sits above the SVG */}
      <View style={styles.tabWrapper}>
        {(['Threads', 'Chats', 'Groups'] as TopTab[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => onTabChange(tab)}
            style={styles.tabItem}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab ? styles.activeText : styles.inactiveText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* SVG Scoop curve - creates the dipped/concave shape for center tab */}
      <View style={styles.svgAbsolute}>
        <Svg height="100" width={width} viewBox={`0 0 ${width} 100`}>
          <Path
            d={`M0,0
                L${width * 0.3},0
                C${width * 0.38},0 ${width * 0.4},45 ${width * 0.5},45
                C${width * 0.6},45 ${width * 0.62},0 ${width * 0.7},0
                L${width},0
                L${width},100
                L0,100 Z`}
            fill="#FF4081"
          />
        </Svg>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#FFC1D6',
    height: 130,
    justifyContent: 'flex-end',
  },
  tabWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    zIndex: 30,
    paddingBottom: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '700',
  },
  inactiveText: {
    color: '#FFFFFF',
  },
  activeText: {
    color: '#FF4081',
    marginBottom: 70,
  },
  svgAbsolute: {
    position: 'absolute',
    bottom: -1,
    left: 0,
    right: 0,
  },
});
