import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { firebase } from '../firebaseConfig';
import { MaterialIcons } from '@expo/vector-icons';

const Rating = () => {
  const [rating, setRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [userRating, setUserRating] = useState(null);

  useEffect(() => {
    const user = firebase.auth().currentUser;
    if (user) {
      const unsubscribe = firebase.firestore().collection('ratings').doc(user.uid)
        .onSnapshot((snapshot) => {
          const data = snapshot.data();
          if (data && data.rating) {
            setUserRating(data.rating);
          }
        });
      return () => unsubscribe();
    }
  }, []);

  useEffect(() => {
    const unsubscribe = firebase.firestore().collection('ratings')
      .onSnapshot((snapshot) => {
        let totalRatings = 0;
        let numRatings = 0;
  
        snapshot.forEach((doc) => {
          const data = doc.data();
          totalRatings += data.rating;
          numRatings++;
        });
  
        if (numRatings > 0) {
          const average = totalRatings / numRatings;
          setAverageRating(average.toFixed(1));
        } else {
          setAverageRating(0);
        }
      });
  
    return () => unsubscribe();
  }, []);
  

  const submitRating = async () => {
    const user = firebase.auth().currentUser;
    if (!user) {
      Alert.alert('Error', 'You must be logged in to submit a rating.');
      return;
    }

    try {
      if (userRating !== null) {
        await firebase.firestore().collection('ratings').doc(user.uid).update({
          rating,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });
        Alert.alert('Success', 'Rating updated successfully.');
      } else {
        await firebase.firestore().collection('ratings').doc(user.uid).set({
          rating,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });
        Alert.alert('Success', 'Rating submitted successfully.');
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      Alert.alert('Error', 'Failed to submit rating. Please try again later.');
    }
  };

  const renderStarButton = (value) => {
    return (
      <TouchableOpacity
        style={[styles.starButton, userRating === value ? styles.selectedStar : null]}
        onPress={() => setRating(value)}
      >
        <MaterialIcons name="star" size={28} color={userRating === value ? 'gold' : 'gray'} />
        <Text style={userRating === value ? styles.selectedStarText : styles.starText}>{value} Star</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.appRating}>App Rating: {averageRating} (out of 5)</Text>
      <View style={styles.starContainer}>
        {renderStarButton(1)}
        {renderStarButton(2)}
        {renderStarButton(3)}
      </View>
      <View style={styles.starContainer}>
        {renderStarButton(4)}
        {renderStarButton(5)}
      </View>
      <TouchableOpacity style={styles.submitButton} onPress={submitRating}>
        <Text style={styles.submitButtonText}>Submit Rating</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appRating: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  starContainer: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  starButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'gray',
  },
  selectedStar: {
    backgroundColor: 'lightblue',
  },
  starText: {
    marginLeft: 5,
  },
  selectedStarText: {
    marginLeft: 5,
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: 'darkgreen',
    paddingVertical: 18,
    paddingHorizontal: 110,
    borderRadius: 30,
    marginTop: 20,
  },
  submitButtonText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Rating;


/*import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { firebase } from '../firebaseConfig';
import { MaterialIcons } from '@expo/vector-icons';

const Rating = () => {
  const [rating, setRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [userRating, setUserRating] = useState(null);

  useEffect(() => {
    const user = firebase.auth().currentUser;
    if (user) {
      const unsubscribe = firebase.firestore().collection('ratings').doc(user.uid)
        .onSnapshot((snapshot) => {
          const data = snapshot.data();
          if (data && data.rating) {
            setUserRating(data.rating);
          }
        });
      return () => unsubscribe();
    }
  }, []);

  useEffect(() => {
    const unsubscribe = firebase.firestore().collection('ratings')
      .onSnapshot((snapshot) => {
        let totalRatings = 0;
        let numRatings = 0;
  
        snapshot.forEach((doc) => {
          const data = doc.data();
          totalRatings += data.rating;
          numRatings++;
        });
  
        if (numRatings > 0) {
          const average = totalRatings / numRatings;
          setAverageRating(average.toFixed(1));
        } else {
          setAverageRating(0);
        }
      });
  
    return () => unsubscribe();
  }, []);
  

  const submitRating = async () => {
    const user = firebase.auth().currentUser;
    if (!user) {
      Alert.alert('Error', 'You must be logged in to submit a rating.');
      return;
    }

    try {
      if (userRating !== null) {
        await firebase.firestore().collection('ratings').doc(user.uid).update({
          rating,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });
        Alert.alert('Success', 'Rating updated successfully.');
      } else {
        await firebase.firestore().collection('ratings').doc(user.uid).set({
          rating,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });
        Alert.alert('Success', 'Rating submitted successfully.');
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      Alert.alert('Error', 'Failed to submit rating. Please try again later.');
    }
  };

  const handleStarPress = (value) => {
    if (userRating === value) {
      // Toggle off
      setUserRating(null);
      setRating(0);
    } else {
      // Toggle on
      setUserRating(value);
      setRating(value);
    }
  };

  const renderStarButton = (value) => {
    return (
      <TouchableOpacity
        key={value}
        style={[styles.starButton, userRating === value ? styles.selectedStar : null]}
        onPress={() => handleStarPress(value)}
      >
        <MaterialIcons name={userRating === value ? 'star' : 'star-border'} size={50} color={userRating >= value ? 'gold' : 'gray'} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.appRating}>App Rating: {averageRating} (out of 5)</Text>
      <View style={styles.starContainer}>
        {renderStarButton(1)}
        {renderStarButton(2)}
        {renderStarButton(3)}
        {renderStarButton(4)}
        {renderStarButton(5)}
      </View>
      <TouchableOpacity style={styles.submitButton} onPress={submitRating}>
        <Text style={styles.submitButtonText}>Submit Rating</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appRating: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  starContainer: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  starButton: {
    marginRight: 10,
  },
  selectedStar: {
    backgroundColor: 'lightblue',
    borderRadius: 30,
  },
  submitButton: {
    backgroundColor: 'darkgreen',
    paddingVertical: 16,
    paddingHorizontal: 110,
    borderRadius: 30,
    marginTop: 20,
  },
  submitButtonText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Rating;
*/