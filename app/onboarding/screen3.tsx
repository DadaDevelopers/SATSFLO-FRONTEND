import TopWave from '@/components/TopWave';
import { router } from 'expo-router';
import { Image, Pressable, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function OnboardingScreen3() {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const imageHeight = height * 0.52;
  const imageTop = insets.top + 16;

  const waveTop = Math.round(imageTop + imageHeight * 0.75);
  const waveHeight = Math.round(imageHeight * 0.25 + 20);
  const cardTop = waveTop + waveHeight - 2;

  return (
    <View style={{ flex: 1, backgroundColor: '#FF4081' }}>
      {/* Image — behind the wave */}
      <View
        style={{
          position: 'absolute',
          top: imageTop,
          left: 0,
          right: 0,
          alignItems: 'center',
          zIndex: 0,
        }}
      >
        <Image
          source={require('../../assets/images/Gift Token SATS.png')}
          style={{ width: width * 0.72, height: imageHeight }}
          resizeMode="contain"
        />
      </View>

      {/* Wave */}
      <View style={{ position: 'absolute', top: waveTop, left: 0, right: 0, zIndex: 1 }}>
        <TopWave fillHeight={waveHeight} />
      </View>

      {/* Card */}
      <View
        style={{
          position: 'absolute',
          top: cardTop,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: '#FFDBE7',
          paddingHorizontal: 32,
          paddingTop: 16,
        }}
      >
        <Text className="text-2xl font-poppins font-semibold text-[#212121] text-center leading-8 mb-3">
          Simple, Secure, and{'\n'}Supportive!
        </Text>
        <Text className="text-sm font-inter text-[#666666] text-center leading-5 mb-4 px-4">
          Empowering women to support each other with SATS during those challenging moments, making wellness a shared journey.
        </Text>
        <View className="flex-row justify-center mb-5">
          <View className="w-[5px] h-[5px] rounded-full bg-[#FFE9F1] mx-[1.5px]" />
          <View className="w-[5px] h-[5px] rounded-full bg-[#FFE9F1] mx-[1.5px]" />
          <View className="w-3 h-[5px] rounded-full bg-[#FF4081] mx-[1.5px]" />
        </View>
        <Pressable
          onPress={() => router.replace('/(auth)/signup')}
          className="py-4 rounded-full bg-[#FF4081] items-center justify-center active:opacity-80 self-center"
          style={{ width: '65%' }}
        >
          <Text className="text-white font-medium text-[15px]">Get Started</Text>
        </Pressable>
        <View style={{ flex: 1 }} />
        {/* Home indicator */}
        <View
          style={{
            backgroundColor: '#FF3378',
            alignItems: 'center',
            paddingTop: 8,
            paddingBottom: Math.max(insets.bottom, 8) + 3,
            marginHorizontal: -32,
          }}
        >
          <View style={{ width: 134, height: 5, backgroundColor: '#FF99BC', borderRadius: 100 }} />
        </View>
      </View>
    </View>
  );
}
