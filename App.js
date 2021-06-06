import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import LoginNavigator from "./Components/Navigator/LoginNavigator";
import { LogBox } from "react-native";

export default function App() {
  LogBox.ignoreLogs(["Setting a timer"]);
  return (
    <NavigationContainer>
      <LoginNavigator />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
