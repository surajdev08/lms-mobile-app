import React, { useEffect, useRef, useState } from "react";
import { View, FlatList, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Button, Card } from "react-native-paper";
import { useRouter } from "expo-router";
import useReportApi from "../hooks/report/useReportApi";
import SubmissionCard from "../../components/SubmissionCard";
const report = () => {
  const router = useRouter();

  const [selectedTest, setSelectedTest] = useState(null);

  const { submissionData, fetchSubmissions, error } = useReportApi();

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

  const renderEmptyStateCard = () => (
    <Card style={{ margin: 20, padding: 20, alignItems: "center" }}>
      <Text style={{ fontSize: 16, marginBottom: 10 }}>
        {error ? "Nothing to show." : "No submissions available."}
      </Text>
      <Button
        mode="contained"
        onPress={() => router.push("/browsetest")}
        style={{ marginTop: 10 }}
      >
        Browse Test?
      </Button>
    </Card>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1 }}>
          {!submissionData || submissionData.length === 0 || error ? (
            renderEmptyStateCard()
          ) : (
            <FlatList
              contentContainerStyle={{
                flexGrow: 1,
                paddingHorizontal: 20,
                gap: 15,
                paddingVertical: 20,
              }}
              showsHorizontalScrollIndicator={false}
              data={submissionData}
              renderItem={({ item }) => (
                <SubmissionCard
                  title={item.test?.title}
                  time={item.start_time}
                  handlePress={() => handleTestSelect(item.test)}
                />
              )}
              keyExtractor={(item) => item.id.toString()}
            />
          )}
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default report;

report.options = {
  headerShown: true,
  title: "Report Summary",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: "#ffffff",
  },
});
