import { Stack } from "expo-router";
import {Button,View,StyleSheet,TouchableOpacity,Text} from "react-native";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="SignupScreen/signupScreen" options={{ headerShown: false }} />
      <Stack.Screen name="OTP/otpPage" options={{ headerShown: false }} />
      <Stack.Screen name="Maps/MapScreen" options={{ headerShown: false }} />
      <Stack.Screen name="AccountPage/accountPage" options={{headerShown:false}}/>
    </Stack>
  );
}

