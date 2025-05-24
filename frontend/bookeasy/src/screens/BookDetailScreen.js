import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

const API_URL = 'http://192.168.0.15:3000/api/books';

export default function BookDetailScreen({ route, navigation }) {
  const { book } = route.params;
  const [title, setTitle] = useState(book.title);
  const [status, setStatus] = useState(book.status);
  const [comment, setComment] = useState(book.comment || '');

  const handleUpdate = async () => {
    const token = await AsyncStorage.getItem('token');

    try {
      const response = await fetch(`${API_URL}/${book.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title, status, comment })
      });

      if (!response.ok) throw new Error('No se pudo actualizar');
      Alert.alert('Libro actualizado');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleDelete = async () => {
    const token = await AsyncStorage.getItem('token');

    try {
      const response = await fetch(`${API_URL}/${book.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('No se pudo eliminar');
      Alert.alert('Libro eliminado');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Libro</Text>

      <Text style={styles.label}>Título</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Título del libro"
      />

      <Text style={styles.label}>Estado</Text>
      <View style={styles.pickerWrapper}>
        <Picker selectedValue={status} onValueChange={setStatus}>
          <Picker.Item label="Por leer" value="por leer" />
          <Picker.Item label="Leyendo" value="leyendo" />
          <Picker.Item label="Completado" value="completado" />
        </Picker>
      </View>

      <Text style={styles.label}>Comentario</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        value={comment}
        onChangeText={setComment}
        placeholder="Comentario"
        multiline
      />

      <TouchableOpacity style={styles.buttonPrimary} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Actualizar libro</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonDanger} onPress={handleDelete}>
        <Text style={styles.buttonText}>Eliminar libro</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fdf2e9', padding: 20 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#1f2937', marginBottom: 20, textAlign: 'center' },
  label: { fontWeight: '600', marginBottom: 6, color: '#1f2937' },
  input: {
    backgroundColor: '#f6ddcc',
    borderColor: '#cbd5e1',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 12
  },
  pickerWrapper: {
    backgroundColor: '#ffffff',
    borderColor: '#cbd5e1',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12
  },
  buttonPrimary: {
    backgroundColor: '#eb984e',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10
  },
  buttonDanger: {
    backgroundColor: '#ec7063',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10
  },
  buttonText: {
    color: '#fdf2e9',
    fontWeight: '600',
    fontSize: 16
  }
});
