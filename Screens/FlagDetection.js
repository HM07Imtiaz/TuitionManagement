import React, { useState, useEffect } from 'react';
import { View, Image, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import * as tf from '@tensorflow/tfjs';
import { bundleResourceIO, decodeJpeg } from '@tensorflow/tfjs-react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

const modelJson = require("../assets/model/model.json");
const modelWeights = require("../assets/model/weights.bin");

const labels = ["Afghanistan", "Argentina", "Australia", "Austria", "Bangladesh", "Belgium", "Bhutan", "Brazil", "Canada", "China", 
  "Croatia", "Denmark", "Egypt", "Finland", "France", "Germany", "Greece", "Hungary", "India", "Indonesia", "Iran", 
  "Iraq", "Ireland", "Italy", "Japan", "Malaysia", "Maldives", "Nepal", "Netherlands", "New Zealand", "Pakistan", 
  "Poland", "Portugal", "Qatar", "Russia", "Saudi Arabia", "South Africa", "Spain", "Sri Lanka", "Sweden", 
  "Switzerland", "Turkey", "United Arab Emirates (UAE)", "United Kingdom (UK)", "United States (USA)"
];

const transformImageToTensor = async (uri) => {
  const img64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  const imgBuffer = tf.util.encodeString(img64, "base64").buffer;
  const raw = new Uint8Array(imgBuffer);
  let imgTensor = decodeJpeg(raw);
  const scalar = tf.scalar(255);
  imgTensor = tf.image.resizeNearestNeighbor(imgTensor, [224, 224]);
  const tensorScaled = imgTensor.div(scalar);
  return tf.reshape(tensorScaled, [1, 224, 224, 3]);
};

const ModelTest = () => {
  const [model, setModel] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [prediction, setPrediction] = useState('');
  const [loading, setLoading] = useState(false);
  const [modelLoading, setModelLoading] = useState(true);

  useEffect(() => {
    const loadModel = async () => {
      await tf.ready();
      console.log("TensorFlow is ready");

      try {
        const loadedModel = await tf.loadLayersModel(
          bundleResourceIO(modelJson, modelWeights)
        );
        setModel(loadedModel);
        console.log("Model loaded successfully");
      } catch (error) {
        console.error("Error loading model:", error);
      } finally {
        setModelLoading(false);
      }
    };
    loadModel();
  }, []);

  const handleImagePick = async (fromCamera) => {
    setLoading(true);
    try {
      let result;
      if (fromCamera) {
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
      }

      console.log(result); 

      if (!result.canceled) {
        const localUri = result.assets[0].uri; 
        setImageUri(localUri);

        const imageTensor = await transformImageToTensor(localUri);

        if (model) {
          const predictions = model.predict(imageTensor);
          const highestPredictionIndex = predictions.argMax(1).dataSync()[0];
          setPrediction(labels[highestPredictionIndex] || "Can't Recognize");
        } else {
          console.error("Model is not loaded yet");
        }
      } else {
        console.log("Image pick canceled");
      }
    } catch (error) {
      console.error("Error picking image:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.details}>
        <Text style={styles.detailsText}>
          Upload an image of a Flag to detect the country of the flag.
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, { backgroundColor: '#3CB371' }]} onPress={() => handleImagePick(true)} disabled={modelLoading}>
          <Text style={styles.textStyle}>Take Image</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: 'dodgerblue' }]} onPress={() => handleImagePick(false)} disabled={modelLoading}>
          <Text style={styles.textStyle}>Import Image</Text>
        </TouchableOpacity>
      </View>
      {modelLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Loading model...</Text>
        </View>
      )}
      {imageUri && (
        <View style={{ width: '90%', alignSelf: 'center', marginTop: 50 }}>
          <Image source={{ uri: imageUri }} style={{ width: 200, height: 200, alignSelf: 'center' }} />
          <View style={{ display: 'flex', flexDirection: 'row', alignSelf: 'center', marginTop: 30 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Country Name:  </Text>
            {loading ? <ActivityIndicator size={'small'} color={'blue'} /> : <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'darkgreen' }}>{prediction}</Text>}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  buttonContainer: {
    marginTop: 50,
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    borderColor: 'black',
    borderRadius: 5,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    width: '45%',
  },
  textStyle: {
    fontSize: 19,
    color: 'white',
  },
  details: {
    alignSelf: 'center',
    width: '90%',
    marginTop: 60,
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 13,
    padding: 10,
  },
  detailsText: {
    fontSize: 20,
    textAlign: 'center',
  },
  loadingContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
});

export default ModelTest;
