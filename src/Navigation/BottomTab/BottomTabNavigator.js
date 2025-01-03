import React, { Suspense, lazy } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";
import { ActivityIndicator, View } from "react-native";
import HomeScreen from "../../Screens/Home/HomeScreen.js";

// Lazy load the screens
const NotificationTobTab = lazy(() => import("../TopTab/NotificationTopTab/NotificationTopTab.js"),);
const CustomDrawerNavigator = lazy(() => import("../Drawer/CustomDrawerNavigator.js"));
const ProfileScreen = lazy(() => import("../../Screens/Profile/ProfileScreen.js"));

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  const icons = {
    Home: "home-outline",
    Profile: "person-outline",
    Notifications: "notifications-outline",
    Menu: "menu-outline",
  };

  return (
    <Suspense
      fallback={
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#ffb300" />
        </View>
      }>
      <Tab.Navigator
        initialRouteName="Home"
        backBehavior="history"
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ color, size }) => {
            const iconName = icons[route.name];
            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#ffb300",
          tabBarInactiveTintColor: "gray",
          tabBarStyle: {
            height: 65,
            backgroundColor: "#fff",
            paddingBottom: 8,
            paddingTop: 5,
          },
          tabBarLabelStyle: {
            fontSize: 15,
            fontWeight: "400",
          },
        })}>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
        <Tab.Screen name="Notifications" component={NotificationTobTab} />
        <Tab.Screen name="Menu" component={CustomDrawerNavigator} />
      </Tab.Navigator>
    </Suspense>
  );
};

export default BottomTabNavigator;
