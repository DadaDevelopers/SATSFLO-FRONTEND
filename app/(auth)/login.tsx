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

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const isFormValid = email.trim() !== '' && password.trim() !== '';

  const handleSignIn = () => {
    if (isFormValid) {
      // Navigate to main app after login
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
          {/* Back Button */}
          <View style={styles.header}>
            <BackButton />
          </View>

          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>Welcome Back!</Text>
            <Text style={styles.subtitle}>
              Access your account and stay connected to your wellness journey anytime, anywhere.
            </Text>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
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
            <View style={styles.optionsRow}>
              <Checkbox
                checked={rememberMe}
                onToggle={() => setRememberMe(!rememberMe)}
                label="Remember me"
              />
              <TouchableOpacity onPress={handleForgotPassword} activeOpacity={0.7}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          <PrimaryButton
            title="Sign In"
            onPress={handleSignIn}
            disabled={!isFormValid}
          />
          <TouchableOpacity onPress={handleCreateAccount} activeOpacity={0.7}>
            <Text style={styles.createAccountText}>
              Don't have an account? <Text style={styles.createAccountLink}>Create account</Text>
            </Text>
          </TouchableOpacity>
        </View>

        {/* Home Indicator Area */}
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
  header: {
    paddingTop: 16,
    paddingBottom: 24,
  },
  titleSection: {
    gap: 4,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 29,
    color: SignupColors.titleText,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 17,
    color: SignupColors.bodyText,
  },
  formSection: {
    gap: 20,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  forgotPasswordText: {
    fontSize: 12,
    fontWeight: '500',
    color: SignupColors.titleText,
  },
  bottomSection: {
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  createAccountText: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 17,
    textAlign: 'center',
    color: SignupColors.linkText,
  },
  createAccountLink: {
    fontWeight: '600',
    color: SignupColors.titleText,
  },
  homeIndicatorArea: {
    height: 34,
    backgroundColor: SignupColors.homeIndicatorBackground,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 8,
  },
  homeIndicator: {
    width: 134,
    height: 5,
    backgroundColor: SignupColors.homeIndicator,
    borderRadius: 100,
  },
});
