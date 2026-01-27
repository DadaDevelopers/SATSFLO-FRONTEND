import TopWave from '@/components/TopWave';
import { router } from 'expo-router';
import { Image, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
export default function OnboardingScreen() {
  const handleContinue = () => {
    router.push('/onboarding/screen2');
  };

  const handleSkip = () => {
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView className="flex-1 bg-[#FF4081]" edges={['top']}>
      {/* Top Section with Phone Mockup */}
      <View className="items-center pt-16">
        {/* Phone mockup using image */}
        <Image
          source={require('../../assets/images/miniscreen.png')}
          className="w-[85%] aspect-[9/16] -mt-[6%] z-10"
          resizeMode="contain"
        />
      </View>

      {/* Bottom Section with Content */}
      <View className="relative items-center pt-8">
        <View className="absolute -bottom-14 w-full">
          <TopWave />
        </View>
        <View className="flex-1 justify-end">
          <View className="bg-[#FFDBE7] pb-10 pt-4 -mt-12 rounded-t-[40px]">
            {/* Title */}
            <Text className="text-2xl font-poppins font-semibold text-[#212121] text-center mb-8 leading-8">
              Empower Your Wellness{'\n'}Journey!
            </Text>

            {/* Description */}
            <Text className="text-sm font-inter text-[#666666] text-center mb-6 leading-5">
              Log your cycle, track your symptoms, and monitor your moods in one seamless experience.
            </Text>

            {/* Page indicator dots */}
            <View className="flex-row justify-center mb-6">
              <View className="w-3 h-[5px] rounded-full bg-[#FF4081] mx-[1.5px]" />
              <View className="w-[5px] h-[5px] rounded-full bg-[#FFE9F1] mx-[1.5px]" />
              <View className="w-[5px] h-[5px] rounded-full bg-[#FFE9F1] mx-[1.5px]" />
            </View>
        </View>
        {/* Buttons */}
        <View className="flex-row w-full gap-3 mb-6">
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
    </SafeAreaView>
  );
}
