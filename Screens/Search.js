import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { firebase } from '../firebaseConfig';
import TeacherCard from '../Components/TeacherCard';
//import TeacherDetailsScreen from './TeacherDetailsScreen';

const Search = ({ navigation }) => {
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const snapshot = await firebase.firestore().collection('users').where('type', '==', 'Teacher').get(); // Fetch only teachers
        const teacherData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTeachers(teacherData);
      } catch (error) {
        console.error('Error fetching teachers:', error);
      }
    };

    fetchTeachers();
  }, []);

  const handleTeacherPress = (teacherId) => {
    navigation.navigate('UserProfile', { userId: teacherId });
  };
  
  /* const handleTeacherPress = (teacherId) => {
    navigation.navigate('TeacherDetailsScreen', { teacherId });
  };
  */

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {teachers.map(teacher => (
        <TeacherCard
          key={teacher.id}
          teacher={teacher}
          onPress={() => handleTeacherPress(teacher.id)}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});

export default Search;


/*
import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Button } from 'react-native'; // Import Button component
import { firebase } from '../firebaseConfig';
import TeacherCard from '../Components/TeacherCard';
import TeacherDetailsScreen from './TeacherDetailsScreen';

const SearchScreen = ({ navigation }) => {
  const [teachers, setTeachers] = useState([]);
  const [showAllTeachers, setShowAllTeachers] = useState(false); // State variable to track whether to show all teachers

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const snapshot = await firebase.firestore().collection('users').where('type', '==', 'Teacher').get(); // Fetch only teachers
        const teacherData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTeachers(teacherData);
      } catch (error) {
        console.error('Error fetching teachers:', error);
      }
    };

    fetchTeachers();
  }, []);

  const handleTeacherPress = (teacherId) => {
    navigation.navigate('UserProfile', { userId: teacherId });
  };

  const toggleShowAllTeachers = () => {
    setShowAllTeachers(!showAllTeachers); // Toggle the state when the button is clicked
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {showAllTeachers ? ( // Render all teachers' cards if showAllTeachers is true
        teachers.map(teacher => (
          <TeacherCard
            key={teacher.id}
            teacher={teacher}
            onPress={() => handleTeacherPress(teacher.id)}
          />
        ))
      ) : (
        <View>
          <Button title="Show All Teacher's Info" onPress={toggleShowAllTeachers} /> 
        
          </View>
        )}
      </ScrollView>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      padding: 10,
    },
  });
  
  //export default SearchScreen;
 */