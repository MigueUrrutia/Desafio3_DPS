import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Platform,
  TouchableOpacity
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

const API_URL = 'http://192.168.0.15:3000/api/books';

export default function AddBookScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [status, setStatus] = useState('por leer');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [comment, setComment] = useState('');

  const handleAddBook = async () => {
    if (!title || !author) {
      Alert.alert('Campos obligatorios', 'Debes completar al menos título y autor.');
      return;
    }

    const token = await AsyncStorage.getItem('token');

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          author,
          status,
          startDate,
          endDate,
          comment
        })
      });

      const text = await response.text();
      try {
        const data = JSON.parse(text);
        if (!response.ok) {
          throw new Error(data.error || 'Error al guardar');
        }

        Alert.alert('Libro agregado correctamente');
        navigation.goBack();
      } catch {
        throw new Error('Respuesta no válida del servidor: ' + text);
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nuevo Libro</Text>

      <Text style={styles.label}>Título</Text>
      <TextInput
        style={styles.input}
        placeholder="Título del libro"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Autor</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre del autor"
        value={author}
        onChangeText={setAuthor}
      />

      <Text style={styles.label}>Estado</Text>
      <View style={styles.pickerWrapper}>
        <Picker selectedValue={status} onValueChange={setStatus}>
          <Picker.Item label="Por leer" value="por leer" />
          <Picker.Item label="Leyendo" value="leyendo" />
          <Picker.Item label="Completado" value="completado" />
        </Picker>
      </View>

      <Text style={styles.label}>Fecha de inicio</Text>
      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setShowStartPicker(true)}
      >
        <Text style={styles.dateButtonText}>
          {startDate ? startDate.toDateString() : 'Seleccionar fecha'}
        </Text>
      </TouchableOpacity>
      {showStartPicker && (
        <DateTimePicker
          value={startDate || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, date) => {
            setShowStartPicker(false);
            if (date) setStartDate(date);
          }}
        />
      )}

      <Text style={styles.label}>Fecha de fin</Text>
      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setShowEndPicker(true)}
      >
        <Text style={styles.dateButtonText}>
          {endDate ? endDate.toDateString() : 'Seleccionar fecha'}
        </Text>
      </TouchableOpacity>
      {showEndPicker && (
        <DateTimePicker
          value={endDate || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, date) => {
            setShowEndPicker(false);
            if (date) setEndDate(date);
          }}
        />
      )}

      <Text style={styles.label}>Comentario</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Comentario adicional"
        value={comment}
        onChangeText={setComment}
        multiline
      />

      <TouchableOpacity style={styles.buttonPrimary} onPress={handleAddBook}>
        <Text style={styles.buttonText}>Guardar libro</Text>
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
    backgroundColor: '#f6ddcc',
    borderColor: '#cbd5e1',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12
  },
  dateButton: {
    backgroundColor: '#f6ddcc',
    borderColor: '#cbd5e1',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12
  },
  dateButtonText: {
    color: '#1f2937'
  },
  buttonPrimary: {
    backgroundColor: '#eb984e',
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
