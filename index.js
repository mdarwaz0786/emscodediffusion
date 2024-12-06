import "react-native-gesture-handler";
import "react-native-reanimated";
import { AppRegistry, StatusBar, StyleSheet, Text, View } from "react-native";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import App from "./App.js";
import { name as appName } from "./app.json";
import Toast from "react-native-toast-message";
import { AuthProvider } from "./src/Context/auth.context.js";

// Custom Toast Configuration
const toastConfig = {
  success: ({ text1, text2 }) => (
    <View style={[styles.toastContainer, styles.successToast]}>
      <Text style={styles.toastTitle}>{text1}</Text>
      {text2 ? <Text style={styles.toastMessage}>{text2}</Text> : null}
    </View>
  ),
  error: ({ text1, text2 }) => (
    <View style={[styles.toastContainer, styles.errorToast]}>
      <Text style={styles.toastTitle}>{text1}</Text>
      {text2 ? <Text style={styles.toastMessage}>{text2}</Text> : null}
    </View>
  ),
  info: ({ text1, text2 }) => (
    <View style={[styles.toastContainer, styles.infoToast]}>
      <Text style={styles.toastTitle}>{text1}</Text>
      {text2 ? <Text style={styles.toastMessage}>{text2}</Text> : null}
    </View>
  ),
};

const Main = () => (
  <SafeAreaProvider>
    <AuthProvider>
      <PaperProvider>
        <App />
        <StatusBar backgroundColor="#ffb300" barStyle="light-content" />
        <Toast config={toastConfig} />
      </PaperProvider>
    </AuthProvider>
  </SafeAreaProvider>
);

const styles = StyleSheet.create({
  toastContainer: {
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 20,
    marginBottom: 10,
    alignItems: "center",
  },
  toastTitle: {
    fontSize: 13,
    fontWeight: "500",
    color: "#fff",
    marginBottom: 5,
  },
  toastMessage: {
    fontSize: 13,
    color: "#fff",
    fontWeight: "500",
  },
  successToast: {
    backgroundColor: "#4caf50",
  },
  errorToast: {
    backgroundColor: "#f44336",
  },
  infoToast: {
    backgroundColor: "#2196f3",
  },
});

AppRegistry.registerComponent(appName, () => Main);
