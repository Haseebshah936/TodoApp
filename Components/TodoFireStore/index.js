import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import Constants from 'expo-constants';
function index(props) {
    return (
        <View style={styles.container}>
            <Text> FireStore </Text>
        </View>
    );
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    padding: Constants.statusBarHeight
  }
})
export default index;