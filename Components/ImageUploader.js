import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, FlatList, Alert } from 'react-native';
import { Card, Divider, Button } from 'react-native-paper';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';

const ImageUploader = ({ onProfilePicSelect, onCVSelect }) => {
  const [selectedProfilePic, setSelectedProfilePic] = useState(null);
  const [selectedCV, setSelectedCV] = useState(null);
  const [recentUploads, setRecentUploads] = useState([]);

  const handleProfilePicSelection = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync();
      if (!result.cancelled) {
        setSelectedProfilePic(result.uri);
        onProfilePicSelect(result.uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select profile picture.');
    }
  };

  const handleCVSelection = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync();
      if (result.type === 'success') {
        setSelectedCV(result.uri);
        onCVSelect(result.uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select CV.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="Profile Picture Upload" />
        <Card.Content>
          <TouchableOpacity onPress={handleProfilePicSelection}>
            <Text style={styles.uploadText}>Tap to upload profile picture</Text>
          </TouchableOpacity>
          {selectedProfilePic && (
            <View style={styles.previewContainer}>
              <Image source={{ uri: selectedProfilePic }} style={styles.previewImage} />
            </View>
          )}
        </Card.Content>
      </Card>

      <Divider style={styles.divider} />

      <Card style={styles.card}>
        <Card.Title title="CV Upload" />
        <Card.Content>
          <TouchableOpacity onPress={handleCVSelection}>
            <Text style={styles.uploadText}>Tap to upload CV</Text>
          </TouchableOpacity>
          {selectedCV && (
            <View style={styles.previewContainer}>
              <Text>{selectedCV}</Text>
            </View>
          )}
        </Card.Content>
      </Card>

      <Text style={styles.recentText}>Recent Uploads</Text>
      <FlatList
        data={recentUploads}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        renderItem={({ item }) => (
          <Card style={styles.recentCard}>
            <Card.Cover source={{ uri: item }} style={styles.previewImage} />
          </Card>
        )}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginVertical: 8,
  },
  uploadText: {
    fontSize: 16,
    color: 'blue',
    textAlign: 'center',
    padding: 16,
  },
  divider: {
    marginVertical: 16,
  },
  previewContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  previewImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginTop: 10,
  },
  recentText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  recentCard: {
    marginHorizontal: 8,
  },
});

export default ImageUploader;
