import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function MapScreen() {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 28.6139,     // Example: Delhi
          longitude: 77.2090,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        <Marker
          coordinate={{ latitude: 28.6139, longitude: 77.2090 }}
          title={"School Bus"}
          description={"This is the bus location"}
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
