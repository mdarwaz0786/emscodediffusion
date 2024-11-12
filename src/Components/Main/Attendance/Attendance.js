import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';
import { API_BASE_URL } from "@env";
import { useAuth } from '../../../Context/auth.context.js';

const Attendance = () => {
  const { team, validToken, isLoading } = useAuth();
  const [attendance, setAttendance] = useState([]);

  const currentDate = new Date().toISOString().split("T")[0];
  const employeeId = team?._id;

  // Fetch attendance
  const fetchAttendance = async () => {
    try {
      const params = {};

      if (currentDate) {
        params.date = currentDate;
      }

      if (employeeId) {
        params.employeeId = employeeId;
      }

      const response = await axios.get(
        `${API_BASE_URL}/api/v1/attendance/all-attendance`,
        {
          params,
          headers: {
            Authorization: validToken,
          },
        },
      );

      if (response?.data?.success) {
        setAttendance(response?.data?.attendance);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    if (employeeId && currentDate && !isLoading) {
      fetchAttendance();
    }
  }, [employeeId, currentDate, isLoading]);

  const renderAttendanceItem = ({ item }) => {
    return (
      <View style={styles.attendanceCard}>
        <View style={styles.employeeInfo}>
          <Text style={styles.employeeName}>{item.employee.name}</Text>
          <Text style={styles.employeeId}>Employee ID: {item.employee.employeeId}</Text>
          <Text style={styles.attendanceDate}>Date: {item.attendanceDate}</Text>
        </View>
        <View style={styles.attendanceStatus}>
          <Text style={styles.statusText}>Status: {item.status}</Text>
          <Text style={styles.punchInOut}>Punch In: {item.punchInTime}</Text>
          <Text style={styles.punchInOut}>Punch Out: {item.punchOutTime}</Text>
          <Text style={styles.hoursWorked}>Hours Worked: {item.hoursWorked}</Text>
        </View>
        <View style={styles.salaryInfo}>
          <Text style={styles.salaryText}>Monthly Salary: ₹{item.employee.monthlySalary}</Text>
          <Text style={styles.workHoursText}>Working Hours/Day: {item.employee.workingHoursPerDay}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Attendance Detail</Text>
      <FlatList
        data={attendance}
        keyExtractor={(item) => item._id}
        renderItem={renderAttendanceItem}
        ListEmptyComponent={<Text>No attendance records found.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginVertical: 2,
    marginBottom: 10,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#888',
  },
  attendanceCard: {
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  employeeInfo: {
    marginBottom: 10,
  },
  employeeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2a2a2a',
  },
  employeeId: {
    fontSize: 16,
    color: '#666',
  },
  attendanceDate: {
    fontSize: 16,
    color: '#333',
  },
  attendanceStatus: {
    marginVertical: 10,
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d8b2d',
  },
  punchInOut: {
    fontSize: 14,
    color: '#888',
  },
  hoursWorked: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
  },
  salaryInfo: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f1f1f1',
    paddingTop: 10,
  },
  salaryText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d8b2d',
  },
  workHoursText: {
    fontSize: 14,
    color: '#555',
  },
});

export default Attendance;
