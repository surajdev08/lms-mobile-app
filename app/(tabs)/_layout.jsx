import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs, Redirect } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { View, ActivityIndicator } from "react-native";

export default function TabLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#006FFD" />
      </View>
    );
  }

  // if (!user) {
  //   return <Redirect href="/dashboard" />;
  // }
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "blue", headerShown: false }}>
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="mytest"
        options={{
          title: "My Test",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="pencil-square-o" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="browsetest"
        options={{
          title: "Browse Test",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="search" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="report"
        options={{
          headerShown: true,
          headerTitle: "Submissions",
          title: "Report",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="file-text-o" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="manage"
        options={{
          title: "Manage",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="user" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
