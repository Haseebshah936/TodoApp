import React,{useEffect} from 'react';
import {View, StyleSheet,ActivityIndicator} from 'react-native';
import { auth } from '../../firebase';
function LoadingScreen({navigation}) {
    useEffect(() => {
        auth.onAuthStateChanged((user) => {
          if (user) {
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/firebase.User
            var uid = user.uid;
            navigation.replace('Todo');
            // ...
          } else {
            // User is signed out
            // ...
            navigation.replace('Login')
          }
        });
      })
    return (
        <View>
            <ActivityIndicator style={{justifyContent: 'center', alignItems: 'center'}} size={'large'} color={'black'}/>
        </View>
    );
}

const styles = StyleSheet.create({
  container:{
     
  }
})
export default LoadingScreen;