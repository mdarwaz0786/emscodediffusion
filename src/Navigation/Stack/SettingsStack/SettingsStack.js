import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SettingsScreen from '../../../Screens/Settings/SettingsScreen.js';
import AddOfficeScreen from '../../../Screens/Settings/AddOffice.js';

// Create a Stack Navigator
const Stack = createStackNavigator();

const SettingsStack = () => {
  return (
    <Stack.Navigator initialRouteName="Settings" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="AddOffice" component={AddOfficeScreen} />
    </Stack.Navigator>
  );
};

export default SettingsStack;