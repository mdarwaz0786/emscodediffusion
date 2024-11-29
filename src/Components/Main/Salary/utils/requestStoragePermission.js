import {PermissionsAndroid} from "react-native";

// Request storage permissions from user
const requestStoragePermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: "Storage Permission",
        message: "This app needs access to your storage to save PDFs",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK",
      },
    );
    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      Alert.alert(
        "Permission denied",
        "Cannot save files without files and media permission.",
      );
    }
  } catch (error) {
    console.warn(error.message);
  }
};

export default requestStoragePermission;
