import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import { API_BASE_URL } from "@env";
import { useAuth } from '../../../Context/auth.context.js';

const EmployeeListScreen = ({ navigation }) => {
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

  const navigateToAttendance = (employeeId) => {
    navigation.navigate('Attendance', { employeeId });
  };

  const renderEmployeeItem = ({ item }) => (
    <View style={styles.employeeCard}>
      <Text style={styles.employeeName}>{item.name}</Text>
      <Text style={styles.employeeRole}>{item.role}</Text>
      <TouchableOpacity
        style={styles.attendanceButton}
        onPress={() => navigateToAttendance(item._id)}
      >
        <Text style={styles.attendanceButtonText}>View Attendance</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Employee List</Text>
      <FlatList
        data={employees}
        renderItem={renderEmployeeItem}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  employeeCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  employeeName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  employeeRole: {
    fontSize: 14,
    color: '#888',
    marginVertical: 8,
  },
  attendanceButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  attendanceButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
});

export default EmployeeListScreen;
