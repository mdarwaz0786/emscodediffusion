import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { API_BASE_URL } from "@env";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [team, setTeam] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const validToken = token ? `Bearer ${token}` : null;
  const isLoggedIn = !!token;

  const storeToken = async (serverToken) => {
    setToken(serverToken);
    try {
      await AsyncStorage.setItem("token", serverToken);
    } catch (error) {
      console.log("Error storing token:", error);
    };
  };

  const logOutTeam = async () => {
    setToken(null);
    try {
      await AsyncStorage.removeItem("token");
      Toast.show({ type: "success", text1: "Logout successful" });
    } catch (error) {
      console.log("Error removing token:", error);
    };
  };

  const loggedInTeam = async () => {
    try {
      setIsLoading(true);
      const storedToken = await AsyncStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
        const response = await axios.get(`${API_BASE_URL}/api/v1/team/loggedin-team`, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });
        setTeam(response?.data?.team);
      } else {
        logOutTeam();
        Toast.show({ type: "error", text1: "Please log in to continue" });
      };
    } catch (error) {
      if (error.response?.status === 401) {
        logOutTeam();
        Toast.show({ type: "error", text1: "Please log in to continue" });
      } else {
        console.log("Error while fetching logged in employee:", error.message);
      };
    } finally {
      setIsLoading(false);
    };
  };

  useEffect(() => {
    loggedInTeam();
  }, []);

  return (
    <AuthContext.Provider value={{ storeToken, logOutTeam, isLoggedIn, team, isLoading, validToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
