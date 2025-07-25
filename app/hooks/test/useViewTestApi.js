import axios from "axios";
import { useState, useEffect } from "react";

import { getToken, getGuid } from "../../../utils/secureStore";

const API_BASE_URL = "https://dev.lms.developer1.website";

const useViewTestApi = () => {
  const [viewTestData, setViewTestData] = useState(null);
  const [error, setError] = useState(null);

  const viewTest = async (guid) => {
    try {
      const token = await getToken("access_token");

      if (!token || !guid) {
        setError("Missing token or test GUID");
        return;
      }

      const endpoint = `${API_BASE_URL}/test/${guid}/view`;

      const response = await axios.post(endpoint, null, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (response.data?.success) {
        const payload = response.data.payload;
        setViewTestData(payload);
        console.log("✅ viewTestData payload:", payload); // ✅ log here
      } else {
        setError("Error fetching test data");
      }
    } catch (err) {
      console.error("Error fetching test data:", err);
      setError("An error occurred while fetching test data.");
    }
  };

  return { viewTestData, error, viewTest };
};

export default useViewTestApi;
