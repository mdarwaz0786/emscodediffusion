import React, { lazy, Suspense } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { ActivityIndicator, View } from 'react-native';

// Lazy load screens
const UpcomingHolidaysScreen = lazy(() =>
  import('../../../Screens/Notifications/UpcomingHolidaysScreen.js')
);
const TodayAttendanceScreen = lazy(() =>
  import('../../../Screens/Notifications/TodayAttendanceScree.js')
);
const TodayWorkSummaryScreen = lazy(() =>
  import('../../../Screens/Notifications/TodayWorkSummaryScreen.js')
);

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
            elevation: 3,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 3,
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
