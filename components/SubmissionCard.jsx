import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { Card } from "react-native-paper";

const SubmissionCard = ({ title, time }) => {
  function formatDateTime(dateString) {
    const date = new Date(dateString);

    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yy = String(date.getFullYear()).slice(-2);

    const hours = String(date.getHours()).padStart(2, "0");
    const mins = String(date.getMinutes()).padStart(2, "0");

    return {
      date: `${dd}-${mm}-${yy}`,
      time: `${hours}:${mins}`,
    };
  }

  const formatted = formatDateTime(time);

  return (
    <Card style={styles.testCard}>
      <Text style={styles.cardHeader}>{title}</Text>
      <View style={styles.cardContent}>
        <Text style={styles.time}>{formatted.date}</Text>
        <Text style={styles.time}>{formatted.time}</Text>
      </View>
    </Card>
  );
};

export default SubmissionCard;

const styles = StyleSheet.create({
  testCard: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0.5 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardContent: {
    flexDirection: "row",
    gap: 20,
    paddingTop: 10,
  },
  cardHeader: {
    fontSize: 20,
  },
  time: {
    fontSize: 14,
    color: "#555",
  },
});
