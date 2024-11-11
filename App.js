import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import SplashScreen from "react-native-splash-screen";
import BottomTabNavigator from "./src/Navigation/BottomTab/BottomTabNavigator.js";
import DrawerNavigator from "./src/Navigation/Drawer/DrawerNavigator.js";

const App = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      SplashScreen.hide();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <NavigationContainer>
        <DrawerNavigator />
      </NavigationContainer>
    </>
  );
};

export default App;
