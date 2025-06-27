import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'react-native';
import styles from './SignupStyles';
import {Picker} from '@react-native-picker/picker';
import{SafeAreaView,StatusBar,Text,TextInput,TouchableOpacity,
  View,ScrollView,} from 'react-native';

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

      <TouchableOpacity style={styles.backButton} onPress={()=>router.back()}>
       <Ionicons name="arrow-back" size={22} color="white" />
      </TouchableOpacity>

        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image source={require('../../assets/images/company_logo.jpeg')} style = {styles.logo} />
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
        <TouchableOpacity style={styles.signupButton} onPress={handleSignUp} activeOpacity={0.8}>
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

export default SignUpScreen;