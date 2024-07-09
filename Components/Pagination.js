import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Pagination = ({ currentPage, totalPages, onNextPage, onPrevPage }) => {
  return (
    <View style={styles.paginationContainer}>
      <TouchableOpacity onPress={onPrevPage} disabled={currentPage === 1}>
        <Text style={[styles.paginationButton, currentPage === 1 && styles.disabled]}>Previous</Text>
      </TouchableOpacity>
      <Text style={styles.pageNumber}>Page {currentPage} of {totalPages}</Text>
      <TouchableOpacity onPress={onNextPage} disabled={currentPage === totalPages}>
        <Text style={[styles.paginationButton, currentPage === totalPages && styles.disabled]}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
    marginTop: 50,
    marginBottom: 30,
    borderColor: 'white',
    borderWidth: 1,
    padding: 10,
  },
  paginationButton: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'blue',
    borderWidth: 1,
    padding: 5,
    borderColor: 'grey',
  },
  disabled: {
    color: '#ccc',
  },
  pageNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    borderWidth: 1,
    padding: 5,
    borderColor: 'white',
  },
});

export default Pagination;
