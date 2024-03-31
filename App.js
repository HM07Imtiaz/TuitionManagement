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
import ProfileStudent from './Screens/ProfileStudent';
import ProfileParent from './Screens/ProfileParent';
import UserProfile from './Screens/UserProfile';



const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator initialRouteName="WelcomeScreen" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="SignupScreen" component={SignupScreen} />
    </Stack.Navigator>
  );
};

const HomeStack = () => {
  return (
    <Stack.Navigator initialRouteName="HomeScreen" screenOptions={{ headerShown: true }}>
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
      <Stack.Screen name='ProfileParent' component={ProfileParent} />
      <Stack.Screen name='ProfileStudent' component={ProfileStudent} />
      <Stack.Screen name='UserProfile' component={UserProfile} />
    </Stack.Navigator>
  );
};


function App() {

  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [initializing, setInitializing] = useState(true);
  //const [user, setUser] = useState();


useEffect(() => {
  const checkSession = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const { email, password } = JSON.parse(userData);
        await firebase.auth().signInWithEmailAndPassword(email, password);
        setUserLoggedIn(true);
        console.log('check Session: ',userLoggedIn);
      }
    } catch (error) {
      console.error('Error checking session:', error);
    } finally {
      setInitializing(false);
    }
  };

  checkSession();
}, []);

 
const onAuthStateChanged = (user) => {
  setUserLoggedIn(user);
  console.log('Auth Change: ',user, userLoggedIn);
};

useEffect(() => {
  const unsubscribe = firebase.auth().onAuthStateChanged(onAuthStateChanged);
  console.log('Unsubscribe: ', unsubscribe);

  return () => {
    if (unsubscribe) {
      unsubscribe();
    }
  };
}, []);


if (initializing) {
  return null; 
}

  return (
    <NavigationContainer>
     {userLoggedIn ? (
       <HomeStack/>  
     ) : (
       <AuthStack/>
     )}
    </NavigationContainer> 
  );
}

export default App;
