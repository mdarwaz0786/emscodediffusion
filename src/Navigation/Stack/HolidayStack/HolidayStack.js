import React from "react";
import {createStackNavigator} from "@react-navigation/stack";
import HolidayScreen from "../../../Screens/Holiday/HolidayScreen.js";
import AddHolidayScreen from "../../../Screens/Holiday/AddHolidayScreen.js";

// Create a Stack Navigator
const Stack = createStackNavigator();

const HolidayStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Holiday"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Holiday" component={HolidayScreen} />
      <Stack.Screen name="AddHoliday" component={AddHolidayScreen} />
    </Stack.Navigator>
  );
};

export default HolidayStack;
