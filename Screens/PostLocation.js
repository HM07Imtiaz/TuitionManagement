import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Button, Alert, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const PostLocation = ({ navigation, route }) => {
  const { onLocationSelect } = route.params; 

  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locationPermission, setLocationPermission] = useState(null);

  useEffect(() => {
    getLocationPermission();
  }, []);

  const getLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    setLocationPermission(status === 'granted');
  };

  const handleMapPress = (event) => {
    const { coordinate } = event.nativeEvent;
    setSelectedLocation(coordinate);
  };

  const handleLocationSelection = () => {
    if (!selectedLocation) {
      Alert.alert('Error', 'Please select a location.');
      return;
    }

    onLocationSelect(selectedLocation); 
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {locationPermission !== 'granted' && (
        <Text>No location permission. Please grant access in settings.</Text>
      )}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 22.33825,
          longitude: 91.8024,
          latitudeDelta: 0.09,
          longitudeDelta: 0.07,
        }}
        onPress={handleMapPress} 
        showsUserLocation={locationPermission === 'granted'} 
      >
        {selectedLocation && (
          <Marker coordinate={selectedLocation} />
        )}
      </MapView>
      <View style={styles.submit}>
      <Button title="Submit Location" onPress={handleLocationSelection} />
      </View>
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
  submit: {
    padding: 5,
    margin: 5,
  },
});

export default PostLocation;
