import React from "react";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";
import HomeScreen from "../../screens/Home/HomeScreen.js";
import SettingsScreen from "../../screens/Settings/SettingsScreen.js";
import LoginScreen from "../../screens/Auth/LoginScreen.js";
import NotificationsScreen from "../../screens/Notifications/NotificationScreen.js";
import CustomDrawerNavigator from "../Drawer/CustomDrawerNavigator.js";

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  const icons = {
    Home: "home-outline",
    Settings: "settings-outline",
    Login: "person-outline",
    Notifications: "notifications-outline",
    Menu: "menu-outline",
  };

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarIcon: ({color, size}) => {
          const iconName = icons[route.name];
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#A63ED3",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          height: 70,
          backgroundColor: "#fff",
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      })}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
      <Tab.Screen name="Login" component={LoginScreen} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
      <Tab.Screen name="Menu" component={CustomDrawerNavigator} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
