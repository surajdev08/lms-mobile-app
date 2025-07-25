import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { IconButton, Card } from "react-native-paper";
import { useLocalSearchParams, useRouter } from "expo-router";
import moment from "moment";
import useReportApi from "../hooks/report/useReportApi";

const DetailReport = () => {
  const router = useRouter();
  const { testguid, session_id, attempt_date } = useLocalSearchParams();

  const { detailReport, loading } = useReportApi();
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      if (testguid && session_id) {
        const res = await detailReport(session_id, testguid);
        if (res?.payload) setDetail(res.payload);
      }
    };
    fetchDetail();
  }, [testguid, session_id]);

  const renderCard = ({ item }) => {
    const isCorrect = item.response === "CORRECT";
    const isWrong = item.response === "WRONG";
    const isNA = item.response === "NA";

    const remark = isCorrect ? "True" : isWrong ? "False" : "Not Attempted";

    const remarkColor = isCorrect ? "#34C759" : isWrong ? "#FF3B30" : "#888";

    return (
      <Card style={styles.card}>
        <Text style={styles.questionText}>
          {item.question?.question || "No question text"}
        </Text>
        <Text style={[styles.remarkText, { color: remarkColor }]}>
          Remark: {remark}
        </Text>
        <Text style={styles.detailText}>
          Time Taken:{" "}
          {item.time_taken
            ? `${item.time_taken.toString().padStart(2, "0")}:00`
            : "--"}{" "}
          (in sec)
        </Text>
        <Text style={styles.detailText}>Mark: {item.marks_obtained || 0}</Text>
      </Card>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <IconButton icon="arrow-left" size={24} onPress={() => router.back()} />
        <Text style={styles.headerTitle}>Details</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.attemptDate}>
          Attempt Date: {attempt_date || "—"}
        </Text>

        {loading ? (
          <ActivityIndicator style={styles.loading} />
        ) : (
          <FlatList
            data={detail?.data || []}
            keyExtractor={(item) => `${item.id}`}
            renderItem={renderCard}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No questions found.</Text>
            }
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#eee",
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
    marginRight: 44,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  attemptDate: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  loading: {
    marginVertical: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#f0f0f0",
    marginBottom: 14,
    elevation: 2,
  },
  questionText: {
    fontSize: 16,
    color: "black",
    marginBottom: 8,
    lineHeight: 20,
  },
  remarkText: {
    fontWeight: "500",
    marginTop: 4,
  },
  detailText: {
    fontSize: 15,
    color: "#888",
    marginTop: 4,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    color: "#999",
  },
});

export default DetailReport;
