import axios from "axios";
import { useState, useEffect } from "react";

import { getToken, getGuid } from "../../../utils/secureStore";

const API_BASE_URL = "https://dev.lms.developer1.website";

const useMyTestApi = (type) => {
  const [testData, setTestData] = useState([]);
  const [error, setError] = useState(null);

  const fetchTestData = async () => {
    try {
      const token = await getToken("access_token");
      const guid = await getGuid("guid");

      if (!token || !guid) {
        setError("Missing token or user GUID");
        return;
      }

      const formData = new FormData();
      formData.append("type", type);
      const endpoint = `${API_BASE_URL}/users/${guid}/tests`;

      const response = await axios.post(endpoint, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      const { success, message, payload } = response.data;

      if (success) {
        setTestData(payload?.data || []);
        setError(null);
      } else if (message === "RECORDS_NOT_FOUND") {
        setTestData([]);
        setError(null);
      } else {
        setError("Error fetching test data");
      }
    } catch (err) {
      setError("An error occurred while fetching test data.");
    }
  };

  return { testData, error, fetchTestData };
};

export default useMyTestApi;
