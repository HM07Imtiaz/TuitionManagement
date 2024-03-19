import React, { useState, useEffect } from 'react';
import { View, Button, StyleSheet, ScrollView, Text, TextInput, Alert, TouchableOpacity, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import axios from 'axios';
import { firebase } from '../firebaseConfig';

const Post = ({ navigation }) => {
  const [type, setType] = useState('tutorWanted');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [district, setDistrict] = useState('');
  const [address, setAddress] = useState('');
  const [qualification, setQualification] = useState('');
  const [experience, setExperience] = useState('');
  const [remuneration, setRemuneration] = useState('');
  const [cvImage, setCvImage] = useState(null);
  const [cvSelected, setCvSelected] = useState(false);

  const [selectedLocation, setSelectedLocation] = useState(null); // State to store selected location


  const handleImageSelection = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'image/jpeg', // Specify the type for image CVs
      });

      if (!result.cancelled) {
        handleImageUploading(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error selecting CV:', error);
      Alert.alert('Error', 'Failed to select CV.');
    }
  };


  const handleLocationSelect = (location) => {
    setSelectedLocation(location); // Set selected location
  };

  const handleLocationSelection = () => {
    // Part where you navigate to PostLocation
  const postRef = firebase.firestore().collection('posts').doc();
  navigation.navigate('PostLocation', { postId: postRef.postId });

  };

  const handleSubmit = async () => {
    if (!description || !title || !district || !address) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }
  
    try {
      const userId = firebase.auth().currentUser.uid;
      const postRef = firebase.firestore().collection('posts').doc();
      
      // Only set cvImageUrl if cvImage is available
      const cvImageUrl = cvImage ? cvImage : null;
  
      await postRef.set({
        postId: postRef.id,
        userId,
        type,
        title,
        description,
        district,
        address,
        qualification,
        experience,
        remuneration,
        cvImageUrl,
        selectedLocation,
        createdAt: new Date(),
      });
  
      Alert.alert('Success', 'Post submitted successfully!');
      // Reset state after successful submission
      setTitle('');
      setDescription('');
      setDistrict('');
      setAddress('');
      setQualification('');
      setExperience('');
      setRemuneration('');
      setCvImage(null);
      setCvSelected(false); // Reset cvSelected state as well
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred. Please try again.');
    }
  };
  

  const handleImageUploading = async (uri) => {
    try {
      const data = new FormData();
      data.append('file', {
        uri,
        type: 'image/jpeg',
        name: 'upload.jpg',
      });
  
      const preset_key = "postimage";
      const cloud_name = "dpugfaojh";
  
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
        data,
        {
          withCredentials: false,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          params: {
            upload_preset: preset_key,
          },
        }
      );
  
      const imageUrl = response.data.url;
      setCvImage(imageUrl); // Update cvImage state with the uploaded image URL
      setCvSelected(true);
  
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error.message);
    }
  };
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Post Type(*)</Text>
      <Picker
        selectedValue={type}
        onValueChange={(value) => setType(value)}
        style={styles.input}
      >
        <Picker.Item label="Tutor Wanted" value="tutorWanted" />
        <Picker.Item label="Tutor Available" value="tutorAvailable" />
      </Picker>
      <View>
        <Text style={styles.label}>Title(*)</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Enter post title"
          style={styles.input}
        />
      </View>
      <View>
        <Text style={styles.label}>Description(*)</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Enter your description"
          multiline={true}
          style={[styles.input, {height: 100}]}
        />
      </View>
      <View>
        <Text style={styles.label}>District(*)</Text>
        <TextInput
          value={district}
          onChangeText={setDistrict}
          placeholder="Enter district"
          style={styles.input}
        />
      </View>
      <View>
        <Text style={styles.label}>Address(*)</Text>
        <TextInput
          value={address}
          onChangeText={setAddress}
          placeholder="Enter address"
          style={styles.input}
        />
      </View>
      <View>
        <Text style={styles.label}>Qualification</Text>
        <TextInput
          value={qualification}
          onChangeText={setQualification}
          placeholder="Enter qualification"
          style={styles.input}
        />
      </View>
      <View>
        <Text style={styles.label}>Experience</Text>
        <TextInput
          value={experience}
          onChangeText={setExperience}
          placeholder="Enter experience"
          style={styles.input}
        />
      </View>
      <View>
        <Text style={styles.label}>Remuneration</Text>
        <TextInput
          value={remuneration}
          onChangeText={setRemuneration}
          placeholder="Enter remuneration"
          style={styles.input}
        />
      </View>
      <TouchableOpacity onPress={handleImageSelection}>
        <Text style={styles.uploadCv}>Upload CV/Image</Text>
      </TouchableOpacity>
      {cvImage && <Image source={{ uri: cvImage }} style={styles.uploadedCvImage} />}

      <TouchableOpacity onPress={() => navigation.navigate('PostLocation', { onLocationSelect: handleLocationSelect })}>
        <Text style={styles.selectLocationButton}>Select Location on Map</Text>
      </TouchableOpacity>
      
      {selectedLocation && (
        <Text style={styles.selectedLocationText}>Selected Location: {selectedLocation.latitude}, {selectedLocation.longitude}</Text>
      )}
      <Button title="Submit Post" onPress={handleSubmit} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  uploadCv: {
    fontSize: 16,
    color: 'blue',
    textAlign: 'center',
    padding: 10,
  },
  uploadedCvImage: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  selectLocationButton: {
    fontSize: 16,
    color: 'blue',
    marginBottom: 10,
  },
  selectedLocationText: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default Post;
