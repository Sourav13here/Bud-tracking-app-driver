import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  StatusBar,
  SafeAreaView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from './accountStyles';
import { useRouter } from 'expo-router';

const DriverAccountScreen = ({ navigation }) => {
  const router = useRouter();
  
  const [isEditing, setIsEditing] = useState(false);
  const [originalData] = useState({
    fullName: 'Ravi Kumar',
    phone: '+91 7453627840',
    email: 'ravi.kumar@gmail.com',
    license: 'AS01BH6574',
    experience: '8 Years',
    address: 'Nirala,Karimganj,Assam',
    busNumber: 'ASO1HG5364',
  });
  
  const [formData, setFormData] = useState({ ...originalData });

  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleEdit = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleCancel = useCallback(() => {
    setFormData({ ...originalData });
    setIsEditing(false);
  }, [originalData]);

  const handleSave = useCallback(() => {
    setIsEditing(false);
    Alert.alert('Success', 'Profile updated successfully!');
  }, []);

  const handleLogout = useCallback(() => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: () => console.log('Logout pressed') },
      ]
    );
  }, []);

  const handleChangePhoto = useCallback(() => {
    Alert.alert(
      'Change Photo',
      'Choose an option',
      [
        { text: 'Camera', onPress: () => console.log('Camera pressed') },
        { text: 'Gallery', onPress: () => console.log('Gallery pressed') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#f5f5f5" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.headerButton} 
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>My Account</Text>

        <TouchableOpacity 
          style={styles.headerButton} 
          onPress={isEditing ? handleCancel : handleEdit}
        >
          <Ionicons 
            name={isEditing ? "close" : "create-outline"} 
            size={24} 
            color="white" 
          />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollContainer} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={require('../../assets/images/react-logo.png')}
              style={styles.avatar}
            />
            {isEditing && (
              <TouchableOpacity style={styles.cameraButton} onPress={handleChangePhoto}>
                <Ionicons name="camera" size={16} color="white" />
              </TouchableOpacity>
            )}
          </View>
          
          <Text style={styles.driverName}>{formData.fullName}</Text>
          <Text style={styles.driverId}>Driver ID: #DR12345</Text>
          
          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>On Duty</Text>
          </View>
        </View>

        {/* Driver Information Card */}
        <View style={styles.infoCard}>
          <View style={styles.cardHeader}>
            <Ionicons name="person" size={20} color="#4A90E2" />
            <Text style={styles.cardTitle}>Driver Information</Text>
          </View>
          
          <View style={styles.cardContent}>

            {/* Full Name */}
            <View style={styles.infoRow}>
              <Text style={styles.label}>Full Name</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={formData.fullName}
                  onChangeText={(text) => handleInputChange('fullName', text)}
                  placeholder="Enter full name"
                  autoCapitalize="words"
                />
              ) : (
                <Text style={styles.value}>{formData.fullName}</Text>
              )}
            </View>
            
            {/* Phone Number */}
            <View style={styles.infoRow}>
              <Text style={styles.label}>Phone Number</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={formData.phone}
                  onChangeText={(text) => handleInputChange('phone', text)}
                  placeholder="Enter phone number"
                  keyboardType="phone-pad"
                />
              ) : (
                <Text style={styles.value}>{formData.phone}</Text>
              )}
            </View>

            {/* Email Address */}
            <View style={styles.infoRow}>
              <Text style={styles.label}>Email Address</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={formData.email}
                  onChangeText={(text) => handleInputChange('email', text)}
                  placeholder="Enter email address"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              ) : (
                <Text style={styles.value}>{formData.email}</Text>
              )}
            </View>

            {/* License Number */}
            <View style={styles.infoRow}>
              <Text style={styles.label}>License Number</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={formData.license}
                  onChangeText={(text) => handleInputChange('license', text)}
                  placeholder="Enter license number"
                  autoCapitalize="characters"
                />
              ) : (
                <Text style={styles.value}>{formData.license}</Text>
              )}
            </View>

            {/* Experience */}
            <View style={styles.infoRow}>
              <Text style={styles.label}>Experience</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={formData.experience}
                  onChangeText={(text) => handleInputChange('experience', text)}
                  placeholder="Enter experience"
                />
              ) : (
                <Text style={styles.value}>{formData.experience}</Text>
              )}
            </View>

            {/* Address */}
            <View style={styles.infoRow}>
              <Text style={styles.label}>Address</Text>
              {isEditing ? (
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={formData.address}
                  onChangeText={(text) => handleInputChange('address', text)}
                  placeholder="Enter address"
                  multiline={true}
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              ) : (
                <Text style={styles.value}>{formData.address}</Text>
              )}
            </View>

            {/* Bus Number */}
            <View style={styles.infoRow}>
              <Text style={styles.label}>Bus Number</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={formData.busNumber}
                  onChangeText={(text) => handleInputChange('busNumber', text)}
                  placeholder="Enter bus number"
                  autoCapitalize="characters"
                />
              ) : (
                <Text style={styles.value}>{formData.busNumber}</Text>
              )}
            </View>
          </View>
        </View>

        {/* Action Buttons - Only show when editing */}
        {isEditing && (
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Ionicons name="checkmark" size={20} color="white" />
              <Text style={styles.buttonText}>Save Changes</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <Ionicons name="close" size={20} color="white" />
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Settings Section */}
        {!isEditing && (
          <View style={styles.settingsSection}>
            
            <TouchableOpacity style={styles.settingItem}>
              <Ionicons name="help-circle" size={20} color="#4A90E2" />
              <Text style={styles.settingText}>Help & Support</Text>
              <Ionicons name="chevron-forward" size={16} color="#ccc" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.settingItem, styles.logoutItem]} 
              onPress={handleLogout}
            >
              <Ionicons name="log-out" size={20} color="#dc3545" />
              <Text style={[styles.settingText, styles.logoutText]}>Logout</Text>
              <Ionicons name="chevron-forward" size={16} color="#ccc" />
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default DriverAccountScreen;