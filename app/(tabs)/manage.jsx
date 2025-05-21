import { View, Text, SafeAreaView, StyleSheet, ScrollView } from "react-native";
import React, { useEffect } from "react";
import {
  Avatar,
  Button,
  Card,
  Chip,
  PaperProvider,
  List,
} from "react-native-paper";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import useUserApi from "../hooks/user/useUserApi";

import { useAuth } from "../../context/AuthContext";
const manage = () => {
  const { userData, fetchUserById } = useUserApi();
  const { logout } = useAuth();

  useEffect(() => {
    fetchUserById();
  }, []);

  const name = userData?.first_name + " " + userData?.last_name;
  const router = useRouter();
  return (
    <PaperProvider
      settings={{
        icon: (props) => <EvilIcons {...props} />,
      }}
    >
      <SafeAreaView style={{ flex: 1, padding: 20, backgroundColor: "white" }}>
        <ScrollView style={{ flex: 1 }}>
          <View style={{ flex: 1, padding: 20 }}>
            <Card style={styles.profileCard}>
              <View style={styles.profileimg}>
                <Avatar.Image
                  size={80}
                  source={require("../../assets/avatar.jpg")}
                />
                <Text style={{ fontWeight: 600, fontSize: 18 }}>{name}</Text>
              </View>
              <View style={styles.profileDetails}>
                <View
                  style={{
                    justifyContent: "center",
                    gap: 10,
                    flexDirection: "row",
                    paddingTop: 10,
                  }}
                >
                  <Chip onPress={() => console.log("Pressed")}>Student</Chip>
                  <Chip
                    icon="location"
                    i
                    onPress={() => console.log("Pressed")}
                  >
                    Vetican City
                  </Chip>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 5,
                    paddingTop: 10,
                    justifyContent: "center",
                  }}
                >
                  <Text>Joined on 23 March 2025</Text>
                </View>
                <View style={{ flexDirection: "row", gap: 10 }}>
                  <Button mode="contained">Upload Profile</Button>
                  <Button
                    mode="outlined"
                    textColor="red"
                    style={{ borderColor: "red", width: 120 }}
                  >
                    Reset
                  </Button>
                </View>
              </View>
            </Card>
            <View style={{ paddingVertical: 20, gap: 10 }}>
              <List.Item
                title="Account"
                description="Manage Account Details"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 0.5 },
                  shadowOpacity: 0.5,
                  shadowRadius: 2,
                  backgroundColor: "white",
                  borderRadius: 10,
                }}
                right={(props) => <List.Icon {...props} icon="arrow-right" />}
                onPress={() => router.push("/accounts")}
              />

              <List.Item
                title="Change Password"
                description="Check and manage passwords"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 0.5 },
                  shadowOpacity: 0.5,
                  shadowRadius: 2,
                  backgroundColor: "white",
                  borderRadius: 10,
                }}
                right={(props) => <List.Icon {...props} icon="arrow-right" />}
                onPress={() => router.push("/changepassword")}
              />
              <List.Item
                title="Billings and Plans"
                description="Manage Your billing plans"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 0.5 },
                  shadowOpacity: 0.5,
                  shadowRadius: 2,
                  backgroundColor: "white",
                  borderRadius: 10,
                }}
                right={(props) => <List.Icon {...props} icon="arrow-right" />}
              />
              <List.Item
                title="Notifications"
                description="Manage your notification"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 0.5 },
                  shadowOpacity: 0.5,
                  shadowRadius: 2,
                  backgroundColor: "white",
                  borderRadius: 10,
                }}
                right={(props) => <List.Icon {...props} icon="arrow-right" />}
              />
              <List.Item
                title="Sign Out"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 0.5 },
                  shadowOpacity: 0.5,
                  shadowRadius: 2,
                  backgroundColor: "white",
                  borderRadius: 10,
                }}
                titleStyle={{ color: "red" }}
                right={(props) => <List.Icon {...props} icon="arrow-right" />}
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </PaperProvider>
  );
};

export default manage;

const styles = StyleSheet.create({
  profileCard: {
    justifyContent: "center",
    height: "45%",
    alignItems: "center",
    padding: 20,
  },
  manageProfile: {
    flex: 1,
    padding: 36,
    alignItems: "center",
  },
  profileimg: {
    alignItems: "center",
    gap: 10,
  },
});
