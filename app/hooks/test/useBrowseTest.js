import { useState } from "react";
import axios from "axios";
import { getToken, getGuid } from "../../../utils/secureStore";

const API_BASE_URL = "https://test.lms.developer1.website";

const useBrowseTestApi = () => {
  const [browseData, setBrowseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBrowseTests = async (search = "", order_by = "newest_first") => {
    setLoading(true);
    setError(null);

    try {
      const token = await getToken("access_token");
      const guid = await getGuid("guid");

      if (!token || !guid) {
        setError("Missing token or user GUID");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("search", search);
      formData.append("order_by", order_by);

      const response = await axios.post(`${API_BASE_URL}/test/all`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data?.success) {
        setBrowseData(response.data?.payload?.data);
      } else {
        setError("Failed to fetch browse test data");
      }
    } catch (err) {
      console.error("Browse API error:", err);
      setError("An error occurred while fetching browse data.");
    }

    setLoading(false);
  };

  return { loading, error, browseData, fetchBrowseTests };
};

export default useBrowseTestApi;
