import React from 'react';
import { View, Text, TouchableOpacity, Button, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { firebase } from '../firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
//import { ScrollView } from 'react-native-gesture-handler';

const Sidebar = ({ onClose }) => {


  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('users');
      await firebase.auth().signOut(); // Sign out the user
      navigation.navigate('WelcomeScreen'); // Navigate to the welcome screen after logout
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };


  return (
    
    <ScrollView style={{ flex: 1, width: '60%', backgroundColor: 'darkgrey', position: 'absolute', left: 0, top: 0, bottom: 0, zIndex: 1}}>
      <TouchableOpacity style={{borderRadius: 5, backgroundColor: 'white', marginBottom: 3, marginTop: 3}} onPress={onClose}>
        <Text style={{padding: 20, marginLeft: 40, fontWeight: 'bold', fontSize: 18}}>Close</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{borderRadius: 5, backgroundColor: 'white', marginBottom: 3}} onPress={() => navigation.navigate("Profile")}>
        <Text style={{padding: 20, marginLeft: 40, fontWeight: 'bold', fontSize: 18}}>Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{borderRadius: 5, backgroundColor: 'white', marginBottom: 3}} onPress={() => navigation.navigate("ShowPosts")}>
        <Text style={{padding: 20, marginLeft: 40, fontWeight: 'bold', fontSize: 18}}>NewsFeed</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{borderRadius: 5, backgroundColor: 'white', marginBottom: 3}} onPress={() => navigation.navigate("Chat")}>
        <Text style={{padding: 20, marginLeft: 40, fontWeight: 'bold', fontSize: 18}}>Chat</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{borderRadius: 5, backgroundColor: 'white', marginBottom: 3}} onPress={() => navigation.navigate("Post")}>
        <Text style={{padding: 20, marginLeft: 40, fontWeight: 'bold', fontSize: 18}}>Post</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{borderRadius: 5, backgroundColor: 'white', marginBottom: 3}} onPress={() => navigation.navigate("Rating")}>
        <Text style={{padding: 20, marginLeft: 40, fontWeight: 'bold', fontSize: 18}}>Rating</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{borderRadius: 5, backgroundColor: 'white', marginBottom: 3}} onPress={() => navigation.navigate("Media")}>
        <Text style={{padding: 20, marginLeft: 40, fontWeight: 'bold', fontSize: 18}}>Media</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{borderRadius: 5, backgroundColor: 'white', marginBottom: 3}} onPress={() => navigation.navigate("MapScreen")}>
        <Text style={{padding: 20, marginLeft: 40, fontWeight: 'bold', fontSize: 18}}>Map</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{borderRadius: 5, backgroundColor: 'white', marginBottom: 3}} onPress={() => navigation.navigate("PostLocation")}>
        <Text style={{padding: 20, marginLeft: 40, fontWeight: 'bold', fontSize: 18}}>Post the Location</Text>
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
