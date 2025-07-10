import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Animated,
  Dimensions,
  Alert,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './MapStyles';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { height: screenHeight } = Dimensions.get('window');

interface LocationData {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

interface Stoppage {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  route_name: string;
  stoppage_name: string;
  stoppage_latitude: number;
  stoppage_longitude: number;
}

const MapScreen = () => {
  const router = useRouter();
  const busName = 'B002'; // change this dynamically if needed

  const [location, setLocation] = useState<LocationData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [mapHeight] = useState(new Animated.Value(screenHeight * 0.65));
  const [isMapExpanded, setIsMapExpanded] = useState(true);
  const [stoppages, setStoppages] = useState<Stoppage[]>([]);
  const [isLoadingStoppages, setIsLoadingStoppages] = useState(true);
  const [driverPhone, setDriverPhone] = useState<string | null>(null);
  
  const mapRef = useRef<MapView>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const animationInProgress = useRef(false);
  const lastSentLocation = useRef<LocationData | null>(null);

  // Get driver's phone number from AsyncStorage
  useEffect(() => {
    const getDriverPhone = async () => {
      try {
        const phone = await AsyncStorage.getItem('driverPhone');
        if (phone) {
          setDriverPhone(phone);
        } else {
          // If no phone number found, redirect to login
          Alert.alert('Authentication Required', 'Please login again', [
            { text: 'OK', onPress: () => router.push('/') }
          ]);
        }
      } catch (error) {
        console.error('Error getting driver phone:', error);
        Alert.alert('Error', 'Failed to get user information');
      }
    };

    getDriverPhone();
  }, []);

  // Fetch stoppages when driver phone is available
  useEffect(() => {
    if (driverPhone) {
      fetchStoppages();
    }
  }, [driverPhone]);

  const fetchStoppages = async () => {
    if (!driverPhone) return;

    try {
      setIsLoadingStoppages(true);
      console.log('Fetching stoppages for phone:', driverPhone);

      const response = await fetch(`http://192.168.47.204:8000/api/route/stoppages/${driverPhone}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Stoppages response:', data);

      if (data.success && data.stoppages) {
        // Transform the data to match the expected format
        const transformedStoppages = data.stoppages.map((stoppage, index) => ({
          id: `${index + 1}`,
          name: stoppage.stoppage_name,
          latitude: Number(stoppage.stoppage_latitude),
          longitude: Number(stoppage.stoppage_longitude),
          route_name: stoppage.route_name,
          stoppage_name: stoppage.stoppage_name,
          stoppage_latitude: Number(stoppage.stoppage_latitude),
          stoppage_longitude: Number(stoppage.stoppage_longitude),
        }));

        setStoppages(transformedStoppages);
      } else {
        setStoppages([]);
        Alert.alert('No Stoppages', 'No stoppages found for your route');
      }
    } catch (error) {
      console.error('Error fetching stoppages:', error);
      Alert.alert('Error', 'Failed to fetch stoppages. Please try again.');
      setStoppages([]);
    } finally {
      setIsLoadingStoppages(false);
    }
  };

  const sendLocationToServer = async (loc: LocationData) => {
    try {
      console.log('Sending location to server:', {
        bus_name: busName,
        latitude: loc.latitude,
        longitude: loc.longitude,
      });

      const response = await fetch('http://192.168.47.204:8000/api/bus/location', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          bus_name: busName,
          bus_latitude: loc.latitude,
          bus_longitude: loc.longitude,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Location sent successfully:', data);
      
      // Update the last sent location
      lastSentLocation.current = loc;
      
    } catch (err) {
      console.error('Failed to send location:', err);
    }
  };

  // Function to check if location has changed significantly
  const hasLocationChanged = (newLoc: LocationData, oldLoc: LocationData | null) => {
    if (!oldLoc) return true;
    
    const latDiff = Math.abs(newLoc.latitude - oldLoc.latitude);
    const lngDiff = Math.abs(newLoc.longitude - oldLoc.longitude);
    
    // Send update if location changed by more than ~5 meters (0.00005 degrees)
    return latDiff > 0.00005 || lngDiff > 0.00005;
  };

  useEffect(() => {
    let locationSubscription: Location.LocationSubscription;

    const initializeLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          Alert.alert('Location Permission', 'Please enable location permission to track the bus');
          return;
        }

        // Get initial location
        const initialLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        
        const formattedLocation = {
          latitude: initialLocation.coords.latitude,
          longitude: initialLocation.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        
        setLocation(formattedLocation);
        
        // Send initial location to server
        await sendLocationToServer(formattedLocation);

        // Start watching position changes
        locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 3000, // Update every 3 seconds
            distanceInterval: 5, // Update when moved 5 meters
          },
          (newLocation) => {
            const updatedLocation = {
              latitude: newLocation.coords.latitude,
              longitude: newLocation.coords.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            };
            
            setLocation(updatedLocation);
            
            // Animate map to new location
            mapRef.current?.animateToRegion(updatedLocation, 1000);
          }
        );

      } catch (error) {
        console.error('Error initializing location:', error);
        setErrorMsg('Failed to get location. Please try again.');
      }
    };

    initializeLocation();

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []);

  // Separate useEffect for sending location updates every 3 seconds
  useEffect(() => {
    if (location) {
      // Clear any existing interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      // Start new interval to send location every 3 seconds
      intervalRef.current = setInterval(() => {
        if (location && hasLocationChanged(location, lastSentLocation.current)) {
          sendLocationToServer(location);
        }
      }, 3000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [location]); // This will restart the interval when location changes

  const handleScrollEnd = useCallback((event) => {
    const offsetY = event.nativeEvent.contentOffset.y;

    if (animationInProgress.current) return;

    if (offsetY > 20 && isMapExpanded) {
      animationInProgress.current = true;
      setIsMapExpanded(false);
      Animated.timing(mapHeight, {
        toValue: screenHeight * 0.4,
        duration: 250,
        useNativeDriver: false,
      }).start(() => {
        animationInProgress.current = false;
      });
    } else if (offsetY <= 20 && !isMapExpanded) {
      animationInProgress.current = true;
      setIsMapExpanded(true);
      Animated.timing(mapHeight, {
        toValue: screenHeight * 0.65,
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
        <Text style={styles.companyName}>Company Name</Text>
      </View>
      <TouchableOpacity
        style={styles.accountButton}
        onPress={() => router.push('../AccountPage/accountPage')}
      >
        <Text style={styles.accountIcon}>👤</Text>
      </TouchableOpacity>
    </View>
  );

  const renderStoppage = useCallback(({ item, index }) => (
    <View style={styles.stoppageItem}>
      <View style={styles.stoppageNumber}>
        <Text style={styles.stoppageNumberText}>{index + 1}</Text>
      </View>
      <View style={styles.stoppageDetails}>
        <Text style={styles.stoppageName}>{item.name}</Text>
        {item.latitude && item.longitude ? (
          <Text style={styles.stoppageCoordinates}>
            Lat: {item.latitude.toFixed(6)}, Long: {item.longitude.toFixed(6)}
          </Text>
        ) : (
          <Text style={styles.stoppageCoordinates}>
            Coordinates not available
          </Text>
        )}
        <Text style={styles.stoppageRoute}>Route: {item.route_name}</Text>
      </View>
    </View>
  ), []);

  const handleRefreshStoppages = () => {
    if (driverPhone) {
      fetchStoppages();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      
      {/* Header */}
      {renderHeader()}

      {/* Map Section */}
      <Animated.View style={[styles.mapContainer, { height: mapHeight }]}>
        {location ? (
          <View style={{ flex: 1, position: 'relative' }}>
            <MapView
              ref={mapRef}
              style={styles.map}
              initialRegion={location}
              showsUserLocation={true}
              loadingEnabled={true}
              showsMyLocationButton={false}
              followsUserLocation={false}
            >
              {/* Bus Location Marker */}
              {location && (
                <Marker
                  coordinate={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                  }}
                  title="Bus Location"
                  description="Driver's current location"
                >
                  <View style={styles.busMarker}>
                    <Text style={styles.busEmoji}>🚌</Text>
                  </View>
                </Marker>
              )}

              {/* Stoppage Markers */}
              {stoppages
                .filter(stoppage => stoppage.latitude && stoppage.longitude)
                .map((stoppage, index) => (
                <Marker
                  key={stoppage.id}
                  coordinate={{
                    latitude: stoppage.latitude!,
                    longitude: stoppage.longitude!,
                  }}
                  title={stoppage.name}
                  description={`Stop ${index + 1}: ${stoppage.route_name}`}
                >
                  <View style={styles.stoppageMarker}>
                    <Text style={styles.stoppageMarkerText}>{index + 1}</Text>
                  </View>
                </Marker>
              ))}
            </MapView>

            {/* Custom Location Button */}
            {location && (
              <TouchableOpacity
                onPress={() => {
                  mapRef.current?.animateToRegion({
                    latitude: location.latitude,
                    longitude: location.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }, 1000);
                }}
                style={{
                  position: 'absolute',
                  bottom: 30,
                  right: 20,
                  backgroundColor: 'black',
                  borderRadius: 50,
                  width: 50,
                  height: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                  elevation: 6,
                  zIndex: 100,
                }}
              >
                <Ionicons name="locate" size={20} color="white" />
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>
              {errorMsg || 'Loading map...'}
            </Text>
          </View>
        )}
      </Animated.View>

      {/* Stoppages List Section */}
      <View style={styles.stoppagesContainer}>
        <View style={styles.stoppagesHeader}>
          <Text style={styles.stoppagesTitle}>Bus Stoppages</Text>
          <View style={styles.stoppagesHeaderRight}>
            <Text style={styles.stoppagesSubtitle}>
              {stoppages.length} stops on this route
            </Text>
            <TouchableOpacity
              onPress={handleRefreshStoppages}
              style={styles.refreshButton}
            >
              <Ionicons name="refresh" size={20} color="#007AFF" />
            </TouchableOpacity>
          </View>
        </View>
        
        {isLoadingStoppages ? (
          <View style={styles.loadingStoppagesContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingStoppagesText}>Loading stoppages...</Text>
          </View>
        ) : stoppages.length > 0 ? (
          <FlatList
            data={stoppages}
            renderItem={renderStoppage}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            onMomentumScrollEnd={handleScrollEnd}
            removeClippedSubviews={true} 
            maxToRenderPerBatch={10} 
            updateCellsBatchingPeriod={50} 
            windowSize={10} 
            contentContainerStyle={styles.stoppagesList}
          />
        ) : (
          <View style={styles.noStoppagesContainer}>
            <Text style={styles.noStoppagesText}>No stoppages found</Text>
            <TouchableOpacity
              onPress={handleRefreshStoppages}
              style={styles.retryButton}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

export default MapScreen;