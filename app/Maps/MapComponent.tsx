import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
  Dimensions,
  Alert,
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import styles from './MapStyles';

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
  const [location, setLocation] = useState<LocationData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const mapRef = useRef<MapView>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastSentLocation = useRef<LocationData | null>(null);

  const sendLocationToServer = async (loc: LocationData) => {
        if (!busName || busName.trim() === '') {
      console.log('Bus name not available yet, skipping location send');
      return;
    }
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
        throw new Error(`HTTP errors! status: ${response.status}`);
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

  const [routeCoords, setRouteCoords] = useState<{ latitude: number, longitude: number }[]>([]);

  const fetchORSRoute = async (stoppages: Stoppage[], busLocation: LocationData | null) => {
    if (!busLocation || stoppages.length === 0) return;

    // Sort stoppages by stoppage_number to ensure correct order
    const sortedStoppages = [...stoppages].sort((a, b) => a.stoppage_number - b.stoppage_number);

    const coordinates = [
      [busLocation.longitude, busLocation.latitude], // Bus as first point
      ...sortedStoppages.map(s => [s.longitude, s.latitude]), // Stoppages in order
    ];

    try {
      const response = await fetch('https://api.openrouteservice.org/v2/directions/driving-car/geojson', {
        method: 'POST',
        headers: {
          'Authorization': 'eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjNiYzhkN2YwNTgxMjRiN2I5M2UwYWFiOGFjZGM0OWJjIiwiaCI6Im11cm11cjY0In0=', // Replace with your actual API key
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          coordinates,
          instructions: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`ORS API error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const route = data.features[0].geometry.coordinates;

        const formatted = route.map(([lng, lat]: [number, number]) => ({
          latitude: lat,
          longitude: lng,
        }));

        setRouteCoords(formatted);
      } else {
        console.warn('No route found in ORS response');
        setRouteCoords([]);
      }
    } catch (error) {
      console.error('Error fetching route from ORS:', error);
      setRouteCoords([]);
    }
  };

  useEffect(() => {
    if (location && stoppages.length > 0) {
      fetchORSRoute(stoppages, location);
    }
  }, [location, stoppages]);

  // Sort stoppages by stoppage_number for display
  const sortedStoppages = [...stoppages].sort((a, b) => a.stoppage_number - b.stoppage_number);

  return (
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
            showsCompass={false}
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
            {sortedStoppages
              .filter(stoppage => stoppage.latitude && stoppage.longitude)
              .map((stoppage) => (
              <Marker
                key={stoppage.id}
                coordinate={{
                  latitude: stoppage.latitude!,
                  longitude: stoppage.longitude!,
                }}
                title={`Stop ${stoppage.stoppage_number}: ${stoppage.name}`}
                description={`Route: ${stoppage.route_name}`}
              >
                <View style={styles.stoppagesContainer}>
                  <Image
                    source={require('../../assets/images/bus-station.png')} 
                    style={{ width: 50, height: 50, }}
                     resizeMode="contain"
                  />
                  <View style={styles.stoppageNumber}>
                    <Text style={styles.stoppageNumberText}>
                      {stoppage.stoppage_number}
                    </Text>
                  </View>
                </View>
              </Marker>
            ))}

            {/* Route Polyline */}
            {routeCoords.length > 0 && (
              <Polyline
                coordinates={routeCoords}
                strokeColor="black"
                strokeWidth={2}
                geodesic={true}
              />
            )}
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
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
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
  );
};

export default MapComponent;