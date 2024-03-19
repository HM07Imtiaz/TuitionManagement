import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import { firebase } from '../firebaseConfig';

const Media = () => {
  const [mediaLinks, setMediaLinks] = useState([]);
  const [currentLink, setCurrentLink] = useState('');
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const user = firebase.auth().currentUser;
        if (user) {
          setUserId(user.uid);
          const mediaLinksRef = firebase.firestore().collection('mediaLinks').doc(user.uid);
          const doc = await mediaLinksRef.get();
          if (doc.exists) {
            setMediaLinks(doc.data().links || []);
          }
        }
      } catch (error) {
        console.error('Error fetching user ID:', error);
      }
    };
  
    fetchUserId();
  }, []);

  const addMedia = async () => {
    try {
      // Extract media ID from the shared link
      const mediaId = extractMediaId(currentLink);
      if (!mediaId) {
        throw new Error('Invalid media link');
      }
      
      // Add the media link to Firestore
      const mediaLinksRef = firebase.firestore().collection('mediaLinks').doc(userId);
      await mediaLinksRef.set({
        links: [...mediaLinks, mediaId]
      });
      
      // Update the state
      setMediaLinks([...mediaLinks, mediaId]);
      setCurrentLink('');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const deleteMedia = async (index) => {
    try {
      // Remove the media link from Firestore
      const updatedMediaLinks = [...mediaLinks];
      updatedMediaLinks.splice(index, 1);
      const mediaLinksRef = firebase.firestore().collection('mediaLinks').doc(userId);
      await mediaLinksRef.set({
        links: updatedMediaLinks
      });
      
      // Update the state
      setMediaLinks(updatedMediaLinks);
    } catch (error) {
      console.error('Error deleting media link:', error);
    }
  };

  const extractMediaId = (link) => {
    // Example: Extract YouTube video ID from the shared link
    const match = link.match(/(?:youtu\.be\/|youtube\.com\/(?:.*\/|v\/|.*[?&]v=))([^?&]+)/);
    return match ? match[1] : null;
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        {mediaLinks.map((mediaId, index) => (
          <View key={index} style={{ marginBottom: 10, marginTop: 10 }}>
            <WebView
              javaScriptEnabled={true}
              domStorageEnabled={true}
              source={{ uri: `https://www.youtube.com/embed/${mediaId}` }}
              style={{ width: '100%', aspectRatio: 16 / 9 }}
            />
            <TouchableOpacity onPress={() => deleteMedia(index)} style={{ alignSelf: 'flex-end', backgroundColor: 'white', padding: 5, marginRight: 20, marginTop: 10, borderColor: 'gray', borderRadius: 5, borderWidth: 2 }}>
              <Text style={{ color: 'red', fontWeight: 'bold', fontSize: 15, paddingRight: 5, paddingLeft: 5 }}>Delete</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      <View style={{ padding: 10 }}>
        <TextInput
          placeholder="Enter media link"
          value={currentLink}
          onChangeText={setCurrentLink}
          style={{ marginBottom: 10, backgroundColor: 'rgb(220, 220, 220)', borderRadius: 5, padding: 7 }}
        />
        <Button title="Add Media" onPress={addMedia} />
      </View>
    </View>
  );
};

export default Media;
