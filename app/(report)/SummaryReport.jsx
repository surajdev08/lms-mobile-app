import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { Text, IconButton, Surface } from "react-native-paper";
import DropDownPicker from "react-native-dropdown-picker";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import useReportApi from "../hooks/report/useReportApi";
import SummaryPieChart from "../../components/SummaryPieChart";

const SummaryReport = () => {
  const navigation = useNavigation();
  const { testguid } = useLocalSearchParams();
  const testGuid = testguid || null;
  const router = useRouter();

  const [selectedAttempt, setSelectedAttempt] = useState(null);
  const [summaryData, setSummaryData] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownItems, setDropdownItems] = useState([]);

  const { fetchTestAttempts, summaryReport, attempts, loading, error } =
    useReportApi();

  useEffect(() => {
    if (testGuid) {
      fetchTestAttempts(testGuid);
    }
  }, [testGuid]);

  useEffect(() => {
    if (Array.isArray(attempts) && attempts.length > 0) {
      const items = attempts
        .map((attempt) => ({
          label: moment(attempt.start_time).format("DD MMM YYYY, HH:mm"),
          value: attempt.session_id,
          startTime: attempt.start_time,
        }))
        .sort((a, b) => new Date(b.startTime) - new Date(a.startTime));

      setDropdownItems(items);
      setSelectedAttempt(items[0].value);
    }
  }, [attempts]);

  useEffect(() => {
    const loadSummary = async () => {
      if (selectedAttempt && testGuid) {
        const res = await summaryReport(selectedAttempt, testGuid);
        if (res?.payload) {
          setSummaryData(res.payload);
        }
      }
    };
    loadSummary();
  }, [selectedAttempt]);

  if (!testGuid) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>No test selected.</Text>
      </View>
    );
  }

  const summary = summaryData?.summary || {};
  const marks = summaryData?.marks_obtained || 0;
  const totalMarks = summaryData?.test?.test_marks || 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerTitle}>Summary Report</Text>
        <View style={{ width: 44 }} />
      </View>

      <View style={styles.container}>
        <DropDownPicker
          open={dropdownOpen}
          value={selectedAttempt}
          items={dropdownItems}
          setOpen={setDropdownOpen}
          setValue={setSelectedAttempt}
          setItems={setDropdownItems}
          placeholder="Select Attempt"
          style={styles.dropdown}
          dropDownContainerStyle={{ zIndex: 1000 }}
          zIndex={1000}
        />

        {loading && (
          <ActivityIndicator
            size="large"
            color="#0000ff"
            style={styles.loading}
          />
        )}

        {summary && selectedAttempt && (
          <>
            <SummaryPieChart
              summary={summary}
              marks={marks}
              totalMarks={totalMarks}
            />

            <Text style={styles.scoreText}>
              Total Marks: {marks}/{totalMarks}
            </Text>

            <View style={styles.cardRow}>
              <Surface
                style={styles.surface}
                elevation={2}
                onTouchEnd={() => {
                  const selectedAttemptItem = dropdownItems.find(
                    (item) => item.value === selectedAttempt
                  );

                  const attemptDate = selectedAttemptItem
                    ? selectedAttemptItem.startTime
                    : null;

                  router.push({
                    pathname: "/DifficultyReport",
                    params: {
                      testguid: testGuid,
                      session_id: selectedAttempt,
                      attempt_date: attemptDate,
                    },
                  });
                }}
              >
                <Text style={{ fontWeight: "bold" }}>Difficulty Report</Text>
              </Surface>
              <Surface
                style={styles.surface}
                elevation={2}
                onTouchEnd={() => {
                  const selectedAttemptItem = dropdownItems.find(
                    (item) => item.value === selectedAttempt
                  );

                  const attemptDate = selectedAttemptItem
                    ? selectedAttemptItem.startTime
                    : null;

                  router.push({
                    pathname: "/DetailReport",
                    params: {
                      testguid: testGuid,
                      session_id: selectedAttempt,
                      attempt_date: attemptDate,
                    },
                  });
                }}
              >
                <Text style={{ fontWeight: "bold" }}>Detail Report</Text>
              </Surface>
            </View>
          </>
        )}

        {error && !loading && (
          <Text style={styles.errorText}>Error: {error}</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
    backgroundColor: "white",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
  },
  container: {
    flex: 1,
    padding: 16,
  },
  dropdown: {
    marginBottom: 16,
  },
  loading: {
    marginTop: 20,
  },
  scoreText: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    textAlign: "center",
    color: "#333",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  surface: {
    padding: 12,
    width: 150,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 24,
    gap: 10,
  },
});

export default SummaryReport;
