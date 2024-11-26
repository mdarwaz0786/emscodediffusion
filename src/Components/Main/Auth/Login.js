import React, { useState } from "react";
import { View, Text, TextInput, Button, Image, StyleSheet } from "react-native";
import axios from "axios";
import Toast from "react-native-toast-message";
import { useAuth } from "../../../Context/auth.context.js";
import { API_BASE_URL } from "@env";

const Login = () => {
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const { storeToken } = useAuth();

  // Ensure the employeeId starts with "EmpID" and the rest remains unchanged
  const transformedEmployeeId = `EmpID${employeeId.substring(5)}`;

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/team/login-team`,
        {
          employeeId: transformedEmployeeId,
          password,
        },
      );
      if (response?.data?.success) {
        storeToken(response?.data?.token);
        setEmployeeId("");
        setPassword("");
        Toast.show({ type: "success", text1: response?.data?.message });
      }
    } catch (error) {
      console.error("Error while login:", error.message);
      const errorMessage =
        error?.response?.data?.message ||
        "An unexpected error occurred. Please try again.";
      Toast.show({ type: "error", text1: errorMessage });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require("../../../Assets/logo.png")}
          style={styles.logo}
        />
      </View>
      <Text style={styles.heading}>Login</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>
          Employee ID <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Employee ID"
          value={employeeId}
          onChangeText={setEmployeeId}
          autoComplete="off"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>
          Password <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          autoComplete="off"
        />
      </View>
      <Button title="Login" onPress={handleLogin} color="#A63ED3" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: "50%",
    resizeMode: "contain",
  },
  heading: {
    fontSize: 20,
    fontWeight: "400",
    textAlign: "center",
    marginBottom: 10,
    color: "#333",
  },
  subheading: {
    fontSize: 14,
    textAlign: "center",
    color: "#6b7280",
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 15,
    marginBottom: 5,
    color: "#555",
  },
  required: {
    color: "red",
  },
  input: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
});

export default Login;
