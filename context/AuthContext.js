import React, { createContext, useContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { getToken, getGuid } from "../utils/secureStore";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [guid, setGuid] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async ({ user, token, guid }) => {
    await SecureStore.setItemAsync("access_token", token);
    await SecureStore.setItemAsync("guid", guid);
    setUser(user);
    setToken(token);
    setGuid(guid);
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync("access_token");
    await SecureStore.deleteItemAsync("guid");
    setUser(null);
    setToken(null);
    setGuid(null);
  };

  useEffect(() => {
    const loadSession = async () => {
      const storedToken = await getToken("access_token");
      const storedGuid = await getGuid("guid");

      if (storedToken && storedGuid) {
        setToken(storedToken);
        setGuid(storedGuid);
        // Optionally fetch user data here using token/guid
        setUser({}); // Or fetched user data
      }

      setLoading(false);
    };

    loadSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        guid,
        login,
        logout,
        loading,
        isLoggedIn: !!user && !!token && !!guid,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
