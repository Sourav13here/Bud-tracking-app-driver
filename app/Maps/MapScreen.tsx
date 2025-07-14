import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
  Dimensions,
  Alert,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import MapComponent from './MapComponent';
import StoppageComponent from './StoppageComponent';
import styles from './MapStyles';

const { height: screenHeight } = Dimensions.get('window');

interface Stoppage {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  route_name: string;
  stoppage_name: string;
  stoppage_latitude: number;
  stoppage_longitude: number;
  stoppage_number: number;
}

const MapScreen = () => {
  const router = useRouter();
  
  const [mapHeight] = useState(new Animated.Value(screenHeight * 0.75));
  const [isMapExpanded, setIsMapExpanded] = useState(true);
  const [driverPhone, setDriverPhone] = useState<string | null>(null);
  const [stoppages, setStoppages] = useState<Stoppage[]>([]);
  const [busName, setBusName] = useState<string>('');
  const animationInProgress = useRef(false);

  // Get driver's phone number from AsyncStorage
  useEffect(() => {
    const getDriverPhone = async () => {
      try {
        const phone = await AsyncStorage.getItem('driverPhone');

        if (phone) {
          setDriverPhone(phone);

          // Fetch bus name from backend using phone
          const response = await fetch(`http://192.168.47.204:8000/api/bus_name/${phone}`);
          const data = await response.json();

          if (data.success) {
            setBusName(data.bus_name);
          } else {
            Alert.alert('Error', 'Bus not found for this driver');
          }
        } else {
          // If no phone number found, redirect to login
          Alert.alert('Authentication Required', 'Please login again', [
            { text: 'OK', onPress: () => router.push('/') }
          ]);
        }
      } catch (error) {
        console.error('Error fetching phone or bus name:', error);
        Alert.alert('Error', 'Failed to get user or bus information');
      }
    };
    getDriverPhone();
  }, []);


  const handleScrollEnd = useCallback((event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;

    if (animationInProgress.current) return;

    if (offsetY > 20 && isMapExpanded) {
      animationInProgress.current = true;
      setIsMapExpanded(false);
      Animated.timing(mapHeight, {
        toValue: screenHeight * 0.55,
        duration: 250,
        useNativeDriver: false,
      }).start(() => {
        animationInProgress.current = false;
      });
    } else if (offsetY <= 20 && !isMapExpanded) {
      animationInProgress.current = true;
      setIsMapExpanded(true);
      Animated.timing(mapHeight, {
        toValue: screenHeight * 0.75,
        duration: 250,
        useNativeDriver: false,
      }).start(() => {
        animationInProgress.current = false;
      });
    }
  }, [isMapExpanded, mapHeight]);

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.headerLeft}>
        <Image
          source={require('../../assets/images/company_logo.jpeg')}
          style={styles.logo}
        />
        <Text style={styles.companyName}>Geekx Workx</Text>
      </View>
      <TouchableOpacity
        style={styles.accountButton}
        onPress={() => router.push('/AccountPage/accountPage')}
      >
        <Ionicons name="person" size={22} color="white" />
      </TouchableOpacity>
    </View>
  );

  // Callback to receive stoppages from StoppageComponent
  const handleStoppagesUpdate = useCallback((updatedStoppages: Stoppage[]) => {
    setStoppages(updatedStoppages);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />

      {/* Map Component */}
      <MapComponent
        busName={busName}
        stoppages={stoppages}
        isMapExpanded={isMapExpanded}
        mapHeight={mapHeight}
      />

      {/* Floating Header */}
      {renderHeader()}

      {/* Bus Stoppages Component */}
      <StoppageComponent
        driverPhone={driverPhone}
        onScrollEnd={handleScrollEnd}
        onStoppagesUpdate={handleStoppagesUpdate}
      />
    </View>
  );
};

export default MapScreen;