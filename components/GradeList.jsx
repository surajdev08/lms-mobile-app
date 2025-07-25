import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Card } from "react-native-paper";
import { useRouter } from "expo-router";
import moment from "moment";
import useReportApi from "../app/hooks/report/useReportApi";
import { useLocalSearchParams } from "expo-router";

const GradeCard = ({ title, attemptDate, marks, onPress }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
    <Card style={styles.card}>
      <Card.Content>
        <Text style={styles.title}>{title}</Text>

        <Text style={styles.attemptDate}>Attempted on {attemptDate}</Text>
      </Card.Content>
    </Card>
  </TouchableOpacity>
);

const GradeList = () => {
  const { submissionData, fetchSubmissions, loading, error } = useReportApi();
  const router = useRouter();
  const [selectedTest, setSelectedTest] = useState(null);
  const [displayData, setDisplayData] = useState([]);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleTestSelect = (test) => {
    console.log("Selected Test:", test?.guid);
    setSelectedTest(test);
    router.push({
      pathname: "/SummaryReport",
      params: { testguid: test?.guid }, // ✅ use test directly
    });
  };

  useEffect(() => {
    if (Array.isArray(submissionData)) {
      // Map to desired structure, limiting to 5 items
      const limitedData = submissionData.slice(0, 5).map((submission) => ({
        id: submission.id,
        title: submission.test?.title || "Test",
        // Format start_time to "MMM DD" e.g., "Sep 23"
        attemptDate: submission.start_time
          ? moment(submission.start_time).format("MMM DD")
          : "N/A",
        // Show marks_obtained/total (assuming test_marks is total marks)
        marks: `${submission.marks_obtained ?? "-"}/${
          submission.test?.test_marks ?? "-"
        }`,
        sessionId: submission.session_id,
        testGuid: submission.test?.guid,
      }));

      setDisplayData(limitedData);
    }
  }, [submissionData]);

  const handleReattempt = (testGuid, sessionId) => {
    // Route to reattempt or test detail page
    router.push({
      pathname: "/MyTestDetails", // your test details or reattempt page
      params: {
        testguid: testGuid,
        sessionid: sessionId,
      },
    });
  };

  if (loading) {
    return <Text style={styles.loadingText}>Loading grades...</Text>;
  }

  if (error) {
    return <Text style={styles.errorText}>Failed to load grades.</Text>;
  }

  if (!displayData.length) {
    return <Text style={styles.emptyText}>No grades to display.</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Latest Submissions</Text>
      <FlatList
        horizontal
        data={displayData}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <GradeCard
            title={item.title}
            attemptDate={item.attemptDate}
            marks={item.marks}
            onPress={() => router.push("/report")}
            // onPress={console.log(item)}
          />
        )}
      />
      <TouchableOpacity onPress={() => router.push("/report")}>
        <Text style={styles.viewAllText}>View All</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginHorizontal: 16,
    marginBottom: 12,
    color: "#25245A",
  },
  listContent: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  card: {
    width: 180,
    height: 180,
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginRight: 12,
    backgroundColor: "#F3D9D9",
    borderRadius: 12,
  },
  title: {
    fontWeight: "600",
    fontSize: 16,
    color: "#25245A",
    marginBottom: 12,
  },
  marks: {
    fontWeight: "bold",
    fontSize: 28,
    color: "#25245A",
    marginBottom: 6,
  },
  attemptDate: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  reattempt: {
    fontSize: 14,
    color: "#2156F5",
    fontWeight: "600",
  },
  viewAllText: {
    color: "#2156F5",
    fontWeight: "600",
    fontSize: 16,
    marginTop: 10,
    marginLeft: 16,
  },
  loadingText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginVertical: 30,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
    marginVertical: 30,
  },
  emptyText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginVertical: 30,
  },
});

export default GradeList;
