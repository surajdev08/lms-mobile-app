import React, { useEffect } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text, Card } from "react-native-paper";
import { useRouter } from "expo-router";
import useMyTestApi from "../app/hooks/test/useMyTestApi";

const ICON_QS = "🗂️";
const ICON_TIME = "⏰";
const ICON_MARKS = "📋";

const TestTab = ({ type }) => {
  const { testData, fetchTestData, error, loading } = useMyTestApi(type);
  const router = useRouter();

  useEffect(() => {
    fetchTestData();
  }, []);

  const listedTests = testData?.slice(0, 4) || [];
  const showNoTests =
    !loading && (!Array.isArray(testData) || listedTests.length === 0);

  return (
    <View style={styles.tabContainer}>
      {showNoTests ? (
        <Card>
          <Card.Content>
            <Text style={styles.noTestFound}>No {type} test found.</Text>
          </Card.Content>
        </Card>
      ) : (
        listedTests.map((test) => (
          <View key={test.id} style={styles.card}>
            <Text style={styles.title}>{test.title}</Text>

            <View style={styles.attrRow}>
              <Text style={styles.attrItem}>
                <Text style={styles.green}>
                  {ICON_QS} {test.questions_count || 0} Qs
                </Text>
              </Text>
              <Text style={styles.attrItem}>
                <Text style={styles.orange}>
                  {ICON_TIME}{" "}
                  {test.settings?.test_time
                    ? `${test.settings.test_time}${
                        test.settings.test_time_unit || ""
                      }`
                    : "--"}
                </Text>
              </Text>
              <Text style={styles.attrItem}>
                <Text style={styles.red}>
                  {ICON_MARKS} {test.test_marks || "--"} marks
                </Text>
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => router.push(`/mytest?id=${test.id}`)}
            >
              <Text style={styles.detailsLink}>View Details</Text>
            </TouchableOpacity>
          </View>
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: { padding: 12 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 18,
    marginBottom: 16,
    shadowColor: "#1E40AF27",
    shadowOpacity: 0.06,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#edf1ff",
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#25245A",
    marginBottom: 6,
  },
  attrRow: {
    flexDirection: "row",
    gap: 18,
    marginBottom: 8,
  },
  attrItem: {
    fontSize: 13,
    fontWeight: "500",
  },
  green: { color: "#06B057" },
  orange: { color: "#FF8800" },
  red: { color: "#F12D2D" },
  detailsLink: {
    color: "#2156F5",
    fontWeight: "600",
    marginTop: 6,
    fontSize: 14,
  },
  noTestFound: {
    fontSize: 15,
    textAlign: "center",
    color: "#25245A",
    opacity: 0.7,
  },
});

export default TestTab;
