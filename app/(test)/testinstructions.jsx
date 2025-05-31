import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { Button } from "react-native-paper";
import { useRouter, useLocalSearchParams } from "expo-router";
import useTakeTestApi from "../hooks/test/useTakeTestApi";
import * as Device from "expo-device";
import * as Location from "expo-location";
import * as ScreenCapture from "expo-screen-capture";
import {
  activateKeepAwakeAsync,
  deactivateKeepAwakeAsync,
} from "expo-keep-awake";

const DATA = [
  { id: "1", instructions: "Instruction 1: Read all details carefully." },
  { id: "2", instructions: "Instruction 2: Keep the device steady." },
  { id: "3", instructions: "Instruction 3: Do not exit the test screen." },
  { id: "4", instructions: "Instruction 4: Ensure good internet connection." },
];

const TestInstructions = () => {
  const router = useRouter();
  const { guid } = useLocalSearchParams();
  const { fetchTestQuestions, createSession } = useTakeTestApi(); // Hook to fetch test data
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      // Ask for permission
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      // Get current location
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
    })();
  }, []);

  const handleStartTest = async () => {
    await ScreenCapture.preventScreenCaptureAsync();
    await activateKeepAwakeAsync();
    console.log("location", location);
    // Trigger API call when the "Start Test" button is pressed
    console.log(
      "Device Info:",
      Device.osName,
      Device.osVersion,
      Device.deviceName
    );
    const sessionId = await createSession(guid);
    fetchTestQuestions(guid);

    if (sessionId) {
      router.push({ pathname: "/taketest", params: { guid } });
    } // Redirect to the test page
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Read all the instructions carefully</Text>
      <FlatList
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        data={DATA}
        renderItem={({ item }) => (
          <View style={styles.instructionBox}>
            <Text style={styles.instructionText}>{item.instructions}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          paddingVertical: 20,
          flexDirection: "row",
          gap: 20,
        }}
      >
        <Button
          style={{ width: 120 }}
          mode="contained"
          onPress={() => router.back()}
        >
          Go back
        </Button>
        <Button
          style={{ width: 120 }}
          mode="contained"
          onPress={handleStartTest} // Call the function to fetch the test questions
        >
          Start Test
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "white",
  },
  headerText: {
    fontSize: 22,
    fontWeight: "600",
    paddingVertical: 20,
    textAlign: "center",
  },
  listContainer: {
    paddingHorizontal: 20,
    gap: 15,
    paddingVertical: 20,
    flexGrow: 1,
    justifyContent: "flex-start",
  },
  instructionBox: {
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    width: "90%",
    alignSelf: "center",
  },
  instructionText: {
    fontSize: 16,
    textAlign: "left",
  },
});

export default TestInstructions;
