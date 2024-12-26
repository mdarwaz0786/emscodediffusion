import React, { Suspense } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { ActivityIndicator, View } from 'react-native';
import TodayAttendanceScreen from '../../../Screens/Notifications/TodayAttendanceScree.js';
import TodayWorkSummaryScreen from '../../../Screens/Notifications/TodayWorkSummaryScreen.js';
import UpcomingHolidaysScreen from '../../../Screens/Notifications/UpcomingHolidaysScreen.js';

const Tab = createMaterialTopTabNavigator();

const NotificationTopTab = () => {
  return (
    <Suspense
      fallback={
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#ffb300" />
        </View>
      }>
      <Tab.Navigator
        initialRouteName="TodayAttendance"
        screenOptions={() => ({
          lazy: true,
          tabBarActiveTintColor: '#ffb300',
          tabBarInactiveTintColor: '#777',
          tabBarLabelStyle: {
            fontSize: 15,
            fontWeight: '400',
            marginHorizontal: -1,
            textTransform: 'none',
          },
          tabBarStyle: {
            backgroundColor: '#fff',
            elevation: 0,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0,
            shadowRadius: 0,
          },
          tabBarIndicatorStyle: {
            backgroundColor: '#ffb300',
            height: 3,
            borderRadius: 2,
          },
        })}
      >
        <Tab.Screen
          name="TodayAttendance"
          component={TodayAttendanceScreen}
          options={{ tabBarLabel: 'Attendance' }}
        />
        <Tab.Screen
          name="TodayWorkSummary"
          component={TodayWorkSummaryScreen}
          options={{ tabBarLabel: 'Work Summary' }}
        />
        <Tab.Screen
          name="UpcomingHolidays"
          component={UpcomingHolidaysScreen}
          options={{ tabBarLabel: 'Holidays' }}
        />
      </Tab.Navigator>
    </Suspense>
  );
};

export default NotificationTopTab;
