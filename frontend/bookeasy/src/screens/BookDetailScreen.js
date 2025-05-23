import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

const API_URL = 'http://192.168.0.17:3000/api';

export default function BookDetailScreen({ route, navigation }) {
  const { bookId } = route.params;

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [status, setStatus] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [comment, setComment] = useState('');

  const fetchBook = async () => {
    const token = await AsyncStorage.getItem('token');

    try {
      const res = await fetch(`${API_URL}/books/${bookId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al obtener datos');

      setTitle(data.title);
      setAuthor(data.author);
      setStatus(data.status);
      setStartDate(data.startDate || '');
      setEndDate(data.endDate || '');
      setComment(data.comment || '');
    } catch (err) {
      Alert.alert('Error', err.message);
      navigation.goBack();
    }
  };

  const updateBook = async () => {
    const token = await AsyncStorage.getItem('token');

    try {
      const res = await fetch(`${API_URL}/books/${bookId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title, author, status, startDate, endDate, comment })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'No se pudo actualizar');

      Alert.alert('Libro actualizado');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  const deleteBook = async () => {
    const token = await AsyncStorage.getItem('token');

    try {
      await fetch(`${API_URL}/books/${bookId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      Alert.alert('Libro eliminado');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  useEffect(() => {
    fetchBook();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalles del libro</Text>

      <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Título" />
      <TextInput style={styles.input} value={author} onChangeText={setAuthor} placeholder="Autor" />

      <Text style={styles.label}>Estado:</Text>
      <Picker selectedValue={status} onValueChange={setStatus} style={styles.picker}>
        <Picker.Item label="Por leer" value="por leer" />
        <Picker.Item label="Leyendo" value="leyendo" />
        <Picker.Item label="Completado" value="completado" />
      </Picker>

      <TextInput style={styles.input} value={startDate} onChangeText={setStartDate} placeholder="Fecha inicio" />
      <TextInput style={styles.input} value={endDate} onChangeText={setEndDate} placeholder="Fecha fin" />
      <TextInput
        style={styles.input}
        value={comment}
        onChangeText={setComment}
        placeholder="Comentario"
        multiline
      />

      <Button title="Guardar cambios" onPress={updateBook} />
      <View style={{ marginTop: 10 }}>
        <Button title="Eliminar libro" onPress={deleteBook} color="red" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12
  },
  picker: { marginBottom: 16 },
  label: { marginTop: 12, marginBottom: 4, fontWeight: 'bold' }
});
