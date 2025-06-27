import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import {
    SafeAreaView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    View,
} from 'react-native';
import styles from './loginStyles'; 
import {Image} from "expo-image";

const LoginScreen = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    
    const router= useRouter();


    const handleGetOTP = () => {
        // Check if phoneNumber is empty
        if (!phoneNumber) {
            alert("Phone number is required");
            return;
        }

        // Check if phoneNumber contains only digits
    const isNumeric = /^[0-9]+$/.test(phoneNumber);
        if (!isNumeric) {
            alert("Phone number must contain only digits");
            return;
        }

        // Check if it's exactly 10 digits
        if (phoneNumber.length !== 10) {
            alert("Please enter a valid 10-digit phone number");
            return;
        }

        // If all validations pass, navigate to OTP screen
        router.push({
            pathname: "/OTP/otpPage",
            params: { phone: phoneNumber },
        });
        };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />

            <View style={styles.content}>

                {/* Logo */}
                <View style={styles.logoContainer}>
                    <Image
                        source={require('../assets/images/company_logo.jpeg')}
                        style={styles.logo}/>
                </View>

                {/* Welcome Text */}
                <View style={styles.welcomeContainer}>
                    <Text style={styles.loginText}>Login</Text>
                    <Text style={styles.welcomeText}>Welcome !</Text>
                </View>
                <View style={styles.formContainer}>
                {/* Phone Input */}
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

                {/* Get OTP Button */}
                <TouchableOpacity style={styles.otpButton} onPress={handleGetOTP} activeOpacity={0.8} >
                    <Text style={styles.otpButtonText}>GET OTP</Text>
                </TouchableOpacity>

                {/* Sign Up Link */}

                </View>
            </View>
        </SafeAreaView>
    );
};

export default LoginScreen;