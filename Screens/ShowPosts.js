import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Button, Image } from 'react-native';
import { firebase } from '../firebaseConfig';
import Pagination from '../Components/Pagination';
import DatePickerComponent from '../Components/DatePickerCmp';

const ShowPosts = ({ navigation }) => {

  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null); // State to store selected date
  const postsPerPage = 5;

  useEffect(() => {
    const unsubscribe = firebase.firestore().collection('posts').orderBy('createdAt', 'desc').onSnapshot(snapshot => {
      const updatedPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(updatedPosts);
    });

    return () => unsubscribe();
  }, []);

  const calculateTotalPages = () => {
    const filteredPosts = selectedDate ? posts.filter(post => post.createdAt.toDate().toDateString() === selectedDate.toDateString()) : posts;
    return Math.ceil(filteredPosts.length / postsPerPage);
  };
  const totalPages = calculateTotalPages();

  const currentPosts = () => {
    // Filter posts based on the selected date
    const filteredPosts = selectedDate ? posts.filter(post => post.createdAt.toDate().toDateString() === selectedDate.toDateString()) : posts;
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    return filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  };


  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };


  const handleLikeDislike = async (postId, isLike) => {
    try {
      const userId = firebase.auth().currentUser.uid;
      const postRef = firebase.firestore().collection('posts').doc(postId);
      const postSnapshot = await postRef.get();
      const postData = postSnapshot.data();

      let updatedLikes = postData.totalLikes || 0;
      let updatedDislikes = postData.totalDislikes || 0;

      if (isLike) {
        if (postData.likes && postData.likes.includes(userId)) {
          updatedLikes--;
          await postRef.update({
            totalLikes: updatedLikes,
            likes: firebase.firestore.FieldValue.arrayRemove(userId),
          });
        } else {
          updatedLikes++;
          updatedDislikes = postData.dislikes && postData.dislikes.includes(userId) ? updatedDislikes - 1 : updatedDislikes;
          await postRef.update({
            totalLikes: updatedLikes,
            totalDislikes: updatedDislikes,
            likes: firebase.firestore.FieldValue.arrayUnion(userId),
            dislikes: firebase.firestore.FieldValue.arrayRemove(userId),
          });
        }
      } else {
        if (postData.dislikes && postData.dislikes.includes(userId)) {
          updatedDislikes--;
          await postRef.update({
            totalDislikes: updatedDislikes,
            dislikes: firebase.firestore.FieldValue.arrayRemove(userId),
          });
        } else {
          updatedDislikes++;
          updatedLikes = postData.likes && postData.likes.includes(userId) ? updatedLikes - 1 : updatedLikes;
          await postRef.update({
            totalLikes: updatedLikes,
            totalDislikes: updatedDislikes,
            dislikes: firebase.firestore.FieldValue.arrayUnion(userId),
            likes: firebase.firestore.FieldValue.arrayRemove(userId),
          });
        }
      }
    } catch (error) {
      console.error('Error updating like/dislike status:', error);
    }
  };

  const handleComment = (postId) => {
    navigation.navigate('Comment', { postId });
  };

  const formatDate = (createdAt) => {
    if (!createdAt) return ''; 
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return createdAt.toDate().toLocaleString('en-US', options); 
  };

  const handleSelectDate = (date) => {
    setSelectedDate(date);
    setCurrentPage(1); // Reset page to 1 when selecting a new date
  };


  return (
    <ScrollView style={styles.container}>
      <View style={styles.datePickerContainer}>
        {/* Render DatePickerComponent and pass handleSelectDate function as prop */}
        <DatePickerComponent onSelectDate={handleSelectDate} />
      </View>

      {currentPosts().length > 0 ? (
        currentPosts().map((post) => (
          <TouchableOpacity key={post.id} onPress={() => navigation.navigate('Comment', { postId: post.id })}>
            <View style={styles.card}>
              <TouchableOpacity onPress={() => navigation.navigate('Profile', { userId: post.userId })}>
                <Text style={styles.userId}>{post.userId}</Text>
              </TouchableOpacity>
              <Text>Date: {formatDate(post.createdAt)}</Text>
              <Text>Type: {post.type}</Text>
              <Text>Title: {post.title}</Text>
              <Text style={styles.description}>{post.description}</Text>
              <Text>District: {post.district}</Text>
              <Text>Address: {post.address}</Text>
              <Text>Remuneration: {post.remuneration}</Text>
              <Text>Experience: {post.experience}</Text>
              <Text>Qualification: {post.qualification}</Text>

              {post.cvImageUrl && ( // Check if CV is uploaded
                <Image source={{ uri: post.cvImageUrl }} style={styles.cvImage} />
              )}
              {post.selectedLocation && ( // Check if location is submitted by the user
                 <TouchableOpacity onPress={() => navigation.navigate('ShowLocation', { selectedLocation: post.selectedLocation })}>
                  <Text style={styles.map}>See Location on Map</Text>
                </TouchableOpacity>
              )}

              <View style={styles.actionContainer}>
                <TouchableOpacity onPress={() => handleLikeDislike(post.id, true)}>
                  <Text style={[styles.actionText, post.likes && post.likes.includes(firebase.auth().currentUser.uid) && styles.likedText]}>Like ({post.totalLikes || 0})</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleLikeDislike(post.id, false)}>
                  <Text style={[styles.actionText, post.dislikes && post.dislikes.includes(firebase.auth().currentUser.uid) && styles.dislikedText]}>Dislike ({post.totalDislikes || 0})</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleComment(post.id)}>
                  <Text style={styles.actionText}>Comment</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))
      ) : (
        <Text style={{fontSize: 17, marginTop: 20, marginBottom: 10}}>No Posts Available for Selected Date...</Text>
      )}

      {currentPosts().length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onNextPage={nextPage}
          onPrevPage={prevPage}
        />
      )}

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  postContainer: {
    padding: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'lightblue',
    marginBottom: 20,
    
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  paginationButton: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'blue',
  },
  disabled: {
    color: '#ccc',
  },
  pageNumber: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userId: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    marginBottom: 5,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    marginBottom: 10,
    borderTopColor: 'lightblue',
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderBottomColor: 'lightblue',
  },
  actionText: {
    marginTop: 10,
    marginBottom: 10,
    color: 'blue',
  },
  likedText: {
    fontWeight: 'bold',
    color: 'green',
  },
  dislikedText: {
    fontWeight: 'bold',
    color: 'red',
  },
  datePickerContainer: {
    marginBottom: 10,
  },
  card: {
    borderWidth: 2,
    borderColor: 'lightgray',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    backgroundColor: 'white',
  },
  map: {
    marginTop: 10,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 5,
    marginRight: 200,
    color: 'green',
  },
  cvImage: {
    width: 350, 
    height: 500, 
    marginTop: 10, 
    marginBottom: 10,
    borderColor: 'grey',
    borderWidth: 2,
  },
});

export default ShowPosts;