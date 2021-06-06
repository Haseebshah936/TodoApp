import * as React from "react";
import { Button, View } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import index from "../TodoFireStore";
// import index from "../TodoRealTime";

const Drawer = createDrawerNavigator();

function DrawerNavigator(props) {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Main" component={index} />
    </Drawer.Navigator>
  );
}

export default DrawerNavigator;
