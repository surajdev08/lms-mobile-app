import React from "react";
import { SafeAreaView, View, Text, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
const TestSubmittedScreen = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const handleGoHome = () => {
    router.push("/(tabs)/dashboard"); // make sure 'Home' exists in your navigator
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>🎉 Test Submitted Successfully!</Text>
        <Text style={styles.subtitle}>Thank you for completing the test.</Text>
        <Button mode="contained" onPress={handleGoHome} style={styles.button}>
          Go to Home
        </Button>
        <Button
          mode="outlined"
          onPress={() => router.push("/FeedbackFormScreen")}
          style={styles.button}
        >
          Submit Feedback
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default TestSubmittedScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: "center",
    color: "gray",
  },
  button: {
    width: 180,
    borderRadius: 8,
    marginVertical: 10,
  },
});
