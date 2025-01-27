import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import { PermissionsAndroid, Platform } from 'react-native';

export async function requestUserPermission() {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    const granted = PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Permission granted');
      getFcmToken();
    } else {
      console.log('Permission denied');
    };
  } else {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
      getFcmToken();
    };
  };
};

const getFcmToken = async () => {
  try {
    await messaging().registerDeviceForRemoteMessages();
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    if (!!fcmToken) {
      console.log('FCM Token:', fcmToken);
      return;
    } else {
      fcmToken = await messaging().getToken();
      console.log('FCM Token:', fcmToken);
      await AsyncStorage.setItem('fcmToken', fcmToken);
    };
  } catch (error) {
    console.log('Error during generating token:', error);
  };
};

