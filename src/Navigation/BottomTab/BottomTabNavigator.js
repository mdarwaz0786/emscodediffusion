import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";
import HomeScreen from "../../Screens/Home/HomeScreen.js";
import NotificationsScreen from "../../Screens/Notifications/NotificationScreen.js";
import CustomDrawerNavigator from "../Drawer/CustomDrawerNavigator.js";
import ProfileScreen from "../../Screens/Profile/ProfileScreen.js";

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {

  const icons = {
    Home: "home-outline",
    Profile: "person-outline",
    Login: "person-outline",
    Notifications: "notifications-outline",
    Menu: "menu-outline",
  };

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          const iconName = icons[route.name];
          return <Icon name={iconName} size={23} color={color} />;
        },
        tabBarActiveTintColor: "#A63ED3",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          height: 60,
          backgroundColor: "#fff",
          paddingBottom: 8,
          paddingTop: 5,
        },
        tabBarLabelStyle: {
          fontSize: 14,
        },
      })}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
      <Tab.Screen name="Menu" component={CustomDrawerNavigator} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
