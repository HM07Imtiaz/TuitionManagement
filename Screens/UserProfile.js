import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, StyleSheet, Image } from 'react-native';
import { firebase } from '../firebaseConfig';

const UserProfile = ({ route }) => {
  const { userId } = route.params;
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const unsubscribe = firebase.firestore().collection('users').doc(userId).onSnapshot(snapshot => {
      setUserData(snapshot.data());
    });

    return () => unsubscribe();
  }, [userId]);

  if (!userData) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.profileInfo}>
        {userData.profilePic && (
          <Image source={{ uri: userData.profilePic }} style={styles.profilePic} />
        )}
        <Text style={styles.type}>{userData.type}</Text>
        {userData.fullName && <Text style={styles.name}>{userData.fullName}</Text>}
      </View>
      <View /*style={styles.userInfo}*/ >
        {userData.mobileNumber && <Text style={styles.label}>Mobile Number: {userData.mobileNumber}</Text>}
        {userData.educationBackground && <Text style={styles.label}>Education Background: {userData.educationBackground}</Text>}
        {userData.gender && <Text style={styles.label}>Gender: {userData.gender}</Text>}
        {userData.address && <Text style={styles.label}>Address: {userData.address}</Text>}
        {userData.about && <Text style={styles.label}>About: {userData.about}</Text>}
        {userData.eduQualification && <Text style={styles.label}>Education Qualification: {userData.eduQualification}</Text>}
        {userData.experience && <Text style={styles.label}>Experience: {userData.experience}</Text>}
        {userData.class && <Text style={styles.label}>Class: {userData.class}</Text>}
        {userData.institution && <Text style={styles.label}>Institution: {userData.institution}</Text>}
        {userData.group && <Text style={styles.label}>Group: {userData.group}</Text>}
        {userData.currentOccupation && <Text style={styles.label}>Current Occupation: {userData.currentOccupation}</Text>}
        {userData.currentOccupation === 'Study' && (
          <>
            <Text style={styles.label}>Current Year: {userData.currentYear}</Text>
            <Text style={styles.label}>Current Institution: {userData.currentInstitution}</Text>
          </>
        )}
      </View>
      {userData.cv && (
        <Image source={{ uri: userData.cv }} style={styles.cvImage} />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    //justifyContent: 'center',
    //alignItems: 'center',
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  type: {
    fontSize: 17,
    color: 'grey',
  },
  cvImage: {
    width: 360,
    height: 500,
    marginTop: 10,
    marginBottom: 10,
    borderColor: 'grey',
    borderWidth: 2,
  },
  userInfo: {
    alignItems: 'flex-start',
  },
  name: {
    marginTop: 10,
    fontSize: 20,
    marginBottom: 10,
    padding: 5,
    color: 'darkgreen',
  },
  label: {
    marginTop: 10,
    fontSize: 18,
    marginBottom: 10,
    borderColor: 'grey',
    borderWidth: 1,
    padding: 5,
    marginRight: 10,
  },
});

export default UserProfile;
