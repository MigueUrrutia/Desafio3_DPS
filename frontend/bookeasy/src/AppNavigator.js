import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import AddBookScreen from '../screens/AddBookScreen';
import BookDetailScreen from '../screens/BookDetailScreen';
const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Iniciar sesión' }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Registro' }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Mis libros' }} />
        <Stack.Screen name="AddBook" component={AddBookScreen} options={{ title: 'Nuevo libro' }} />
        <Stack.Screen name="BookDetail" component={BookDetailScreen} options={{ title: 'Detalles del libro' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
