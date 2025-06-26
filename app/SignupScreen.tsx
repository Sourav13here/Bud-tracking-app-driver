import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import {Picker} from '@react-native-picker/picker';
import{
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';

const SignUpScreen = () => {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedType, setSelectedType] = useState('School');
  const [classValue, setClassValue] = useState('');
  const [section, setSection] = useState('');
  const [rollNo, setRollNo] = useState('');

  const handleSignUp = () => {
    console.log('Creating account with:', {
      name,
      phoneNumber,
      selectedType,
      classValue,
      section,
      rollNo,
    });
  };

  const handleLogin = () => {
    console.log('Navigate to login');
  };

  const router= useRouter();

  

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

      <TouchableOpacity styles={styles.signupButton} onPress={()=>router.back()}>
       <Text style={{ fontSize: 30, fontWeight: 'bold',marginBottom:2 }}>⬅</Text>
      </TouchableOpacity>

        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>gt</Text>
          </View>
        </View>

        {/* Welcome Text */}
        <View style={styles.welcomeContainer}>
          <Text style={styles.signupText}>Sign Up</Text>
          <Text style={styles.welcomeText}>Create Your Account</Text>
        </View>

        {/* Personal Information Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          {/* Name Input */}
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="Full Name"
              placeholderTextColor="#999"
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* Phone Input */}
          <View style={styles.phoneInputWrapper}>
            <Text style={styles.countryCode}>+91</Text>
            <TextInput
              style={styles.phoneInput}
              placeholder="Phone Number"
              placeholderTextColor="#999"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              maxLength={10}
            />
          </View>
        </View>

        {/* Academic Information Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Academic Information</Text>
          
          {/* Institution Type Selection */}
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                styles.toggleButtonLeft,
                selectedType === 'School' && styles.toggleButtonActive,
              ]}
              onPress={() => setSelectedType('School')}
            >
              <Text
                style={[
                  styles.toggleText,
                  selectedType === 'School' && styles.toggleTextActive,
                ]}
              >
                School
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                styles.toggleButtonRight,
                selectedType === 'College' && styles.toggleButtonActive,
              ]}
              onPress={() => setSelectedType('College')}
            >
              <Text
                style={[
                  styles.toggleText,
                  selectedType === 'College' && styles.toggleTextActive,
                ]}
              >
                College
              </Text>
            </TouchableOpacity>
          </View>

          {/* Academic Details */}
          <View style={styles.academicRow}>
            <View style={[styles.inputWrapper, styles.halfWidth]}>
              <TextInput
                style={styles.textInput}
                placeholder={selectedType === 'School' ? 'Class' : 'Department'}
                placeholderTextColor="#999"
                value={classValue}
                onChangeText={setClassValue}
              />
            </View>
            <View style={[styles.inputWrapper, styles.halfWidth]}>
              <TextInput
                style={styles.textInput}
                placeholder={selectedType === 'School'? 'Section': 'Semester'}
                placeholderTextColor="#999"
                value={section}
                onChangeText={setSection}
              />
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder={selectedType === 'School' ? 'Roll Number' : 'Student ID'}
              placeholderTextColor="#999"
              value={rollNo}
              onChangeText={setRollNo}
            />
          </View>
        </View>

        {/* Sign Up Button */}
        <TouchableOpacity
          style={styles.signupButton}
          onPress={handleSignUp}
          activeOpacity={0.8}
        >
          <Text style={styles.signupButtonText}>CREATE ACCOUNT</Text>
        </TouchableOpacity>

        {/* Login Link */}
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={()=> router.push('/')}>
            <Text style={styles.loginLink}>Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    paddingHorizontal: 30,
    paddingVertical: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  logo: {
    width: 70,
    height: 70,
    backgroundColor: '#00b894',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  signupText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  welcomeText: {
    fontSize: 18,
    color: '#666',
  },
  sectionContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
    paddingLeft: 5,
  },
  inputWrapper: {
    backgroundColor: 'white',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  textInput: {
    fontSize: 16,
    color: '#333',
    paddingVertical: 0,
  },
  phoneInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  countryCode: {
    fontSize: 16,
    color: '#333',
    marginRight: 10,
    fontWeight: '500',
  },
  phoneInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 0,
  },
  toggleContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 21,
  },
  toggleButtonLeft: {
    marginRight: 2,
  },
  toggleButtonRight: {
    marginLeft: 2,
  },
  toggleButtonActive: {
    backgroundColor: '#00b894',
    shadowColor: '#00b894',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  toggleText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  toggleTextActive: {
    color: 'white',
    fontWeight: '600',
  },
  academicRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  signupButton: {
    backgroundColor: '#2d3436',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  signupButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  loginText: {
    fontSize: 16,
    color: '#666',
  },
  loginLink: {
    fontSize: 17,
    color: '#00b894',
    fontWeight: '600',
  },
});

export default SignUpScreen;