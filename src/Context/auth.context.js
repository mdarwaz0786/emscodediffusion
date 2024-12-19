import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { API_BASE_URL } from "@env";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [team, setTeam] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const isLoggedIn = !!token;
  const validToken = token ? `Bearer ${token}` : null;

  const storeToken = async (serverToken) => {
    try {
      await AsyncStorage.setItem("token", serverToken);
      const response = await axios.get(`${API_BASE_URL}/api/v1/team/loggedin-team`, {
        headers: { Authorization: `Bearer ${serverToken}` }
      });

      if (response?.data?.success) {
        const newTeam = response?.data?.team;
        setTeam(newTeam);
        await AsyncStorage.setItem("team", JSON.stringify(newTeam));
        setToken(serverToken);
      }
    } catch (error) {
      console.log("Error while storing token and fetching employee details:", error?.response?.data?.message);
      Toast.show({ type: "error", text1: "Login failed. Please try again." });
    }
  };

  const logOutTeam = async () => {
    try {
      await AsyncStorage.removeItem("token");
      setToken(null);
      setTeam(null);
      Toast.show({ type: "success", text1: "Logout successful" });
    } catch (error) {
      console.log("Error while logout:", error.message);
    }
  };

  const initializeAuth = async () => {
    try {
      setIsLoading(true);
      const [storedToken, cachedTeam] = await AsyncStorage.multiGet(["token", "team"]);

      if (storedToken[1]) {
        setToken(storedToken[1]);
        if (cachedTeam[1]) {
          setTeam(JSON.parse(cachedTeam[1]));
        }
        refreshTeamData(storedToken[1]);
      } else {
        Toast.show({ type: "info", text1: "Please login to continue." });
      }
    } catch (error) {
      console.log("Error during auth initialization:", error.message);
      Toast.show({ type: "error", text1: "Session expired, login again to continue." });
      await logOutTeam();
    } finally {
      setIsLoading(false);
    }
  };

  const refreshTeamData = async (token) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/team/loggedin-team`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response?.data?.success) {
        const newTeam = response?.data?.team;
        setTeam(newTeam);
        await AsyncStorage.setItem("team", JSON.stringify(newTeam));
      }
    } catch (error) {
      console.log("Error while refreshing team data:", error?.response?.data?.message);
    }
  };

  useEffect(() => {
    initializeAuth();
  }, []);

  const value = useMemo(() => ({
    storeToken,
    logOutTeam,
    isLoggedIn,
    team,
    setTeam,
    isLoading,
    validToken
  }), [isLoggedIn, team, isLoading, validToken]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);