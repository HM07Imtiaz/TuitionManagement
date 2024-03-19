import React, {useEffect, useState} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from './Screens/WelcomeScreen';
import SignupScreen from './Screens/SignupScreen';
import LoginScreen from './Screens/LoginScreen';
import HomeScreen from './Screens/HomeScreen';
import Post from './Screens/Post';
import Profile from './Screens/Profile';
import Search from './Screens/Search';
import Chat from './Screens/Chat';
import Rating from './Screens/Rating';
import ShowPosts from './Screens/ShowPosts';
import Comment from './Screens/Comment';
import Media from './Screens/Media';
import MapScreen from './Screens/MapScreen';
import {firebase} from './firebaseConfig';
import PostLocation from './Screens/PostLocation';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import ShowLocation from './Screens/ShowLocation';
//import Profile from './Screens/Profile';



const Stack = createNativeStackNavigator();

function App() {

  const [userType, setUserType] = useState('');
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const fetchUserType = async () => {
      try {
        const user = firebase.auth().currentUser;
        if (user) {
          const userDoc = await firebase.firestore().collection('users').doc(user.uid).get();
          const userData = userDoc.data();
          console.log('userData:', userData); // Log user data
          if (userData && userData.type) {
            setUserType(userData.type);
          }
        }
      } catch (error) {
        console.error('Error fetching user type:', error);
      }
    };
  
    fetchUserType();
  }, []);

  console.log('userType:', userType); // Log userType

  /*
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        const storedUser  = await AsyncStorage.getItem('users');
        const userData = JSON.parse(storedUser);
        if (userData) {
          setUserLoggedIn(true); // Set userLoggedIn state to true if user data is found
        }
      } catch (error) {
        console.error('Error checking user login status:', error);
      } finally {
        setInitializing(false); // Set initializing state to false after checking
      }
    };

    checkUserLoggedIn();
  }, []);

  if (initializing) {
    // Render loading screen while initializing
    return null;
  }
*/  

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SignupScreen" component={SignupScreen} options={{ headerShown: false }} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
        
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="Post" component={Post} />
        <Stack.Screen name="Chat" component={Chat} />
        <Stack.Screen name='Profile' component={Profile} />
        <Stack.Screen name="Rating" component={Rating} />
        <Stack.Screen name="Media" component={Media} />
        <Stack.Screen name="Search" component={Search} />
        <Stack.Screen name="ShowPosts" component={ShowPosts} />
        <Stack.Screen name="Comment" component={Comment} />
        <Stack.Screen name="MapScreen" component={MapScreen} />
        <Stack.Screen name="PostLocation" component={PostLocation} />
        <Stack.Screen name="ShowLocation" component={ShowLocation} />
      
      </Stack.Navigator>
    </NavigationContainer> 
  );
}

export default App;
