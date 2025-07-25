import React from "react";
import { View, Text, StyleSheet } from "react-native";
import PieChart from "react-native-pie-chart";

const PIE_COLORS = ["#FFCC00", "#FF3B30", "#34C759"];

const SummaryPieChart = ({ summary = {} }) => {
  const chartData = [
    { value: summary.NA || 0, color: PIE_COLORS[0] },
    { value: summary.WRONG || 0, color: PIE_COLORS[1] },
    { value: summary.CORRECT || 0, color: PIE_COLORS[2] },
  ];
  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  const legendItems = [
    { label: "Not Attempted", color: PIE_COLORS[0], count: summary.NA || 0 },
    { label: "Wrong", color: PIE_COLORS[1], count: summary.WRONG || 0 },
    { label: "Correct", color: PIE_COLORS[2], count: summary.CORRECT || 0 },
  ];

  if (total === 0) {
    return (
      <View style={styles.centered}>
        <Text>No data to display.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <PieChart
        widthAndHeight={180}
        series={chartData}
        coverRadius={0.65}
        coverFill="#FFF"
      />
      <View style={styles.legendContainer}>
        {legendItems.map((item) => (
          <View style={styles.legendRow} key={item.label}>
            <View style={[styles.legendDot, { backgroundColor: item.color }]} />
            <View>
              <Text style={styles.legendLabel}>{item.label}</Text>
              <Text style={styles.legendValue}>{item.count}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: "center", marginVertical: 16 },
  legendContainer: {
    marginTop: 18,
    alignSelf: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 18,
  },
  legendDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 10,
    marginTop: 3,
  },
  legendLabel: { fontSize: 16, color: "#40444E" },
  legendValue: {
    fontWeight: "bold",
    fontSize: 24,
    color: "#40444E",
    marginTop: 2,
  },
  centered: {
    alignItems: "center",
    marginVertical: 16,
  },
});

export default SummaryPieChart;
