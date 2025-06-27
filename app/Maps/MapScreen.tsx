import React, { useState, useEffect, useRef } from "react";
import {  
    View, 
    Text, 
    TouchableOpacity, 
    Alert,
    Dimensions,
    ActivityIndicator,
    ScrollView 
} from "react-native";
import MapView, { 
    Marker, 
    Polyline, 
    Circle,
    Callout,
    PROVIDER_GOOGLE 
} from "react-native-maps";
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import styles from './MapStyles';

const { width, height } = Dimensions.get('window');

interface BusData {
    id: number;
    coordinate: {
        latitude: number;
        longitude: number;
    };
    title: string;
    description: string;
    speed: number;
    capacity: string;
    nextStop: string;
    eta: string;
}

interface BusStop {
    id: number;
    coordinate: {
        latitude: number;
        longitude: number;
    };
    name: string;
    routes: string[];
}

interface LocationData {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
}

const MapScreen = () => {
    const router = useRouter();
    const mapRef = useRef<MapView>(null);
    
    // State management
    const [userLocation, setUserLocation] = useState<LocationData | null>(null);
    const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
    const [buses, setBuses] = useState<BusData[]>([
        {
            id: 1,
            coordinate: { latitude: 37.78825, longitude: -122.4324 },
            title: "Bus #101",
            description: "Route: Downtown Express",
            speed: 25,
            capacity: "75%",
            nextStop: "Union Square",
            eta: "3 min"
        },
        {
            id: 2,
            coordinate: { latitude: 37.79025, longitude: -122.4304 },
            title: "Bus #205",
            description: "Route: City Loop",
            speed: 18,
            capacity: "45%",
            nextStop: "Market Street",
            eta: "7 min"
        }
    ]);
    
    const [busStops, setBusStops] = useState<BusStop[]>([
        {
            id: 1,
            coordinate: { latitude: 37.7872, longitude: -122.4344 },
            name: "Central Station",
            routes: ["101", "205", "303"]
        },
        {
            id: 2,
            coordinate: { latitude: 37.7892, longitude: -122.4284 },
            name: "Union Square",
            routes: ["101", "150"]
        },
        {
            id: 3,
            coordinate: { latitude: 37.7912, longitude: -122.4264 },
            name: "Market Street",
            routes: ["205", "303"]
        }
    ]);
    
    const [selectedBus, setSelectedBus] = useState<BusData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [followUser, setFollowUser] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());

    // Bus route polyline coordinates
    const busRoute = [
        { latitude: 37.78825, longitude: -122.4324 },
        { latitude: 37.7872, longitude: -122.4344 },
        { latitude: 37.7892, longitude: -122.4284 },
        { latitude: 37.7912, longitude: -122.4264 },
    ];

    // Get user location and start real-time tracking
    useEffect(() => {
        getUserLocation();
        startLocationTracking();
        
        // Update current time every minute
        const timeInterval = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);
        
        // Simulate real-time bus updates
        const busInterval = setInterval(updateBusPositions, 3000);
        
        return () => {
            clearInterval(timeInterval);
            clearInterval(busInterval);
        };
    }, []);

    const getUserLocation = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission denied', 'Location permission is required for navigation');
                setIsLoading(false);
                return;
            }

            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });
            
            const locationData = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            };
            
            setUserLocation(locationData);
            setCurrentLocation(locationData);
        } catch (error) {
            console.error('Error getting location:', error);
            Alert.alert('Location Error', 'Unable to get your current location');
        } finally {
            setIsLoading(false);
        }
    };

    const startLocationTracking = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') return;

            // Watch position changes for real-time navigation
            Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.High,
                    timeInterval: 2000, // Update every 2 seconds
                    distanceInterval: 10, // Update every 10 meters
                },
                (location) => {
                    const newLocation = {
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    };
                    
                    setCurrentLocation(newLocation);
                    
                    // Auto-center map if follow user is enabled
                    if (followUser && mapRef.current) {
                        mapRef.current.animateToRegion(newLocation, 1000);
                    }
                }
            );
        } catch (error) {
            console.error('Error starting location tracking:', error);
        }
    };

    const updateBusPositions = () => {
        setBuses(prevBuses => 
            prevBuses.map(bus => ({
                ...bus,
                coordinate: {
                    latitude: bus.coordinate.latitude + (Math.random() - 0.5) * 0.0008,
                    longitude: bus.coordinate.longitude + (Math.random() - 0.5) * 0.0008
                },
                speed: Math.floor(Math.random() * 25) + 15,
                eta: Math.floor(Math.random() * 8) + 2 + " min"
            }))
        );
    };

    const centerOnUser = () => {
        if (currentLocation && mapRef.current) {
            mapRef.current.animateToRegion(currentLocation, 1000);
            setFollowUser(true);
        }
    };

    const centerOnBus = (bus: BusData) => {
        if (mapRef.current) {
            mapRef.current.animateToRegion({
                ...bus.coordinate,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            }, 1000);
            setFollowUser(false);
        }
    };

  const getMarkerColor = (capacity: string) => {
        const cap = parseInt(capacity);
        if (cap < 30) return '#4CAF50'; // Green
        if (cap < 70) return '#FF9800'; // Orange
        return '#F44336'; // Red
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2196F3" />
                <Text style={styles.loadingText}>Loading navigation...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Map Section - Top Half */}
            <View style={styles.mapContainer}>
                <MapView
                    ref={mapRef}
                    provider={PROVIDER_GOOGLE}
                    style={styles.map}
                    showsUserLocation={true}
                    followsUserLocation={followUser}
                    showsMyLocationButton={false}
                    showsCompass={true}
                    showsScale={true}
                    initialRegion={userLocation || {
                        latitude: 37.78825,
                        longitude: -122.4324,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                    onPress={() => {
                        setSelectedBus(null);
                        setFollowUser(false);
                    }}
                >
                    {/* Bus route polyline */}
                    <Polyline
                        coordinates={busRoute}
                        strokeColor="#2196F3"
                        strokeWidth={4}
                        lineDashPattern={[10, 5]}
                    />

                    {/* Bus markers */}
                    {buses.map((bus) => (
                        <Marker
                            key={bus.id}
                            coordinate={bus.coordinate}
                            onPress={() => setSelectedBus(bus)}
                            pinColor={getMarkerColor(bus.capacity)}
                        >
                            <Callout>
                                <View style={styles.calloutContainer}>
                                    <Text style={styles.calloutTitle}>{bus.title}</Text>
                                    <Text style={styles.calloutText}>{bus.description}</Text>
                                    <Text style={styles.calloutText}>Speed: {bus.speed} mph</Text>
                                    <Text style={styles.calloutText}>Capacity: {bus.capacity}</Text>
                                    <Text style={styles.calloutText}>Next: {bus.nextStop}</Text>
                                    <Text style={styles.calloutText}>ETA: {bus.eta}</Text>
                                </View>
                            </Callout>
                        </Marker>
                    ))}

                    {/* Bus stops */}
                    {busStops.map((stop) => (
                        <Marker
                            key={`stop-${stop.id}`}
                            coordinate={stop.coordinate}
                            pinColor="blue"
                        >
                            <Callout>
                                <View style={styles.calloutContainer}>
                                    <Text style={styles.calloutTitle}>{stop.name}</Text>
                                    <Text style={styles.calloutText}>
                                        Routes: {stop.routes.join(', ')}
                                    </Text>
                                </View>
                            </Callout>
                        </Marker>
                    ))}

                    {/* User location circle */}
                    {currentLocation && (
                        <Circle
                            center={currentLocation}
                            radius={50}
                            strokeColor="rgba(33, 150, 243, 0.8)"
                            fillColor="rgba(33, 150, 243, 0.2)"
                            strokeWidth={2}
                        />
                    )}
                </MapView>

                {/* Current time overlay */}
                <View style={styles.timeOverlay}>
                    <Text style={styles.timeText}>
                        {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                </View>

                {/* Control buttons */}
                <View style={styles.controlsContainer}>
                    <TouchableOpacity 
                        style={[styles.controlButton, followUser && styles.activeControlButton]} 
                        onPress={centerOnUser}>
                        <Text style={styles.buttonText}>📍</Text>
                    </TouchableOpacity>
                </View>
            </View>


            {/* Bus Stoppages Section - Bottom Half */}
            <View style={styles.stoppagesContainer}>
                <View style={styles.stoppagesHeader}>
                    <Text style={styles.stoppagesTitle}>Bus Stoppages</Text>
                    <TouchableOpacity style={styles.addButton}>
                        <Text style={styles.addButtonText}>+ Add Route</Text>
                    </TouchableOpacity>
                </View>
                
                <ScrollView style={styles.stoppagesList} showsVerticalScrollIndicator={false}>
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyStateIcon}>🚌</Text>
                        <Text style={styles.emptyStateTitle}>No Routes Added</Text>
                        <Text style={styles.emptyStateText}>
                            Add your bus route stoppages to see real-time schedule and tracking information
                        </Text>
                        <TouchableOpacity style={styles.emptyStateButton}>
                            <Text style={styles.emptyStateButtonText}>Add First Route</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>

            {/* Bus info panel */}
            {selectedBus && (
                <View style={styles.infoPanel}>
                    <View style={styles.infoPanelHeader}>
                        <Text style={styles.infoPanelTitle}>{selectedBus.title}</Text>
                        <TouchableOpacity onPress={() => setSelectedBus(null)}>
                            <Text style={styles.closeButton}>✕</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.infoPanelText}>{selectedBus.description}</Text>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Speed:</Text>
                        <Text style={styles.infoValue}>{selectedBus.speed} mph</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Capacity:</Text>
                        <Text style={[styles.infoValue, { color: getMarkerColor(selectedBus.capacity) }]}>
                            {selectedBus.capacity}
                        </Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Next Stop:</Text>
                        <Text style={styles.infoValue}>{selectedBus.nextStop}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>ETA:</Text>
                        <Text style={styles.infoValue}>{selectedBus.eta}</Text>
                    </View>
                    <TouchableOpacity 
                        style={styles.trackButton}
                        onPress={() => centerOnBus(selectedBus)}
                    >
                        <Text style={styles.trackButtonText}>Center on Bus</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

export default MapScreen;