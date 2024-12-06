import React, { Suspense, lazy } from "react";
import { ActivityIndicator, View } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { useAuth } from "../../Context/auth.context.js";
import BottomTabNavigator from "../BottomTab/BottomTabNavigator.js";
import LoginScreen from "../../Screens/Auth/LoginScreen.js";
import WorkSummary from "../../Components/Main/WorkSummary/WorkSummary.js";

// Lazy load the screens
const CustomDrawerNavigator = lazy(() => import("./CustomDrawerNavigator.js"));
const AboutUsScreen = lazy(() =>
  import("../../Screens/AboutUs/AboutUsScreen.js"),
);
const ContactUsScreen = lazy(() =>
  import("../../Screens/ContactUs/ContactUsScreen.js"),
);
const HelpScreen = lazy(() => import("../../Screens/Help/HelpScreen.js"));
const LogoutScreen = lazy(() => import("../../Screens/Auth/LogoutScreen.js"));
const EmployeeStack = lazy(() =>
  import("../Stack/EmployeeStack/EmployeeStack.js"),
);
const HolidayStack = lazy(() =>
  import("../Stack/HolidayStack/HolidayStack.js"),
);
const SettingsStack = lazy(() =>
  import("../Stack/SettingsStack/SettingsStack.js"),
);

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  const { isLoggedIn } = useAuth();

  return (
    <Suspense
      fallback={
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#ffb300" />
        </View>
      }>
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
            <Drawer.Screen
              name="BottomTabNavigator"
              component={BottomTabNavigator}
            />
            <Drawer.Screen name="EmployeeStack" component={EmployeeStack} />
            <Drawer.Screen name="HolidayStack" component={HolidayStack} />
            <Drawer.Screen name="SettingsStack" component={SettingsStack} />
            <Drawer.Screen name="WorkSummary" component={WorkSummary} />
            <Drawer.Screen name="About" component={AboutUsScreen} />
            <Drawer.Screen name="Contact" component={ContactUsScreen} />
            <Drawer.Screen name="Help" component={HelpScreen} />
            <Drawer.Screen name="Logout" component={LogoutScreen} />
          </>
        ) : (
          <Drawer.Screen name="Login" component={LoginScreen} />
        )}
      </Drawer.Navigator>
    </Suspense>
  );
};

export default DrawerNavigator;
