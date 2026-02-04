import { Stack } from 'expo-router';
import { AddLogProvider } from '@/context/add-log-context';

export default function AddLogLayout() {
  return (
    <AddLogProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#FF4081' },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="moods" />
        <Stack.Screen name="symptoms" />
        <Stack.Screen name="medicine" />
        <Stack.Screen name="notes" />
        <Stack.Screen name="temperature" />
        <Stack.Screen name="weight" />
        <Stack.Screen name="drink-water" />
      </Stack>
    </AddLogProvider>
  );
}
