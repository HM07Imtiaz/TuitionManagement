import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Button, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';

const PostLocation = ({ navigation, route }) => {
  const { onLocationSelect } = route.params; // Retrieve the onLocationSelect function from route params

  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    fetchSelectedLocation();
  }, []);

  const fetchSelectedLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Location permission denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      setSelectedLocation({ latitude, longitude });
    } catch (error) {
      console.error('Error fetching location:', error);
    }
  };

  const handleLocationSelection = () => {
    onLocationSelect(selectedLocation); // Pass the selected location back to the parent component
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: `https://www.google.com/maps?q=${selectedLocation ? selectedLocation.latitude + ',' + selectedLocation.longitude : ''}` }}
        style={styles.map}
        geolocationEnabled={true}
        originWhitelist={['*']}
      />
      <Button title="Submit Location" onPress={handleLocationSelection} />
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

export default PostLocation;
