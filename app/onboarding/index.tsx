import { HomeIndicatorArea } from '@/components/signup/home-indicator-area';
import TopWave from '@/components/TopWave';
import { router } from 'expo-router';
import { Image, Pressable, Text, View } from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';

export default function OnboardingScreen() {
  const handleContinue = () => {
    router.push('/onboarding/screen2');
  };

  const handleSkip = () => {
    router.replace('/(auth)/signup');
  };

  return (
    <View className="flex-1 bg-[#FF4081]">
      {/* Top Section with Phone Mockup */}
      <View className="items-center pt-28 pb-6">
        {/* Phone mockup using image */}
        <Image
          source={require('../../assets/images/miniscreen.png')}
          className="w-[85%] aspect-[9/16] -mt-[4%] z-10"
          resizeMode="contain"
        />
      </View>

      {/* Bottom Section with Content */}
      <View className="relative items-center pt-8">
        <View className="absolute -bottom-14 left-0 right-0 overflow-hidden w-full">
          <TopWave />
        </View>
        <View className="flex-1 justify-end">
          <View className="bg-[#FFDBE7] rounded-t-[40px] px-8 pb-10 pt-4 -mt-12">
            {/* Title */}
            <Text className="text-2xl font-poppins font-semibold text-[#212121] text-center leading-8 mb-8">
              Empower Your Wellness{'\n'}Journey!
            </Text>

            {/* Description */}
            <Text className="text-sm font-inter text-[#666666] text-center leading-5" style={{ marginBottom: verticalScale(12), paddingHorizontal: scale(16) }}>
              Log your cycle, track your symptoms, and monitor your moods in one seamless experience.
            </Text>

            {/* Page indicator dots */}
            <View className="flex-row justify-center" style={{ marginBottom: verticalScale(12) }}>
              <View className="w-3 h-[5px] rounded-full bg-[#FF4081] mx-[1.5px]" />
              <View className="w-[5px] h-[5px] rounded-full bg-[#FFE9F1] mx-[1.5px]" />
              <View className="w-[5px] h-[5px] rounded-full bg-[#FFE9F1] mx-[1.5px]" />
            </View>
        
        {/* Buttons */}
        <View className="flex-row w-full gap-3" style={{ marginBottom: verticalScale(12) }}>
          {/* Skip button */}
          <Pressable
            onPress={handleSkip}
            className="flex-1 py-4 rounded-full bg-[#FFEBF2] items-center justify-center active:opacity-80"
          >
            <Text className="text-[#FF4081] font-medium text-[15px]">Skip</Text>
          </Pressable>

          {/* Continue button */}
          <Pressable
            onPress={handleContinue}
            className="flex-1 py-4 rounded-full bg-[#FF4081] items-center justify-center active:opacity-80"
          >
            <Text className="text-white font-medium text-[15px]">Continue</Text>
          </Pressable>
        </View>      
      </View>
        </View>
      </View>
      {/* Home Indicator at bottom */}
      <View className="absolute bottom-0 left-0 right-0">
        <HomeIndicatorArea />
      </View>
    </View>
  );
}
