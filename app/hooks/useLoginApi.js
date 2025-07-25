// hooks/useLoginApi.js
import axios from "axios";
import { useState } from "react";
// import { useAuth } from "../context/AuthContext";

const API_BASE_URL = "https://dev.lms.developer1.website";

const useLoginApi = () => {
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);
  const [emailHash, setEmailHash] = useState("");
  const [mobileHash, setMobileHash] = useState("");
  const [status, setStatus] = useState("idle");

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

  const validateEmail = async (email) => {
    setStatus("loading");
    setError(null);

    const formData = new FormData();
    formData.append("email", email);

    try {
      const res = await axios.post(
        `${API_BASE_URL}/login/email_otp`,
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

  const validateMobile = async (mobile) => {
    setStatus("loading");
    setError(null);

    const formData = new FormData();
    formData.append("mobile", mobile);

    try {
      const res = await axios.post(
        `${API_BASE_URL}/login/mobile_otp`,
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

  const validateOtp = async (email, email_otp, mobile, mobile_otp) => {
    setStatus("loading");
    setError(null);

    const formData = new FormData();
    formData.append("email", email);
    formData.append("email_otp", email_otp);
    formData.append("mobile", mobile);
    formData.append("mobile_otp", mobile_otp);

    try {
      const res = await axios.post(
        `${API_BASE_URL}/login/validate_otp`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setResponse(res.data);
      setStatus("success");
      setEmailHash(res.data?.payload?.email_otp_hash || "");
      setMobileHash(res.data?.payload?.mobile_otp_hash || "");
    } catch (err) {
      setError(err?.response?.data || err.message);
      setStatus("error");
    }
  };

  const loginviaotp = async (email, mobile) => {
    const formData = new FormData();
    formData.append("email", email);
    formData.append("email_hash", emailHash);
    formData.append("mobile", mobile);
    formData.append("mobile_hash", mobileHash);

    try {
      const response = await axios.post(`${API_BASE_URL}/login/otp`, formData, {
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

  return {
    loginUser,
    validateEmail,
    validateMobile,
    validateOtp,
    error,
    response,
    emailHash,
    mobileHash,
    loginviaotp,
    status,
  };
};

export default useLoginApi;
