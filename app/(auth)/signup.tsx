import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SignupColors } from '@/constants/signup-theme';
import { InputField } from '@/components/signup/input-field';
import { PrimaryButton } from '@/components/signup/primary-button';
import { Checkbox } from '@/components/signup/checkbox';
import { BackButton } from '@/components/signup/back-button';
import { CustomStatusBar } from '@/components/signup/custom-status-bar';

export default function SignupScreen() {
  const router = useRouter();
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
    <View style={styles.container}>
      {/* Custom Status Bar */}
      <CustomStatusBar />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Back Button - positioned at top: 75px from design, adjusted for status bar */}
          <View style={styles.header}>
            <BackButton />
          </View>

          {/* Title Section - Frame 113: top: 115px, gap: 4px */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Sign up with Satsflo to start tracking your cycle today.
            </Text>
          </View>

          {/* Form Section - Frame 112: top: 202px, gap: 12px */}
          <View style={styles.formSection}>
            {/* Input Fields Container - Frame 1686553389: gap: 20px */}
            <View style={styles.inputsContainer}>
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

            {/* Checkbox - Frame 54 */}
            <Checkbox
              checked={agreeToTerms}
              onToggle={() => setAgreeToTerms(!agreeToTerms)}
              label="I agree to terms and conditions"
            />
          </View>
        </ScrollView>

        {/* Bottom Section - Frame 111: top: 709px, gap: 4px */}
        <View style={styles.bottomSection}>
          <PrimaryButton
            title={isFormValid ? 'Next' : 'Sign up'}
            onPress={handleNext}
            disabled={!isFormValid}
          />
          <TouchableOpacity onPress={handleSignIn} activeOpacity={0.7}>
            <Text style={styles.signInText}>
              Already have an account? <Text style={styles.signInLink}>Sign In</Text>
            </Text>
          </TouchableOpacity>
        </View>

        {/* Home Indicator Area - height: 34px, background: #FF3378 */}
        <View style={styles.homeIndicatorArea}>
          <View style={styles.homeIndicator} />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SignupColors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  // Back button at top: 75px in design, minus status bar height
  header: {
    paddingTop: 16,
    paddingBottom: 24,
  },
  // Frame 113: gap: 4px
  titleSection: {
    gap: 4,
    marginBottom: 20,
  },
  // Create Account: font-size: 24px, font-weight: 600, line-height: 29px, color: #FFFFFF
  title: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 29,
    color: SignupColors.titleText,
  },
  // Subtitle: font-size: 14px, font-weight: 400, line-height: 17px, color: #FAFAFA
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 17,
    color: SignupColors.bodyText,
  },
  // Frame 112: gap: 12px
  formSection: {
    gap: 12,
  },
  // Frame 1686553389: gap: 20px
  inputsContainer: {
    gap: 20,
  },
  // Frame 111: gap: 4px, centered
  bottomSection: {
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  // Already have an account text: font-size: 14px, color: #DDDDDD
  signInText: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 17,
    textAlign: 'center',
    color: SignupColors.linkText,
  },
  signInLink: {
    fontWeight: '600',
    color: SignupColors.titleText,
  },
  // HomeIndicator: height: 34px, background: #FF3378
  homeIndicatorArea: {
    height: 34,
    backgroundColor: SignupColors.homeIndicatorBackground,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 8,
  },
  // Home Indicator bar: width: 134px, height: 5px, background: #FF99BC, border-radius: 100px
  homeIndicator: {
    width: 134,
    height: 5,
    backgroundColor: SignupColors.homeIndicator,
    borderRadius: 100,
  },
});
