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
    <>
      {/* Header */}
      <View style={styles.header}>
        <Icon
          name="arrow-left"
          size={20}
          color="#000"
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerTitle}>Employee</Text>
      </View>

      <View style={styles.container}>
        <FlatList
          data={employees}
          renderItem={renderEmployeeItem}
          keyExtractor={item => item?._id}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingTop: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    columnGap: 100,
    padding: 12,
    marginBottom: 10,
    backgroundColor: "#fff",
    elevation: 1,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: "400",
    color: "#000",
  },
  employeeCard: {
    backgroundColor: "#ffffff",
    padding: 10,
    marginBottom: 12,
    borderRadius: 8,
  },
  heading: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 7,
  },
  employeeName: {
    fontSize: 13,
    fontWeight: "400",
    color: "#555",
  },
  employeeRole: {
    fontSize: 12,
    color: "#888",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  attendanceButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 6,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  attendanceButtonText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "400",
  },
  salaryButton: {
    backgroundColor: "#2196F3",
    paddingHorizontal: 7,
    paddingVertical: 5,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  salaryButtonText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "400",
  },
});

export default Employee;
