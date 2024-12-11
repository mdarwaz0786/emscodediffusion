import React, { createContext, useContext, useEffect, useState } from "react";
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

  const storeToken = async serverToken => {
    try {
      await AsyncStorage.setItem("token", serverToken);
      setToken(serverToken);

      const response = await axios.get(
        `${API_BASE_URL}/api/v1/team/loggedin-team`,
        { headers: { Authorization: `Bearer ${serverToken}` } },
      );

      if (response?.data?.success) {
        setTeam(response?.data?.team);
        await AsyncStorage.setItem(
          "team",
          JSON.stringify(response?.data?.team),
        );
      }
    } catch (error) {
      console.log(
        "Error while storing token and fetching user details:",
        error.message,
      );
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
      const storedToken = await AsyncStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
        const cachedTeam = await AsyncStorage.getItem("team");
        if (cachedTeam) {
          setTeam(JSON.parse(cachedTeam));
        } else {
          setTeam(null);
        };
      } else {
        Toast.show({
          type: "error",
          text1: "Please log in to continue.",
        });
      };
    } catch (error) {
      console.log("Error during initializing auth:", error.message);
      logOutTeam();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{ storeToken, logOutTeam, isLoggedIn, team, setTeam, isLoading, validToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
