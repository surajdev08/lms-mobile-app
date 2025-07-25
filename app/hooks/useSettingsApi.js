import axios from "axios";
import { useState } from "react";

const API_BASE_URL = "https://dev.lms.developer1.website";

const useSettingsApi = () => {
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loginSettings, setLoginSettings] = useState(null);

  const resgistrationSettings = async () => {
    setStatus("loading");
    setError(null);

    try {
      const res = await axios.get(
        `${API_BASE_URL}/settings/registration`,

        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setSettings(res.data?.payload);

      setStatus("success");
    } catch (err) {
      setError(err?.response?.data || err.message);
      setStatus("error");
    }
  };

  const signinSettings = async () => {
    setStatus("loading");
    setError(null);

    try {
      const res = await axios.get(
        `${API_BASE_URL}/settings/login`,

        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setLoginSettings(res.data?.payload);

      setStatus("success");
    } catch (err) {
      setError(err?.response?.data || err.message);
      setStatus("error");
    }
  };

  return {
    status,
    error,
    settings,
    resgistrationSettings,
    loginSettings,
    signinSettings,
  };
};

export default useSettingsApi;
