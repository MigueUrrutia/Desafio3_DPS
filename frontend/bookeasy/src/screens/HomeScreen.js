import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  FlatList,
  Alert,
  ActivityIndicator
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

const API_URL = "http://192.168.0.17:3000/api";

export default function HomeScreen({ navigation }) {
  const [books, setBooks] = useState([]);
  const [filterStatus, setFilterStatus] = useState("todos");
  const [loading, setLoading] = useState(true);

 useFocusEffect(
  useCallback(() => {
    const fetchBooks = async () => {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");

      try {
        const response = await fetch(`${API_URL}/books`, {
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

    fetchBooks();
  }, [])
);


  const filteredBooks = books.filter((book) => {
    if (filterStatus === "todos") return true;
    return book.status === filterStatus;
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Libros</Text>

      <Text style={styles.label}>Filtrar por estado:</Text>
      <Picker
        selectedValue={filterStatus}
        onValueChange={(value) => setFilterStatus(value)}
        style={styles.picker}
      >
        <Picker.Item label="Todos" value="todos" />
        <Picker.Item label="Por leer" value="por leer" />
        <Picker.Item label="Leyendo" value="leyendo" />
        <Picker.Item label="Completado" value="completado" />
      </Picker>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={filteredBooks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.bookTitle}>{item.title}</Text>
              <Text>{item.author} — {item.status}</Text>
            </View>
          )}
          ListEmptyComponent={<Text>No hay libros registrados aún.</Text>}
        />
      )}

      <Button title="Agregar libro" onPress={() => navigation.navigate("AddBook")} />
      <Button title="Cerrar sesión" color="red" onPress={() => {
        AsyncStorage.removeItem("token");
        navigation.replace("Login");
      }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  label: { marginBottom: 6, fontWeight: "bold" },
  picker: { marginBottom: 10 },
  item: { marginBottom: 12 },
  bookTitle: { fontWeight: "bold", fontSize: 16 }
});
