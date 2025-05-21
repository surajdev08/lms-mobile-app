// hooks/useLoginApi.js
import axios from "axios";

const API_BASE_URL = "https://test.lms.developer1.website";

const useLoginApi = () => {
  const loginUser = async (email, password) => {
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    try {
      const response = await axios.post(`${API_BASE_URL}/login`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      console.error("Login Error:", error?.response?.data || error.message);
      throw error;
    }
  };

  return { loginUser };
};

export default useLoginApi;
