import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import SplashScreen from "react-native-splash-screen";
import DrawerNavigator from "./src/Navigation/Drawer/DrawerNavigator.js";
import { useAuth } from "./src/Context/auth.context.js";
import { useNetwork } from "./src/Context/network.context.js";
import NoInternet from "./src/Components/Common/NoInternet.js";
import { requestUserPermission } from "./src/Helper/notificationService.js";
import messaging from "@react-native-firebase/messaging";
import notifee from "@notifee/react-native";
import { Alert } from "react-native";

const App = () => {
  const { isLoading } = useAuth();
  const { isNetworkOkay } = useNetwork();

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hide();
    };
  }, [isLoading]);

  useEffect(() => {
    requestUserPermission();
    createNotificationChannel();

    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      const { notification } = remoteMessage;
      Alert.alert(
        notification?.title || "New Notification",
        notification?.body || "You have a new message!"
      );
    });

    return () => unsubscribe();
  }, []);

  const createNotificationChannel = async () => {
    await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      sound: 'default',
      vibration: true,
      importance: AndroidPriority.HIGH,
    });
  };

  return (
    <NavigationContainer>
      {isNetworkOkay ? (
        <DrawerNavigator />
      ) : (
        <NoInternet />
      )}
    </NavigationContainer>
  );
};

export default App;
