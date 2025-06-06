import { useState, useEffect } from "react";
import axios from "axios";
import { getToken, getGuid } from "../../../utils/secureStore";
const useReportApi = (endpoint, options = {}) => {
  const [submissionData, setSubmissionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_BASE_URL = "https://test.lms.developer1.website";

  const fetchSubmissions = async () => {
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
        console.log("Fetched submission data:", submissionData); // moved here
      } else {
        setError("Error fetching user data");
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError("An error occurred while fetching user data.");
    }
  };
  return { loading, error, submissionData, fetchSubmissions };
};

export default useReportApi;
