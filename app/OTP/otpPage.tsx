import { useRouter, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    SafeAreaView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import styles from './otpStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OTPVerification = () => {
    const { phone } = useLocalSearchParams();
    const router = useRouter();
    const [otp, setOtp] = useState<string[]>(['', '', '', '']);
    const [isResending, setIsResending] = useState<boolean>(false);
    const [isVerifying, setIsVerifying] = useState<boolean>(false);
    const [timer, setTimer] = useState<number>(30);
    const [canResend, setCanResend] = useState<boolean>(false);
    const inputRefs = useRef<(TextInput | null)[]>([]);

    // Ensure phone is a string
    const phoneNumber = Array.isArray(phone) ? phone[0] : phone;

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer(prev => prev - 1);
            }, 1000);
            return () => clearInterval(interval);
        } else {
            setCanResend(true);
        }
    }, [timer]);

    const handleInputChange = (index: number, value: string) => {
        if (value && !/^\d$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 3) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (index: number, key: string) => {
        if (key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleResendOTP = async () => {
        if (!phoneNumber) {
            Alert.alert('Error', 'Phone number is required');
            return;
        }

        setIsResending(true);
        setCanResend(false);
        setTimer(30);

        try {
            const response = await fetch("http://192.168.39.204:8000/api/otp/request-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone: phoneNumber }),
            });

            const data = await response.json();

            setIsResending(false);

            if (response.ok && data.success) {
                Alert.alert("Success", data.message || "OTP resent successfully");
            } else {
                Alert.alert("Error", data.error || data.message || "Failed to resend OTP.");
            }
        } catch (error) {
            setIsResending(false);
            Alert.alert('Error', 'Failed to resend OTP. Please try again.');
        }
    };

    const handleVerifyOtp = async () => {
        if (isVerifying) return; // Prevent multiple submissions

        const otpCode = otp.join('');

        if (!phoneNumber || otpCode.length < 4) {
            Alert.alert('Missing Information', 'Phone number or OTP is missing or incomplete');
            return;
        }

        setIsVerifying(true);

        try {
            const response = await fetch('http://192.168.39.204:8000/api/otp/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: phoneNumber, otp: otpCode }),
            });

            const data = await response.json();

            if (data.success) {
               await AsyncStorage.setItem('driverPhone', phoneNumber);

                router.replace('/Maps/MapScreen');
            } else {
                Alert.alert('Verification failed', data.error || 'Invalid OTP');
            }
        } catch (error) {
            console.error('OTP verification failed:', error);
            Alert.alert('Error', 'Failed to verify OTP');
        } finally {
            setIsVerifying(false);
        }

        console.log('Submitting OTP:', otpCode);
        console.log('Phone:', phoneNumber);
    };

    const isComplete = otp.every(digit => digit !== '');

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />

            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>Verify OTP</Text>
                    <Text style={styles.subtitle}>Enter verification code</Text>
                    <Text style={styles.phoneNumber}>
                        Sent to {phoneNumber || 'your number'}
                    </Text>
                </View>

                <View style={styles.otpContainer}>
                    {otp.map((digit, index) => (
                        <TextInput
                            key={index}
                            ref={(ref) => {
                                inputRefs.current[index] = ref;
                            }}
                            style={[
                                styles.otpInput,
                                digit ? styles.otpInputFilled : null
                            ]}
                            value={digit}
                            onChangeText={(value) => handleInputChange(index, value)}
                            onKeyPress={({ nativeEvent }) => handleKeyPress(index, nativeEvent.key)}
                            keyboardType="number-pad"
                            maxLength={1}
                            textAlign="center"
                            selectTextOnFocus
                            autoFocus={index === 0}
                        />
                    ))}
                </View>

                <View style={styles.resendContainer}>
                    <TouchableOpacity
                        onPress={handleResendOTP}
                        disabled={!canResend || isResending}
                        style={[
                            styles.resendButton,
                            (!canResend || isResending) && styles.resendButtonDisabled
                        ]}
                        activeOpacity={0.7}
                    >
                        <Text style={[
                            styles.resendButtonText,
                            (!canResend || isResending) && styles.resendButtonTextDisabled
                        ]}>
                            {isResending
                                ? 'Resending...'
                                : canResend
                                    ? 'Resend OTP'
                                    : `Resend OTP (${timer}s)`}
                        </Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    onPress={handleVerifyOtp}
                    disabled={!isComplete || isVerifying}
                    style={[
                        styles.verifyButton,
                        (!isComplete || isVerifying) && styles.verifyButtonDisabled
                    ]}
                    activeOpacity={0.8}
                >
                    <Text style={styles.verifyButtonText}>
                        {isVerifying ? 'Verifying...' : 'Verify'}
                    </Text>
                </TouchableOpacity>

                <View style={styles.infoContainer}>
                    <Text style={styles.infoText}>
                        Didn't receive the code? Check your SMS or try again.
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default OTPVerification;