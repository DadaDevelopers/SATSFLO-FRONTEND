import TopWave from '@/components/TopWave';
import { router } from 'expo-router';
import { Image, Pressable, Text, View } from 'react-native';

export default function OnboardingScreen() {
  const handleContinue = () => {
    router.push('/onboarding/screen2');
  };

  const handleSkip = () => {
    router.replace('/(tabs)');
  };

  return (
    <View className="flex-1 bg-[#FF4081]">
      {/* Top Section with Phone Mockup */}
      <View className="flex-1 items-center justify-center pt-12 mt-0 pb-2">
        {/* Phone mockup using image */}
        <Image
          source={require('../../assets/images/miniscreen.png')}
          className="w-[90%] h-[90%]"
          resizeMode="contain"
        />
      </View>

      {/* Bottom Section with Content */}
      <View className="">
        <TopWave />
      <View className="bg-[#FFDBE7] rounded-t-[40px] px-8 pb-8 pt-10 -mt-20 mb-8">
        {/* Title */}
        <Text className="text-2xl font-poppins font-semibold text-[#212121] text-center mb-6 leading-8">
          Empower Your Wellness{'\n'}Journey!
        </Text>

        {/* Description */}
        <Text className="text-sm font-inter text-[#666666] text-center mb-8 leading-5">
          Log your cycle, track your symptoms, and monitor your moods in one seamless experience.
        </Text>

        {/* Page indicator dots */}
        <View className="flex-row justify-center mb-8">
          <View className="w-3 h-[5px] rounded-full bg-[#FF4081] mx-[1.5px]" />
          <View className="w-[5px] h-[5px] rounded-full bg-[#FFE9F1] mx-[1.5px]" />
          <View className="w-[5px] h-[5px] rounded-full bg-[#FFE9F1] mx-[1.5px]" />
        </View>

        {/* Buttons */}
        <View className="flex-row w-full gap-3">
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
  );
}
