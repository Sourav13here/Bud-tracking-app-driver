import React, { useState } from 'react';
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

const router = useRouter();

const DriverAccountScreen = ({ navigation }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [driverData, setDriverData] = useState({
    fullName: 'Ravi Kumar',
    phone: '+91 7453627840',
    email: 'ravi.kumar@gmail.com',
    license: 'AS01BH6574',
    experience: '8 Years',
    address: 'Nirala,Karimganj,Assam',
  });

  const [busData, setBusData] = useState({
    busNumber: 'BUS-401',
    routeName: 'Downtown Express',
    routeCode: 'RT-15A',
    vehicleModel: 'Bus',
    capacity: '45 Passengers',
    fuelType: 'Diesel',
  });

  const [tempDriverData, setTempDriverData] = useState({ ...driverData });
  const [tempBusData, setTempBusData] = useState({ ...busData });

  const toggleEdit = () => {
    if (isEditing) {
      // Cancel edit - reset temp data
      setTempDriverData({ ...driverData });
      setTempBusData({ ...busData });
    } else {
      // Start editing - copy current data to temp
      setTempDriverData({ ...driverData });
      setTempBusData({ ...busData });
    }
    setIsEditing(!isEditing);
  };

  const saveChanges = () => {
    setDriverData({ ...tempDriverData });
    setBusData({ ...tempBusData });
    setIsEditing(false);
    Alert.alert('Success', 'Changes saved successfully!');
  };

  const handleDriverDataChange = (field, value) => {
    setTempDriverData({ ...tempDriverData, [field]: value });
  };

  const handleBusDataChange = (field, value) => {
    setTempBusData({ ...tempBusData, [field]: value });
  };

  const changePhoto = () => {
    Alert.alert(
      'Change Photo',
      'Choose an option',
      [
        { text: 'Camera', onPress: () => console.log('Camera pressed') },
        { text: 'Gallery', onPress: () => console.log('Gallery pressed') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: () => console.log('Logout pressed') },
      ]
    );
  };

  const InfoRow = ({ label, value, field, isDriver = true, multiline = false }) => (
    <View style={styles.infoRow}>
      <Text style={styles.label}>{label}</Text>
      {isEditing ? (
        <TextInput
          style={[styles.input, multiline && styles.textArea]}
          value={isDriver ? tempDriverData[field] : tempBusData[field]}
          onChangeText={(text) => 
            isDriver ? handleDriverDataChange(field, text) : handleBusDataChange(field, text)
          }
          multiline={multiline}
          numberOfLines={multiline ? 3 : 1}
        />
      ) : (
        <Text style={[styles.value, multiline && styles.multilineValue]}>{value}</Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#f5f5f5" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.headerButton} 
          onPress={() => router.push('../Maps/MapScreen')}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>My Account</Text>

        <TouchableOpacity style={styles.headerButton} onPress={toggleEdit}>
          <Ionicons 
            name={isEditing ? "close" : "create-outline"} 
            size={24} 
            color="white" 
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: 'https://via.placeholder.com/100x100/4A90E2/FFFFFF?text=JD' }}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.cameraButton} onPress={changePhoto}>
              <Ionicons name="camera" size={16} color="white" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.driverName}>{driverData.fullName}</Text>
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
            <InfoRow 
              label="Full Name" 
              value={driverData.fullName} 
              field="fullName" 
            />
            <InfoRow 
              label="Phone Number" 
              value={driverData.phone} 
              field="phone" 
            />
            <InfoRow 
              label="Email Address" 
              value={driverData.email} 
              field="email" 
            />
            <InfoRow 
              label="License Number" 
              value={driverData.license} 
              field="license" 
            />
            <InfoRow 
              label="Experience" 
              value={driverData.experience} 
              field="experience" 
            />
            <InfoRow 
              label="Address" 
              value={driverData.address} 
              field="address" 
              multiline={true}
            />
          </View>
        </View>

        {/* Bus Information Card */}
        <View style={styles.infoCard}>
          <View style={styles.cardHeader}>
            <Ionicons name="bus" size={20} color="#4A90E2" />
            <Text style={styles.cardTitle}>Bus Information</Text>
          </View>
          
          <View style={styles.cardContent}>
            <InfoRow 
              label="Bus Number" 
              value={busData.busNumber} 
              field="busNumber" 
              isDriver={false}
            />
            <InfoRow 
              label="Route Name" 
              value={busData.routeName} 
              field="routeName" 
              isDriver={false}
            />
            <InfoRow 
              label="Route Code" 
              value={busData.routeCode} 
              field="routeCode" 
              isDriver={false}
            />
            <InfoRow 
              label="Vehicle Model" 
              value={busData.vehicleModel} 
              field="vehicleModel" 
              isDriver={false}
            />
            <InfoRow 
              label="Capacity" 
              value={busData.capacity} 
              field="capacity" 
              isDriver={false}
            />
            <InfoRow 
              label="Fuel Type" 
              value={busData.fuelType} 
              field="fuelType" 
              isDriver={false}
            />
          </View>
        </View>

        {/* Action Buttons - Only show when editing */}
        {isEditing && (
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.saveButton} onPress={saveChanges}>
              <Ionicons name="checkmark" size={20} color="white" />
              <Text style={styles.buttonText}>Save Changes</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.cancelButton} onPress={toggleEdit}>
              <Ionicons name="close" size={20} color="white" />
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Settings Section */}
        <View style={styles.settingsSection}>
          
          <TouchableOpacity style={styles.settingItem}>
            <Ionicons name="help-circle" size={20} color="#4A90E2" />
            <Text style={styles.settingText}>Help & Support</Text>
            <Ionicons name="chevron-forward" size={16} color="#ccc" />
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.settingItem, styles.logoutItem]} onPress={handleLogout}>
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