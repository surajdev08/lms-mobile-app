import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  SafeAreaView,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Avatar, Badge, Card } from "react-native-paper";
import MyTestCard from "../../components/MytestCard";
import GradeList from "../../components/GradeList";
import useUserApi from "../hooks/user/useUserApi";

const Dashboard = () => {
  const { userData, fetchUserById } = useUserApi();

  useEffect(() => {
    fetchUserById();
  }, []);

  const name = userData?.first_name;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.header}>
          <View>
            <Text style={{ color: "white", fontSize: 22, fontWeight: 600 }}>
              Welcome, {name}
            </Text>
            <Text style={{ color: "white", fontSize: 18, fontWeight: 500 }}>
              Let’s start learning
            </Text>
          </View>

          <Avatar.Image size={50} source={require("../../assets/avatar.jpg")} />
        </View>
        <View
          style={{
            flex: 1,
            backgroundColor: "white",
            alignItems: "center",
          }}
        >
          <View
            style={{
              zIndex: 1,
              marginTop: -50,
              gap: 20,
              justifyContent: "space-between",
              flexDirection: "row",
            }}
          >
            <Card style={{ height: 100, width: "40%" }}>
              <Card.Title title="Announcements" subtitle="30" />
            </Card>
            <Card style={{ height: 100, width: "40%" }}>
              <Card.Title title="Emails" subtitle="40" />
            </Card>
          </View>
          <MyTestCard />
          <GradeList />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
  },
  header: {
    height: 180,
    backgroundColor: "#006FFD",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 40,
    paddingHorizontal: 40,
  },

  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: -40, // Pull cards up to overlay
  },
  card: {
    width: "40%",
    height: 100,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    elevation: 4, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    alignItems: "center",
  },
  announcementCard: {
    borderBottomWidth: 3,
    borderBottomColor: "red",
  },
  emailCard: {
    borderBottomWidth: 3,
    borderBottomColor: "blue",
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  cardNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#555",
    marginTop: 5,
  },
  notificationDot: {
    width: 8,
    height: 8,
    backgroundColor: "red",
    borderRadius: 4,
    position: "absolute",
    top: 8,
    right: 20,
  },
});
