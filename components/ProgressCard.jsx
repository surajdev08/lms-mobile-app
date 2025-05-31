import React, { useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { Text, SegmentedButtons, TouchableRipple } from "react-native-paper";

const ProgressCard = ({
  totalQuestions,
  currentQuestionIndex,
  selectedOptions,
  markedForReview,
  onQuestionSelect,
  indexToGuidMap,
}) => {
  const [tabValue, setTabValue] = useState("not_attempted");

  const boxStyle = (bgColor, borderColor, isCurrent) => ({
    width: 38,
    height: 34,
    borderWidth: isCurrent ? 2 : 1.5,
    borderColor: borderColor,
    backgroundColor: bgColor,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    margin: 4,
  });

  const getColorStatus = (index) => {
    const questionGuid = indexToGuidMap[index];

    let bgColor = "transparent";
    if (selectedOptions?.[questionGuid] === "Unattended") {
      bgColor = "#FF4D49";
    } else if (selectedOptions?.[questionGuid]) {
      bgColor = "#72E128";
    }

    let borderColor = markForReview?.[questionGuid] ? "#FDC453" : "#7D808E";

    if (index === currentQuestionIndex) {
      borderColor = "blue";
    }

    return { bgColor, borderColor };
  };

  const notAttemptedIndices = Array.from({ length: totalQuestions })
    .map((_, index) => index)
    .filter((index) => {
      const qid = indexToGuidMap[index];
      return !selectedOptions?.[qid] || selectedOptions[qid] === "Unattended";
    });

  const renderBox = ({ item: index }) => {
    const { bgColor, borderColor } = getColorStatus(index);
    return (
      <TouchableRipple
        onPress={() => onQuestionSelect(index)}
        style={boxStyle(bgColor, borderColor, index === currentQuestionIndex)}
        rippleColor="rgba(0, 0, 0, .1)"
      >
        <Text
          style={{ color: index === currentQuestionIndex ? "white" : "black" }}
        >
          {index + 1}
        </Text>
      </TouchableRipple>
    );
  };

  const allIndices = Array.from({ length: totalQuestions }, (_, i) => i);

  const answeredCount = Object.values(selectedOptions)?.filter(
    (opt) => opt && opt !== "reset"
  )?.length;
  const unattendedCount = Object.values(selectedOptions)?.filter(
    (opt) => opt === "reset"
  )?.length;
  const reviewCount = Object.values(markForReview)?.filter(Boolean)?.length;
  const notVisitedCount = totalQuestions - Object.keys(selectedOptions)?.length;

  return (
    <View style={styles.wrapper}>
      <SegmentedButtons
        value={tabValue}
        onValueChange={setTabValue}
        buttons={[
          { value: "all", label: "All Questions" },
          { value: "not_attempted", label: "Not Attempted" },
        ]}
      />

      <FlatList
        data={tabValue === "all" ? allIndices : notAttemptedIndices}
        renderItem={renderBox}
        keyExtractor={(item) => item.toString()}
        numColumns={5}
        contentContainerStyle={{ marginTop: 20 }}
      />

      <View style={styles.statusContainer}>
        <StatusItem label="Answered" color="#72E128" count={answeredCount} />
        <StatusItem
          label="Unattended"
          color="#FF4D49"
          count={unattendedCount}
        />
        <StatusItem label="Review" color="#FDC453" count={reviewCount} />
        <StatusItem
          label="Not Visited"
          color="transparent"
          count={notVisitedCount}
        />
      </View>
    </View>
  );
};

const StatusItem = ({ label, color, count }) => (
  <View style={styles.statusItem}>
    <View style={[styles.statusBox, { backgroundColor: color }]}>
      <Text>{count}</Text>
    </View>
    <Text style={styles.statusLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: 10,
  },
  statusContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
    flexWrap: "wrap",
  },
  statusItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    width: "48%",
  },
  statusBox: {
    width: 38,
    height: 34,
    borderWidth: 1,
    borderColor: "#7D808E",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
  },
  statusLabel: {
    marginLeft: 10,
  },
});

export default ProgressCard;
