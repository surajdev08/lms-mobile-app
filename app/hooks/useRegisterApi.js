import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = "https://dev.lms.developer1.website";

const useRegisterApi = () => {
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);
  const [emailHash, setEmailHash] = useState("");
  const [mobileHash, setMobileHash] = useState("");

  const validateEmail = async (email) => {
    setStatus("loading");
    setError(null);

    const formData = new FormData();
    formData.append("email", email);

    try {
      const res = await axios.post(
        `${API_BASE_URL}/register/validate_email`,
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
        `${API_BASE_URL}/register/validate_mobile`,
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
        `${API_BASE_URL}/register/validate_otp`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setResponse(res.data);
      setStatus("success");
      setEmailHash(res.data?.payload.email_otp_hash);
      setMobileHash(res.data?.payload.mobile_otp_hash);
    } catch (err) {
      setError(err?.response?.data || err.message);
      setStatus("error");
    }
  };
  const registerUser = async (
    firstName,
    lastName,
    password,
    confirmPassword,
    email,
    mobile
  ) => {
    setStatus("loading");
    setError(null);

    const formData = new FormData();
    formData.append("first_name", firstName);
    formData.append("last_name", lastName);
    formData.append("password", password);
    formData.append("password_confirmation", confirmPassword);
    formData.append("email", email);
    formData.append("email_hash", emailHash);
    formData.append("mobile", mobile);
    formData.append("mobile_hash", mobileHash);

    try {
      const res = await axios.post(`${API_BASE_URL}/register/user`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setResponse(res.data);
      setStatus("success");
    } catch (err) {
      setError(err?.response?.data || err.message);
      setStatus("error");
    }
  };

  return {
    status,
    error,
    response,
    validateEmail,
    validateMobile,
    validateOtp,
    registerUser,
  };
};

export default useRegisterApi;
