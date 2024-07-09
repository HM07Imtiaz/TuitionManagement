import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import Navbar from '../Components/Navbar';
import SideBar from '../Components/SideBar';
import {firebase} from '../firebaseConfig'

const HomeScreen = ({ navigation }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const profileNavigation = async () => {
    try {
      const user = firebase.auth().currentUser;
      if (!user) {
        throw new Error('User not found');
      }
      const profileSnapshot = await firebase.firestore().collection('users').doc(user.uid).get();
      const profileData = profileSnapshot.data();

      if(profileData){
        if(profileData.type == 'Teacher'){
          navigation.navigate('Profile');
        }
        else if(profileData.type == 'Student'){
          navigation.navigate('ProfileStudent');
        }
        else if(profileData.type == 'Parent'){
          navigation.navigate('ProfileParent');
        }
        else
        console.error('Invalid user type:', profileData.type);

      }

    }catch (error) {
      console.error('Error fetching profile data:', error);
    }
      
  }

  const navigateToPost = () => {
    navigation.navigate('Post');
  };

  const navigateToNewsFeed = () => {
    navigation.navigate('ShowPosts');
  };

  const navigateToRating = () => {
    navigation.navigate('Rating');
  };

  const navigateToMedia = () => {
    navigation.navigate('Media');
  };

  const navigateToLocation = () => {
    navigation.navigate('MapScreen');
  };


  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
     
      <Navbar onMenuPress={handleToggleSidebar} />

      <View style={{ flex: 1, flexDirection: 'row' }}>
        
        {isSidebarOpen && <SideBar onClose={() => setIsSidebarOpen(false)} />}

      <ScrollView style={{ flex: 1 }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: 'lightblue', fontSize: 28, marginTop: 40 }}>Welcome to TuitionLinkHUB</Text>
          <Text style={{ color: 'darkgreen', fontSize: 28, marginTop: 10, marginBottom: 50 }}>"Tuition Management App"</Text>
          <View style={styles.dashboardContainer}>
            <TouchableOpacity style={styles.dashboardItem} onPress={profileNavigation}>
              <Text style={styles.dashboardItemText}>Create Your</Text>
              <Text style={styles.dashboardItemText}>Profile First</Text>
              <Text style={styles.dashboardItemLink}>Click here to create</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.dashboardItem} onPress={navigateToPost}>
              <Text style={styles.dashboardItemText}>Post to Find</Text>
              <Text style={styles.dashboardItemText}>Tutor or Tuition</Text>
              <Text style={styles.dashboardItemLink}>Click here to Post</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.dashboardItem} onPress={navigateToNewsFeed}>
              <Text style={styles.dashboardItemText}>NewsFeed</Text>
              <Text style={styles.dashboardItemText}>See the Posts</Text>
              <Text style={styles.dashboardItemLink}>Click to See Posts</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.dashboardItem} onPress={navigateToMedia}>
              <Text style={styles.dashboardItemText}>You can store</Text>
              <Text style={styles.dashboardItemText}>your videos here</Text>
              <Text style={styles.dashboardItemLink}>Click here for Media</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.dashboardItem} onPress={navigateToLocation}>
              <Text style={styles.dashboardItemText}>Search Location</Text>
              <Text style={styles.dashboardItemText}>on Map</Text>
              <Text style={styles.dashboardItemLink}>Click here for Map</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.dashboardItem} onPress={navigateToRating}>
              <Text> </Text>
              <Text style={styles.dashboardItemText}>Rate the App</Text>
              <Text style={styles.dashboardItemLink}>Click here for Rating</Text>
            </TouchableOpacity>
          </View>
          <Text style={{ color: 'black', fontSize: 20, marginTop: 80 }}>Find Tuition   |   Find Tutor</Text>
          <Text style={{ color: 'black', fontSize: 18, marginBottom: 40 }}>A Smart Platform to find Tuition and Tutor.</Text>
        </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  dashboardContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 20,
  },
  dashboardItem: {
    width: '48%',
    backgroundColor: 'darkviolet',
    padding: 15,
    marginBottom: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  dashboardItemText: {
    fontSize: 16,
    marginBottom: 3,
    fontWeight: 'bold',
    color: 'white',
    alignItems: 'center',
  },
  dashboardItemLink: {
    marginTop: 10,
    fontSize: 16,
    color: 'gold',
    textDecorationLine: 'underline',
  },
});

export default HomeScreen;
