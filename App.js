import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import SplashScreen from "react-native-splash-screen";
import DrawerNavigator from "./src/Navigation/Drawer/DrawerNavigator.js";
import { useAuth } from "./src/Context/auth.context.js";
import { useNetwork } from "./src/Context/network.context.js";
import NoInternet from "./src/Components/Common/NoInternet.js";

const App = () => {
  const { isLoading } = useAuth();
  const { isNetworkOkay } = useNetwork();

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hide();
    };
  }, [isLoading]);

  return (
    <NavigationContainer>
      {isNetworkOkay ? (
        <DrawerNavigator />
      ) : (
        <NoInternet />
      )}
    </NavigationContainer>
  );
};

export default App;
