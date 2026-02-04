import { BlurView } from 'expo-blur';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Modal, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';

const GradientStar = ({ size = 16 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <Defs>
      <LinearGradient id="starGradient" x1="6.08" y1="0.4" x2="14.3467" y2="4.21333" gradientUnits="userSpaceOnUse">
        <Stop stopColor="#F43B3B" />
        <Stop offset="1" stopColor="#8E2222" />
      </LinearGradient>
    </Defs>
    <Path
      d="M8 0L9.79611 5.52786H15.6085L10.9062 8.94427L12.7023 14.4721L8 11.0557L3.29772 14.4721L5.09383 8.94427L0.391548 5.52786H6.20389L8 0Z"
      fill="url(#starGradient)"
    />
  </Svg>
);

interface MenstrualPhaseModalProps {
  visible: boolean;
  onClose: () => void;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const OFFSET_Y = 248;

export function MenstrualPhaseModal({ visible, onClose }: MenstrualPhaseModalProps) {
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  const bulletPoints = [
    'Varies, typically 3-7 day(s).',
    'Your period starts.',
    'The uterus sheds it\'s lining, causing bleeding.',
    'Hormones like estrogen and progesterone are at their lowest levels.',
    'You may feel cramps, fatigue, or mood changes.',
  ];

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    } else {
      slideAnim.setValue(SCREEN_HEIGHT);
    }
  }, [visible, slideAnim]);

  const handleClose = () => {
    Animated.timing(slideAnim, {
      toValue: SCREEN_HEIGHT,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.container}>
          {/* Blurred overlay background */}
          <BlurView
            intensity={7}
            tint="dark"
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.overlay} />

          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.modalContent,
                { transform: [{ translateY: Animated.add(slideAnim, new Animated.Value(OFFSET_Y))}] }
              ]}
            >
              
              <View className="bg-[#FFE5EE] rounded-3xl px-6 pt-8 pb-10 w-full shadow-lg">
                {/* Header with stars and title */}
                <View className="items-center mb-4">
                  <View className="w-12 h-1 bg-[#E84C8A] rounded-full mx-auto mb-6"></View>
                  <View className="flex-row items-center justify-center gap-2">
                    <GradientStar size={16} />
                    <Text className="text-[#171717] text-2xl font-bold font-inter">
                      Menstrual Phase
                    </Text>
                    <GradientStar size={16} />
                  </View>

                  {/* Subtitle */}
                  <Text className="text-[#090909]  font-inter text-base mt-1">
                    Day 1 to Day 5
                  </Text>
                </View>

                {/* Divider line */}
                <View className="h-[1px] bg-[#FFB2CD] mb-5" />

                {/* Bullet points */}
                <View className="gap-4 text-[#4D4D4D] font-inter">
                  {bulletPoints.map((point, index) => (
                    <View key={index} className="flex-row items-start">
                      <Text className="text-[#333333] text-base mr-3">•</Text>
                      <Text className="text-[#333333] text-base flex-1 leading-6">
                        {point}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  modalContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
