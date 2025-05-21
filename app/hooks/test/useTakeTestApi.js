// hooks/test/useTakeTestAPI.js
import { useState, useEffect } from "react";
import axios from "axios";
import {
  getToken,
  getGuid,
  getSessionKey,
  generateAndSaveSessionKey,
  clearSessionKey,
} from "../../../utils/secureStore";

import { useRouter, useLocalSearchParams } from "expo-router";
import * as SecureStore from "expo-secure-store";
const useTakeTestApi = () => {
  const [testQuestions, setTestQuestion] = useState([]);
  const [loading, setLoading] = useState(true);
  const [testGuid, setTestGuid] = useState(null);
  const API_BASE_URL = "https://test.lms.developer1.website";
  const [testSessionKey, setTestSessionKey] = useState(null);
  const router = useRouter();

  const fetchTestQuestions = async (guid) => {
    if (testGuid === guid) {
      return;
    }

    const token = await getToken("access_token");

    setTestGuid(guid);
    setLoading(true);

    try {
      const endpoint = `${API_BASE_URL}/test/${guid}/questions/all`;

      const response = await axios.post(endpoint, null, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (response.data?.success) {
        setTestQuestion(response.data?.payload);

        setLoading(false);
      } else {
        console.error("Error fetching test data");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching test data:", error);
      setLoading(false);
    }
  };

  const createSession = async (guid) => {
    const sessionId = await generateAndSaveSessionKey();
    const userGuid = await getGuid("guid");

    const formData = new FormData();
    formData.append("user_guid", userGuid);
    formData.append("session_guid", sessionId);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/test/${guid}/learner/take_test`,
        formData,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (response.data?.success) {
        await SecureStore.setItemAsync("session_key", sessionId); // ✅ Save it again
        setTestSessionKey(sessionId); // optional, for local use
        console.log("Session created successfully:", response.data);
        return sessionId;
      } else {
        console.error("Error creating session:", response.data.message);
        return null;
      }
    } catch (error) {
      console.error("Error creating session:", error);
      setLoading(false);
      return null;
    }
  };

  const submitTest = async (guid, selectedOptions, timeTaken) => {
    const formData = new FormData();
    const sessionId = await getSessionKey();
    const userGuid = await getGuid("guid");

    formData.append("session_guid", sessionId);
    formData.append("user_guid", userGuid);

    const processQuestions = (questions) => {
      questions.forEach((question) => {
        const questionGuid = question.guid;
        const selectedChoice = selectedOptions[questionGuid];
        const timeSpent = timeTaken[questionGuid] || 0;

        if (question.type === "section" && question.children) {
          // Process children of section questions
          processQuestions(question.children);
        } else if (questionGuid && selectedChoice) {
          formData.append(`question[${questionGuid}][answer]`, selectedChoice);
          formData.append(`question[${questionGuid}][time_taken]`, timeSpent);
        } else {
          console.warn(
            `Skipping question ${questionGuid} due to missing data.`
          );
        }
      });
    };

    processQuestions(testQuestions?.data?.questions);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/test/${guid}/learner/submit_test`,
        formData,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (response.status === 200) {
        await clearSessionKey();
        router.push("/TestSubmittedScreen");
        console.log("Test submitted successfully!");
      } else {
        console.log("Failed to submit the test.");
      }
    } catch (error) {
      console.log(`Error submitting the test: ${error.message}`);
    }
  };

  return {
    testQuestions,
    setTestQuestion,
    fetchTestQuestions,
    testGuid,
    loading,
    createSession,
    submitTest,
  };
};

export default useTakeTestApi;
