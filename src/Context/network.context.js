import React, { createContext, useState, useEffect, useContext } from "react";
import NetInfo from "@react-native-community/netinfo";
import { Alert } from "react-native";

const NetworkContext = createContext();

export const NetworkProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(true);
  const [isInternetSlow, setIsInternetSlow] = useState(false);

  const showAlert = (title, message) => {
    Alert.alert(title, message);
  };

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
      if (state.isConnected && state.isInternetReachable) {
        const speed = state.details.linkSpeed;
        setIsInternetSlow(speed < 1);
      } else {
        setIsInternetSlow(true);
      };
    });

    return () => unsubscribe();
  }, []);

  return (
    <NetworkContext.Provider value={{ isConnected, isInternetSlow, showAlert }}>
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetwork = () => useContext(NetworkContext);