import { BlurView } from 'expo-blur';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Modal, ScrollView, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';

const GradientStar = ({ size = 16 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <Defs>
      <LinearGradient id="lutealStarGradient" x1="6.08" y1="0.4" x2="14.3467" y2="4.21333" gradientUnits="userSpaceOnUse">
        <Stop stopColor="#70A9FE" />
        <Stop offset="1" stopColor="#F0F0F1" />
      </LinearGradient>
    </Defs>
    <Path
      d="M8 0L9.79611 5.52786H15.6085L10.9062 8.94427L12.7023 14.4721L8 11.0557L3.29772 14.4721L5.09383 8.94427L0.391548 5.52786H6.20389L8 0Z"
      fill="url(#lutealStarGradient)"
    />
  </Svg>
);

interface LutealPhaseModalProps {
  visible: boolean;
  onClose: () => void;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export function LutealPhaseModal({ visible, onClose }: LutealPhaseModalProps) {
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  const bulletPoints = [
    'The body gets ready for a possible pregnancy during this phase.',
    'The ruptured follicle transforms into the corpus luteum (ovary glands), which secretes progesterone to maintain the uterine lining.',
    'If the egg is not fertilized, the corpus luteum disintegrates, leading to a drop in progesterone and estrogen, which triggers the next menstruation.',
    'You may experience symptoms like bloating, breast tenderness, and mood swings.',
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
                {
                  paddingHorizontal: 16,
                  paddingBottom: insets.bottom + 16,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <View className="bg-[#FFE5EE] rounded-3xl px-6 pt-8 pb-10 shadow-lg" style={{ maxHeight: SCREEN_HEIGHT * 0.82 }}>
                {/* Header with stars and title */}
                <View className="items-center mb-4">
                  <View className="w-12 h-1 bg-[#E84C8A] rounded-full mx-auto mb-6"></View>
                  <View className="flex-row items-center justify-center gap-2">
                    <GradientStar size={16} />
                    <Text className="text-[#171717] text-2xl font-bold font-inter">
                      Luteal Phase
                    </Text>
                    <GradientStar size={16} />
                  </View>

                  {/* Subtitle */}
                  <Text className="text-[#090909]  font-inter text-base mt-1">
                    Day 15 to Day 28
                  </Text>
                </View>

                {/* Divider line */}
                <View className="h-[1px] bg-[#FFB2CD] mb-5" />

                {/* Bullet points */}
                <ScrollView showsVerticalScrollIndicator={false}>
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
                </ScrollView>
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
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  modalContent: {
    width: '100%',
  },
});
