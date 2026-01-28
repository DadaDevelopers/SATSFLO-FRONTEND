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

export default function SignupScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const isFormValid =
    name.trim() !== '' &&
    email.trim() !== '' &&
    password.trim() !== '' &&
    confirmPassword.trim() !== '' &&
    password === confirmPassword &&
    agreeToTerms;

  const handleNext = () => {
    if (isFormValid) {
      router.push('/(auth)/cycle-length');
    }
  };

  const handleSignIn = () => {
    router.push('/(auth)/login');
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
              title="Create Account"
              subtitle="Sign up with Satsflo to start tracking your cycle today."
              className="mb-6"
            />

            {/* Form Section */}
            <View className="gap-4">
              {/* Input Fields Container */}
              <View className="gap-4">
                <InputField
                  placeholder="Name"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  autoComplete="name"
                />

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
                  autoComplete="new-password"
                />

                <InputField
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  showPasswordToggle
                  autoCapitalize="none"
                  autoComplete="new-password"
                />
              </View>

              {/* Checkbox */}
              <Checkbox
                checked={agreeToTerms}
                onToggle={() => setAgreeToTerms(!agreeToTerms)}
                label="I agree to terms and conditions"
              />
            </View>
          </View>
        </ScrollView>

        {/* Bottom Section - Fixed at bottom */}
        <View className="px-5 pb-3 pt-2">
          <View className="items-center gap-3">
            <PrimaryButton
              title={isFormValid ? 'Next' : 'Sign up'}
              onPress={handleNext}
              disabled={!isFormValid}
            />
            <TouchableOpacity onPress={handleSignIn} activeOpacity={0.7} className="py-2">
              <Text className="text-sm font-normal leading-[17px] text-center text-signup-link">
                Already have an account?{' '}
                <Text className="font-semibold text-signup-title">Sign In</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <HomeIndicatorArea />
      </KeyboardAvoidingView>
    </View>
  );
}
