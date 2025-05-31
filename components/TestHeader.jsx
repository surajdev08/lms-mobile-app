// components/TestHeader.js
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Icon, IconButton, MD3Colors } from "react-native-paper";
const TestHeader = ({
  settings,
  openSheet,
  handleSubmit,
  questionMarks,
  negativeMarks,
}) => {
  const [timeLeft, setTimeLeft] = useState(settings?.test_time || 0);
  const router = useRouter();
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  return (
    <View style={styles.header}>
      <View
        style={{
          justifyContent: "space-between",
          flexDirection: "row",
          alignItems: "center",
          gap: 20,
        }}
      >
        <Text>{timeLeft}s</Text>

        <Text onPress={() => router.back()}>Back</Text>
        <Text onPress={handleSubmit}>submit</Text>
        <View
          style={{ height: "24px", width: "60px", backgroundColor: "#E7F4E8" }}
        >
          <Text>{questionMarks}</Text>
        </View>

        <View
          style={{ height: "24px", width: "60px", backgroundColor: "#FFE2E5" }}
        >
          <Text>{negativeMarks}</Text>
        </View>
      </View>

      <View
        style={{
          justifyContent: "space-between",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Icon source="record" color={MD3Colors.error50} size={30} />
        <IconButton icon="menu" size={24} onPress={() => openSheet()} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: "#E8E9F1",
    paddingHorizontal: 20,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
});

export default TestHeader;
