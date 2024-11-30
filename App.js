import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import SplashScreen from "react-native-splash-screen";
import DrawerNavigator from "./src/Navigation/Drawer/DrawerNavigator.js";

const App = () => {
  useEffect(() => {
    SplashScreen.hide();
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
