import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginForm from '../Login/LoginForm';
import RegisterForm from '../Login/RegisterForm';
import index from '../TodoRealTime';
// import index from '../TodoFireStore';

const Stack = createStackNavigator();

function LoginNavigator(props) {
  return (
    <Stack.Navigator headerMode={'none'} mode={'modal'}>
      <Stack.Screen name="Login" component={LoginForm} />
      <Stack.Screen name="Register" component={RegisterForm} />
      <Stack.Screen name="Todo" component={index}/>
    </Stack.Navigator>
  );
}

export default LoginNavigator;