import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { firebase } from '../firebaseConfig';
import { useNavigation } from '@react-navigation/native';

const CommentScreen = ({ route }) => {
  const navigation = useNavigation();
  const { postId } = route.params;
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [usersData, setUsersData] = useState({}); 

  useEffect(() => {
    const unsubscribe = firebase.firestore()
      .collection('comments')
      .where('postId', '==', postId)
      .onSnapshot(snapshot => {
        const commentsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setComments(commentsData);
      });

    return () => unsubscribe();
  }, [postId]);


  useEffect(() => {
    const usersRef = firebase.firestore().collection('users');
    const unsubscribeUsers = usersRef.onSnapshot(snapshot => {
      const users = {};
      snapshot.forEach(doc => {
        users[doc.id] = doc.data();
      });
      setUsersData(users);
    });

    return () => unsubscribeUsers();
  }, []); 

  const handleUserProfile = (userId) => {
    navigation.navigate('UserProfile', { userId });
  };


  const handlePostComment = async () => {
    if (!newComment.trim()) {
      alert('Please enter a comment.');
      return;
    }

    try {
      await firebase.firestore().collection('comments').add({
        postId,
        userId: firebase.auth().currentUser.uid,
        text: newComment,
        createdAt: new Date(),
      });
      setNewComment('');
    } catch (error) {
      console.error('Error posting comment:', error);
      alert('An error occurred while posting your comment. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.commentList}>
        {comments.map((comment, index) => (
          <View key={index} style={styles.comment}>
            <TouchableOpacity onPress={() => handleUserProfile(comment.userId)}>
                <View style={styles.userInfo}>
                  {usersData[comment.userId]?.profilePic && (
                    <Image source={{ uri: usersData[comment.userId].profilePic }} style={styles.profilePic} />
                  )}
                  <View style={styles.userDetails}>
                    <Text style={styles.userName}>{usersData[comment.userId]?.fullName || 'Unknown User'}</Text>
                    <Text style={styles.userType}>{usersData[comment.userId]?.type}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            <Text style={styles.text}>{comment.text}</Text>
          </View>
        ))}
      </ScrollView>
      <TextInput
        value={newComment}
        onChangeText={setNewComment}
        placeholder="Write your comment here"
        style={styles.input}
        multiline
      />
      <Button title="Post Comment" onPress={handlePostComment} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  commentList: {
    marginBottom: 10,
  },
  comment: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    backgroundColor: 'white',
  },
  commentUser: {
    marginTop: 5,
    fontWeight: 'bold',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 50,
    marginRight: 10,
  },
  userDetails: {
    flexDirection: 'column',
  },
  userName: {
    fontWeight: 'bold',
    marginBottom: 3,
    color: 'blue'
  },
  userType: {
    color: 'gray',
  },
  text: {
    color: 'black',
    fontSize: 17,
  },
});

export default CommentScreen;
