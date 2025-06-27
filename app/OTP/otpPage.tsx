import React, { useState, useRef, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import styles from './otpStyles';
import { useRouter } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    Alert,
    Keyboard,
} from 'react-native';

const OTPVerification = () => {
    const { phone } = useLocalSearchParams();
    const router = useRouter();
    const [otp, setOtp] = useState(['', '', '', '']);
    const [isResending, setIsResending] = useState(false);
    const [timer, setTimer] = useState(30);
    const [canResend, setCanResend] = useState(false);
    const inputRefs = useRef<TextInput[]>([]);

    // Timer countdown
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
        setIsResending(true);
        setCanResend(false);
        setTimer(30);

        try {
            // Simulate API call
            setTimeout(() => {
                setIsResending(false);
                Alert.alert('Success', `OTP has been resent to ${phone || 'your number'}`);
            }, 1000);
        } catch (error) {
            setIsResending(false);
            Alert.alert('Error', 'Failed to resend OTP. Please try again.');
        }
    };

    const handleVerify = () => {
        router.push({
            pathname:'../Maps/MapScreen',
        })
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
                        Sent to {phone || 'your number'}
                    </Text>
                </View>

                <View style={styles.otpContainer}>
                    {otp.map((digit, index) => (
                        <TextInput
                            key={index}
                            ref={(ref) => {
                                inputRefs.current[index] = ref!;
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
                    onPress={handleVerify}
                    disabled={!isComplete}
                    style={[
                        styles.verifyButton,
                        !isComplete && styles.verifyButtonDisabled
                    ]}
                    activeOpacity={0.8}
                >
                    <Text style={styles.verifyButtonText}>Verify</Text>
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