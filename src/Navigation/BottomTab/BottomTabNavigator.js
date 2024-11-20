// src/Navigation/BottomTab/BottomTabNavigator.js
import React from "react";
import { ActivityIndicator, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useAuth } from "../../Context/auth.context.js";
import Icon from "react-native-vector-icons/Ionicons";
import HomeScreen from "../../Screens/Home/HomeScreen.js";
import LoginScreen from "../../Screens/Auth/LoginScreen.js";
import NotificationsScreen from "../../Screens/Notifications/NotificationScreen.js";
import CustomDrawerNavigator from "../Drawer/CustomDrawerNavigator.js";
import ProfileScreen from "../../Screens/Profile/ProfileScreen.js";

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  const { isLoggedIn, isLoading } = useAuth();

  const icons = {
    Home: "home-outline",
    Profile: "person-outline",
    Login: "person-outline",
    Notifications: "notifications-outline",
    Menu: "menu-outline",
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#A63ED3" />
      </View>
    );
  }

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          const iconName = icons[route.name];
          return <Icon name={iconName} size={size} color={color} />;
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
          fontWeight: "400",
        },
      })}>
      {isLoggedIn ? (
        <>
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Profile" component={ProfileScreen} />
          <Tab.Screen name="Notifications" component={NotificationsScreen} />
          <Tab.Screen name="Menu" component={CustomDrawerNavigator} />
        </>
      ) : (
        <Tab.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
      )}
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
