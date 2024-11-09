import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useAuth } from '../../../Context/auth.context.js';
import axios from 'axios';
import Toast from "react-native-toast-message";
import { API_BASE_URL } from "@env";

const Home = () => {
  const { team, validToken } = useAuth();

  const currentDate = new Date().toISOString().split('T')[0];
  const currentTime = new Date().toTimeString().split(' ')[0].slice(0, 5);
  const employeeId = team?._id;

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
      };
    } catch (error) {
      Toast.show({ type: "error", text1: error.response.data.message });
    };
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header Card with Profile Icon and Punch Buttons */}
      <View style={styles.cardContainer}>
        <View style={styles.header}>
          <View style={styles.profileContainer}>
            <Image style={styles.profileIcon} source={require("../../../Assets/user-icon.png")} />
            <View>
              <Text style={styles.employeeName}>{team?.name}</Text>
              <Text style={styles.positionText}>{team?.role?.name}</Text>
            </View>
          </View>
          <View style={styles.punchButtons}>
            <TouchableOpacity style={[styles.punchButton, styles.punchInButton]} onPress={handleCreateAttendance}>
              <Text style={styles.punchButtonText}>Punch In</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.punchButton, styles.punchOutButton]}>
              <Text style={styles.punchButtonText}>Punch Out</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Greeting and Date */}
      <View style={styles.greetingContainer}>
        <Text style={styles.greetingText}>Good Morning, {team?.name?.split(' ', 1)[0]}!</Text>
        <Text style={styles.dateText}>{new Date().toDateString()}</Text>
      </View>

      {/* Attendance Status Card */}
      <View style={styles.attendanceStatus}>
        <Text style={styles.statusText}>Status: Checked In</Text>
        <Text style={styles.statusTime}>Last Punch: 9:00 AM</Text>
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
        <Text>Total Hours Worked: 5 hrs</Text>
        <Text>Break Time: 30 mins</Text>
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
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>Leaves</Text>
          </View>
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.activitySection}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <Text>✓ 9:00 AM - Checked In</Text>
        <Text>✓ 12:00 PM - Break</Text>
        <Text>✓ 12:30 PM - Resume Work</Text>
      </View>

      {/* Upcoming Events */}
      <View style={styles.upcomingEvents}>
        <Text style={styles.sectionTitle}>Upcoming Events</Text>
        <Text>📅 Project Deadline: June 30, 2023</Text>
        <Text>📅 Team Meeting: June 15, 2023</Text>
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
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  employeeName: {
    fontSize: 18,
    fontWeight: '600',
  },
  positionText: {
    color: 'gray',
  },
  punchButtons: {
    flexDirection: 'row',
  },
  punchButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  punchInButton: {
    backgroundColor: '#28a745',
  },
  punchOutButton: {
    backgroundColor: '#dc3545',
    display: "none",
  },
  punchButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  greetingContainer: {
    marginBottom: 20,
  },
  greetingText: {
    fontSize: 17,
    fontWeight: '500',
  },
  dateText: {
    color: 'gray',
  },
  attendanceStatus: {
    padding: 20,
    backgroundColor: '#d9e3f0',
    borderRadius: 10,
    marginVertical: 10,
  },
  statusText: {
    fontSize: 17,
    color: '#006400',
  },
  statusTime: {
    fontSize: 15,
    color: 'gray',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
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
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: 15,
  },
  upcomingEvents: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: 15,
  },
  notifications: {
    padding: 15,
    backgroundColor: '#fce8e8',
    borderRadius: 10,
    marginTop: 15,
  },
});
