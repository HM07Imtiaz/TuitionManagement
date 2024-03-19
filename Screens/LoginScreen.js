import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Background from './Background';
import Btn from './Btn';
import { darkGreen } from './Constants';
import Field from './Field';
import { firebase } from '../firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = (props) => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLoginPress = async () => {
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
      
      const user = firebase.auth().currentUser;
      if (user && !user.emailVerified) {
        Alert.alert(
          'Email Not Verified',
          'Please verify your email to complete the login process.',
          [
            {
              text: 'Resend Verification Email',
              onPress: async () => {
                try {
                  await user.sendEmailVerification({
                    handleCodeInApp: true,
                    url: 'https://tuition-bae48.firebaseapp.com',
                  });
                  Alert.alert('Verification Email Sent', 'Please check your email and verify your account.');
                } catch (error) {
                  console.error('Error sending verification email:', error);
                  Alert.alert('Error', 'An error occurred while sending the verification email. Please try again later.');
                }
              },
            },
            {
              text: 'OK',
            },
          ]
        );
        return;
      }
      /*try{
        await AsyncStorage.setItem("users", JSON.stringify(data))
      }catch(err){
        console.log('error store in async storage', err.message)
    }*/
      navigation.navigate('HomeScreen');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <Background>
      <View style={{ alignItems: 'center', width: 460 }}>
        <Text
          style={{
            color: 'lightblue',
            fontSize: 64,
            fontWeight: 'bold',
            marginVertical: 30,
          }}>
          Login
        </Text>
        <View
          style={{
            backgroundColor: 'white',
            height: 700,
            width: 460,
            borderTopLeftRadius: 160,
            paddingTop: 100,
            alignItems: 'center',
          }}>
          <Text style={{ fontSize: 40, color: darkGreen, fontWeight: 'bold' }}>
            Welcome Back
          </Text>
          <Text
            style={{
              color: 'grey',
              fontSize: 19,
              fontWeight: 'bold',
              marginBottom: 20,
            }}>
            Login to your account
          </Text>
          <Field
            placeholder="Email"
            keyboardType={'email-address'}
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
          <Field
            placeholder="Password"
            secureTextEntry={true}
            value={password}
            onChangeText={(text) => setPassword(text)}
          />

          <View
            style={{ alignItems: 'flex-end', width: '78%', paddingRight: 16, marginBottom: 150 }}>
            <Text style={{ color: darkGreen, fontWeight: 'bold', fontSize: 16 }}>
              Forgot Password ?
            </Text>
          </View>
          <Btn textColor='white' bgColor={darkGreen} btnLabel="Login" Press={handleLoginPress} />
          <View style={{ display: 'flex', flexDirection: 'row', justifyContent: "center" }}>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>Don't have an account ? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("SignupScreen")}>
              <Text style={{ color: darkGreen, fontWeight: 'bold', fontSize: 16 }}>Signup</Text>
            </TouchableOpacity>
          </View>
        </View>

      </View>
    </Background>
  );
};

export default LoginScreen;
