import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { firebase } from '../firebaseConfig';

const CommentScreen = ({ route }) => {
  const { postId } = route.params;
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

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
            <TouchableOpacity onPress={() => navigation.navigate('Profile', { userId: comment.userId })}>
              <Text style={styles.commentUser}>{comment.userId}</Text>
            </TouchableOpacity>
            <Text>{comment.text}</Text>
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
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  commentUser: {
    marginTop: 5,
    fontWeight: 'bold',
  },
});

export default CommentScreen;
