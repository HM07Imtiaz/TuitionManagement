import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const ShowLocation = ({ route }) => {
  const { selectedLocation } = route.params; 

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude,
          latitudeDelta: 0.09,
          longitudeDelta: 0.07,
        }}
      >
        <Marker
          coordinate={{
            latitude: selectedLocation.latitude,
            longitude: selectedLocation.longitude,
          }}
          title="Selected Location"
          description={`Latitude: ${selectedLocation.latitude}, Longitude: ${selectedLocation.longitude}`}
        />
      </MapView>
      <Text>{selectedLocation.latitude}, {selectedLocation.longitude}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

export default ShowLocation;
