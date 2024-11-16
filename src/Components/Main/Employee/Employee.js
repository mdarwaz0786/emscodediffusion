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
    if (validToken) {
      fetchAllEmployees();
    }
  }, [validToken]);

  const navigateToAttendance = id => {
    navigation.navigate("Attendance", { id });
  };

  const navigateToSalary = id => {
    navigation.navigate("Salary", { id });
  };

  const renderEmployeeItem = ({ item }) => (
    <View style={styles.employeeCard}>
      <View style={styles.heading}>
        <Text style={styles.employeeName}>{item?.name}</Text>
        <Text style={styles.employeeRole}>{item?.role?.name}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.attendanceButton}
          onPress={() => navigateToAttendance(item?._id)}>
          <Text style={styles.attendanceButtonText}>View Attendance</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.salaryButton}
          onPress={() => navigateToSalary(item?._id)}>
          <Text style={styles.salaryButtonText}>View Salary</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon name="arrow-left" size={25} onPress={() => navigation.goBack()} />
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
    fontSize: 19,
    fontWeight: "400",
    color: "#333",
    textAlign: "center",
  },
  employeeCard: {
    backgroundColor: "#ffffff",
    padding: 12,
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
    marginBottom: 10,
  },
  employeeName: {
    fontSize: 14,
    fontWeight: "400",
    color: "#333",
  },
  employeeRole: {
    fontSize: 14,
    color: "#888",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  attendanceButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  attendanceButtonText: {
    fontSize: 13,
    color: "#fff",
    fontWeight: "500",
  },
  salaryButton: {
    backgroundColor: "#2196F3",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  salaryButtonText: {
    fontSize: 13,
    color: "#fff",
    fontWeight: "500",
  },
});

export default Employee;
