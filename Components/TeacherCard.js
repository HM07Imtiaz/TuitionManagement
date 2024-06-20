import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const TeacherCard = ({ teacher, onPress }) => {
    return (
      <TouchableOpacity style={styles.container} onPress={onPress}>
        <Image source={{ uri: teacher.profilePic }} style={styles.profilePic} />
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{teacher.fullName}</Text>
          <Text style={styles.qualification}>{teacher.eduQualification}</Text>
        </View>
        <TouchableOpacity style={styles.detailsButton} onPress={onPress}>
          <Text style={styles.buttonText}>View Details</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };
  

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 10,
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  qualification: {
    fontSize: 14,
    color: '#888',
  },
  detailsButton: {
    backgroundColor: '#007bff',
    padding: 8,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default TeacherCard;
