import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  ActivityIndicator,
  TouchableOpacity
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { useFocusEffect } from "@react-navigation/native";

const API_URL = "http://192.168.0.15:3000/api/books";

export default function HomeScreen({ navigation }) {
  const [books, setBooks] = useState([]);
  const [filterStatus, setFilterStatus] = useState("todos");
  const [loading, setLoading] = useState(true);

  const fetchBooks = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem("token");

    try {
      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Error al obtener libros");

      setBooks(data);
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchBooks();
    }, [])
  );

  const filteredBooks = books.filter((book) => {
    if (filterStatus === "todos") return true;
    return book.status === filterStatus;
  });

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    navigation.replace("Login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Libros</Text>

      <Text style={styles.label}>Filtrar por estado:</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={filterStatus}
          onValueChange={(value) => setFilterStatus(value)}
        >
          <Picker.Item label="Todos" value="todos" />
          <Picker.Item label="Por leer" value="por leer" />
          <Picker.Item label="Leyendo" value="leyendo" />
          <Picker.Item label="Completado" value="completado" />
        </Picker>
      </View>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={filteredBooks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.bookCard}
              onPress={() => navigation.navigate("BookDetail", { book: item })}
            >
              <Text style={styles.bookTitle}>{item.title}</Text>
              <Text style={styles.bookInfo}>{item.author} — {item.status}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text style={styles.label}>No hay libros registrados aún.</Text>}
        />
      )}

      <TouchableOpacity style={styles.buttonPrimary} onPress={() => navigation.navigate("AddBook")}>
        <Text style={styles.buttonText}>Agregar libro</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonDanger} onPress={handleLogout}>
        <Text style={styles.buttonText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fdf2e9', padding: 20 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#1f2937', marginBottom: 16, textAlign: 'center' },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 6, color: '#1f2937' },
  pickerWrapper: {
    backgroundColor: '#fdf2e9',
    borderColor: '#cbd5e1',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16
  },
  bookCard: {
    backgroundColor: '#f6ddcc',
    borderColor: '#17202a',
    borderWidth: 1,
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1
  },
  bookTitle: { fontWeight: 'bold', fontSize: 16, color: '#1f2937' },
  bookInfo: { color: '#4b5563', marginTop: 4 },
  buttonPrimary: {
    backgroundColor: '#eb984e',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16
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
