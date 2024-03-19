import React from 'react';
import {TextInput} from 'react-native';
import {darkGreen} from './Constants';

const Field = props => {
  return (
    <TextInput
      {...props}
      style={{borderRadius: 100, color: darkGreen, paddingVertical: 8, paddingHorizontal: 10, width: '70%', backgroundColor: 'rgb(220, 220, 220)', marginVertical: 10}}
      placeholderTextColor={darkGreen}></TextInput>
  );
};

export default Field;