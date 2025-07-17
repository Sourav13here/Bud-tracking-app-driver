import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  StatusBar,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from './accountStyles';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Type definitions
interface DriverData {
  driver_name: string;
  driver_phone_no: string;
  driver_photo?: string;
  driver_address: string;
  bus_name: string;
  status: 'Active' | 'Inactive';
}

interface ApiResponse {
  success: boolean;
  driver?: DriverData;
  error?: string;
}

interface DriverAccountScreenProps {
  navigation?: any;
}

const DriverAccountScreen: React.FC<DriverAccountScreenProps> = ({ navigation }) => {
  const router = useRouter();
  
  const [driverData, setDriverData] = useState<DriverData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDriverData = useCallback(async (phoneNumber: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`http://192.168.39.204:8000/api/account/driver/${encodeURIComponent(phoneNumber)}`);
      const data: ApiResponse = await response.json();

      if (data.success && data.driver) {
        setDriverData(data.driver);
      } else {
        setError(data.error || 'Failed to fetch driver data');
      }
    } catch (err) {
      console.error('Error fetching driver data:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const getPhoneNumberAndFetchDriver = async () => {
      try {
        const storedPhone = await AsyncStorage.getItem('driverPhone');
        if (!storedPhone) {
          setError('No phone number found. Please log in again.');
          setLoading(false);
          return;
        }

        fetchDriverData(storedPhone);
      } catch (err) {
        console.error('Error accessing local storage', err);
        setError('Failed to load user data.');
        setLoading(false);
      }
    };

    getPhoneNumberAndFetchDriver();
  }, [fetchDriverData]);


  const handleLogout = useCallback(() => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          onPress: async () => {
            await AsyncStorage.removeItem('driverPhone');
            await AsyncStorage.removeItem('busName');
            router.replace('/loginPage/loginPage'); 
          }
        },
      ]
    );
  }, []);


  const handleRefresh = useCallback(async () => {
    try {
      const storedPhone = await AsyncStorage.getItem('driverPhone');
      if (!storedPhone) {
        setError('No phone number found. Please log in again.');
        return;
      }

      fetchDriverData(storedPhone);
    } catch (err) {
      console.error('Error refreshing driver data', err);
      setError('Unable to refresh data');
    }
  }, [fetchDriverData]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#f5f5f5" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4A90E2" />
          <Text style={styles.loadingText}>Loading driver information...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#f5f5f5" />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={50} color="#dc3545" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

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
          onPress={handleRefresh}
        >
          <Ionicons name="refresh" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollContainer} 
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={
                driverData?.driver_photo 
                  ? { uri: driverData.driver_photo }
                  : require('../../assets/images/react-logo.png')
              }
              style={styles.avatar}
            />
          </View>
          
          <Text style={styles.driverName}>{driverData?.driver_name || 'N/A'}</Text>
          
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
              <Text style={styles.value}>{driverData?.driver_name || 'N/A'}</Text>
            </View>
            
            {/* Phone Number */}
            <View style={styles.infoRow}>
              <Text style={styles.label}>Phone Number</Text>
              <Text style={styles.value}>{driverData?.driver_phone_no || 'N/A'}</Text>
            </View>

            {/* Address */}
            <View style={styles.infoRow}>
              <Text style={styles.label}>Address</Text>
              <Text style={styles.value}>{driverData?.driver_address || 'N/A'}</Text>
            </View>

            {/* Bus Number */}
            <View style={styles.infoRow}>
              <Text style={styles.label}>Bus Number</Text>
              <Text style={styles.value}>{driverData?.bus_name || 'N/A'}</Text>
            </View>

            {/* Status */}
            <View style={styles.infoRow}>
              <Text style={styles.label}>Status</Text>
              <Text style={[
                styles.value,
                { color: driverData?.status === 'Active' ? '#28a745' : '#ffc107' }
              ]}>
                {driverData?.status === 'Active' ? 'Active' : 'Inactive'}
              </Text>
            </View>
          </View>
        </View>

        {/* Settings Section */}
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
      </ScrollView>
    </SafeAreaView>
  );
};

export default DriverAccountScreen;