import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { firebase } from '../firebaseConfig';

const CVUploader = ({ onCVSelect }) => {
  const [cv, setCv] = useState(null);

  const handleCVSelection = async () => {
    let result = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' });
    if (result.type === 'success') {
      setCv(result.uri);
      onCVSelect(result.uri);
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={handleCVSelection}>
        <Text style={{ fontSize: 20, marginBottom: 5 }}>Select CV</Text>
        <Text style={{ color: 'blue' }}>{cv ? 'CV Selected' : 'Select CV'}</Text>
      </TouchableOpacity>
      {cv && <Text>{cv}</Text>} 
    </View>
  );
};

export default CVUploader;
