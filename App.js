import React, {useEffect} from "react";
import {NavigationContainer} from "@react-navigation/native";
import SplashScreen from "react-native-splash-screen";
import DrawerNavigator from "./src/Navigation/Drawer/DrawerNavigator.js";
import {useAuth} from "./src/Context/auth.context.js";

const App = () => {
  const {isLoading} = useAuth();

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hide();
    }
  }, [isLoading]);

  return (
    <>
      <NavigationContainer>
        <DrawerNavigator />
      </NavigationContainer>
    </>
  );
};

export default App;
