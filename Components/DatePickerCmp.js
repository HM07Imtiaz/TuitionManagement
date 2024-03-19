import React, { useState } from 'react';
import { View, Button, Platform, Text, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const DatePickerComponent = ({ onSelectDate }) => {
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowPicker(Platform.OS === 'ios'); // For iOS, show the picker until the user confirms the date
    setDate(currentDate);
    onSelectDate(currentDate);
  };

  const showDatepicker = () => {
    setShowPicker(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <Text style={styles.filterText}>Filter by Date :</Text>
        <Button onPress={showDatepicker} title="Select Date" />
      </View>
      {showPicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 30,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
    marginTop: 10,
  },
  filterText: {
    fontSize: 20,
    marginRight: 30,
    marginTop: 10,
    marginBottom: 10,
  },
});

export default DatePickerComponent;
