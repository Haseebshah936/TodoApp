import React from 'react';
import {View, StyleSheet, Text, FlatList, Button, TextInput, Keyboard, Pressable, TouchableOpacity} from 'react-native';
import Constants from 'expo-constants';
import { Fontisto } from "@expo/vector-icons";
import { useState } from 'react';

function index(props) {
  const [data, setData] = useState([]);
  const [task, setTask] = useState('');
  const addTodo = () => {
    setData([...data,{todo: task}])
  }

    return (
        <Pressable onPress={Keyboard.dismiss} style={styles.container}>
            <View style={styles.searchBar}>
              <Fontisto
                style={styles.CovidLog}
                name="email"
                size={24}
                color="black"
              />
              <View style={{ marginLeft: 45, marginRight: 10 }}>
                <TextInput
                  onChangeText={text => setTask(text)}
                  placeholder={"Email"}
                  style={styles.searchBarText}
                  clearButtonMode="always"
                  keyboardType={"email-address"}
                  // onBlur={() => setFieldTouched("email")}
                />
              </View>
            </View>
            {/* <Text>{task}</Text> */}
            <TouchableOpacity style={{marginTop: 20, padding: 10, borderRadius: 20, backgroundColor: 'pink', width: '50%', alignItems: 'center',alignSelf: 'center'}} activeOpacity={0.6} onPress={addTodo}>
              <Text>Add</Text>
            </TouchableOpacity>
            <FlatList 
              data={data}
              style={{flex: 1, backgroundColor: 'white', marginTop: 20}}
              keyExtractor={(item,index) => index.toString()}
              renderItem={({item}) => <Text> {item.todo} </Text>}
            />
        </Pressable>
    );
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    paddingTop: Constants.statusBarHeight*1.5,
    width: '100%',
    backgroundColor: 'lightyellow'
  },
  searchBar: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 30,
    padding: 10,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    alignSelf: 'center'

  },
  searchBarText: {
    fontWeight: "bold",
    color: "black",
    fontSize: 16,
  },
  CovidLog: {
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    position: "absolute",
    left: 15,
    alignSelf: "center",
    width: 40,
  },
})
export default index;