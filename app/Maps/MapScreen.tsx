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
  } from 'react-native';
  import MapView, { Marker } from 'react-native-maps';
  import * as Location from 'expo-location';
  import  styles  from './MapStyles';
  import { Ionicons } from '@expo/vector-icons';
  import { useRouter } from 'expo-router';

  const { height: screenHeight } = Dimensions.get('window');
  const router= useRouter();

  const MapScreen = () => {

      interface LocationData {
          latitude: number;
          longitude: number;
          latitudeDelta: number;
          longitudeDelta: number;
      }
    // State variables
    const [location, setLocation] = useState<LocationData | null>(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [mapHeight] = useState(new Animated.Value(screenHeight * 0.65)); // Initial map height 60% of screen
    const [isMapExpanded, setIsMapExpanded] = useState(true); // Track map state
    
    // Refs
    const mapRef = useRef<MapView>(null);
    const scrollY = useRef(new Animated.Value(0)).current;
    const animationInProgress = useRef(false); // Prevent multiple animations

    // Sample bus stoppages data
    const stoppages = [
      { id: '1', name: 'Fancy Bazar' },
      { id: '2', name: 'Paltan Bazar' },
      { id: '3', name: 'Panbazar' },
      { id: '4', name: 'Ganeshguri' },
      { id: '5', name: 'Dispur' },
      { id: '6', name: 'Hatigaon' },
      { id: '7', name: 'Beltola' },
      { id: '8', name: 'Kahilipara' },
      { id: '9', name: 'Jayanagar' },
      { id: '10', name: 'Christian Basti' },
    ];

    // Request location permissions and start tracking
    useEffect(() => {
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          Alert.alert('Location Permission', 'Please enable location permission to track the bus');
          return;
        }

        // Get initial location
        let initialLocation = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: initialLocation.coords.latitude,
          longitude: initialLocation.coords.longitude,
          latitudeDelta: 0.0100,
          longitudeDelta: 0.0100,
        });

        // Start watching location
        Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 2000, // Update every 2 seconds
            distanceInterval: 10, // Update every 10 meters
          },
          (newLocation) => {
            const updatedLocation = {
              latitude: newLocation.coords.latitude,
              longitude: newLocation.coords.longitude,
              latitudeDelta: 0.0100,
              longitudeDelta: 0.0100,
            };
            setLocation(updatedLocation);
            
            // Animate map to new location
            if (mapRef.current) {
              mapRef.current.animateToRegion(updatedLocation, 1000);
            }
          }
        );
      })();
    }, []);

      // Throttled scroll handler with state tracking
    const handleScrollEnd = useCallback((event) => {
      const offsetY = event.nativeEvent.contentOffset.y;
      
      // Only animate if state needs to change and no animation is in progress
      if (animationInProgress.current) return;
      
      if (offsetY > 20 && isMapExpanded) {
        // Shrink map
        animationInProgress.current = true;
        setIsMapExpanded(false);
        
        Animated.timing(mapHeight, {
          toValue: screenHeight * 0.4, // Shrink to 40% for better UX
          duration: 250,
          useNativeDriver: false,
        }).start(() => {
          animationInProgress.current = false;
        });
      } 
      else if (offsetY <= 20 && !isMapExpanded) {
        // Expand map
        animationInProgress.current = true;
        setIsMapExpanded(true);
        
        Animated.timing(mapHeight, {
          toValue: screenHeight * 0.65, // Expand to 60%
          duration: 250, 
          useNativeDriver: false,
        }).start(() => {
          animationInProgress.current = false;
        });
      }
    }, [isMapExpanded, mapHeight]);

    const handleMomentumScrollEnd = useCallback((event) => {
      handleScrollEnd(event);
    }, [handleScrollEnd]);

    // Header component
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

    // Stoppage item component 
    const renderStoppage = useCallback(({ item, index }) => (
      <View style={styles.stoppageItem}>
        <View style={styles.stoppageNumber}>
          <Text style={styles.stoppageNumberText}>{index + 1}</Text>
        </View>
        <Text style={styles.stoppageName}>{item.name}</Text>
      </View>
    ), []);

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
          </MapView>

          {/* ✅ Custom Button outside the MapView */}
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
            <Text style={styles.stoppagesSubtitle}>
              {stoppages.length} stops on this route
            </Text>
          </View>
          
          <FlatList
            data={stoppages}
            renderItem={renderStoppage}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            onMomentumScrollEnd={handleMomentumScrollEnd}
            removeClippedSubviews={true} 
            maxToRenderPerBatch={10} 
            updateCellsBatchingPeriod={50} 
            windowSize={10} 
            contentContainerStyle={styles.stoppagesList}
          />
        </View>
      </View>
    );
  };

  export default MapScreen;