import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
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
import formatDate from "../../../Helper/formatDate.js";
import { useRefresh } from "../../../Context/refresh.context.js";

const Home = () => {
  const navigation = useNavigation();
  const { team, validToken } = useAuth();
  const { refreshKey, refreshPage } = useRefresh();
  const [attendance, setAttendance] = useState([]);
  const [monthlyStatistic, setMonthlyStatistic] = useState("");
  const [currentMonth, setCurrentMonth] = useState(
    new Date().toISOString().split("T")[0].slice(0, 7),
  );
  const [currentDate, setCurrentDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [employeeId, setEmployeeId] = useState(team?._id);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Update employeeId, currentMonth and currentDate when the component mounts or team changes
  useEffect(() => {
    setEmployeeId(team?._id);
    setCurrentDate(new Date().toISOString().split("T")[0]);
    setCurrentMonth(new Date().toISOString().split("T")[0].slice(0, 7));
  }, [team]);

  // Process Attendance API Request
  const processAttendance = async (
    method,
    endpoint,
    data,
    successMessage,
    validToken,
  ) => {
    try {
      const axiosConfig = {
        method,
        url: `${API_BASE_URL}/api/v1/attendance/${endpoint}`,
        data,
        headers: { Authorization: validToken },
      };

      const response = await axios(axiosConfig);

      if (response.data.success) {
        fetchAttendance();
        Toast.show({ type: "success", text1: successMessage });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: error?.message || "Failed to process attendance",
      });
    }
  };

  // Handle Punch attendance
  const handlePunchAction = async actionType => {
    try {
      const position = await getUserLocation();

      if (!position) {
        Toast.show({ type: "error", text1: "Please enable location" });
        return;
      }

      const { latitude, longitude } = position;

      // Ensure the function waits for the result of isWithinOfficeLocation
      const isWithinOffice = await isWithinOfficeLocation(
        latitude,
        longitude,
        validToken,
      );

      if (!isWithinOffice) {
        Toast.show({
          type: "error",
          text1: "Attendance can only be marked in office.",
        });
        return;
      }

      const { time, date, employeeId } = getAttendanceData(team);

      const requestData =
        actionType === "punchIn"
          ? { employee: employeeId, attendanceDate: date, punchInTime: time }
          : { employee: employeeId, attendanceDate: date, punchOutTime: time };

      const apiMethod = actionType === "punchIn" ? "post" : "put";
      const apiEndpoint =
        actionType === "punchIn" ? "create-attendance" : "update-attendance";
      const successMessage =
        actionType === "punchIn"
          ? "Punch in successful"
          : "Punch out successful";

      await processAttendance(
        apiMethod,
        apiEndpoint,
        requestData,
        successMessage,
        validToken,
      );
    } catch (error) {
      Toast.show({ type: "error", text1: error.message });
    }
  };

  // Handle marked attendance
  const handleMarkedAttendance = () => {
    fetchAttendance();
    if (attendance[0]?.punchOut && attendance[0]?.punchIn) {
      Toast.show({ type: "success", text1: "Attendance is marked for today." });
    }
  };

  // Get current date attendance for logged in employee
  const fetchAttendance = async () => {
    try {
      setLoading(true);

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
      console.log("Error while fetching attendance:", error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (employeeId && currentDate && validToken) {
      fetchAttendance();
    }
  }, [employeeId, currentDate, validToken, refreshKey]);

  // Get current month statistic for logged in employee
  const fetchMonthlyStatistic = async () => {
    try {
      const params = {};

      if (currentMonth) {
        params.month = currentMonth;
      }

      if (employeeId) {
        params.employeeId = employeeId;
      }

      const response = await axios.get(
        `${API_BASE_URL}/api/v1/attendance/monthly-statistic`,
        {
          params,
          headers: {
            Authorization: validToken,
          },
        },
      );

      if (response?.data?.success) {
        setMonthlyStatistic(response?.data?.attendance);
      }
    } catch (error) {
      console.error("Error while fetching monthly statistic:", error.message);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (employeeId && currentMonth && validToken) {
      fetchMonthlyStatistic();
    }
  }, [employeeId, currentMonth, validToken, refreshKey]);

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
    const attendanceIndex = routes.findIndex(
      route =>
        route.name === "EmployeeStack" && route.params?.screen === "Attendance",
    );

    navigation.dispatch(
      CommonActions.reset({
        index: attendanceIndex,
        routes,
      }),
    );
  };

  const statistics = [
    { label: "Month", value: formatDate(monthlyStatistic?.month) || "-", icon: "📅" },
    { label: "Total Days", value: monthlyStatistic?.totalDaysInMonth || 0, icon: "📆" },
    { label: "Working Days", value: monthlyStatistic?.companyWorkingDays || 0, icon: "💼" },
    { label: "Holidays", value: monthlyStatistic?.totalHolidays || 0, icon: "🎉" },
    { label: "Sundays", value: monthlyStatistic?.totalSundays || 0, icon: "☀️" },
    { label: "Present Days", value: monthlyStatistic?.employeePresentDays || 0, icon: "✅" },
    { label: "Absent Days", value: monthlyStatistic?.employeeAbsentDays || 0, icon: "❌" },
    { label: "Leave Days", value: monthlyStatistic?.employeeLeaveDays || 0, icon: "🏖️" },
    { label: "Late In Days", value: monthlyStatistic?.employeeLateInDays || 0, icon: "⏰" },
    { label: "Total Hours Worked", value: `${formatTimeToHoursMinutes(monthlyStatistic?.employeeWorkingHours) || "00:00"} / ${formatTimeToHoursMinutes(monthlyStatistic?.employeeRequiredWorkingHours) || "00:00"}`, icon: "🕒" },
    { label: "Avgerage Punch In Time", value: formatTimeWithAmPm(monthlyStatistic?.averagePunchInTime) || "-", icon: "🔔" },
    { label: "Avgerage Punch Out Time", value: formatTimeWithAmPm(monthlyStatistic?.averagePunchOutTime) || "-", icon: "🔕" },
    { label: "Company's Working Hours", value: formatTimeToHoursMinutes(monthlyStatistic?.companyWorkingHours) || "00:00", icon: "🏢" },
  ];

  const handleRefresh = () => {
    setRefreshing(true);
    refreshPage();
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
          {loading ? (
            <View
              style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
              <ActivityIndicator size={30} color="#ffb300" />
            </View>
          ) : (
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
          )}
        </View>
      </View>

      {/* Scrollable content */}
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        }
      >
        {/* Greeting and Date */}
        <View style={styles.greetingContainer}>
          <Text style={styles.greetingText}>
            {getGreeting()}, {team?.name?.split(" ", 1)[0]}!
          </Text>
          <Text style={styles.dateText}>{new Date().toDateString()}</Text>
        </View>

        {/* Today's Activity */}
        <View style={styles.activitySection}>
          <Text style={[styles.sectionTitle, styles.activityTitle,]}>Today’s Activity</Text>
          <Text style={{ marginTop: -3, color: "#777" }}>
            <Text style={{ color: attendance[0]?.punchIn ? "green" : "red" }}>
              {attendance[0]?.punchIn ? "✓" : "✗"}
            </Text>{" "}
            {formatTimeWithAmPm(attendance[0]?.punchInTime)}
            {attendance[0]?.punchIn ? " - Punch In" : " Punch In"}
          </Text>
          <Text style={{ color: "#777" }}>
            <Text
              style={{ color: attendance[0]?.punchOut ? "green" : "red" }}>
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
            <Icon name="history" size={20} style={{ color: "#777" }} />
            <Text style={styles.quickActionText}>Attendance History</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionButton}>
            <Icon name="file-text-o" size={20} style={{ color: "#777" }} />
            <Text style={styles.quickActionText}>Leave Request</Text>
          </TouchableOpacity>
        </View>

        {/* Today's Summary */}
        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Today’s Summary</Text>
          <Text style={{ marginTop: -1, color: "#777" }}>
            Total Hours Worked:{" "}
            {formatTimeToHoursMinutes(attendance[0]?.hoursWorked) || "0"}
          </Text>
          <Text style={{ color: "#777" }}>Break Time: 45 minutes</Text>
        </View>

        {/* Monthly Statistics */}
        <View style={styles.monthlyStats}>
          <Text style={[styles.sectionTitle, styles.staticTitle]}>Monthly Statistics</Text>
          {statistics?.map((item, index) => (
            <View key={index} style={styles.statItem}>
              <Text style={styles.iconPlaceholder}>{item.icon}</Text>
              <View style={styles.textContainer}>
                <Text style={styles.label}>{item.label}</Text>
                <Text style={styles.value}>{item.value}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 10,
    backgroundColor: "#f3f4f6",
  },
  cardContainer: {
    backgroundColor: "#fff",
    padding: 15,
    paddingHorizontal: 12,
    marginHorizontal: 10,
    borderRadius: 12,
    marginTop: 10,
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
    width: 40,
    height: 40,
    borderRadius: 25,
    marginRight: 8,
  },
  employeeName: {
    fontSize: 15,
    fontWeight: "500",
    marginRight: 10,
    color: "#777",
  },
  positionText: {
    color: "#777",
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
    backgroundColor: "#ffb300",
  },
  punchOutButton: {
    backgroundColor: "#ffb300",
  },
  markedButton: {
    backgroundColor: "#28a745",
  },
  punchButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  greetingContainer: {
    marginBottom: 10,
  },
  greetingText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#777",
  },
  dateText: {
    color: "#777",
    fontSize: 13,
  },
  activitySection: {
    padding: 15,
    backgroundColor: "#d9e3f0",
    borderRadius: 10,
    marginTop: 2,
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#777",
  },
  activityTitle: {
    paddingBottom: 7,
    marginTop: -5,
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
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
    fontSize: 14,
    marginTop: 5,
    color: "#777",
  },
  summary: {
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginTop: 16,
    marginBottom: 1,
  },
  summaryTitle: {
    fontSize: 14,
    color: "#777",
    fontWeight: "500",
    marginBottom: 5,
    marginTop: -5,
  },
  monthlyStats: {
    paddingTop: 12,
    paddingBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginTop: 16,
  },
  staticTitle: {
    paddingLeft: 16,
    paddingBottom: 10,
  },
  statItem: {
    paddingLeft: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  iconPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#d9e2ec",
    textAlign: "center",
    lineHeight: 32,
    fontSize: 18,
    marginRight: 12,
    color: "#333",
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: "#777",
  },
  value: {
    fontSize: 14,
    fontWeight: "400",
    color: "#4a90e2",
  },
});

export default Home;
