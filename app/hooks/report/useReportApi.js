import { useState, useEffect } from "react";
import axios from "axios";
import { getToken, getGuid } from "../../../utils/secureStore";

const useReportApi = () => {
  const [submissionData, setSubmissionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const API_BASE_URL = "https://dev.lms.developer1.website";
  const [summary, setSummary] = useState(null);
  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const token = await getToken("access_token");
      const guid = await getGuid("guid");

      if (!token || !guid) {
        setError("Missing token or user GUID");
        return;
      }

      const endpoint = `${API_BASE_URL}/test/learner/submissions`;

      const response = await axios.post(
        endpoint,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data?.success) {
        setSubmissionData(response.data?.payload);
      } else {
        setError("Error fetching user data");
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError("An error occurred while fetching user data.");
    } finally {
      setLoading(false); // ✅ Done loading
    }
  };

  const fetchTestAttempts = async (testguid) => {
    setLoading(true);
    try {
      const token = await getToken("access_token");
      const userGuid = await getGuid("guid");

      if (!token || !userGuid) {
        setError("Missing token or user GUID");
        return;
      }

      const endpoint = `${API_BASE_URL}/test/${testguid}/learner/attempts`;

      const response = await axios.post(
        endpoint,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data?.success) {
        const attempts = response.data?.payload || [];

        setAttempts(attempts);
      } else {
        setError("Failed to fetch test attempts.");
      }
    } catch (err) {
      console.error("Error fetching test attempts:", err);
      setError("An error occurred while fetching test attempts.");
    } finally {
      setLoading(false); // ✅ Done loading
    }
  };

  const summaryReport = async (selectedAttempt, testguid) => {
    setLoading(true);

    try {
      const token = await getToken("access_token");
      const userGuid = await getGuid("guid");

      if (!token || !userGuid) {
        setError("Missing token or user GUID");
        return;
      }

      const endpoint = `${API_BASE_URL}/test/${testguid}/user/${userGuid}/reports/summary`;

      const response = await axios.post(
        endpoint,
        { session_guid: selectedAttempt }, // ✅ JSON body
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json", // ✅ Must match body
          },
        }
      );

      if (response.data?.success) {
        return response.data;
      } else {
        setError("Failed to fetch summary report.");
      }
    } catch (err) {
      console.error("Error fetching summary report:", err);
      setError("An error occurred while fetching summary report.");
    } finally {
      setLoading(false);
    }
  };

  const detailReport = async (selectedAttempt, testguid) => {
    setLoading(true);

    try {
      const token = await getToken("access_token");
      const userGuid = await getGuid("guid");

      if (!token || !userGuid) {
        setError("Missing token or user GUID");
        return;
      }

      const endpoint = `${API_BASE_URL}/test/${testguid}/user/${userGuid}/reports/detail`;

      const response = await axios.post(
        endpoint,
        { session_guid: selectedAttempt }, // ✅ JSON body
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json", // ✅ Must match body
          },
        }
      );

      if (response.data?.success) {
        return response.data;
      } else {
        setError("Failed to fetch summary report.");
      }
    } catch (err) {
      console.error("Error fetching summary report:", err);
      setError("An error occurred while fetching summary report.");
    } finally {
      setLoading(false);
    }
  };

  const difficultyReport = async (selectedAttempt, testguid) => {
    setLoading(true);

    try {
      const token = await getToken("access_token");
      const userGuid = await getGuid("guid");

      if (!token || !userGuid) {
        setError("Missing token or user GUID");
        return;
      }

      const endpoint = `${API_BASE_URL}/test/${testguid}/user/${userGuid}/reports/difficulty`;

      const response = await axios.post(
        endpoint,
        { session_guid: selectedAttempt }, // ✅ JSON body
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json", // ✅ Must match body
          },
        }
      );

      if (response.data?.success) {
        return response.data;
      } else {
        setError("Failed to fetch summary report.");
      }
    } catch (err) {
      console.error("Error fetching summary report:", err);
      setError("An error occurred while fetching summary report.");
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    submissionData,
    fetchSubmissions,
    fetchTestAttempts,
    attempts,
    summaryReport,
    detailReport,
    difficultyReport,
  };
};

export default useReportApi;
