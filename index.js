import "react-native-gesture-handler";
import { AppRegistry, StatusBar } from "react-native";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import App from "./App.js";
import { name as appName } from "./app.json";
import Toast from 'react-native-toast-message';
import { AuthProvider } from "./src/Context/auth.context.js";

const Main = () => (
  <SafeAreaProvider>
    <AuthProvider>
      <PaperProvider>
        <App />
        <StatusBar backgroundColor="#A63ED3" barStyle="light-content" />
        <Toast />
      </PaperProvider>
    </AuthProvider>
  </SafeAreaProvider>
);

AppRegistry.registerComponent(appName, () => Main);
