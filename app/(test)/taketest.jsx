import React, { useEffect, useState } from "react";
import { SafeAreaView, View, Text, StyleSheet } from "react-native";
import { ActivityIndicator, Button } from "react-native-paper";
import { useLocalSearchParams } from "expo-router";
import { useCameraPermissions, CameraType } from "expo-camera";

import useTakeTestApi from "../hooks/test/useTakeTestApi";
import QuestionContainer from "../../components/QuestionContainer";

const Taketest = () => {
  const { guid } = useLocalSearchParams();
  const { testQuestions, loading, fetchTestQuestions } = useTakeTestApi();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    if (guid) {
      fetchTestQuestions(guid);
    }
  }, [guid]);

  // 1. Permission loading
  if (!permission) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator animating size="large" />
      </SafeAreaView>
    );
  }

  // 2. Permission denied
  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.text}>
          We need your permission to access the camera
        </Text>
        <Button mode="contained" onPress={requestPermission}>
          Grant Permission
        </Button>
      </SafeAreaView>
    );
  }

  // 3. Data loading
  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator animating size="large" />
      </SafeAreaView>
    );
  }

  // 4. All good: show test
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <QuestionContainer />
    </SafeAreaView>
  );
};

export default Taketest;

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  text: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: "center",
  },
});
