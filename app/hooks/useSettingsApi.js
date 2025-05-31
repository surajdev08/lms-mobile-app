import axios from "axios";
import { useState } from "react";

const API_BASE_URL = "https://test.lms.developer1.website";

const useSettingsApi = () => {
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [settings, setSettings] = useState(null);

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

  return { status, error, settings, resgistrationSettings };
};

export default useSettingsApi;
