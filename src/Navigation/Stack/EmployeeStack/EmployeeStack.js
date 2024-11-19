import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import EmployeeScreen from '../../../Screens/Employee/EmployeeScreen';
import SalaryScreen from '../../../Screens/Salary/SalaryScreen';
import AttendanceScreen from '../../../Screens/Attendance/AttendanceScreen';

// Create a Stack Navigator
const Stack = createStackNavigator();

const EmployeeStack = () => {
  return (
    <Stack.Navigator initialRouteName="Employee" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Employee" component={EmployeeScreen} />
      <Stack.Screen name="Attendance" component={AttendanceScreen} />
      <Stack.Screen name="Salary" component={SalaryScreen} />
    </Stack.Navigator>
  );
};

export default EmployeeStack;