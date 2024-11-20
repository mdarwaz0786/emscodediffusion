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
import { CommonActions, useNavigation } from "@react-navigation/native";
import formatTimeWithAmPm from "../../../Helper/formatTimeWithAmPm.js";
import formatTimeToHoursMinutes from "../../../Helper/formatTimeToHoursMinutes.js";
import getGreeting from "../../../Helper/generateGreeting.js";
import isWithinOfficeLocation from "./utils/isWithinOfiiceLocation.js";
import getUserLocation from "./utils/getUerLocation.js";
import getAttendanceData from "./utils/getAttendanceData.js";

const Home = () => {
  const navigation = useNavigation();
  const { team, validToken, isLoading } = useAuth();
  const [attendance, setAttendance] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split("T")[0]);
  const [employeeId, setEmployeeId] = useState(team?._id);

  // Update employeeId and currentDate when the component mounts or team changes
  useEffect(() => {
    setEmployeeId(team?._id);
    setCurrentDate(new Date().toISOString().split("T")[0]);
  }, [team]);

  // Process Attendance API Request
  const processAttendance = async (method, endpoint, data, successMessage, validToken) => {
    try {
      const axiosConfig = {
        method,
        url: `${API_BASE_URL}/api/v1/attendance/${endpoint}`,
        data,
        headers: { Authorization: validToken },
      };

      const response = await axios(axiosConfig);

      if (response.data.success) {
        Toast.show({ type: "success", text1: successMessage });
        fetchAttendance();
      };
    } catch (error) {
      Toast.show({
        type: "error",
        text1: error?.response?.data?.message || "Failed to process attendance",
      });
    };
  };

  // Handle Punch attendance
  const handlePunchAction = async (actionType) => {
    try {
      const position = await getUserLocation();

      if (!position) {
        Toast.show({ type: "error", text1: "Please enable location" });
        return;
      };

      const { latitude, longitude } = position;

      if (!isWithinOfficeLocation(latitude, longitude)) {
        Toast.show({ type: "error", text1: "Attendance can only be marked in office." });
        return;
      };

      const { time, date, employeeId } = getAttendanceData(team);

      const requestData = actionType === "punchIn"
        ? { employee: employeeId, attendanceDate: date, punchInTime: time }
        : { employee: employeeId, attendanceDate: date, punchOutTime: time };

      const apiMethod = actionType === "punchIn" ? "post" : "put";
      const apiEndpoint = actionType === "punchIn" ? "create-attendance" : "update-attendance";
      const successMessage = actionType === "punchIn" ? "Punch in successful" : "Punch out successful";

      await processAttendance(apiMethod, apiEndpoint, requestData, successMessage, validToken);
    } catch (error) {
      Toast.show({ type: "error", text1: error.message });
    };
  };

  // Handle marked attendance
  const handleMarkedAttendance = () => {
    if (attendance[0]?.punchOut && attendance[0]?.punchIn) {
      Toast.show({ type: "success", text1: "Attendance is marked for today." });
    };
  };

  // Get current date attendance for logged in employee
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
        };
      } else {
        console.log("Request was unsuccessful");
      };
    } catch (error) {
      console.error("Error while fetching attendance:", error.response.data.message);
    };
  };

  useEffect(() => {
    if (employeeId && currentDate && validToken && !isLoading) {
      fetchAttendance();
    };
  }, [employeeId, currentDate, validToken, isLoading]);

  // Navigate to attendance detail screen
  const navigateToAttendance = () => {
    const routes = [
      { name: "BottomTabNavigator" }, // Base route
      {
        name: "EmployeeStack",
        params: {
          screen: "Attendance",
          params: { id: employeeId },
        },
      },
    ];

    // Index of Attendance in routes array
    const attendanceIndex = routes.findIndex((route) => route.name === "EmployeeStack" && route.params?.screen === "Attendance");

    navigation.dispatch(
      CommonActions.reset({
        index: attendanceIndex,
        routes,
      })
    );
  };

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
                onPress={() => handlePunchAction("punchIn")}>
                <Text style={styles.punchButtonText}>Punch In</Text>
              </TouchableOpacity>
            )}
            {!attendance[0]?.punchOut && attendance[0]?.punchIn && (
              <TouchableOpacity
                style={[styles.punchButton, styles.punchOutButton]}
                onPress={() => handlePunchAction("punchOut")}>
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
          <Text>Break Time: 45 minutes</Text>
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
