import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BACKGROUND_LOCATION_TASK = 'background-location-task';

// Helper to check if location changed significantly
const hasLocationChanged = (
  newLat: number,
  newLng: number,
  oldLat: number | null,
  oldLng: number | null
): boolean => {
  if (oldLat === null || oldLng === null) return true;

  const latDiff = Math.abs(newLat - oldLat);
  const lngDiff = Math.abs(newLng - oldLng);

  return latDiff > 0.0002 || lngDiff > 0.0002;
};

TaskManager.defineTask(BACKGROUND_LOCATION_TASK, async ({ data, error }) => {
  if (error) {
    console.error('Background location task error:', error);
    return;
  }

  if (!data) return;

  const { locations } = data as any;
  const latestLocation = locations[0];

  if (!latestLocation) return;

  const { latitude, longitude } = latestLocation.coords;

  try {
      // Get dynamic bus name
    // const busName = await AsyncStorage.getItem('busName');
    // if (!busName || busName.trim() === '') {
    //   console.warn('Bus name not found in AsyncStorage. Skipping location update.');
    //   return;
    // }
    const busName = 'B_002';

    // Load last location from AsyncStorage
    const lastLatStr = await AsyncStorage.getItem('lastLatitude');
    const lastLngStr = await AsyncStorage.getItem('lastLongitude');
    const lastLat = lastLatStr ? parseFloat(lastLatStr) : null;
    const lastLng = lastLngStr ? parseFloat(lastLngStr) : null;

    // Check if location has changed
    if (!hasLocationChanged(latitude, longitude, lastLat, lastLng)) {
      console.log('Location unchanged. Skipping update.');
      return;
    }

    // Optional: check last update time
    const lastTimeStr = await AsyncStorage.getItem('lastTimestamp');
    const now = Date.now();
    if (lastTimeStr && now - parseInt(lastTimeStr) < 5000) {
      console.log('Too soon since last update. Skipping.');
      return;
    }

    // Send location to server
    const response = await fetch('http://192.168.39.204:8000/api/bus/location', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        bus_name: busName,
        bus_latitude: latitude,
        bus_longitude: longitude,
      }),
    });

    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }

    console.log('Background location sent:', latitude, longitude);

    // Store current location and timestamp in AsyncStorage
    await AsyncStorage.setItem('lastLatitude', latitude.toString());
    await AsyncStorage.setItem('lastLongitude', longitude.toString());
    await AsyncStorage.setItem('lastTimestamp', now.toString());

  } catch (err) {
    console.error('Failed to send background location:', err);
  }
});

export default BACKGROUND_LOCATION_TASK;
