import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { SafeAreaView } from "react-native";
import Upcoming from "../../pages/Upcoming";
import Ongoing from "../../pages/Ongoing";
import Previous from "../../pages/Previous";

const Tab = createMaterialTopTabNavigator();

export default function MyTabs() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <Tab.Navigator>
        <Tab.Screen name="Upcoming" component={Upcoming} />
        <Tab.Screen name="Ongoing" component={Ongoing} />
        <Tab.Screen name="Previous" component={Previous} />
      </Tab.Navigator>
    </SafeAreaView>
  );
}
