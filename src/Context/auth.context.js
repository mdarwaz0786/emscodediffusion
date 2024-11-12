import React, {createContext, useContext, useEffect, useState} from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import {API_BASE_URL} from "@env";

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [token, setToken] = useState(null);
  const [team, setTeam] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const isLoggedIn = !!token;
  const validToken = token ? `Bearer ${token}` : null;

  const storeToken = async serverToken => {
    try {
      await AsyncStorage.setItem("token", serverToken);
      setToken(serverToken);
    } catch (error) {
      console.error("Error while storing token:", error.message);
    }
  };

  const logOutTeam = async () => {
    try {
      await AsyncStorage.removeItem("token");
      setToken(null);
      setTeam(null);
      Toast.show({type: "success", text1: "Logout successful"});
    } catch (error) {
      console.error("Error while removing token:", error.message);
    }
  };

  const loggedInTeam = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/team/loggedin-team`,
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      );
      setTeam(response?.data?.team);
    } catch (error) {
      if (error.response?.status === 401) {
        Toast.show({
          type: "error",
          text1: "Session expired. Please log in again.",
        });
        logOutTeam();
      } else {
        console.error(
          "Error while fetching logged in employee:",
          error.message,
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        if (storedToken) {
          setToken(storedToken);
        } else {
          Toast.show({type: "error", text1: "Please log in to continue"});
        }
      } catch (error) {
        console.error("Error while fetching token:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchToken();
  }, []);

  useEffect(() => {
    if (token) {
      loggedInTeam();
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{storeToken, logOutTeam, isLoggedIn, team, isLoading, validToken}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
