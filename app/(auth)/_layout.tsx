import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function AuthLayout() {
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#FF4081' },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="login" />
        <Stack.Screen name="cycle-length" />
        <Stack.Screen name="period-length" />
        <Stack.Screen name="last-period" />
        <Stack.Screen name="forgot-password" />
        <Stack.Screen name="otp-verification" />
        <Stack.Screen name="reset-password" />
        <Stack.Screen name="terms-and-conditions" />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}
