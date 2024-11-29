import React from "react";
import {createStackNavigator} from "@react-navigation/stack";
import EmployeeScreen from "../../../Screens/Employee/EmployeeScreen.js";
import SalaryScreen from "../../../Screens/Salary/SalaryScreen.js";
import AttendanceScreen from "../../../Screens/Attendance/AttendanceScreen.js";

// Create a Stack Navigator
const Stack = createStackNavigator();

const EmployeeStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Employee"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Employee" component={EmployeeScreen} />
      <Stack.Screen name="Attendance" component={AttendanceScreen} />
      <Stack.Screen name="Salary" component={SalaryScreen} />
    </Stack.Navigator>
  );
};

export default EmployeeStack;
