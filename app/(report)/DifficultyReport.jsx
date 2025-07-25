import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { Text, IconButton, Surface } from "react-native-paper";
import { useLocalSearchParams, useRouter } from "expo-router";
import moment from "moment";
import { BarChart } from "react-native-gifted-charts";
import useReportApi from "../hooks/report/useReportApi";

const BAR_COLORS = { Medium: "#FFCC00", Easy: "#34C759", High: "#FF3B30" };

const DifficultyReport = () => {
  const { testguid, session_id, attempt_date } = useLocalSearchParams();
  const { difficultyReport, loading } = useReportApi();
  const router = useRouter();
  const [report, setReport] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (testguid && session_id) {
        const res = await difficultyReport(session_id, testguid);
        if (res?.payload) setReport(res.payload);
      }
    };
    fetchData();
  }, [testguid, session_id]);

  // Build solid-color bar data from your API response
  const difficultySummary = [
    {
      label: "Medium",
      value: report?.data?.medium ?? 0,
      color: BAR_COLORS.Medium,
    },
    { label: "Easy", value: report?.data?.easy ?? 0, color: BAR_COLORS.Easy },
    { label: "High", value: report?.data?.high ?? 0, color: BAR_COLORS.High },
  ];

  const barData = difficultySummary.map((d) => ({
    value: d.value,
    label: d.label,
    frontColor: d.color,
    spacing: 36,
    barWidth: 38,
  }));

  const stats = {
    score: report?.data?.score ?? 0,
    classAverage: report?.data?.class_average ?? 0,
    highestScore: report?.data?.highest_score ?? 0,
    maximumScore: report?.data?.maximum_score ?? 0,
  };

  // Format the attempt date if provided
  const formattedAttemptDate = attempt_date
    ? moment(attempt_date).format("DD MMM YYYY, hh:mm A")
    : null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.header}>
        <IconButton icon="arrow-left" size={24} onPress={() => router.back()} />
        <Text style={styles.headerTitle}>Difficulty</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {formattedAttemptDate && (
          <Text style={styles.attemptDate}>
            Attempt Date: {formattedAttemptDate}
          </Text>
        )}

        <BarChart
          data={barData}
          yAxisThickness={0.5}
          xAxisThickness={0}
          hideRules
          showValuesOnTopOfBars
          maxValue={Math.max(...barData.map((b) => b.value)) + 5}
          xAxisLabelTextStyle={{
            marginTop: 8,
            fontWeight: "bold",
            fontSize: 14,
          }}
          yAxisTextStyle={{ fontSize: 13, color: "#888" }}
          noOfSections={6}
          barBorderRadius={8}
          stepValue={5}
          height={180}
        />

        <Text style={styles.totalLabel}>Total</Text>
        <View style={styles.totalsRow}>
          {["Medium", "High", "Easy"].map((level) => {
            const d = difficultySummary.find((s) => s.label === level);
            return (
              <Surface
                key={level}
                style={[styles.totalsCard, { borderColor: d.color }]}
              >
                <View style={styles.legendRow}>
                  <View
                    style={[styles.legendDot, { backgroundColor: d.color }]}
                  />
                  <Text style={styles.totalsCardLabel}>{d.label}</Text>
                </View>
                <Text style={styles.totalsCardValue}>{d.value}</Text>
              </Surface>
            );
          })}
        </View>

        <Surface style={styles.levelCard}>
          <Text style={styles.levelCardTitle}>Difficulty Level</Text>
          <View style={styles.levelStats}>
            <Text>Score: {stats.score}</Text>
            <Text style={{ color: "#FF3B30" }}>
              Class Average: {stats.classAverage}
            </Text>
            <Text style={{ color: "#34C759" }}>
              Highest Score: {stats.highestScore}
            </Text>
            <Text>Maximum Score: {stats.maximumScore}</Text>
          </View>
        </Surface>
        {loading && <ActivityIndicator style={{ margin: 20 }} />}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
    marginRight: 44,
  },
  attemptDate: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  totalLabel: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#333",
    marginTop: 25,
    marginBottom: 10,
  },
  totalsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 8,
    gap: 10,
  },
  totalsCard: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 12,
    borderWidth: 1.5,
    minWidth: 100,
    alignItems: "flex-start",
    justifyContent: "center",
    elevation: 2,
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 5,
    marginRight: 8,
    marginTop: 1,
  },
  totalsCardLabel: {
    fontSize: 15,
    fontWeight: "500",
    color: "#444",
  },
  totalsCardValue: {
    marginTop: 5,
    fontWeight: "bold",
    fontSize: 22,
    color: "#444",
  },
  levelCard: {
    marginTop: 20,
    borderRadius: 12,
    borderWidth: 1.2,
    borderColor: "#ddd",
    padding: 15,
    backgroundColor: "#fff",
    elevation: 2,
  },
  levelCardTitle: {
    fontWeight: "bold",
    fontSize: 15,
    marginBottom: 8,
  },
  levelStats: {
    gap: 2,
  },
});

export default DifficultyReport;
