import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import axios from "axios";
import { API_BASE_URL } from "@env";
import { useAuth } from "../../../Context/auth.context.js";
import Icon from "react-native-vector-icons/Feather";

const Employee = ({ navigation }) => {
  const { validToken } = useAuth();
  const [employees, setEmployees] = useState([]);

  // Fetch all employees
  const fetchAllEmployees = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/team/all-team`, {
        headers: {
          Authorization: validToken,
        },
      });

      if (response?.data?.success) {
        setEmployees(response?.data?.team);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchAllEmployees();
  }, []);

  const navigateToAttendance = id => {
    navigation.navigate("Attendance", { id });
  };

  const renderEmployeeItem = ({ item }) => (
    <View style={styles.employeeCard}>
      <View style={styles.heading}>
        <Text style={styles.employeeName}>{item?.name}</Text>
        <Text style={styles.employeeRole}>{item?.role?.name}</Text>
      </View>
      <TouchableOpacity
        style={styles.attendanceButton}
        onPress={() => navigateToAttendance(item?._id)}>
        <Text style={styles.attendanceButtonText}>View Attendance</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon
          name="arrow-left"
          size={30}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerText}>Employee</Text>
      </View>
      <FlatList
        data={employees}
        renderItem={renderEmployeeItem}
        keyExtractor={item => item?._id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
    padding: 16,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "500",
    color: "#333",
    textAlign: "center",
  },
  employeeCard: {
    backgroundColor: "#ffffff",
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
  },
  header: {
    flexDirection: "row",
    width: "60%",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  heading: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  employeeName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  employeeRole: {
    fontSize: 16,
    color: "#888",
  },
  attendanceButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
  },
  attendanceButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "500",
  },
});

export default Employee;
