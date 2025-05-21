import React, { useRef, useState } from "react";
import { View, FlatList, Text } from "react-native";
import TestCard from "../components/TestCard";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Button, Card } from "react-native-paper";
import { useRouter } from "expo-router";
import useMyTestApi from "../app/hooks/test/useMyTestApi";

const Previous = () => {
  const router = useRouter();
  const bottomSheetRef = useRef(null);
  const [selectedTest, setSelectedTest] = useState(null);

  const { testData, error } = useMyTestApi("previous");

  const openSheet = (test) => {
    setSelectedTest(test);
    bottomSheetRef.current?.expand();
  };

  const renderEmptyStateCard = () => (
    <Card style={{ margin: 20, padding: 20, alignItems: "center" }}>
      <Text style={{ fontSize: 16, marginBottom: 10 }}>
        {error ? "Something went wrong." : "No tests available."}
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
                time={`${item.duration || "N/A"} min`}
                marks={`${item.totalMarks || "N/A"} Marks`}
                ques={`${item.totalQuestions || "N/A"} Q`}
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
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
            {selectedTest?.title}
          </Text>
          <Text>
            {selectedTest?.marks} | {selectedTest?.time}
          </Text>

          <Button
            mode="outlined"
            onPress={() => router.push("/testinstructions")}
            style={{ width: 150, marginTop: 10 }}
          >
            Start Test
          </Button>
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
};

export default Previous;
