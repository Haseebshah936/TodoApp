import React from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Button,
  TextInput,
  Keyboard,
  Pressable,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Constants from "expo-constants";
import { Fontisto } from "@expo/vector-icons";
import { useState } from "react";
import { useEffect } from "react";
import { auth, db1 } from "../../firebase";
import Task from "../Todo/Task";
import RenderRightAction from "../Todo/RenderRightAction";

function index({ navigation }) {
  const [data, setData] = useState([]);
  const [task, setTask] = useState("");
  const [added, setAdded] = useState(0);
  const [fetched, setFetched] = useState(false);
  const [userId, setUserID] = useState("");
  const addTodo = () => {
    // setData([...data, { todo: task }]);

    var uid = userId + "/";
    console.log(uid);
    if (fetched && task !== "") {
      console.log(data)
      if (!data) {
        id = 0;
      } else {
        id = data[data.length - 1].key + 1;
      }
      db1.ref(uid + id).set({
        key: id,
        todo: task,
      });
      setAdded(added + 1);
    } else if (task === "") {
      alert("Enter Task to Add");
    }
  };

  const remove = (key) =>{
    console.log(key)
    if(key === 0){
      var uid = userId + "/";
      db1.ref(uid + key).set({
        key: 0,
        todo: " "
      });
    }
    else{
      var uid = userId + "/";
      db1.ref(uid + key).remove();
      setAdded(added + 1);
    }
  }

   async function getUserID(){
    let user = await auth.currentUser;
    if (user != null) {
      console.log(user.uid);
      return user.uid;
    } else {
      navigation.popToTop();
    }
  };

  useEffect(() => {
    getUserID().then(uid => {
      setUserID(uid)
      var todo = db1.ref(uid);
      todo.on("value", (snapshot) => {
        console.log(snapshot.val());
        if (snapshot.val()) {
          let reliableData = snapshot.val().filter( (m) => m!=undefined || m.todo !== " ")
          setData(reliableData);
          console.log(reliableData)
        }
        else{
          setData(snapshot.val())
        }
        setFetched(true);
      });
    }).catch((error) => console.warn(error))
  }, []);

  const signOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace("Login");
      })
      .catch((error) => {
        // An error happened.
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Fontisto
          style={styles.CovidLog}
          name="checkbox-active"
          size={24}
          color="black"
        />
        <View style={{ marginLeft: 45, marginRight: 10 }}>
          <TextInput
            onChangeText={(text) => setTask(text)}
            placeholder={"Todo"}
            style={styles.searchBarText}
            clearButtonMode="always"
            keyboardType={"email-address"}
            // onBlur={() => setFieldTouched("email")}
          />
        </View>
      </View>
      {/* <Text>{task}</Text> */}
      <TouchableOpacity
        style={{
          marginTop: 20,
          padding: 10,
          borderRadius: 20,
          backgroundColor: "pink",
          width: "50%",
          alignItems: "center",
          alignSelf: "center",
        }}
        activeOpacity={0.5}
        onPress={() => {
          addTodo();
          Keyboard.dismiss();
        }}
      >
        <Text>Add</Text>
      </TouchableOpacity>
        <Button title={"SignOut"} onPress={signOut} />
      {!fetched ? (
        <ActivityIndicator style={{marginTop: 20}} size={"large"} color={"white"} />
      ) : (
        <FlatList
          data={data}
          style={{ flex: 1, backgroundColor: "white", marginTop: 20 }}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Task
              todo={item.todo}
              renderRightActions={() => (
                <RenderRightAction onPress={() => remove(item.key)} />
              )}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight * 1.5,
    width: "100%",
    backgroundColor: "lightyellow",
  },
  searchBar: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 30,
    padding: 10,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    alignSelf: "center",
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
});
export default index;
