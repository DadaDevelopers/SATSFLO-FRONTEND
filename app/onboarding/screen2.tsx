import TopWave from '@/components/TopWave';
import { router } from 'expo-router';
import { Image, Pressable, Text, View } from 'react-native';

export default function OnboardingScreen2() {
  const handleContinue = () => {
    router.push('/onboarding/screen3');
  };

  const handleSkip = () => {
    router.replace('/(tabs)');
  };

  return (
    <View className="flex-1 bg-[#FF4081]">
      {/* Top Section with Calendar Image */}
      <View className="items-center pt-28 pb-2">
        {/* Calendar mockup using image */}
        <Image
          source={require('../../assets/images/Calendar.png')}
          className="w-[85%] aspect-[9/12] -mt-[4%] z-10"
          resizeMode="contain"
        />
      </View>

      {/* Bottom Section with Content */}
      <View className="relative items-center pt-10">
      <View className="absolute -top-24 w-full">
        <TopWave />
        </View>
        <View className="bg-[#FFDBE7] rounded-t-[40px] px-8 pb-10 pt-4 -mt-12">
          {/* Title */}
          <Text className="text-2xl font-poppins font-semibold text-[#212121] text-center mb-6 leading-8">
            Insights Tailored to Your {'\n'} Cycle!
          </Text>

          {/* Description */}
          <Text className="text-md font-inter text-[#666666] text-center mb-10 leading-5">
            Receive accurate cycle predictions and personalised {'\n'}health tips designed to fit your lifestyle.
          </Text>

          {/* Page indicator dots */}
          <View className="flex-row justify-center mb-8">
            <View className="w-[5px] h-[5px] rounded-full bg-[#FFE9F1] mx-[1.5px]" />
            <View className="w-3 h-[5px] rounded-full bg-[#FF4081] mx-[1.5px]" />
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
