import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Field from './Field';
import Background from './Background';
import Btn from './Btn';
import { darkGreen } from './Constants';
import { firebase } from '../firebaseConfig'; 

const SignupScreen = ({ navigation }) => {
  const [data, setData] = useState({
    email: '',
    password: '',
    confirm_password: '',
    mobileNumber: '',
    type: '',
    class: '' 
  });
  const [showLoader, setShowLoader] = useState(false);
  const [showClassDropdown, setShowClassDropdown] = useState(false);

  const registerUser = async () => {
    if(data.type === '' || data.email === '' || data.password === '' || data.confirm_password === '' || data.mobileNumber === ''){
      alert('Please Fill the all fields..');
      return;
    }

    if (data.mobileNumber.length !== 11) {
      alert('Not A valid Mobile number! Mobile number must have 11 digits.');
      return;
    }

    try {
      setShowLoader(true);
      await firebase.auth().createUserWithEmailAndPassword(data.email, data.password)

        .then(() => {
          firebase.auth().currentUser.sendEmailVerification({
            handleCodeInApp: true,
            url: 'https://tuition-bae48.firebaseapp.com',
          })
            .then(() => {
              setShowLoader(false);
              alert('Verification email sent');
              setData({
                ...data,
                email: '',
                password: '',
                confirm_password: '',
                mobileNumber: '',
                type: '',
                class: ''
              });
              navigation.navigate("LoginScreen");
            }).catch((err) => {
              console.log(err);
            })
            .then(() => {
              firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).set({
                email: data.email,
                password: data.password,
                type: data.type,
                class: data.class,
              });

              if (data.type === 'Student') {
                firebase.firestore().collection('students').doc(firebase.auth().currentUser.uid).set({
                  class: data.class,
                  userId: firebase.auth().currentUser.uid,
                });
              }

            }).catch((err) => {
              console.log(err);
            });
            
        }).catch((err) => {
          setShowLoader(false);
          if (err.code === 'auth/email-already-in-use') {
            alert('The email address is already in use by another account.');
          } else {
            console.error('Error creating user:', err);
            alert('The email address is badly formatted. Please use existing email.');
          }
        });
    } catch (err) {
      setShowLoader(false);
      console.error('Error registering user:', err);
    }
  };

  const fetchClassOptions = () => {
    
    const classOptions = ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'];
    return classOptions.map((option, index) => (
      <Picker.Item key={index} label={option} value={option} />
    ));
  };


  return (
    <Background>
      <View style={{alignItems: 'center', width: 460}}>
        <Text
          style={{
            color: 'lightblue',
            fontSize: 64,
            fontWeight: 'bold',
            marginTop: 25,
          }}>
          Register
        </Text>
        <Text
          style={{
            color: 'gold',
            fontSize: 19,
            fontWeight: 'bold',
            marginBottom: 20,
          }}>
          Create a new account
        </Text>
        <View
          style={{
            backgroundColor: 'white',
            height: 700,
            width: 460,
            borderTopLeftRadius: 150,
            paddingTop: 50,
            alignItems: 'center',
          }}>
        
          <Field placeholder="Email" keyboardType="email-address" value={data.email} onChangeText={(text)=>setData({...data,email:text})} />
          <Field placeholder="Password" secureTextEntry value={data.password} onChangeText={(text)=>setData({...data,password:text})} />
          <Field placeholder="Confirm Password" secureTextEntry value={data.confirm_password} onChangeText={(text)=>setData({...data,confirm_password:text})} />
          <Field placeholder="Mobile Number" keyboardType="phone-pad" value={data.mobileNumber} onChangeText={(text)=>setData({...data,mobileNumber:text})} /> 

          
          <TouchableOpacity
            style={{
              width: '70%',
              marginVertical: 10,
              backgroundColor: 'rgb(220, 220, 220)',
              borderRadius: 100,
            }}
            onPress={() => {}}>
            <Picker
              selectedValue={data.type}
              onValueChange={(itemValue, itemIndex) => {
                setData({...data, type: itemValue});

                if (itemValue === 'Student') {
                  setShowClassDropdown(true);
                } else {
                  setShowClassDropdown(false);
                }

              }}>
              <Picker.Item label={data.type ? data.type : 'Select User Type'} value="" />
              <Picker.Item label="Tutor" value="Tutor" />
              <Picker.Item label="Student" value="Student" />
              <Picker.Item label="Parent" value="Parent" />
            </Picker>
          </TouchableOpacity>

          {showClassDropdown && (
            <TouchableOpacity
              style={{
                width: '70%',
                marginVertical: 10,
                backgroundColor: 'rgb(220, 220, 220)',
                borderRadius: 100,
              }}
              onPress={() => {}}>
              <Picker
                selectedValue={data.class}
                onValueChange={(itemValue, itemIndex) => {
                  setData({...data, class: itemValue});
                }}>
                <Picker.Item label={data.class ? data.class : 'Select Class'} value="" />
                {fetchClassOptions()}
              </Picker>
            </TouchableOpacity>
          )}

          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              width: '78%',
              paddingRight: 16,
              marginTop: 10
            }}>
            <Text style={{color: 'grey', fontSize: 16}}>
              By signing in, you agree to our{' '}
            </Text>
            <Text style={{color: darkGreen, fontWeight: 'bold', fontSize: 16}}>
              Terms & Conditions
            </Text>
          </View>

          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent :"center",
              width: '78%',
              paddingRight: 16,
              marginBottom: 100
            }}>
            <Text style={{color: 'grey', fontSize: 16}}>
              and {" "}
            </Text>
            <Text style={{color: darkGreen, fontWeight: 'bold', fontSize: 16}}>
              Privacy Policy
            </Text>
          </View>
          <Btn textColor="white" bgColor={darkGreen} btnLabel="Signup" Press={registerUser} />
   
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            <Text style={{fontSize: 16, fontWeight: 'bold'}}>
              Already have an account ?{' '}
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('LoginScreen')}>
              <Text
                style={{color: darkGreen, fontWeight: 'bold', fontSize: 16}}>
                Login
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Background>
  );
};

export default SignupScreen;
