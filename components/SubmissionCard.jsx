import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Card } from "react-native-paper";
import { useRouter } from "expo-router";

const SubmissionCard = ({ title, time, handlePress }) => {
  const router = useRouter();
  const [formattedTime, setFormattedTime] = useState("");

  // Safely format the date once on mount or when `time` changes
  useEffect(() => {
    if (time) {
      const formatted = formatDateTime(time);
      setFormattedTime(formatted);
    }
  }, [time]);

  // Function to format the incoming date
  function formatDateTime(dateString) {
    const date = new Date(dateString);
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return date.toLocaleDateString(undefined, options);
  }

  return (
    <Card style={styles.card} onPress={handlePress}>
      <Card.Content>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.time}>{formattedTime || "Loading..."}</Text>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 12,
    borderRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  time: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
});

export default SubmissionCard;

// const styles = StyleSheet.create({
//   testCard: {
//     backgroundColor: "white",
//     borderRadius: 10,
//     padding: 10,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 0.5 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//   },
//   cardContent: {
//     flexDirection: "row",
//     gap: 20,
//     paddingTop: 10,
//   },
//   cardHeader: {
//     fontSize: 20,
//   },
//   time: {
//     fontSize: 14,
//     color: "#555",
//   },
// });
