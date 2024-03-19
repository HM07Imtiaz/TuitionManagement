import React from 'react';
import {View, ImageBackground} from 'react-native';
import bgImage from '../assets/bgImage.jpg';

const Background = ({ children }) => {
  return (
    <View style={{ flex: 1 }}>
    <ImageBackground source={bgImage} style={{ flex: 1 }}>
      <View style={{ flex: 1, position: "absolute", width: "100%", height: "100%" }}>
        {children}
      </View>
    </ImageBackground>
  </View>
  );
}

export default Background;