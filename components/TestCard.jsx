import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { Button, Card } from "react-native-paper";

const TestCard = ({ title, ques, marks, time, openSheet }) => {
  return (
    <Card
      style={styles.testCard}
      onPress={() => openSheet({ title, ques, marks, time })}
    >
      <Text style={styles.cardHeader}>{title}</Text>
      <View style={styles.cardContent}>
        <Text style={styles.time}>{time}</Text>
        <Text style={styles.ques}>{ques}</Text>
        <Text style={styles.marks}>{marks}</Text>
      </View>
      {/* <Button
        mode="outlined"
        
        style={{ width: 150 }}
      >
        View Test
      </Button> */}
    </Card>
  );
};

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
});

export default TestCard;
