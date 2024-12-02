import React, {useEffect} from "react";
import {View, Text, ActivityIndicator, StyleSheet} from "react-native";
import {useAuth} from "../../../Context/auth.context.js";

const Logout = props => {
  const {logOutTeam} = useAuth();

  useEffect(() => {
    const performLogout = () => {
      setTimeout(async () => {
        await logOutTeam();
        props.navigation.reset({
          index: 0,
          routes: [{name: "Login"}],
        });
      }, 1000);
    };
    performLogout();
  }, [logOutTeam]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#A63ED3" />
      <Text style={styles.message}>Thank you for using our app!</Text>
      <Text style={styles.subMessage}>
        You have been logged out successfully.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  message: {
    fontSize: 15,
    color: "#333",
    marginTop: 10,
    fontWeight: "400",
  },
  subMessage: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
});

export default Logout;
