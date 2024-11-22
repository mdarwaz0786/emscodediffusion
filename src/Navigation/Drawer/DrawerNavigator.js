import React from "react";
import { ActivityIndicator, View } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { useAuth } from "../../Context/auth.context.js";
import CustomDrawerNavigator from "./CustomDrawerNavigator.js";
import BottomTabNavigator from "../BottomTab/BottomTabNavigator.js";
import LoginScreen from "../../Screens/Auth/LoginScreen.js";
import AboutUsScreen from "../../Screens/AboutUs/AboutUsScreen.js";
import ContactUsScreen from "../../Screens/ContactUs/ContactUsScreen.js";
import HelpScreen from "../../Screens/Help/HelpScreen.js";
import LogoutScreen from "../../Screens/Auth/LogoutScreen.js";
import EmployeeStack from "../Stack/EmployeeStack/EmployeeStack.js";
import SettingsScreen from "../../Screens/Settings/SettingsScreen.js";
import HolidayScreen from "../../Screens/Holiday/HolidayScreen.js";

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#A63ED3" />
      </View>
    );
  }

  return (
    <Drawer.Navigator
      initialRouteName={isLoggedIn ? "BottomTabNavigator" : "Login"}
      drawerContent={props =>
        isLoggedIn ? <CustomDrawerNavigator {...props} /> : null
      }
      screenOptions={{
        headerShown: false,
        gestureEnabled: isLoggedIn,
        swipeEnabled: isLoggedIn,
      }}>
      {isLoggedIn ? (
        <>
          <Drawer.Screen name="BottomTabNavigator" component={BottomTabNavigator} />
          <Drawer.Screen name="EmployeeStack" component={EmployeeStack} />
          <Drawer.Screen name="Holiday" component={HolidayScreen} />
          <Drawer.Screen name="Settings" component={SettingsScreen} />
          <Drawer.Screen name="About" component={AboutUsScreen} />
          <Drawer.Screen name="Contact" component={ContactUsScreen} />
          <Drawer.Screen name="Help" component={HelpScreen} />
          <Drawer.Screen name="Logout" component={LogoutScreen} />
        </>
      ) : (
        <Drawer.Screen name="Login" component={LoginScreen} />
      )}
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
