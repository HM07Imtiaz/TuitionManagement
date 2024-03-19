import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

export default function Search() {
  return (
    <View>
      <Text>Search</Text>
      <TouchableOpacity onPress={('TeacherList')}><Text>Show all Teacher's Information</Text></TouchableOpacity>
    </View>
  )
}