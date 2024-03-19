import { ScrollView, StyleSheet, Text, View, Image, TouchableOpacity, TextInput, Platform, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { FontAwesome6 } from '@expo/vector-icons';
import { firebase } from '../firebaseConfig';
import Loader from '../Components/Loader';
import UploadModal from '../Components/UploadModal';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

const TeacherProfile = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [cv, setCV] = useState(null);

    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    alert('Sorry, we need camera roll permissions to make this work!');
                }
            }
        })();
    }, []);

    useEffect(() => {
        const fetchData = () => {
            try {
                setLoading(true);
                const userDocRef = firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid);

                const unsubscribe = userDocRef.onSnapshot((doc) => {
                    if (doc.exists) {
                        setUserData(doc.data());
                        setLoading(false);
                    } else {
                        setUserData(null);
                        setLoading(false);
                    }
                });

                return () => {
                    unsubscribe();
                };
            } catch (err) {
                console.log(err.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const openModal = () => {
        setModalVisible(!modalVisible);
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.cancelled) {
            uploadToCloudinary(result.assets[0].uri);
        }
    };

    const takePicture = async () => {
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            uploadToCloudinary(result.assets[0].uri);
        }
    };

    const handleCVSelection = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.cancelled) {
            setCV(result.uri);
        }
    };

    const uploadToCloudinary = async (uri) => {
        try {
            const data = new FormData();
            data.append('file', {
                uri,
                type: 'image/jpeg',
                name: 'upload.jpg',
            });

            const presetKey = "uploadimage";
            const cloudName = "doh71p23w";
            const response = await axios.post(
                `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                data,
                {
                    withCredentials: false,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    params: {
                        upload_preset: presetKey,
                    },
                }
            );

            const result = response.data;
            console.log(result.url)
            firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).update({ image: result.url })
                .then(() => {
                    setModalVisible(false)
                }).catch((err) => {
                    console.log("firebase err : " + err.code)
                })

        } catch (error) {
            console.error('Error uploading to Cloudinary:', error.message);
        }
    };

    const uploadDocument = async (uri) => {
        try {
            const data = new FormData();
            data.append('file', {
                uri,
                type: 'application/pdf',
                name: 'cv.pdf',
            });

            // Adjust the endpoint and parameters based on the CV upload API
            const response = await axios.post(
                'https://example.com/upload-cv',
                data,
                {
                    withCredentials: false,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    // Additional parameters if needed
                }
            );

            const result = response.data;
            console.log(result.url);
            return result.url;
        } catch (error) {
            console.error('Error uploading CV:', error.message);
            throw new Error('Error uploading CV');
        }
    };

    const handleSubmit = async () => {
        try {
            if (!cv) {
                throw new Error('Please select a CV');
            }

            const cvUrl = await uploadDocument(cv);

            await firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).update({
                image: userData ? userData.image : '',
                cvUrl,
                // Add other profile data fields here...
                fullName: userData.fullName,
                email: userData.email,
                phone: userData.phone,
                address: userData.address,
            });

            setModalVisible(false);

            Alert.alert('Success', 'Profile updated successfully');
        } catch (error) {
            console.error('Error updating profile:', error);
            Alert.alert('Error', error.message);
        }
    };

    return (
        <View style={styles.mainContainer}>
            <View>
                {modalVisible ? <UploadModal isModalVisible={modalVisible} setModalVisible={setModalVisible} pickImage={pickImage} takePicture={takePicture} handleCVSelection={handleCVSelection} /> : null}
            </View>
            <View style={styles.heading}>
                <FontAwesome6 name="circle-user" size={30} color="black" />
                <Text style={{ fontSize: 25 }}> Profile</Text>
            </View>
            {loading === true ? (
                <Loader color='black' />
            ) : userData ? (
                <ScrollView contentContainerStyle={styles.content}>
                    <View style={styles.profilePic}>
                        <Image
                            style={styles.image}
                            source={userData.image === '' ? require('../assets/raiyan.jpg') : { uri: userData.image }}
                        />
                        <TouchableOpacity style={styles.uploadBtn} onPress={openModal}>
                            <Text>Change Image</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.subHeading}>{"<-------Details Information------->"}</Text>
                    <View style={styles.details}>
                        <View style={styles.inputField}>
                            <Text style={{ fontSize: 17, marginVertical: 5 }}>Full Name:</Text>
                            <TextInput
                                style={styles.input}
                                placeholderTextColor={'dimgray'}
                                value={userData.name || 'Not Provided Yet'}
                                editable={false}
                            />
                        </View>
                        <View style={styles.inputField}>
                            <Text style={{ fontSize: 17, marginVertical: 5 }}>Email:</Text>
                            <TextInput
                                style={styles.input}
                                placeholderTextColor={'dimgray'}
                                value={userData.email || 'Not Provided Yet'}
                                editable={false}
                            />
                        </View>
                        <View style={styles.inputField}>
                            <Text style={{ fontSize: 17, marginVertical: 5 }}>Phone: </Text>
                            <TextInput
                                style={styles.input}
                                placeholderTextColor={'dimgray'}
                                value={userData.phone || 'Not Provided Yet'}
                                editable={false}
                            />
                        </View>
                        <View style={styles.inputField}>
                            <Text style={{ fontSize: 17, marginVertical: 5 }}>Address: </Text>
                            <TextInput
                                style={styles.input}
                                placeholderTextColor={'dimgray'}
                                value={userData.district ? userData.division + ',' + userData.district + ',' + userData.upazila : 'Not Provided Yet'}
                                editable={false}
                            />
                        </View>
                        <View style={{ marginBottom: 10 }}>
                        <Text style={{fontSize: 20, marginBottom: 5}}>CV</Text>
                        <TouchableOpacity style={{ borderWidth: 1, borderColor: 'gray', padding: 5, borderRadius: 5 }} onPress={handleCVSelection}>
                            <Text>{cv ? 'CV Selected' : 'Select CV'}</Text>
                        </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>) :
                <Text style={{ justifyContent: 'center', alignItems: 'center' }}>No user data available</Text>
            }
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitText}>Submit</Text>
            </TouchableOpacity>
        </View>
    );
};

export default TeacherProfile;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        marginTop: 60,
        flexDirection: 'column',
    },
    heading: {
        marginTop: 10,
        height: 40,
        width: '90%',
        alignSelf: 'center',
        display: 'flex',
        flexDirection: 'row'
    },
    content: {
        marginTop: 10,
        width: '90%',
        alignSelf: 'center'

    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignSelf: 'center'
    },

    profilePic: {
        display: 'flex',
        flexDirection: 'column'
    },
    uploadBtn: {
        width: '35%',
        backgroundColor: 'cadetblue',
        alignItems: 'center',
        padding: 8,
        borderRadius: 10,
        margin: 5,
        alignSelf: 'center'
    },
    details: {
        display: 'flex',
        flexDirection: 'column',
        alignSelf: 'center',
        width: '90%',
        marginTop: 10
    },
    subHeading: {
        alignSelf: 'center',
        marginTop: 10,
        fontSize: 20
    },
    inputField: {
        display: 'flex',
        flexDirection: 'column',
        // width : '100%'
    },
    input: {
        // width: '95%',
        borderWidth: 2,
        borderColor: 'dimgray',
        fontSize: 17,
        color: 'black',
        borderRadius: 10,
        padding: 5,
        color: 'dimgray'
    },
    submitButton: {
        backgroundColor: 'cadetblue',
        padding: 10,
        borderRadius: 10,
        marginTop: 20,
        alignSelf: 'center'
    },
    submitText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold'
    }
});


   


