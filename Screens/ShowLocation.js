import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const ShowLocation = ({ route }) => {
  const { selectedLocation } = route.params; // Retrieve the selected location from route params

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: `https://www.google.com/maps?q=${selectedLocation ? selectedLocation.latitude + ',' + selectedLocation.longitude : ''}` }}
        style={styles.map}
        geolocationEnabled={true}
        originWhitelist={['*']}
      />
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
