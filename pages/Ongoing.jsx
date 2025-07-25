import React, { useEffect, useRef, useState } from "react";
import { View, FlatList, Text } from "react-native";
import TestCard from "../components/TestCard";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Button, Card } from "react-native-paper";
import { useRouter } from "expo-router";
import useMyTestApi from "../app/hooks/test/useMyTestApi";
import useViewTestApi from "../app/hooks/test/useViewTestApi";

const labelStyle = { fontSize: 13, color: "#8A8BA1" };
const valueStyle = {
  fontSize: 16,
  fontWeight: "bold",
  color: "#23256A",
  marginTop: 2,
};

const StatBadge = ({ label, value, color }) => (
  <View style={{ alignItems: "center", minWidth: 63 }}>
    <View
      style={{
        paddingVertical: 5,
        paddingHorizontal: 13,
        borderRadius: 16,
        backgroundColor: color + "22", // subtle color bg
        marginBottom: 3,
        minWidth: 37,
      }}
    >
      <Text
        style={{ color, fontWeight: "bold", fontSize: 15, textAlign: "center" }}
      >
        {value}
      </Text>
    </View>
    <Text style={{ fontSize: 11, color: "#7A7A84", textAlign: "center" }}>
      {label}
    </Text>
  </View>
);

const styles = {
  startTestButton: {
    marginTop: 26,
    borderRadius: 10,
    backgroundColor: "#2156F5",
    alignSelf: "stretch",
    shadowColor: "#2156F5",
    shadowOpacity: 0.06,
    elevation: 4,
  },
};

const Ongoing = () => {
  const router = useRouter();
  const bottomSheetRef = useRef(null);
  const [selectedTest, setSelectedTest] = useState(null);

  const { testData, error, fetchTestData, loading } = useMyTestApi("ongoing");
  const { viewTestData, viewTest } = useViewTestApi();
  const openSheet = async (test) => {
    setSelectedTest(test);
    await viewTest(test.guid);
    bottomSheetRef.current?.expand();
  };

  useEffect(() => {
    fetchTestData();
  }, []);
  const listedTests = testData?.slice(0, 4) || [];
  const showNoTests =
    !loading && (!Array.isArray(testData) || listedTests.length === 0);
  const renderEmptyStateCard = () => (
    <Card style={{ margin: 20, padding: 20, alignItems: "center" }}>
      <Text style={{ fontSize: 16, marginBottom: 10 }}>
        {error ? "Something went wrong." : "No ongoing tests available."}
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
                No Ongoing test found.
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
                marks={`${item.totalMarks || "N/A"} Marks`}
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
        snapPoints={["50%", "50%"]}
        enablePanDownToClose
      >
        <BottomSheetView style={{ padding: 0, height: "100%" }}>
          {/* Handle Bar */}

          {viewTestData?.title ? (
            <View style={{ paddingHorizontal: 22 }}>
              <Text
                style={{ fontSize: 19, fontWeight: "700", color: "#23256A" }}
              >
                {viewTestData.title}
              </Text>
              <Text style={{ marginTop: 3, fontSize: 14, color: "#7A7A84" }}>
                {viewTestData.details || "—"}
              </Text>
              <View style={{ flexDirection: "row", gap: 24, marginTop: 15 }}>
                <View>
                  <Text style={labelStyle}>Total Marks</Text>
                  <Text style={valueStyle}>{viewTestData.test_marks}</Text>
                </View>
                <View>
                  <Text style={labelStyle}>Total Qs</Text>
                  <Text style={valueStyle}>{viewTestData.questions_count}</Text>
                </View>
              </View>
              {/* Status Row */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 18,
                  marginBottom: 8,
                  gap: 6,
                }}
              >
                <StatBadge
                  label="Ongoing Attempts"
                  value={viewTestData.attempts_in_progress}
                  color="#2156F5"
                />
                <StatBadge
                  label="Ongoing Users"
                  value={viewTestData.users_count}
                  color="#F58021"
                />
                <StatBadge
                  label="Submitted"
                  value={viewTestData.attempts_submitted}
                  color="#1DAD5A"
                />
              </View>

              {/* Start Test Button */}
              <Button
                mode="contained"
                style={styles.startTestButton}
                labelStyle={{ fontWeight: "bold", fontSize: 17 }}
                contentStyle={{ height: 44 }}
                onPress={() =>
                  router.push({
                    pathname: "/testinstructions",
                    params: { guid: selectedTest.guid },
                  })
                }
              >
                Start Test
              </Button>
            </View>
          ) : (
            <View
              style={{
                minHeight: 160,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 15 }}>Loading test details...</Text>
            </View>
          )}
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
};

export default Ongoing;
