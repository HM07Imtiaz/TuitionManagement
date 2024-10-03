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
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';
import CountryInfo from './Screens/CountryInfo';
import CountryScreen from './Screens/CountryScreen';
import FlagDetection from './Screens/FlagDetection';
import ContributionScreen from './Screens/ContributionScreen';


const client = new ApolloClient({
  uri: 'https://countries.trevorblades.com/graphql',
  cache: new InMemoryCache(),
});


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
      <Stack.Screen name='CountryScreen' component={CountryScreen} />
      <Stack.Screen name='CountryInfo' component={CountryInfo} />
      <Stack.Screen name='FlagDetection' component={FlagDetection} />
      <Stack.Screen name='ContributionScreen' component={ContributionScreen} />
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
      console.log('Retrieved userData from AsyncStorage:', userData)
      if (userData) {
        const { email, password } = JSON.parse(userData);
        await firebase.auth().signInWithEmailAndPassword(email, password);
        setUserLoggedIn(true);
        console.log('check Session: (user Logged in) ',userLoggedIn);
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
  setUserLoggedIn(!!user);
  console.log('Auth Change: ',user ? 'User is logged in' : 'No user');
  if (user) {
    console.log('User details:', user);
  }
};

useEffect(() => {
  const unsubscribe = firebase.auth().onAuthStateChanged(onAuthStateChanged);
  console.log('Subscribed to auth state changes');

  return () => {
    if (unsubscribe) {
      unsubscribe();
      console.log('Unsubscribed from auth state changes');
    }
  };
}, []);


if (initializing) {
  return null; 
}

  return (
    <ApolloProvider client={client}>
      <NavigationContainer>
        {userLoggedIn ? (
          <HomeStack/>  
        ) : (
          <AuthStack/>
        )}
      </NavigationContainer> 
    </ApolloProvider>
  );
}

export default App;