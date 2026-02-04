import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { InputField } from '@/components/signup/input-field';
import { PrimaryButton } from '@/components/signup/primary-button';
import { Checkbox } from '@/components/signup/checkbox';
import { HomeIndicatorArea } from '@/components/signup/home-indicator-area';
import { TitleSection } from '@/components/signup/title-section';

const MAX_CONTENT_WIDTH = 480;

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const isDesktop = screenWidth > MAX_CONTENT_WIDTH;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const isFormValid = email.trim() !== '' && password.trim() !== '';

  const handleSignIn = () => {
    if (isFormValid) {
      router.replace('/(tabs)');
    }
  };

  const handleForgotPassword = () => {
    router.push('/(auth)/forgot-password');
  };

  const handleCreateAccount = () => {
    router.push('/(auth)/signup');
  };

  return (
    <View
      className="flex-1"
      style={{
        backgroundColor: isDesktop ? '#f5f5f5' : '#FF4081',
        paddingTop: isDesktop ? 20 : insets.top,
        paddingBottom: isDesktop ? 20 : 0,
      }}
    >
      <View
        className="flex-1"
        style={isDesktop ? {
          maxWidth: MAX_CONTENT_WIDTH,
          maxHeight: 844,
          width: '100%',
          alignSelf: 'center',
          backgroundColor: '#FF4081',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 16,
          elevation: 8,
          borderRadius: 24,
          overflow: 'hidden',
        } : undefined}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          <ScrollView
            className="flex-1"
            contentContainerStyle={{
              flexGrow: 1,
              paddingHorizontal: 24,
            }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Content */}
            <View className="w-full pt-12 pb-8">
              {/* Title Section */}
              <TitleSection
                title="Welcome Back!"
                subtitle="Access your account and stay connected to your wellness journey anytime, anywhere."
                className="mb-10"
              />

              {/* Form Section */}
              <View className="gap-5">
                <InputField
                  placeholder="Email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />

                <InputField
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  showPasswordToggle
                  autoCapitalize="none"
                  autoComplete="password"
                />

                {/* Remember me & Forgot Password Row */}
                <View className="flex-row justify-between items-center">
                  <Checkbox
                    checked={rememberMe}
                    onToggle={() => setRememberMe(!rememberMe)}
                    label="Remember me"
                  />
                  <TouchableOpacity onPress={handleForgotPassword} activeOpacity={0.7}>
                    <Text className="text-xs font-medium text-signup-title">Forgot Password?</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Bottom Section - Fixed at bottom */}
          <View className="px-6 pb-4 pt-4">
            <View className="items-center gap-4">
              <PrimaryButton title="Sign In" onPress={handleSignIn} disabled={!isFormValid} />
              <TouchableOpacity onPress={handleCreateAccount} activeOpacity={0.7} className="py-3">
                <Text className="text-sm font-normal leading-[17px] text-center text-signup-link">
                  Don&apos;t have an account?{' '}
                  <Text className="font-semibold text-signup-title">Create account</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <HomeIndicatorArea />
        </KeyboardAvoidingView>
      </View>
    </View>
  );
}
