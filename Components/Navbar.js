import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { firebase } from '../firebaseConfig';

const Navbar = ({ onMenuPress }) => {


  const navigation = useNavigation();

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


  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'skyblue', padding: 18, zIndex: 1 }}>
      <TouchableOpacity style={{borderRadius: 5, backgroundColor: 'white'}} onPress={onMenuPress}>
        <Text style={{ marginLeft: 10, marginRight: 10, fontSize: 20 }}>☰</Text>
      </TouchableOpacity>
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity onPress={() => navigation.navigate("Post")}>
          <Text style={{ marginRight: 15, fontSize: 18 }}>Post</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("ShowPosts")}>
          <Text style={{ marginRight: 15, fontSize: 18 }}>NewsFeed</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={profileNavigation}>
          <Text style={{ fontSize: 18 }}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Navbar;
