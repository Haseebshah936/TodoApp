import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import LoginNavigator from './Components/Navigator/LoginNavigator';
import { LogBox } from 'react-native';

export default function App() {
  LogBox.ignoreAllLogs(["Setting a timer for a long period of time", "Cannot update state"])
  return (
    <NavigationContainer>
        <LoginNavigator />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
