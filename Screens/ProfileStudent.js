import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Button, Image, Alert, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { firebase } from '../firebaseConfig';
import axios from 'axios';
import Navbar from '../Components/Navbar';
import SideBar from '../Components/SideBar';

const ProfileStudent = ({ navigation }) => {

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [type, setType] = useState('');
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  //const [educationBackground, setEducationBackground] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');
  const [about, setAbout] = useState('');
  const [institution, setInstitution] = useState('');
  const [classSelection, setClassSelection] = useState('');
  const [groupSelection, setGroupSelection] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [cv, setCv] = useState('');
  const [cvUploaded, setCvUploaded] = useState(false);
  const [profilePicSelected, setProfilePicSelected] = useState(false);
  const [cvSelected, setCvSelected] = useState(false);

  useEffect(() => {
    
    const fetchProfileData = async () => {
      try {
        const user = firebase.auth().currentUser;
        if (!user) {
          throw new Error('User not found');
        }

        const profileSnapshot = await firebase.firestore().collection('users').doc(user.uid).get();
        const profileData = profileSnapshot.data();

        if (profileData) {
          setType(profileData.type || '');
          setFullName(profileData.fullName || '');
          setMobileNumber(profileData.mobileNumber || '');
          //setEducationBackground(profileData.educationBackground || '');
          setInstitution(profileData.institution || '');
          setGender(profileData.gender || '');
          setAddress(profileData.address || '');
          setAbout(profileData.about || '');
          setClassSelection(profileData.class || '');
          setGroupSelection(profileData.group || '');
          setProfilePic(profileData.profilePic || '');
          setCv(profileData.cv || '');
          if (profileData.cv) {
            setCvUploaded(true); 
          }
          if (profileData.profilePic) {
            setProfilePicSelected(true);
          }
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchProfileData();
  }, []);

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleProfilePicSelection = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.cancelled) {
      handleImageUploading(result.assets[0].uri);
    }
  };

  const handleCVSelection = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'image/jpeg', 
      });

      if (!result.cancelled) {
        handleCvUploading(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error selecting CV:', error);
      Alert.alert('Error', 'Failed to select CV.');
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

      const preset_key = "userimage";
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
        setProfilePic(imageUrl);
        setProfilePicSelected(true);

    } catch (error) {
      console.error('Error uploading to Cloudinary:', error.message);
    }
  };

  const handleCvUploading = async (uri) => {
    try {
      const data = new FormData();
      data.append('file', {
        uri,
        type: 'image/jpeg',
        name: 'upload.jpg',
      });

      const preset_key = "usercv";
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
        setCv(imageUrl);
        setCvSelected(true);

    } catch (error) {
      console.error('Error uploading to Cloudinary:', error.message);
    }
  };

  const handleSubmit = async () => {
    try {
      const user = firebase.auth().currentUser;
      if (!user) {
        throw new Error('User not found');
      }

      if (!fullName || !mobileNumber || !gender || !address) {
        throw new Error('Please fill in all fields');
      }

      if (mobileNumber.length !== 11) {
        alert('Not A valid Mobile number! Mobile number must have 11 digits.');
        return;
      }

      if (!profilePicSelected) {
        throw new Error('Please select a profile picture');
      }

      const userData = {
        userId: user.uid,
        fullName,
        mobileNumber,
        //educationBackground,
        institution,
        gender,
        address,
        about,
        class: classSelection, 
        group: groupSelection, 
        profilePic: profilePicSelected ? profilePic : '',
        cv: cvSelected ? cv : '',
      };

      await firebase.firestore().collection('users').doc(user.uid).update(userData);

      Alert.alert('Success', 'Your profile has been updated');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', error.message);
    }
  };

  return (
    <ScrollView style={{ flex: 1, marginBottom: 5 }}>
      <View style={{ flex: 1, marginBottom: 20 }}>
        <Navbar onMenuPress={handleToggleSidebar} />
        <View style={{ flex: 1, flexDirection: 'row' }}>
          {isSidebarOpen && <SideBar onClose={() => setIsSidebarOpen(false)} />}
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontWeight: 'bold', fontSize: 24, marginBottom: 20, marginTop: 30 }}>Create your profile</Text>
            <TouchableOpacity onPress={handleProfilePicSelection}>
              <View style={{ width: 110, height: 110, borderRadius: 50, backgroundColor: 'lightgray', marginBottom: 20 }}>
                {profilePic ? <Image source={{ uri: profilePic }} style={{ width: '100%', height: '100%', borderRadius: 50 }} /> : <Text style={{ textAlign: 'center', lineHeight: 100 }}>Select Pic</Text>}
              </View>
            </TouchableOpacity>
            <View style={{marginBottom: 10}}>
              <Text style={{fontSize: 17}}>{type}</Text>
            </View>
            <View style={{ width: '80%' }}>
              <View style={{ marginBottom: 10 }}>
                <Text style={{ fontSize: 20, marginBottom: 5 }}>Full name</Text>
                <TextInput
                  style={{ borderWidth: 1, borderColor: 'gray', padding: 5, fontSize: 20 }}
                  value={fullName}
                  onChangeText={setFullName}
                />
              </View>
              <View style={{ marginBottom: 10 }}>
                <Text style={{ fontSize: 20, marginBottom: 5 }}>Mobile number</Text>
                <TextInput
                  style={{ borderWidth: 1, borderColor: 'gray', padding: 5, fontSize: 20 }}
                  value={mobileNumber}
                  onChangeText={setMobileNumber}
                />
              </View>
              <View style={{ marginBottom: 10 }}>
                <Text style={{ fontSize: 20, marginBottom: 5 }}>Gender</Text>
                <TextInput
                  style={{ borderWidth: 1, borderColor: 'gray', padding: 5, fontSize: 20 }}
                  value={gender}
                  onChangeText={setGender}
                />
              </View>
              <View style={{ marginBottom: 10 }}>
                <Text style={{ fontSize: 20, marginBottom: 5 }}>Class</Text>
                <TextInput
                  style={{ borderWidth: 1, borderColor: 'gray', padding: 5, fontSize: 20 }}
                  value={classSelection}
                  onChangeText={setClassSelection}
                />
              </View>
              {classSelection && parseInt(classSelection.replace('Class ', '')) > 8 && (
                <View style={{ marginBottom: 10 }}>
                  <Text style={{ fontSize: 20, marginBottom: 5 }}>Group</Text>
                  <TextInput
                    style={{ borderWidth: 1, borderColor: 'gray', padding: 5, fontSize: 20 }}
                    value={groupSelection}
                    onChangeText={setGroupSelection}
                  />
                </View>
                )}
              <View style={{ marginBottom: 10 }}>
                <Text style={{ fontSize: 20, marginBottom: 5 }}>Current Institution Name</Text>
                <TextInput
                  style={{ borderWidth: 1, borderColor: 'gray', padding: 5, fontSize: 20 }}
                  value={institution}
                  onChangeText={setInstitution}
                />
              </View>
              <View style={{ marginBottom: 10 }}>
                <Text style={{ fontSize: 20, marginBottom: 5 }}>Address</Text>
                <TextInput
                  style={{ borderWidth: 1, borderColor: 'gray', padding: 5, fontSize: 20 }}
                  value={address}
                  onChangeText={setAddress}
                />
              </View>
              <View style={{ marginBottom: 10 }}>
                <Text style={{ fontSize: 20, marginBottom: 5 }}>Write About You</Text>
                <TextInput
                  style={{ borderWidth: 1, borderColor: 'gray', padding: 5, fontSize: 20 }}
                  value={about}
                  onChangeText={setAbout}
                />
              </View>
              <TouchableOpacity onPress={handleCVSelection}>
                <Text style={{ fontSize: 20, marginBottom: 5 }}>Upload your CV:</Text>
                <Text style={{ color: 'blue', marginBottom: 20, borderColor: 'grey', borderWidth: 1, padding: 5, fontSize: 15, marginRight: 200 }}>{cvUploaded ? 'CV Uploaded' : 'CV Not Uploaded'}</Text>
              </TouchableOpacity>
              {cv && <Image source={{ uri: cv }} style={{ width: 330, height: 500, marginTop: 5, marginBottom: 40 }} />}

              <Button title="Submit" onPress={handleSubmit} />
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default ProfileStudent;
