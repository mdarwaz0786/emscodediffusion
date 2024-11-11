import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useAuth } from '../../../Context/auth.context.js';
import axios from 'axios';
import Toast from "react-native-toast-message";
import { API_BASE_URL } from "@env";
import formatTimeWithAmPm from '../../../Helper/formatTimeWithAmPm.js';
import formatTimeToHoursMinutes from '../../../Helper/formatTimeToHoursMinutes.js';

const Home = () => {
  const { team, validToken } = useAuth();
  const [attendance, setAttendance] = useState([]);

  const currentDate = new Date().toISOString().split('T')[0];
  const currentTime = new Date().toTimeString().split(' ')[0].slice(0, 5);
  const employeeId = team?._id;

  // Punch in attendance
  const handleCreateAttendance = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/v1/attendance/create-attendance`,
        {
          employee: employeeId,
          attendanceDate: currentDate,
          punchInTime: currentTime,
        },
        {
          headers: {
            Authorization: validToken,
          },
        },
      );

      if (response.data.success) {
        Toast.show({ type: "success", text1: "successful" });
        fetchAttendance();
      };
    } catch (error) {
      Toast.show({ type: "error", text1: error.response.data.message });
    };
  };

  // Punch out attendance
  const handleUpdateAttendance = async () => {
    try {
      const response = await axios.put(`${API_BASE_URL}/api/v1/attendance/update-attendance`,
        {
          employee: employeeId,
          attendanceDate: currentDate,
          punchOutTime: currentTime,
        },
        {
          headers: {
            Authorization: validToken,
          },
        },
      );

      if (response.data.success) {
        Toast.show({ type: "success", text1: "successful" });
        fetchAttendance();
      };
    } catch (error) {
      Toast.show({ type: "error", text1: error.response.data.message });
    };
  };

  // Fetch attendance
  const fetchAttendance = async () => {
    try {
      const params = {};

      if (currentDate) {
        params.date = currentDate;
      };

      if (employeeId) {
        params.employeeId = employeeId;
      };

      const response = await axios.get(`${API_BASE_URL}/api/v1/attendance/all-attendance`, { params }, {
        headers: {
          Authorization: validToken,
        },
      });

      if (response?.data?.success) {
        setAttendance(response?.data?.attendance);
      };
    } catch (error) {
      console.error(error.message);
    };
  };

  useEffect(() => {
    fetchAttendance();
  }, [currentDate, employeeId]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header Card with Profile Icon and Punch Buttons */}
      <View style={styles.cardContainer}>
        <View style={styles.header}>
          <View style={styles.profileContainer}>
            <Image style={styles.profileIcon} source={require("../../../Assets/user-icon.png")} />
            <View>
              <Text style={styles.employeeName}>{team?.name?.split(' ', 1)[0]}</Text>
              <Text style={styles.positionText}>{team?.role?.name}</Text>
            </View>
          </View>
          <View style={styles.punchButtons}>
            {
              !(attendance[0]?.punchIn) && !(attendance[0]?.punchOut) && (
                <TouchableOpacity style={[styles.punchButton, styles.punchInButton]} onPress={handleCreateAttendance}>
                  <Text style={styles.punchButtonText}>Punch In</Text>
                </TouchableOpacity>
              )
            }
            {
              !(attendance[0]?.punchOut) && (attendance[0]?.punchIn) && (
                <TouchableOpacity style={[styles.punchButton, styles.punchOutButton]} onPress={handleUpdateAttendance}>
                  <Text style={styles.punchButtonText}>Punch Out</Text>
                </TouchableOpacity>
              )
            }
            {
              (attendance[0]?.punchOut) && (attendance[0]?.punchOut) && (
                <TouchableOpacity style={[styles.punchButton, styles.markedButton]}>
                  <Text style={styles.punchButtonText}>✓ Attendance Marked</Text>
                </TouchableOpacity>
              )
            }
          </View>
        </View>
      </View>

      {/* Greeting and Date */}
      <View style={styles.greetingContainer}>
        <Text style={styles.greetingText}>Good Morning, {team?.name?.split(' ', 1)[0]}!</Text>
        <Text style={styles.dateText}>{new Date().toDateString()}</Text>
      </View>

      {/* Today's Activity */}
      <View style={styles.activitySection}>
        <Text style={styles.sectionTitle}>Today’s Activity</Text>
        <Text>
          <Text style={{ color: attendance[0]?.punchIn ? "green" : "red" }}>{attendance[0]?.punchIn ? "✓" : "✗"}</Text>
          {" "}
          {formatTimeWithAmPm(attendance[0]?.punchInTime)}
          {attendance[0]?.punchIn ? " - Punched In" : " Punched In"}
        </Text>
        <Text>
          <Text style={{ color: attendance[0]?.punchOut ? "green" : "red" }}>{attendance[0]?.punchOut ? "✓" : "✗"}</Text>
          {" "}
          {formatTimeWithAmPm(attendance[0]?.punchOutTime)}
          {attendance[0]?.punchOut ? " - Punched Out" : " Punched Out"}
        </Text>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.quickActionButton}>
          <Icon name="history" size={20} />
          <Text style={styles.quickActionText}>Attendance History</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickActionButton}>
          <Icon name="file-text-o" size={20} />
          <Text style={styles.quickActionText}>Leave Request</Text>
        </TouchableOpacity>
      </View>

      {/* Today's Summary */}
      <View style={styles.summary}>
        <Text style={styles.summaryTitle}>Today’s Summary</Text>
        <Text>Total Hours Worked: {formatTimeToHoursMinutes(attendance[0]?.hoursWorked)}</Text>
        <Text>Break Time: 45 mins</Text>
      </View>

      {/* Monthly Statistics */}
      <View style={styles.monthlyStats}>
        <Text style={styles.sectionTitle}>Monthly Statistics</Text>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>20</Text>
            <Text style={styles.statLabel}>Present Days</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>2</Text>
            <Text style={styles.statLabel}>Absent Days</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Leaves</Text>
          </View>
        </View>
      </View>

      {/* Notifications */}
      <View style={styles.notifications}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <Text>🔔 New Holiday Announced on July 4th</Text>
        <Text>🔔 1 pending leave request</Text>
      </View>
    </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f3f4f6',
  },
  cardContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileIcon: {
    width: 35,
    height: 35,
    borderRadius: 25,
    marginRight: 8,
  },
  employeeName: {
    fontSize: 16,
    fontWeight: '500',
    marginRight: 10,
  },
  positionText: {
    color: 'gray',
    fontSize: 12,
  },
  punchButtons: {
    flexDirection: 'row',
  },
  punchButton: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  punchInButton: {
    backgroundColor: '#dc3545',
  },
  punchOutButton: {
    backgroundColor: '#dc3545',
  },
  markedButton: {
    backgroundColor: '#28a745',
  },
  punchButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
  },
  greetingContainer: {
    marginBottom: 12,
  },
  greetingText: {
    fontSize: 16,
    fontWeight: '500',
  },
  dateText: {
    color: 'gray',
    fontSize: 13,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 9,
  },
  quickActionButton: {
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#d9e3f0',
    padding: 15,
    borderRadius: 10,
    width: "47%"
  },
  quickActionText: {
    fontSize: 12,
    marginTop: 5,
  },
  summary: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: 15,
    marginBottom: 1,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  monthlyStats: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: 15,
    marginBottom: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statBox: {
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f0f4f8',
    borderRadius: 10,
    width: '30%',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '600',
  },
  statLabel: {
    fontSize: 12,
    color: 'gray',
  },
  activitySection: {
    padding: 15,
    backgroundColor: '#d9e3f0',
    borderRadius: 10,
    marginTop: 2,
    marginBottom: 6,
  },
  notifications: {
    padding: 15,
    backgroundColor: '#fce8e8',
    borderRadius: 10,
    marginTop: 15,
  },
});