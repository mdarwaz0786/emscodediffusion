import { PermissionsAndroid } from 'react-native';

// Request storage permissions from user
const requestStoragePermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: "Storage Permission",
        message: "This app needs access to your storage to save PDFs.",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK"
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("You can use the storage");
    } else {
      console.log("Storage permission denied");
    }
  } catch (error) {
    console.warn(error.message);
  }
};

export default requestStoragePermission;