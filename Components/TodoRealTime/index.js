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
import { auth, db1, storage } from "../../firebase";
import Task from "../Todo/Task";
import RenderRightAction from "../Todo/RenderRightAction";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";

function index({ navigation }) {
  const [data, setData] = useState([]);
  const [task, setTask] = useState("");
  const [added, setAdded] = useState(0);
  const [fetched, setFetched] = useState(false);
  const [userId, setUserID] = useState("");
  const [image, setImage] = useState(
    "https://example.com/jane-q-user/profile.jpg"
  );
  const [loading, setLoading] = useState(false);
  const addTodo = () => {
    // setData([...data, { todo: task }]);
    let id;
    var uid = userId + "/";
    // console.log(uid);
    if (fetched && task !== "") {
      // console.log(data)
      if (!data || data.length == 0) {
        id = 0;
      } else {
        id = data[data.length - 1].key + 1;
      }
      db1.ref(uid + id).set({
        key: id,
        todo: task,
        avatar: image,
      });
      // setTask("");
      setImage("https://example.com/jane-q-user/profile.jpg");
      setAdded(added + 1);
    } else if (task === "") {
      alert("Enter a Task to Add");
    }
  };

  const remove = (key) => {
    // console.log(key)
    var uid = userId + "/";
    db1.ref(uid + key).remove();
    storage
      .ref()
      .child("Images/" + uid + key)
      .delete()
      .then(() => {
        console.log("File Deleted");
      })
      .catch((error) => console.log(error));
    setAdded(added + 1);
  };

  async function getUserID() {
    let user = await auth.currentUser;
    if (user != null) {
      // console.log(user.uid);
      // console.log(user);
      return user.uid;
    } else {
      navigation.popToTop();
    }
  }

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("Todo");
      // console.log(jsonValue + "Json");
      // console.log(JSON.parse(jsonValue) + "After");

      return jsonValue;
    } catch (e) {
      // error reading value
      console.log(e + "Line 79 inside getData");
    }
  };

  const signOut = () => {
    let user = auth.currentUser;
    if (user.isAnonymous) {
      var uid = userId + "/";
      db1.ref(uid).remove();
      if(data ){
        data.map((m) =>
          storage
            .ref()
            .child("Images/" + uid + m.key)
            .delete()
            .then(() => {
              console.log("File Deleted");
            })
            .catch((error) => console.log(error))
        );
      }
    }
    auth
      .signOut()
      .then(() => {
        navigation.replace("Login");
      })
      .catch((error) => {
        // An error happened.
      });
    getData().then((value) => {
      console.log(value + "Before Signout");
      if (value) {
        AsyncStorage.setItem("Todo", JSON.stringify([])).then(() =>
          console.log(value + "After Signout")
        );
      }
    });
  };

  const addImage = async () => {
    console.log("Add Image");
    let id;
    // console.log(uid);
    if (fetched && task !== "") {
      // console.log(data)
      if (!data || data.length == 0) {
        id = 0;
      } else {
        id = data[data.length - 1].key + 1;
      }
      // let result = await ImagePicker.launchImageLibraryAsync();
      let result = await ImagePicker.launchCameraAsync();
      if (!result.cancelled) {
        setImage(result.uri);
        uploadImage(result.uri, id).catch((error) => console.log(error));
      }
      // setTask("");
    } else if (task === "") {
      alert("Enter a Task to Add");
    }
  };

  const uploadImage = async (uri, id) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    let ref = storage.ref().child("Images/" + userId + "/" + id);
    // setImage(null);
    await ref.put(blob);
    setImage(await ref.getDownloadURL());
  };

  // const getCamerPermission = async () => {
  //   try {
  //     if (Platform.OS !== 'web') {
  //       const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  //       const { status2 } = await ImagePicker.requestCameraPermissionsAsync();
  //       if (status !== 'granted' && status2 !== 'granted') {
  //         alert('Sorry, we need camera roll permissions to make this work!');
  //       }
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  useEffect(() => {
    getData()
      .then((value) => {
        console.log(value + "Before storing data");
        if (value != null) {
          setData(JSON.parse(value));
          // console.log(value + "Value");
          console.log(JSON.parse(value) + "Inside the json loadup");
          // console.log(JSON.stringify(data) + "DATA 114");
          setFetched(true);
        }
      })
      .then(() => {
        getUserID()
          .then((uid) => {
            setUserID(uid);
            var todo = db1.ref(uid);
            todo.on("value", (snapshot) => {
              // console.log(snapshot.val());
              if (snapshot.val()) {
                if (Array.isArray(snapshot.val())) {
                  let reliableData = snapshot
                    .val()
                    .filter((m) => m != undefined || m.todo !== " ");
                  setData(reliableData);
                } else {
                  // console.log(snapshot.val())
                  let ObjectToArray = Object.keys(snapshot.val()).map(
                    (i) => snapshot.val()[i]
                  );
                  // console.log(ObjectToArray)
                  setData(ObjectToArray);
                }
                // console.log(reliableData)
              } else {
                setData(snapshot.val());
              }
              // console.log(data + "DATA");
              AsyncStorage.setItem("Todo", JSON.stringify(data));
              // getData().then(value => console.log(value + "After storing data"))
              setFetched(true);
            });
          })
          .catch((error) => console.warn(error));
      });
  }, [added]);

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
            onSubmitEditing={addTodo}
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
          addImage();
          Keyboard.dismiss();
        }}
      >
        <Text>Add Image</Text>
      </TouchableOpacity>
      <Button title={"SignOut"} onPress={signOut} />
      {!fetched ? (
        <ActivityIndicator
          style={{ marginTop: 20 }}
          size={"large"}
          color={"white"}
        />
      ) : (
        <FlatList
          data={data}
          style={{ flex: 1, backgroundColor: "white", marginTop: 20 }}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Task
              todo={item.todo}
              avatar={item.avatar}
              renderRightActions={() => (
                <RenderRightAction onPress={() => remove(item.key)} />
              )}
            />
          )}
          ItemSeparatorComponent={() => (
            <View style={{ marginVertical: 10 }}></View>
          )}
          refreshing={loading}
          onRefresh={() => {
            setLoading(false);
            setAdded(added + 1);
          }}
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
