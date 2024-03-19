import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import Navbar from '../Components/Navbar';
import SideBar from '../Components/SideBar';

const HomeScreen = ({ navigation }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const navigateToProfile = () => {
    // Navigate to the profile page
    navigation.navigate('Profile');
  };

  const navigateToPost = () => {
    // Navigate to the post page
    navigation.navigate('Post');
  };

  const navigateToNewsFeed = () => {
    // Navigate to the newsfeed page
    navigation.navigate('ShowPosts');
  };

  const navigateToRating = () => {
    // Navigate to the rating page
    navigation.navigate('Rating');
  };

  const navigateToMedia = () => {
    // Navigate to the media page
    navigation.navigate('Media');
  };

  const navigateToLocation = () => {
    // Navigate to the location page
    navigation.navigate('MapScreen');
  };


  return (
    <View style={{ flex: 1 }}>
     
      <Navbar onMenuPress={handleToggleSidebar} />

      <View style={{ flex: 1, flexDirection: 'row' }}>
        
        {isSidebarOpen && <SideBar onClose={() => setIsSidebarOpen(false)} />}

      <ScrollView style={{ flex: 1 }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: 'lightblue', fontSize: 28, marginTop: 40 }}>Welcome to TuitionLinkHUB</Text>
          <Text style={{ color: 'darkgreen', fontSize: 28, marginTop: 10, marginBottom: 50 }}>"Tuition Management App"</Text>
          <View style={styles.dashboardContainer}>
            <TouchableOpacity style={styles.dashboardItem} onPress={navigateToProfile}>
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

            <TouchableOpacity style={styles.dashboardItem} onPress={navigateToRating}>
              <Text style={styles.dashboardItemText}>You can store</Text>
              <Text style={styles.dashboardItemText}>your videos here</Text>
              <Text style={styles.dashboardItemLink}>Click here for Media</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.dashboardItem} onPress={navigateToMedia}>
              <Text style={styles.dashboardItemText}>Search Location</Text>
              <Text style={styles.dashboardItemText}>on Map</Text>
              <Text style={styles.dashboardItemLink}>Click here for Map</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.dashboardItem} onPress={navigateToLocation}>
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
