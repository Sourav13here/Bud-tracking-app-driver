import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="SignupScreen/signupScreen" options={{ headerShown: false }} />
      <Stack.Screen name="OTP/otpPage" options={{ headerShown: false }} />
    </Stack>
  );
}

