import TopWave from '@/components/TopWave';
import { router } from 'expo-router';
import { Image, Pressable, Text, View } from 'react-native';

export default function OnboardingScreen3() {
  const handleGetStarted = () => {
    router.replace('/'); // to include signup screen
  };

  return (
    <View className="flex-1 bg-[#FF4081]">
      {/* Top Section with Gift Token Image */}
      <View className="items-center pt-16">
        {/* Gift token SATS image */}
        <Image
          source={require('../../assets/images/Gift Token SATS.png')}
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
        <View className="bg-[#FFDBE7] rounded-t-[40px] pb-10 pt-4 -mt-12">
          {/* Title */}
          <Text className="text-2xl font-poppins font-semibold text-[#212121] text-center mb-8 leading-8">
            Simple, Secure, and {'\n'}Supportive!
          </Text>

          {/* Description */}
          <Text className="text-md font-inter text-[#666666] text-center mb-6 leading-5">
            Empowering women to support each other with SATS during those challenging moments, making wellness a shared journey.
          </Text>

          {/* Page indicator dots */}
          <View className="flex-row justify-center mb-6">
            <View className="w-[5px] h-[5px] rounded-full bg-[#FFE9F1] mx-[1.5px]" />
            <View className="w-[5px] h-[5px] rounded-full bg-[#FFE9F1] mx-[1.5px]" />
            <View className="w-3 h-[5px] rounded-full bg-[#FF4081] mx-[1.5px]" />
          </View>

          {/* Get Started button */}
          <Pressable
            onPress={handleGetStarted}
            className="w-[250px] py-4 rounded-full bg-[#FF4081] items-center justify-center active:opacity-80 self-center"
          >
            <Text className="text-white font-medium text-[15px]">Get Started</Text>
          </Pressable>
        </View>
        </View>
      </View>
    </View>
  );
}
