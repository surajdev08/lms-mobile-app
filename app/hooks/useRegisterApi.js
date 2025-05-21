import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = "https://test.lms.developer1.website";

const useRegisterApi = () => {
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

  const validateOtp = async (email, otp) => {
    setStatus("loading");
    setError(null);

    const formData = new FormData();
    formData.append("email", email);
    formData.append("otp", otp);

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
      setHash(res.data?.payload);
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
    email
  ) => {
    setStatus("loading");
    setError(null);

    const formData = new FormData();
    formData.append("first_name", firstName);
    formData.append("last_name", lastName);
    formData.append("password", password);
    formData.append("password_confirmation", confirmPassword);
    formData.append("hash", hash);
    formData.append("email", email);

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

  return { status, error, response, validateEmail, validateOtp, registerUser };
};

export default useRegisterApi;
