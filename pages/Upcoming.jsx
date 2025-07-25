import React, { useRef, useState, useEffect } from "react";
import { View, FlatList, Text } from "react-native";
import TestCard from "../components/TestCard";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Card } from "react-native-paper";
import { useRouter } from "expo-router";
import useMyTestApi from "../app/hooks/test/useMyTestApi";

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d)) return "—";
  return d.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const Upcoming = () => {
  const router = useRouter();
  const bottomSheetRef = useRef(null);
  const [selectedTest, setSelectedTest] = useState(null);

  const { testData, error, fetchTestData, loading } = useMyTestApi("upcoming");

  const openSheet = (test) => {
    setSelectedTest(test);
    bottomSheetRef.current?.expand();
  };

  useEffect(() => {
    fetchTestData();
  }, []);

  const listedTests = testData?.slice(0, 4) || [];
  const showNoTests =
    !loading && (!Array.isArray(testData) || listedTests.length === 0);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        {showNoTests ? (
          <Card>
            <Card.Content>
              <Text
                style={{
                  fontSize: 15,
                  textAlign: "center",
                  color: "#25245A",
                  opacity: 0.7,
                }}
              >
                No Upcoming tests found.
              </Text>
            </Card.Content>
          </Card>
        ) : (
          <FlatList
            contentContainerStyle={{
              flexGrow: 1,
              paddingHorizontal: 20,
              gap: 15,
              paddingVertical: 20,
            }}
            showsHorizontalScrollIndicator={false}
            data={testData}
            renderItem={({ item }) => (
              <TestCard
                title={item.title}
                time={`${item?.settings?.test_time || "N/A"} min`}
                marks={`${item.test_marks || "N/A"} Marks`}
                ques={`${item.questions_count || "N/A"} Q`}
                openSheet={() => openSheet(item)}
              />
            )}
            keyExtractor={(item) => item.id.toString()}
          />
        )}
      </View>

      {/* Bottom Sheet to show test details */}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={["50%", "99%"]}
        enablePanDownToClose={true}
      >
        <BottomSheetView style={{ padding: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 12 }}>
            {selectedTest?.title ?? "Test Details"}
          </Text>

          <View style={{ marginBottom: 8 }}>
            <Text style={{ fontWeight: "600" }}>Start Date</Text>
            <Text>{formatDate(selectedTest?.enrolment?.start_date)}</Text>
          </View>

          <View style={{ marginBottom: 8 }}>
            <Text style={{ fontWeight: "600" }}>End Date</Text>
            <Text>{formatDate(selectedTest?.enrolment?.end_date)}</Text>
          </View>

          <View style={{ marginBottom: 8 }}>
            <Text style={{ fontWeight: "600" }}>Total Questions</Text>
            <Text>{selectedTest?.questions_count ?? "—"}</Text>
          </View>

          <View style={{ marginBottom: 8 }}>
            <Text style={{ fontWeight: "600" }}>Total Marks</Text>
            <Text>{selectedTest?.test_marks ?? "—"}</Text>
          </View>

          {/* No Start Test button for Upcoming tests */}
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
};

export default Upcoming;
