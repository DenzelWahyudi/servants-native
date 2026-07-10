import { Stack } from 'expo-router';
import "../../global.css";
import { AuthProvider } from '@/context/AuthProvider';

export default function RootLayout() {
  return (
      <AuthProvider>
          <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="login" options={{ title: 'Login' }} />
              <Stack.Screen name='(tabs)' />
          </Stack>
      </AuthProvider>
  );
}