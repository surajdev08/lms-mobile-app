import React, { useEffect, useRef, useState } from "react";
import { View, FlatList, Text } from "react-native";
import TestCard from "../components/TestCard";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Button, Card } from "react-native-paper";
import { useRouter } from "expo-router";
import useMyTestApi from "../app/hooks/test/useMyTestApi";
import useViewTestApi from "../app/hooks/test/useViewTestApi";

const Ongoing = () => {
  const router = useRouter();
  const bottomSheetRef = useRef(null);
  const [selectedTest, setSelectedTest] = useState(null);

  const { testData, error, fetchTestData } = useMyTestApi("ongoing");
  const { viewTestData, viewTest } = useViewTestApi();
  const openSheet = async (test) => {
    setSelectedTest(test);
    await viewTest(test.guid);
    bottomSheetRef.current?.expand();
  };

  useEffect(() => {
    fetchTestData();
  }, []);

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
        {!testData || testData.length === 0 || error ? (
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
        enablePanDownToClose={true}
      >
        <BottomSheetView style={{ padding: 20 }}>
          {viewTestData?.title ? (
            <>
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                {viewTestData.title}
              </Text>
              <Text style={{ paddingVertical: 20 }}>
                {viewTestData.test_marks} Marks | {viewTestData.questions_count}{" "}
                Questions
              </Text>
              <Button
                mode="outlined"
                onPress={() =>
                  router.push({
                    pathname: "/testinstructions",
                    params: { guid: selectedTest.guid },
                  })
                }
                style={{ width: 150, marginTop: 10 }}
              >
                Start Test
              </Button>
            </>
          ) : (
            <Text>Loading test details...</Text>
          )}
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
};

export default Ongoing;
