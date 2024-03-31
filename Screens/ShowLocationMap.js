import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { WebView } from 'react-native-webview';

const ShowLocation = ({ route }) => {
  const { selectedLocation } = route.params; 

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: `https://www.google.com/maps?q=${selectedLocation ? selectedLocation.latitude + ',' + selectedLocation.longitude : ''}` }}
        style={styles.map}
        geolocationEnabled={true}
        originWhitelist={['*']}
      />
      <TouchableOpacity><Text>{selectedLocation.latitude}, {selectedLocation.longitude} </Text></TouchableOpacity>
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
