import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from './MapStyles';

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

interface StoppageComponentProps {
  driverPhone: string | null;
  onScrollEnd: (event: any) => void;
  onStoppagesUpdate?: (stoppages: Stoppage[]) => void;
}

const StoppageComponent: React.FC<StoppageComponentProps> = ({
  driverPhone,
  onScrollEnd,
  onStoppagesUpdate,
}) => {
  const [stoppages, setStoppages] = useState<Stoppage[]>([]);
  const [isLoadingStoppages, setIsLoadingStoppages] = useState(true);

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
        const transformedStoppages = data.stoppages.map((stoppage: any) => ({
          id: `${stoppage.stoppage_number}`,
          name: stoppage.stoppage_name,
          latitude: Number(stoppage.stoppage_latitude),
          longitude: Number(stoppage.stoppage_longitude),
          route_name: stoppage.route_name,
          stoppage_name: stoppage.stoppage_name,
          stoppage_latitude: Number(stoppage.stoppage_latitude),
          stoppage_longitude: Number(stoppage.stoppage_longitude),
          stoppage_number: Number(stoppage.stoppage_number),
        }));

        // Sort stoppages by stoppage_number
        const sortedStoppages = transformedStoppages.sort((a: Stoppage, b: Stoppage) => 
          a.stoppage_number - b.stoppage_number
        );

        setStoppages(sortedStoppages);
        // Pass sorted stoppages to parent component
        onStoppagesUpdate?.(sortedStoppages);
      } else {
        setStoppages([]);
        onStoppagesUpdate?.([]);
        Alert.alert('No Stoppages', 'No stoppages found for your route');
      }
    } catch (error) {
      console.error('Error fetching stoppages:', error);
      Alert.alert('Error', 'Failed to fetch stoppages. Please try again.');
      setStoppages([]);
      onStoppagesUpdate?.([]);
    } finally {
      setIsLoadingStoppages(false);
    }
  };

  const renderStoppage = useCallback(({ item }: { item: Stoppage }) => (
    <View style={styles.stoppageItem}>
      <View style={styles.stoppageNumber}>
        <Text style={styles.stoppageNumberText}>{item.stoppage_number}</Text>
      </View>
      <View style={styles.stoppageDetails}>
        <Text style={styles.stoppageName}>{item.name}</Text>
        <Text style={styles.stoppageRoute}>Route: {item.route_name}</Text>
      </View>
      <View style={styles.stoppageRoute}>
        <Ionicons 
          name="location-outline" 
          size={20} 
          color="#666"
        />
      </View>
    </View>
  ), []);

  const handleRefreshStoppages = () => {
    if (driverPhone) {
      fetchStoppages();
    }
  };

  return (
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
            disabled={isLoadingStoppages}
          >
            <Ionicons 
              name={isLoadingStoppages ? "sync" : "refresh"} 
              size={20} 
              color="#007AFF" 
            />
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
          onMomentumScrollEnd={onScrollEnd}
          removeClippedSubviews={true} 
          maxToRenderPerBatch={10} 
          updateCellsBatchingPeriod={50} 
          windowSize={10} 
          contentContainerStyle={styles.stoppagesList}
        />
      ) : (
        <View style={styles.noStoppagesContainer}>
          <Ionicons name="location-outline" size={48} color="#ccc" />
          <Text style={styles.noStoppagesText}>No stoppages found</Text>
          <Text style={styles.noStoppagesText}>
            There are no stoppages configured for this route
          </Text>
          <TouchableOpacity
            onPress={handleRefreshStoppages}
            style={styles.retryButton}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default StoppageComponent;