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
<Stack.Screen name="send-amount" />
      <Stack.Screen name="create-invoice" />
      <Stack.Screen name="success" />
    </Stack>
  );
}
