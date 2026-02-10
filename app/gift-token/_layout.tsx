import { Stack } from 'expo-router';

export default function GiftTokenLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#FF4081' },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="receive" />
      <Stack.Screen name="select-wallet" />
      <Stack.Screen name="success" />
    </Stack>
  );
}
