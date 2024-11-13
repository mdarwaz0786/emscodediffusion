// src/Navigation/Drawer/DrawerNavigator.js
import React from "react";
import {ActivityIndicator, View} from "react-native";
import {createDrawerNavigator} from "@react-navigation/drawer";
import {useAuth} from "../../Context/auth.context.js";
import CustomDrawerNavigator from "./CustomDrawerNavigator.js";
import BottomTabNavigator from "../BottomTab/BottomTabNavigator.js";
import LoginScreen from "../../Screens/Auth/LoginScreen.js";
import AboutUsScreen from "../../Screens/AboutUs/AboutUsScreen.js";
import ContactUsScreen from "../../Screens/ContactUs/ContactUsScreen.js";
import HelpScreen from "../../Screens/Help/HelpScreen.js";
import LogoutScreen from "../../Screens/Auth/LogoutScreen.js";
import AttendanceScreen from "../../Screens/Attendance/AttendanceScreen.js";

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  const {isLoggedIn, isLoading} = useAuth();

  if (isLoading) {
    return (
      <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
        <ActivityIndicator size="large" color="#A63ED3" />
      </View>
    );
  }

  return (
    <Drawer.Navigator
      initialRouteName={isLoggedIn ? "BottomTab" : "Login"}
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
          <Drawer.Screen name="BottomTab" component={BottomTabNavigator} />
          <Drawer.Screen name="About" component={AboutUsScreen} />
          <Drawer.Screen name="Contact" component={ContactUsScreen} />
          <Drawer.Screen name="Help" component={HelpScreen} />
          <Drawer.Screen name="Logout" component={LogoutScreen} />
          <Drawer.Screen name="Attendance" component={AttendanceScreen} />
        </>
      ) : (
        <Drawer.Screen name="Login" component={LoginScreen} />
      )}
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
