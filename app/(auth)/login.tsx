import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { InputField } from '@/components/signup/input-field';
import { PrimaryButton } from '@/components/signup/primary-button';
import { Checkbox } from '@/components/signup/checkbox';
import { HomeIndicatorArea } from '@/components/signup/home-indicator-area';
import { TitleSection } from '@/components/signup/title-section';

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
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
    <View className="flex-1 bg-signup-bg" style={{ paddingTop: insets.top }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 20,
            justifyContent: 'center',
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Center content */}
          <View className="w-full py-16">
            {/* Title Section */}
            <TitleSection
              title="Welcome Back!"
              subtitle="Access your account and stay connected to your wellness journey anytime, anywhere."
              className="mb-6"
            />

            {/* Form Section */}
            <View className="gap-4">
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
        <View className="px-5 pb-3 pt-2">
          <View className="items-center gap-3">
            <PrimaryButton title="Sign In" onPress={handleSignIn} disabled={!isFormValid} />
            <TouchableOpacity onPress={handleCreateAccount} activeOpacity={0.7} className="py-2">
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
  );
}
