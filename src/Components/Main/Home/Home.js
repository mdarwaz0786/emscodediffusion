import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useAuth } from "../../../Context/auth.context.js";
import axios from "axios";
import Toast from "react-native-toast-message";
import { API_BASE_URL } from "@env";
import formatTimeWithAmPm from "../../../Helper/formatTimeWithAmPm.js";
import formatTimeToHoursMinutes from "../../../Helper/formatTimeToHoursMinutes.js";
import { useNavigation } from "@react-navigation/native";
import Geolocation from 'react-native-geolocation-service';
import requestLocationPermission from "./requestLocationPermission.js";
import getGreeting from "../../../Helper/generateGreeting.js";

const Home = () => {
  const navigation = useNavigation();
  const { team, validToken, isLoading } = useAuth();
  const [attendance, setAttendance] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split("T")[0]);
  const [employeeId, setEmployeeId] = useState(team?._id);
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
  });

  // Update employeeId and currentDate when the component mounts or team changes
  useEffect(() => {
    setEmployeeId(team?._id);
    setCurrentDate(new Date().toISOString().split("T")[0]);
  }, [team]);

  // Get current location of the user
  const getLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (hasPermission) {
      Geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
        },
        (error) => {
          console.log(error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
      );
    } else {
      console.log('Location permission denied');
      Toast.show({ type: "error", text1: "Turn on location" });
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  // Navigate to attendance detail screen
  const navigateToAttendance = () => {
    navigation.navigate("Attendance");
  };

  // Punch in attendance
  const handleCreateAttendance = async () => {
    await getLocation();

    // User latitude and longitude
    const userLatitude = location.latitude;
    const userLongitude = location.longitude;

    // Office latitude and longitude
    const officeLatitude = 28.6190774;
    const officeLongitude = 77.0345819;

    // Truncate it to two decimal places
    const userLatParts = Math.floor(userLatitude * 100) / 100;
    const userLongParts = Math.floor(userLongitude * 100) / 100;
    const officeLatParts = Math.floor(officeLatitude * 100) / 100;
    const officeLongParts = Math.floor(officeLongitude * 100) / 100;

    // Punch in only if user latitude and longitude is matched with office latitude and longitude
    if (userLatParts === officeLatParts && userLongParts === officeLongParts) {
      const time = new Date().toTimeString().split(" ")[0].slice(0, 5);
      const date = new Date().toISOString().split("T")[0];
      const employee = team?._id;

      try {
        const response = await axios.post(
          `${API_BASE_URL}/api/v1/attendance/create-attendance`,
          {
            employee: employee,
            attendanceDate: date,
            punchInTime: time,
          },
          {
            headers: {
              Authorization: validToken,
            },
          },
        );

        if (response.data.success) {
          Toast.show({ type: "success", text1: "Punch in successful" });
          fetchAttendance();
        }
      } catch (error) {
        Toast.show({ type: "error", text1: error.response.data.message });
      }
    } else {
      Toast.show({ type: "error", text1: "Location is not match" });
    }
  };

  // Punch out attendance
  const handleUpdateAttendance = async () => {
    await getLocation();

    // User latitude and longitude
    const userLatitude = location.latitude;
    const userLongitude = location.longitude;

    // Office latitude and longitude
    const officeLatitude = 28.6190774;
    const officeLongitude = 77.0345819;

    // Convert to strings, split by the decimal, and get the integer and two decimal places
    const userLatParts = Math.floor(userLatitude * 100) / 100;
    const userLongParts = Math.floor(userLongitude * 100) / 100;
    const officeLatParts = Math.floor(officeLatitude * 100) / 100;
    const officeLongParts = Math.floor(officeLongitude * 100) / 100;

    // Punch out only if user latitude and longitude is matched with office latitude and longitude
    if (userLatParts === officeLatParts && userLongParts === officeLongParts) {
      const time = new Date().toTimeString().split(" ")[0].slice(0, 5);
      const date = new Date().toISOString().split("T")[0];
      const employee = team?._id;

      try {
        const response = await axios.put(
          `${API_BASE_URL}/api/v1/attendance/update-attendance`,
          {
            employee: employee,
            attendanceDate: date,
            punchOutTime: time,
          },
          {
            headers: {
              Authorization: validToken,
            },
          },
        );

        if (response.data.success) {
          Toast.show({ type: "success", text1: "Punch out successful" });
          fetchAttendance();
        }
      } catch (error) {
        Toast.show({ type: "error", text1: error.response.data.message });
      }
    } else {
      Toast.show({ type: "error", text1: "Location is not match" });
    }
  };

  // Handle marked attendance
  const handleMarkedAttendance = () => {
    if (attendance[0]?.punchOut && attendance[0]?.punchIn) {
      Toast.show({ type: "success", text1: "Attendance is marked" });
    }
  };

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
        if (response.data.attendance.length === 0) {
          console.log("Attendance data is empty");
          setAttendance([]);
        } else {
          setAttendance(response.data.attendance);
        }
      } else {
        console.log("Request was unsuccessful");
      }
    } catch (error) {
      console.error("Error while fetching attendance:", error.response.data.message);
    }
  };

  useEffect(() => {
    if (employeeId && currentDate && validToken && !isLoading) {
      fetchAttendance();
    }
  }, [employeeId, currentDate, validToken, isLoading]);

  return (
    <>
      {/* Header Card with Profile Icon and Punch Buttons non scrollable */}
      <View style={styles.cardContainer}>
        <View style={styles.header}>
          <View style={styles.profileContainer}>
            <Image
              style={styles.profileIcon}
              source={require("../../../Assets/user-icon.png")}
            />
            <View>
              <Text style={styles.employeeName}>{team?.name}</Text>
              <Text style={styles.positionText}>{team?.role?.name}</Text>
            </View>
          </View>
          <View style={styles.punchButtons}>
            {!attendance[0]?.punchIn && !attendance[0]?.punchOut && (
              <TouchableOpacity
                style={[styles.punchButton, styles.punchInButton]}
                onPress={handleCreateAttendance}>
                <Text style={styles.punchButtonText}>Punch In</Text>
              </TouchableOpacity>
            )}
            {!attendance[0]?.punchOut && attendance[0]?.punchIn && (
              <TouchableOpacity
                style={[styles.punchButton, styles.punchOutButton]}
                onPress={handleUpdateAttendance}>
                <Text style={styles.punchButtonText}>Punch Out</Text>
              </TouchableOpacity>
            )}
            {attendance[0]?.punchOut && attendance[0]?.punchOut && (
              <TouchableOpacity
                style={[styles.punchButton, styles.markedButton]}
                onPress={handleMarkedAttendance}>
                <Text style={styles.punchButtonText}>✓ Marked</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View style={styles.locationContainer}>
          <View style={styles.location}>
            <Text>{location.latitude}</Text>
            <Text>{location.longitude}</Text>
          </View>
          <TouchableOpacity style={styles.locationRefresher} onPress={getLocation}>
            <Icon name="refresh" size={16} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Scrollable content */}
      <ScrollView contentContainerStyle={styles.container}>
        {/* Greeting and Date */}
        <View style={styles.greetingContainer}>
          <Text style={styles.greetingText}>
            {getGreeting()}, {team?.name?.split(" ", 1)[0]}!
          </Text>
          <Text style={styles.dateText}>{new Date().toDateString()}</Text>
        </View>

        {/* Today's Activity */}
        <View style={styles.activitySection}>
          <Text style={styles.sectionTitle}>Today’s Activity</Text>
          <Text>
            <Text style={{ color: attendance[0]?.punchIn ? "green" : "red" }}>
              {attendance[0]?.punchIn ? "✓" : "✗"}
            </Text>{" "}
            {formatTimeWithAmPm(attendance[0]?.punchInTime)}
            {attendance[0]?.punchIn ? " - Punch In" : " Punch In"}
          </Text>
          <Text>
            <Text style={{ color: attendance[0]?.punchOut ? "green" : "red" }}>
              {attendance[0]?.punchOut ? "✓" : "✗"}
            </Text>{" "}
            {formatTimeWithAmPm(attendance[0]?.punchOutTime)}
            {attendance[0]?.punchOut ? " - Punch Out" : " Punch Out"}
          </Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={navigateToAttendance}>
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
          <Text>
            Total Hours Worked:{" "}
            {formatTimeToHoursMinutes(attendance[0]?.hoursWorked)}
          </Text>
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
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f3f4f6",
  },
  cardContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginTop: 15,
    marginHorizontal: 18,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  profileIcon: {
    width: 35,
    height: 35,
    borderRadius: 25,
    marginRight: 8,
  },
  employeeName: {
    fontSize: 16,
    fontWeight: "500",
    marginRight: 10,
  },
  positionText: {
    color: "gray",
    fontSize: 12,
  },
  punchButtons: {
    flexDirection: "row",
  },
  punchButton: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  punchInButton: {
    backgroundColor: "#dc3545",
  },
  punchOutButton: {
    backgroundColor: "#dc3545",
  },
  markedButton: {
    backgroundColor: "#28a745",
  },
  punchButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "500",
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "space-between",
    marginTop: 10,
  },
  location: {
    flexDirection: "row",
    columnGap: 10,
  },
  greetingContainer: {
    marginBottom: 22,
  },
  greetingText: {
    fontSize: 16,
    fontWeight: "500",
  },
  dateText: {
    color: "gray",
    fontSize: 13,
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 9,
  },
  quickActionButton: {
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#d9e3f0",
    padding: 15,
    borderRadius: 10,
    width: "47%",
  },
  quickActionText: {
    fontSize: 12,
    marginTop: 5,
  },
  summary: {
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginTop: 15,
    marginBottom: 1,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  monthlyStats: {
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginTop: 15,
    marginBottom: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statBox: {
    alignItems: "center",
    padding: 10,
    backgroundColor: "#f0f4f8",
    borderRadius: 10,
    width: "30%",
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "600",
  },
  statLabel: {
    fontSize: 12,
    color: "gray",
  },
  activitySection: {
    padding: 15,
    backgroundColor: "#d9e3f0",
    borderRadius: 10,
    marginTop: 2,
    marginBottom: 6,
  },
  notifications: {
    padding: 15,
    backgroundColor: "#fce8e8",
    borderRadius: 10,
    marginTop: 15,
  },
});

export default Home;
