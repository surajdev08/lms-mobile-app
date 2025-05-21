import React, { useState, useEffect, useRef } from "react";
import {
  View,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { Text } from "react-native-paper";
import { useLocalSearchParams } from "expo-router";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import QuestionCard from "./QuestionCard";
import TestNavigation from "./TestNavigation";
import useTakeTestApi from "../app/hooks/test/useTakeTestApi";
import TestHeader from "./TestHeader";
import ProgressCard from "./ProgressCard";
import { useRouter } from "expo-router";

const QuestionContainer = () => {
  const { guid } = useLocalSearchParams();
  const { testQuestions, loading, fetchTestQuestions, submitTest } =
    useTakeTestApi();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [markForReview, setMarkForReview] = useState({});
  const [timeTaken, setTimeTaken] = useState({});
  const [questionTimerPerQuestion, setQuestionTimerPerQuestion] = useState({});
  const [questionTimer, setQuestionTimer] = useState(null);
  const [startTime, setStartTime] = useState(null);

  const bottomSheetRef = useRef(null);

  const router = useRouter();

  useEffect(() => {
    if (guid) {
      fetchTestQuestions(guid);
    }
  }, [guid]);

  const questions =
    testQuestions?.data?.questions?.flatMap((item) => {
      if (item?.type === "section") {
        return (
          item.children?.map((child) => ({
            ...child,
            section_title: item.question,
          })) || []
        ); // if children is undefined, return empty array
      } else {
        return [item]; // wrap single item in array to match flatMap
      }
    }) || [];

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;

  const indexToGuidMap = questions.reduce((map, q, i) => {
    map[i] = q.guid;
    return map;
  }, {});

  const answeredCount = Object.values(selectedOptions).filter(
    (opt) => opt && opt !== "reset"
  ).length;

  const notVisitedCount = totalQuestions - Object.keys(selectedOptions).length;

  useEffect(() => {
    if (currentQuestion) {
      const questionGuid = currentQuestion.guid;
      const savedTimeLeft =
        questionTimerPerQuestion[questionGuid] ?? currentQuestion?.rules?.time;

      if (savedTimeLeft !== questionTimer) {
        setQuestionTimer(savedTimeLeft);
        setStartTime(Date.now());
      }
    }
  }, [currentQuestion?.guid, questionTimerPerQuestion]);

  useEffect(() => {
    if (questionTimer > 0) {
      const timer = setInterval(() => {
        setQuestionTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [questionTimer]);

  const saveTimeForCurrentQuestion = () => {
    if (currentQuestion) {
      const questionGuid = currentQuestion.guid;

      setQuestionTimerPerQuestion((prev) => ({
        ...prev,
        [questionGuid]: questionTimer,
      }));

      if (startTime) {
        const timeSpent = Math.floor((Date.now() - startTime) / 1000);
        setTimeTaken((prev) => ({
          ...prev,
          [questionGuid]: (prev[questionGuid] || 0) + timeSpent,
        }));
      }
    }
  };

  const handleNextQuestion = () => {
    saveTimeForCurrentQuestion();
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    saveTimeForCurrentQuestion();
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleOptionSelect = (questionId, selectedChoice) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [questionId]: selectedChoice,
    }));
  };

  const handleMarkForReviewChange = (questionGuid, isMarked) => {
    setMarkForReview((prev) => ({
      ...prev,
      [questionGuid]: isMarked,
    }));
  };

  const handleSubmit = async () => {
    saveTimeForCurrentQuestion();

    try {
      const response = await submitTest(guid, selectedOptions, timeTaken);
      console.log("Test submitted!");

      // ✅ Redirect if successful
      if (response?.status === 200) {
        router.push("/TestSubmittedScreen");
      } else {
        console.warn("Test submission failed: ", response);
      }
    } catch (error) {
      console.error("Error during submission:", error);
    }
  };

  const openSheet = () => {
    bottomSheetRef.current?.expand();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loaderContainer}>
        <ActivityIndicator animating size="large" />
      </SafeAreaView>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <View style={styles.loaderContainer}>
        <Text>No questions available.</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <TestHeader
          settings={testQuestions?.data?.settings}
          openSheet={openSheet}
          handleSubmit={handleSubmit}
        />

        <QuestionCard
          currentQuestionIndex={currentQuestionIndex}
          questionText={currentQuestion?.question}
          options={currentQuestion?.choices}
          attachments={currentQuestion?.attachments}
          selectedOption={selectedOptions[currentQuestion?.guid]}
          onSelectOption={(value) =>
            handleOptionSelect(currentQuestion?.guid, value)
          }
        />

        <TestNavigation
          handleNext={handleNextQuestion}
          handlePrevious={handlePreviousQuestion}
          disablePrevious={currentQuestionIndex === 0}
          disableNext={currentQuestionIndex === totalQuestions - 1}
        />
      </View>

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={["40%", "90%"]}
        enablePanDownToClose
      >
        <BottomSheetView style={{ padding: 20 }}>
          <ProgressCard
            totalQuestions={totalQuestions}
            currentQuestionIndex={currentQuestionIndex}
            selectedOptions={selectedOptions}
            markForReview={markForReview}
            indexToGuidMap={indexToGuidMap}
            onQuestionSelect={(index) => {
              saveTimeForCurrentQuestion(); // Save time before moving
              setCurrentQuestionIndex(index);
              bottomSheetRef.current?.close();
            }}
          />
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
};

export default QuestionContainer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
