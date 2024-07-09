import React, {useEffect, useState} from 'react';
import { View, Text, TouchableOpacity, Button, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { firebase } from '../firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Sidebar = ({ onClose }) => {

  const [userType, setUserType] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserType = async () => {
      try {
        const user = firebase.auth().currentUser;
        if (user) {
          const userDoc = await firebase.firestore().collection('users').doc(user.uid).get();
          const userData = userDoc.data();
           
          if (userData && userData.type) {
            setUserType(userData.type);
          }
        }
      } catch (error) {
        console.error('Error fetching user type:', error);
      }
    };

    fetchUserType(); 
  }, [userType]); 


  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userData');
      await firebase.auth().signOut(); 
      console.log('User logged out successfully');
      // navigation.navigate("WelcomeScreen");
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const profileNavigation = async () => {
    try {
      if(userType){
        if(userType == 'Teacher'){
          navigation.navigate('Profile');
        }
        else if(userType == 'Student'){
          navigation.navigate('ProfileStudent');
        }
        else if(userType == 'Parent'){
          navigation.navigate('ProfileParent');
        }
        else
        console.error('Invalid user type:', userType);

      }

    }catch (error) {
      console.error('Error fetching profile data:', error);
    }
      
  }


  return (
    
    <ScrollView style={{ flex: 1, width: '60%', backgroundColor: 'darkgrey', position: 'absolute', left: 0, top: 0, bottom: 0, zIndex: 1}}>
      <TouchableOpacity style={{borderRadius: 5, backgroundColor: 'white', marginBottom: 3, marginTop: 3}} onPress={onClose}>
        <Text style={{padding: 20, marginLeft: 40, fontWeight: 'bold', fontSize: 18}}>Close</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{borderRadius: 5, backgroundColor: 'white', marginBottom: 3}} onPress={profileNavigation}>
        <Text style={{padding: 20, marginLeft: 40, fontWeight: 'bold', fontSize: 18}}>Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{borderRadius: 5, backgroundColor: 'white', marginBottom: 3}} onPress={() => navigation.navigate("ShowPosts")}>
        <Text style={{padding: 20, marginLeft: 40, fontWeight: 'bold', fontSize: 18}}>NewsFeed</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{borderRadius: 5, backgroundColor: 'white', marginBottom: 3}} onPress={() => navigation.navigate("CountryScreen")}>
        <Text style={{padding: 20, marginLeft: 40, fontWeight: 'bold', fontSize: 18}}>Country Info</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{borderRadius: 5, backgroundColor: 'white', marginBottom: 3}} onPress={() => navigation.navigate("Post")}>
        <Text style={{padding: 20, marginLeft: 40, fontWeight: 'bold', fontSize: 18}}>Post</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{borderRadius: 5, backgroundColor: 'white', marginBottom: 3}} onPress={() => navigation.navigate("Media")}>
        <Text style={{padding: 20, marginLeft: 40, fontWeight: 'bold', fontSize: 18}}>Media</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{borderRadius: 5, backgroundColor: 'white', marginBottom: 3}} onPress={() => navigation.navigate("MapScreen")}>
        <Text style={{padding: 20, marginLeft: 40, fontWeight: 'bold', fontSize: 18}}>Search Loaction</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{borderRadius: 5, backgroundColor: 'white', marginBottom: 3}} onPress={() => navigation.navigate("Rating")}>
        <Text style={{padding: 20, marginLeft: 40, fontWeight: 'bold', fontSize: 18}}>Rating</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{borderRadius: 5, backgroundColor: 'white', marginBottom: 3}} onPress={() => navigation.navigate("Search")}>
        <Text style={{padding: 20, marginLeft: 40, fontWeight: 'bold', fontSize: 18}}>Search</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{borderRadius: 5, backgroundColor: 'white', marginBottom: 10}} onPress={handleLogout}>
        <Text style={{color: "red", padding: 20, marginLeft: 40, fontWeight: 'bold', fontSize: 18}}>LogOut</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Sidebar;
