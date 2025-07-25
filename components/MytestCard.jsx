import React from "react";
import { View } from "react-native";
import { Button } from "react-native-paper";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useRouter } from "expo-router";
import TestTab from "./TestTab";

const Tab = createMaterialTopTabNavigator();

const MyTestCard = () => {
  const router = useRouter();

  return (
    <View style={{ width: "100%", padding: 20, height: 600 }}>
      <Tab.Navigator initialRouteName="Ongoing">
        <Tab.Screen name="Upcoming">
          {() => <TestTab type="upcoming" />}
        </Tab.Screen>
        <Tab.Screen name="Ongoing">
          {() => <TestTab type="ongoing" />}
        </Tab.Screen>
        <Tab.Screen name="Previous">
          {() => <TestTab type="previous" />}
        </Tab.Screen>
      </Tab.Navigator>

      <Button
        mode="text"
        onPress={() => router.push("/mytest")}
        style={{ marginTop: 12 }}
      >
        View More
      </Button>
    </View>
  );
};

export default MyTestCard;
