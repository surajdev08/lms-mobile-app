import { useEffect, useState } from "react";

import axios from "axios";

const useBrowseTestApi = () => {
  const [data, setData] = useState([]);
  const [metaData, setMetaData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("idle");

  const fetchAllTestData = async (
    page,
    results_per_page,
    searchKeyword,
    status
  ) => {
    const formData = new FormData();

    console.info(status, "status");

    if (page) {
      formData.append("page", page); // Add pagination: current page
    }

    if (results_per_page) {
      formData.append("results_per_page", results_per_page);
    }

    if (searchKeyword) {
      formData.append("search", searchKeyword); // Add the search term to the formData
    }

    if (status?.length) {
      formData.append("status", status === "Published" ? "1" : "0"); // Add the search term to the formData
    }

    try {
      await api
        .post(`https://test.lms.developer1.website/test/all`, formData, {
          // Authorization: 'Bearer a87afd2b2930bc58266c773f66b78b57e157fef39dd6fa31f40bfd117c2c26b1',
          Network: "dev369",
          accept: "application/json",
        })
        ?.then((res) => {
          setLoader(false);
          setData(res?.data?.payload?.data);
          setMetaData(res?.data?.payload?.meta);
        })
        ?.catch((err) => {
          if (err.response?.status === 501) {
            setLoader(false); // Stop the loader if the API returns 501
            setData([]);
            setMetaData([]);
          }
        });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  return {
    fetchAllTestData,
    data,
    metaData,
    loader,
    error,
    status,
  };
};

export default useBrowseTestApi;
