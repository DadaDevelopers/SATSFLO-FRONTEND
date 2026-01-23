import React, { useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SignupColors } from '@/constants/signup-theme';

type DayPickerProps = {
  values: number[];
  selectedValue: number;
  onValueChange: (value: number) => void;
  suffix?: string;
};

const ITEM_HEIGHT = 70;
const VISIBLE_ITEMS = 3;

export function DayPicker({
  values,
  selectedValue,
  onValueChange,
  suffix = 'days',
}: DayPickerProps) {
  const scrollViewRef = useRef<ScrollView>(null);
  const selectedIndex = values.indexOf(selectedValue);

  useEffect(() => {
    if (scrollViewRef.current && selectedIndex >= 0) {
      scrollViewRef.current.scrollTo({
        y: selectedIndex * ITEM_HEIGHT,
        animated: false,
      });
    }
  }, []);

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    if (index >= 0 && index < values.length && values[index] !== selectedValue) {
      onValueChange(values[index]);
    }
  };

  const handleItemPress = (value: number) => {
    const index = values.indexOf(value);
    if (scrollViewRef.current && index >= 0) {
      scrollViewRef.current.scrollTo({
        y: index * ITEM_HEIGHT,
        animated: true,
      });
    }
    onValueChange(value);
  };

  return (
    <View style={styles.container}>
      {/* Selection highlight */}
      <View style={styles.selectionHighlight} />

      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        onMomentumScrollEnd={handleScroll}
      >
        {/* Top padding */}
        <View style={styles.padding} />

        {values.map((value) => {
          const isSelected = value === selectedValue;
          return (
            <TouchableOpacity
              key={value}
              style={styles.item}
              onPress={() => handleItemPress(value)}
              activeOpacity={0.7}
            >
              <Text style={[styles.itemText, isSelected && styles.selectedText]}>
                {value} {suffix}
              </Text>
              {isSelected && (
                <View style={styles.checkIcon}>
                  <CheckmarkIcon />
                </View>
              )}
            </TouchableOpacity>
          );
        })}

        {/* Bottom padding */}
        <View style={styles.padding} />
      </ScrollView>
    </View>
  );
}

function CheckmarkIcon() {
  return (
    <View style={checkStyles.container}>
      <View style={checkStyles.circle}>
        <View style={checkStyles.checkmark}>
          <View style={checkStyles.short} />
          <View style={checkStyles.long} />
        </View>
      </View>
    </View>
  );
}

const checkStyles = StyleSheet.create({
  container: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    width: 12,
    height: 9,
    position: 'relative',
  },
  short: {
    position: 'absolute',
    width: 5,
    height: 2,
    backgroundColor: '#4CAF50',
    bottom: 2,
    left: 0,
    transform: [{ rotate: '45deg' }],
  },
  long: {
    position: 'absolute',
    width: 9,
    height: 2,
    backgroundColor: '#4CAF50',
    bottom: 3,
    left: 2,
    transform: [{ rotate: '-45deg' }],
  },
});

const styles = StyleSheet.create({
  container: {
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    backgroundColor: SignupColors.pickerBackground,
    borderWidth: 0.5,
    borderColor: SignupColors.pickerBorder,
    borderRadius: 12,
    overflow: 'hidden',
  },
  selectionHighlight: {
    position: 'absolute',
    top: ITEM_HEIGHT,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    backgroundColor: SignupColors.selectedItemBackground,
    zIndex: 0,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
  },
  padding: {
    height: ITEM_HEIGHT,
  },
  item: {
    height: ITEM_HEIGHT,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  itemText: {
    fontSize: 16,
    fontWeight: '400',
    color: SignupColors.placeholderText,
  },
  selectedText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  checkIcon: {
    position: 'absolute',
    right: 40,
  },
});
