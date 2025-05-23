import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function BookItem({ book, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.title}>{book.title}</Text>
      <Text style={styles.author}>{book.author}</Text>
      <Text style={styles.status}>Estado: {book.status}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f4f4f4',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18
  },
  author: {
    fontSize: 14,
    color: '#555'
  },
  status: {
    fontStyle: 'italic',
    marginTop: 8,
    color: '#777'
  }
});
