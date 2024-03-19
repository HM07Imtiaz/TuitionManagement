import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Navbar = ({ onMenuPress }) => {


  const navigation = useNavigation();

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'lightblue', padding: 18 }}>
      <TouchableOpacity onPress={onMenuPress}>
        <Text style={{ marginLeft: 10, fontSize: 20 }}>☰</Text>
      </TouchableOpacity>
      
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity onPress={() => navigation.navigate("Post")}>
          <Text style={{ marginRight: 15, fontSize: 18 }}>Post</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Chat")}>
          <Text style={{ marginRight: 15, fontSize: 18 }}>Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <Text style={{ fontSize: 18 }}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Navbar;
