// utils/secureStore.js
import * as SecureStore from "expo-secure-store";

export const saveToken = async (token) => {
  try {
    await SecureStore.setItemAsync("access_token", token);
  } catch (error) {
    console.error("Failed to save token:", error);
    throw error;
  }
};

export const saveGuid = async (guid) => {
  try {
    await SecureStore.setItemAsync("guid", guid);
  } catch (error) {
    console.error("Failed to save guid:", error);
    throw error;
  }
};

export const getToken = async () => {
  try {
    const token = await SecureStore.getItemAsync("access_token");
    return token;
  } catch (error) {
    console.error("Failed to retrieve token:", error);
    throw error;
  }
};

export const getGuid = async () => {
  try {
    const guid = await SecureStore.getItemAsync("guid");
    return guid;
  } catch (error) {
    console.error("Failed to retrieve guid:", error);
    throw error;
  }
};

export const deleteToken = async () => {
  try {
    await SecureStore.deleteItemAsync("access_token");
  } catch (error) {
    console.error("Failed to delete token:", error);
    throw error;
  }
};

export const deleteGuid = async () => {
  try {
    await SecureStore.deleteItemAsync("guid");
  } catch (error) {
    console.error("Failed to delete guid:", error);
    throw error;
  }
};

// const generateSessionKey = () => {
//   return (
//     Math.random().toString(36).substring(2, 15) +
//     Math.random().toString(36).substring(2, 15)
//   );
// };

// export const saveSessionKey = async () => {
//   const sessionId = generateSessionKey();
//   try {
//     await SecureStore.setItemAsync("session_key", sessionId);
//   } catch (error) {
//     console.error("Failed to save session key:", error);
//     throw error;
//   }
// };

const SESSION_KEY = "session_key";

export const generateAndSaveSessionKey = async () => {
  const newSessionId =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);

  try {
    await SecureStore.setItemAsync(SESSION_KEY, newSessionId);
    return newSessionId;
  } catch (error) {
    console.error("Failed to save session key:", error);
    throw error;
  }
};

export const getSessionKey = async () => {
  try {
    return await SecureStore.getItemAsync(SESSION_KEY);
  } catch (error) {
    console.error("Failed to retrieve session key:", error);
    throw error;
  }
};

export const clearSessionKey = async () => {
  try {
    await SecureStore.deleteItemAsync(SESSION_KEY);
  } catch (error) {
    console.error("Failed to clear session key:", error);
  }
};
