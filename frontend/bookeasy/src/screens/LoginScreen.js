import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Title } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.0.15:3000/api';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const login = async () => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return Alert.alert('Error', data.error || 'No se pudo iniciar sesión');
      }

      await AsyncStorage.setItem('token', data.token);
      navigation.replace('Home');
    } catch (err) {
      Alert.alert('Error de conexión', err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Iniciar Sesión</Title>

      <TextInput
        label="Correo"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />

      <TextInput
        label="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <Button mode="contained" onPress={login} style={styles.button}>
        Entrar
      </Button>

      <Button onPress={() => navigation.navigate('Register')} style={styles.link}>
        ¿No tienes cuenta? Regístrate
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { marginBottom: 20, textAlign: 'center' },
  input: { marginBottom: 15 },
  button: { marginTop: 10 },
  link: { marginTop: 10, alignSelf: 'center' },
});
