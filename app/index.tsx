import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import {
    SafeAreaView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Alert,
} from 'react-native';
import styles from './loginStyles'; 
import { Image } from "expo-image";

const LoginScreen = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const router = useRouter();

    const handleGetOTP = async () => {
        if (!phoneNumber) return Alert.alert("Phone number is required");
        if (!/^[0-9]+$/.test(phoneNumber)) return Alert.alert("Phone number must contain only digits");
        if (phoneNumber.length !== 10) return Alert.alert("Please enter a valid 10-digit phone number");

        try {
            const response = await fetch("http://192.168.47.204:8000/api/otp/request-otp",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone: phoneNumber }),
            });

            const data = await response.json();

            if (data.success) {
                router.push({
                    pathname: "./OTP/otpPage",
                    params: { phone: phoneNumber },
                });
            } else {
                Alert.alert("Phone number not registered");
            }
        } catch (error) {
            Alert.alert("Error", "Network error. Try again.");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
            <View style={styles.content}>
                <View style={styles.logoContainer}>
                    <Image
                        source={require('../assets/images/company_logo.jpeg')}
                        style={styles.logo}
                    />
                </View>
                <View style={styles.welcomeContainer}>
                    <Text style={styles.loginText}>Login</Text>
                    <Text style={styles.welcomeText}>Welcome !</Text>
                </View>
                <View style={styles.formContainer}>
                    <View style={styles.inputContainer}>
                        <View style={styles.phoneInputWrapper}>
                            <Text style={styles.countryCode}>+91</Text>
                            <TextInput
                                style={styles.phoneInput}
                                placeholder="Phone No."
                                placeholderTextColor="#999"
                                value={phoneNumber}
                                onChangeText={setPhoneNumber}
                                keyboardType="phone-pad"
                                maxLength={10}
                            />
                        </View>
                    </View>
                    <TouchableOpacity
                        style={styles.otpButton}
                        onPress={handleGetOTP}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.otpButtonText}>GET OTP</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default LoginScreen;