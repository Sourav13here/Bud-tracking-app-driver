import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
  Dimensions,
  Alert,
} from 'react-native';
import MapView, { Marker, Polyline, AnimatedRegion } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import styles from './MapStyles';
import BACKGROUND_LOCATION_TASK from '../../utils/backgroundLocation';
import * as TaskManager from 'expo-task-manager';

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
  stoppage_number: number;
}

interface MapComponentProps {
  busName: string;
  stoppages: Stoppage[];
  isMapExpanded: boolean;
  mapHeight: Animated.Value;
}

const MapComponent: React.FC<MapComponentProps> = ({
  busName,
  stoppages,
  isMapExpanded,
  mapHeight,
}) => {
  const [mapReady, setMapReady] = useState(false);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [animatedCoord, setAnimatedCoord] = useState<AnimatedRegion | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [routeCoords, setRouteCoords] = useState<{ latitude: number; longitude: number }[]>([]);
  const [isInitializing, setIsInitializing] = useState(true);
  const AnimatedMarker = Animated.createAnimatedComponent(Marker);

  const mapRef = useRef<MapView>(null);
  const locationSubscriptionRef = useRef<Location.LocationSubscription | null>(null);
  const lastSentLocation = useRef<LocationData | null>(null);
  const isLocationUpdateInProgress = useRef(false);
  const lastLocationTimestamp = useRef<number>(0);
  const pendingLocationUpdate = useRef<NodeJS.Timeout | number | null>(null);

  const SCHOOL_COORDINATE = { latitude: 26.185597, longitude: 91.745508 };

  // Memoize sorted stoppages to avoid re-sorting on every render
  const sortedStoppages = useMemo(() => 
    [...stoppages].sort((a, b) => a.stoppage_number - b.stoppage_number),
    [stoppages]
  );

  const initialRegion = useMemo(() => ({
    latitude: SCHOOL_COORDINATE.latitude,
    longitude: SCHOOL_COORDINATE.longitude,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  }), []);

  const hasLocationChanged = useCallback((newLoc: LocationData, oldLoc: LocationData | null) => {
    if (!oldLoc) return true;

    const latDiff = Math.abs(newLoc.latitude - oldLoc.latitude);
    const lngDiff = Math.abs(newLoc.longitude - oldLoc.longitude);
    
    const threshold = 0.0002; // 20 meters
    return latDiff > threshold || lngDiff > threshold;
  }, []);

  const sendLocationToServer = useCallback(async (loc: LocationData) => {
    if (!busName || busName.trim() === '') {
      console.log('Bus name not available yet, skipping location send');
      return;
    }

    // Prevent duplicate sends
    if (isLocationUpdateInProgress.current) {
      console.log('Location update already in progress, skipping');
      return;
    }

    if (!hasLocationChanged(loc, lastSentLocation.current)) {
      console.log('Location unchanged, skipping send');
      return;
    }

    // Prevent rapid-fire updates 
    const now = Date.now();

    // if (now - lastLocationTimestamp.current < 10000) {
    //   console.log('Too soon since last update, skipping');
    //   return;
    // }

    isLocationUpdateInProgress.current = true;
    lastLocationTimestamp.current = now;

    try {
      const response = await fetch('http://192.168.39.204:8000/api/bus/location', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          bus_name: busName,
          bus_latitude: loc.latitude,
          bus_longitude: loc.longitude,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      console.log('Location sent successfully:', data);
      lastSentLocation.current = loc;
    } catch (err) {
      console.error('Failed to send location:', err);
    } finally {
      isLocationUpdateInProgress.current = false;
    }
  }, [busName, hasLocationChanged]);

  // Debounced location update function
  const debouncedLocationUpdate = useCallback((newLocation: LocationData) => {
    // Clear any pending updates
    if (pendingLocationUpdate.current) {
      clearTimeout(pendingLocationUpdate.current);
    }

    // Set new debounced update
    // pendingLocationUpdate.current = setTimeout(() => {
    //   sendLocationToServer(newLocation);
    // }, 2000); 
  }, [sendLocationToServer]);

  const startBackgroundTracking = useCallback(async () => {
    const { status } = await Location.requestBackgroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Background location permission not granted');
      return;
    }

    const isTaskDefined = TaskManager.isTaskDefined(BACKGROUND_LOCATION_TASK);
    const hasStarted = await Location.hasStartedLocationUpdatesAsync(BACKGROUND_LOCATION_TASK);

    if (isTaskDefined && !hasStarted) {
      await Location.startLocationUpdatesAsync(BACKGROUND_LOCATION_TASK, {
        accuracy: Location.Accuracy.Balanced,
        distanceInterval: 20, // 20 meters
        pausesUpdatesAutomatically: false,
        foregroundService: {
          notificationTitle: 'Bus is being tracked',
          notificationBody: 'Location updates are running in the background',
          notificationColor: '#000000',
        },
      });
      console.log('Background location tracking started');
    }
  }, []);

  const fetchORSRoute = useCallback(async (stoppages: Stoppage[], busLocation: LocationData | null) => {
    if (!busLocation || stoppages.length === 0) 
      return;

    const coordinates = [
      [busLocation.longitude, busLocation.latitude],
      ...sortedStoppages.map((s) => [s.longitude, s.latitude]),
      [SCHOOL_COORDINATE.longitude, SCHOOL_COORDINATE.latitude],
    ];

    try {
      const response = await fetch('https://api.openrouteservice.org/v2/directions/driving-car/geojson', {
        method: 'POST',
        headers: {
          Authorization: 'eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjNiYzhkN2YwNTgxMjRiN2I5M2UwYWFiOGFjZGM0OWJjIiwiaCI6Im11cm11cjY0In0=',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          coordinates,
          instructions: false,
        }),
      });

      const data = await response.json();
      if (data.features && data.features.length > 0) {
        const route = data.features[0].geometry.coordinates;
        const formatted = route.map(([lng, lat]: [number, number]) => ({
          latitude: lat,
          longitude: lng,
        }));
        setRouteCoords(formatted);
      } else {
        setRouteCoords([]);
      }
    } catch (error) {
      console.error('ORS route error:', error);
      setRouteCoords([]);
    }
  }, [sortedStoppages]);

  // Initialize location
  useEffect(() => {
    const initializeLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          setIsInitializing(false);
          Alert.alert('Location Permission', 'Please enable location permission to track the bus');
          return;
        }

        // Get initial location
        const initialLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        const formattedLocation = {
          latitude: initialLocation.coords.latitude,
          longitude: initialLocation.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        setLocation(formattedLocation);
        setIsInitializing(false);

        const animatedRegion = new AnimatedRegion({
          latitude: formattedLocation.latitude,
          longitude: formattedLocation.longitude,
          latitudeDelta: formattedLocation.latitudeDelta,
          longitudeDelta: formattedLocation.longitudeDelta,
        });
        setAnimatedCoord(animatedRegion);
        
        // Send initial location immediately
        await sendLocationToServer(formattedLocation);
        
        // Start background tracking
        await startBackgroundTracking();

        // Set up location watching/updates
      locationSubscriptionRef.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 3000, // 3 seconds
          distanceInterval: 10, //10 meters
        },
        (newLocation) => {
          const updatedLocation = {
            latitude: newLocation.coords.latitude,
            longitude: newLocation.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          };

          setLocation(updatedLocation);

          // Update animated coordinate 
          setAnimatedCoord(prevAnimatedCoord => {
            if (prevAnimatedCoord && typeof prevAnimatedCoord.animate === 'function') {
              prevAnimatedCoord.animate({
                latitude: updatedLocation.latitude,
                longitude: updatedLocation.longitude,
                latitudeDelta: updatedLocation.latitudeDelta,
                longitudeDelta: updatedLocation.longitudeDelta,
                duration: 1000,
              });
              return prevAnimatedCoord;
            } else {
              // Create new AnimatedRegion if previous one is invalid
              return new AnimatedRegion({
                latitude: updatedLocation.latitude,
                longitude: updatedLocation.longitude,
                latitudeDelta: updatedLocation.latitudeDelta,
                longitudeDelta: updatedLocation.longitudeDelta,
              });
            }
          });

          // Use debounced update instead of direct sending
          debouncedLocationUpdate(updatedLocation);

          // Only animate if map is ready and expanded
          if (mapReady && isMapExpanded) {
            mapRef.current?.animateToRegion(updatedLocation, 1000);
          }
        }
      );

      } catch (error) {
        console.error('Error initializing location:', error);
        setErrorMsg('Failed to get location. Please try again.');
        setIsInitializing(false);
      }
    };

    initializeLocation();

    return () => {
      if (locationSubscriptionRef.current) {
        locationSubscriptionRef.current.remove();
      }
      if (pendingLocationUpdate.current) {
        clearTimeout(pendingLocationUpdate.current);
      }
    };
  }, [sendLocationToServer, startBackgroundTracking, mapReady, isMapExpanded, debouncedLocationUpdate]);

  // Debounced route fetching
  useEffect(() => {
    if (location && stoppages.length > 0) {
      const timeoutId = setTimeout(() => {
        fetchORSRoute(stoppages, location);
      }, 500); // Debounce route fetching

      return () => clearTimeout(timeoutId);
    }
  }, [location, stoppages, fetchORSRoute]);

  const handleLocatePress = useCallback(() => {
    if (location) {
      mapRef.current?.animateToRegion(
        {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1000
      );
    }
  }, [location]);

  const handleMapReady = useCallback(() => {
    setMapReady(true);
  }, []);

  return (
    <Animated.View style={[styles.mapContainer, { height: mapHeight }]}>
      {isInitializing ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Initializing location...</Text>
        </View>
      ) : location ? (
        <View style={{ flex: 1, position: 'relative' }}>
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={initialRegion}
            showsUserLocation={false}
            loadingEnabled={true}
            showsMyLocationButton={false}
            followsUserLocation={false}
            showsCompass={false}
            showsScale={false}
            showsBuildings={false}
            showsIndoors={false}
            showsTraffic={false}
            onMapReady={handleMapReady}
            mapType="standard"
            pitchEnabled={false}
            rotateEnabled={false}
            scrollEnabled={true}
            zoomEnabled={true}
          >
            {mapReady && (
              <>
                <Marker coordinate={SCHOOL_COORDINATE} title="School">
                  <Image
                    source={require('../../assets/images/school.png')}
                    style={{ width: 40, height: 40 }}
                    resizeMode="contain"
                  />
                </Marker>

                <AnimatedMarker
                  coordinate={animatedCoord as any} title="Bus Location">
                  <View style={styles.busMarker}>
                    <Text style={styles.busEmoji}>🚌</Text>
                  </View>
                </AnimatedMarker>

                {sortedStoppages.map((stoppage) => (
                  <Marker
                    key={stoppage.id}
                    coordinate={{
                      latitude: stoppage.latitude,
                      longitude: stoppage.longitude,
                    }}
                    title={`Stop ${stoppage.stoppage_number}: ${stoppage.name}`}
                    description={`Route: ${stoppage.route_name}`}
                  >
                    <View style={styles.stoppagesContainer}>
                      <Image
                        source={require('../../assets/images/bus-station.png')}
                        style={{ width: 50, height: 50 }}
                        resizeMode="contain"
                      />
                      <View style={styles.stoppageNumber}>
                        <Text style={styles.stoppageNumberText}>{stoppage.stoppage_number}</Text>
                      </View>
                    </View>
                  </Marker>
                ))}

                {routeCoords.length > 0 && (
                  <Polyline
                    coordinates={routeCoords}
                    strokeColor="black"
                    strokeWidth={2}
                    geodesic={true}
                  />
                )}
              </>
            )}
          </MapView>

          <TouchableOpacity
            onPress={handleLocatePress}
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
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              zIndex: 100,
            }}
          >
            <Ionicons name="locate" size={20} color="white" />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>{errorMsg || 'Loading map...'}</Text>
        </View>
      )}
    </Animated.View>
  );
};

export default MapComponent;