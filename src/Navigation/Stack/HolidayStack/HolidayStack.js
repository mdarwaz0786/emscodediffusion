import React, { Suspense, lazy } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { ActivityIndicator, View } from "react-native";

// Lazy load the screens
const HolidayScreen = lazy(() =>
  import("../../../Screens/Holiday/HolidayScreen.js"),
);
const AddHolidayScreen = lazy(() =>
  import("../../../Screens/Holiday/AddHolidayScreen.js"),
);

// Create a Stack Navigator
const Stack = createStackNavigator();

const HolidayStack = () => {
  return (
    <Suspense
      fallback={
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#ffb300" />
        </View>
      }>
      <Stack.Navigator
        initialRouteName="Holiday"
        screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Holiday" component={HolidayScreen} />
        <Stack.Screen name="AddHoliday" component={AddHolidayScreen} />
      </Stack.Navigator>
    </Suspense>
  );
};

export default HolidayStack;
