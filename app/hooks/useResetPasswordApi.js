import axios from "axios";
import { useEffect, useState } from "react";

const API_BASE_URL = "https://test.lms.developer1.website";

const useResetPasswordApi = () => {
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);
  const [hash, setHash] = useState("");

  const validateEmail = async (email) => {
    setStatus("loading");
    setError(null);

    const formData = new FormData();
    formData.append("email", email);

    try {
      const res = await axios.post(
        `${API_BASE_URL}/password/validate_email`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setResponse(res.data);
      setStatus("success");
    } catch (err) {
      setError(err?.response?.data || err.message);
      setStatus("error");
    }
  };

  const validateOtp = async (email, otp) => {
    setStatus("loading");
    setError(null);

    const formData = new FormData();
    formData.append("email", email);
    formData.append("otp", otp);

    try {
      const res = await axios.post(
        `${API_BASE_URL}/password/validate_otp`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setResponse(res.data);
      setStatus("success");
      setHash(res.data?.payload);
    } catch (err) {
      setError(err?.response?.data || err.message);
      setStatus("error");
    }
  };

  const changePassword = async (email, password, confirmPassword) => {
    setStatus("loading");
    setError(null);

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    formData.append("password_confirmation", confirmPassword);
    formData.append("hash", hash);

    try {
      const res = await axios.post(
        `${API_BASE_URL}/password/change`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setResponse(res.data);
      setStatus("success");
    } catch (err) {
      setError(err?.response?.data || err.message);
      setStatus("error");
    }
  };

  return {
    status,
    response,
    error,
    validateEmail,
    validateOtp,
    changePassword,
  };
};

export default useResetPasswordApi;
