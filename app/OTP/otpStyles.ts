import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 60,
    },
    header: {
        alignItems: 'center',
        marginBottom: 50,
    },
    title: {
        fontSize: 28,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#6b7280',
        marginBottom: 4,
    },
    phoneNumber: {
        fontSize: 14,
        color: '#9ca3af',
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 12,
        marginBottom: 40,
    },
    otpInput: {
        width: 56,
        height: 56,
        borderWidth: 2,
        borderColor: '#e5e7eb',
        borderRadius: 12,
        fontSize: 20,
        fontWeight: '600',
        color: '#111827',
        backgroundColor: '#ffffff',
    },
    otpInputFilled: {
        borderColor: '#3b82f6',
        backgroundColor: '#f8fafc',
    },
    resendContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    resendButton: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        backgroundColor: '#1f2937',
        borderRadius: 24,
    },
    resendButtonDisabled: {
        backgroundColor: '#989a9c',
    },
    resendButtonText: {
        fontSize: 14,
        fontWeight: '500',
        color: 'white',
    },
    resendButtonTextDisabled: {
        color: 'white',
    },
    verifyButton: {
        backgroundColor: '#1f2937',
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
        marginBottom: 24,
    },
    verifyButtonDisabled: {
        backgroundColor: '#989a9c',
    },
    verifyButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
    infoContainer: {
        alignItems: 'center',
    },
    infoText: {
        fontSize: 12,
        color: '#6b7280',
        textAlign: 'center',
        lineHeight: 16,
    },
    backButton: {
        backgroundColor: '#2d3436',
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 10,
    },
});


export default styles;