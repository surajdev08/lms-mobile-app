import { useState } from "react";

import axios from "axios";

export default function useBookmarkApi() {
  const [bookmark, setBookmark] = useState([]);
  const [viewQuestion, setViewQuestion] = useState([]);
  const API_BASE_URL = "https://dev.lms.developer1.website";
  const fetchBookmarkData = async (filters = {}) => {
    try {
      const response = await api.post(
        `${API_BASE_URL}test/learner/bookmark/all`,
        {
          ...filters,
        }
      );

      if (response.status === 200) {
        setBookmark(response.data?.payload);
      } else {
        toast.error("Failed to bookmark the question.");
      }
    } catch (error) {
      toast.error("Error bookmarking the question: " + error.message);
    }
  };

  const viewBookmarkData = async (guid) => {
    const formData = new FormData();

    formData.append("question_guid", guid);

    try {
      const response = await api.post(`test/learner/bookmark/view`, formData);

      if (response.status === 200) {
        setViewQuestion(response.data?.payload);
        toast.success("Question bookmarked successfully!");
      } else {
        toast.error("Failed to bookmark the question.");
      }
    } catch (error) {
      toast.error("Error bookmarking the question: " + error.message);
    }
  };

  // Update the delete function
  const deleteBookmark = async (guids) => {
    try {
      const response = await api.post(
        `test/learner/bookmark/delete`,
        { question_guid: guids } // Send as an array
      );

      if (response.status === 200) {
        fetchBookmarkData(); // Refresh bookmark list
        toast.success("Bookmarks deleted successfully!");
      } else {
        toast.error("Failed to delete bookmarks.");
      }
    } catch (error) {
      toast.error("Error removing bookmarks: " + error.message);
    }
  };

  return {
    bookmark,
    fetchBookmarkData,
    deleteBookmark,
    viewBookmarkData,
    viewQuestion,
  };
}
