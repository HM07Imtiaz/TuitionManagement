// ProfilePicUploader component
import React, { useState } from 'react';
import { View, TouchableOpacity, Image, Text, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

const ProfilePicUploader = ({ /*onProfilePicSelect*/ }) => {
  //const [profilePic, setProfilePic] = useState(null);

  /*const handleProfilePicSelection = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.cancelled) {
        setProfilePic(result.uri);
        handleProfilePicUploading(result.uri); // Invoke the callback with the selected URI
      }
    } catch (error) {
      console.error('Error selecting profile picture:', error);
      Alert.alert('Error', 'Failed to select profile picture');
    }
  };

  const handleProfilePicUploading = async (uri) => {
    try {
      const data = new FormData();
      data.append('file', {
        uri,
        type: 'image/jpeg',
        name: 'upload.jpg',
      });

      const presetKey = "userimage";
      const cloudName = "dpugfaojh";
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        data,
        {
          withCredentials: false,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          params: {
            upload_preset: presetKey,
          },
        }
      );

      const result = response.data;
      console.log(result.url);
      setProfilePic(result.url); // Set the uploaded profile picture URL
      onProfilePicSelect(result.url); // Notify the parent component about the selected URL
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error.message);
      Alert.alert('Error', 'Failed to upload profile picture');
    }
  };
  */

  return (
    <View>
      <TouchableOpacity onPress={handleProfilePicSelection}>
        <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: 'lightgray', marginBottom: 20 }}>
          {profilePic ? <Image source={{ uri: profilePic }} style={{ width: '100%', height: '100%', borderRadius: 50 }} /> : <Text style={{ textAlign: 'center', lineHeight: 100 }}>Select Profile Pic</Text>}
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ProfilePicUploader;