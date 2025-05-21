import axios from "axios";
import { useState, useEffect } from "react";

import { getToken, getGuid } from "../../../utils/secureStore";

const useUserApi = () => {
  const [userData, setUserData] = useState(null); // changed from []
  const [error, setError] = useState(null);

  const API_BASE_URL = "https://test.lms.developer1.website";

  const fetchUserById = async () => {
    try {
      const token = await getToken("access_token");
      const guid = await getGuid("guid");

      if (!token || !guid) {
        setError("Missing token or user GUID");
        return;
      }

      const endpoint = `${API_BASE_URL}/users/${guid}/view`;

      const response = await axios.post(
        endpoint,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.data?.success) {
        const user = response.data?.payload;
        setUserData(user);
        console.log("Fetched user data:", user); // moved here
      } else {
        setError("Error fetching user data");
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError("An error occurred while fetching user data.");
    }
  };

  const updateUser = async (updatedData) => {
    try {
      const token = await getToken("access_token");
      const guid = await getGuid("guid");

      if (!token || !guid) {
        setError("Missing token or user GUID");
        return;
      }

      const endpoint = `${API_BASE_URL}/users/${guid}/edit`;
      const formData = new FormData();

      // Append all fields from the object
      for (const key in updatedData) {
        formData.append(key, updatedData[key]);
      }

      const response = await axios.post(endpoint, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      setError(null);
      return response.data;
    } catch (error) {
      console.error("Error updating user data:", error.response?.data || error);
      setError(error.response?.data?.message || "Something went wrong.");
      return null;
    }
  };

  return {
    error,
    fetchUserById,
    userData,
    updateUser,
  };
};

export default useUserApi;
