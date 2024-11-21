import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { API_BASE_URL } from "@env";
import { useAuth } from "../../../Context/auth.context.js";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import formatTimeWithAmPm from "../../../Helper/formatTimeWithAmPm.js";
import formatTimeToHoursMinutes from "../../../Helper/formatTimeToHoursMinutes.js";
import formatDate from "../../../Helper/formatDate.js";

const Attendance = ({ route }) => {
  const id = route?.params?.id;
  const { validToken, isLoading } = useAuth();
  const [attendance, setAttendance] = useState([]);
  const [employee, setEmployee] = useState("");
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);
  const [employeeId, setEmployeeId] = useState(id);
  const [attendanceSummary, setAttendanceSummary] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  // Update employeeId, month and date when the component mounts
  useEffect(() => {
    setEmployeeId(id);
    fetchSingleEmployee(id);
    setMonth(currentMonth);
    setYear(currentYear);
  }, [id]);

  // Fetch single employee
  const fetchSingleEmployee = async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/team/single-team/${id}`, {
        headers: {
          Authorization: validToken,
        },
      });

      if (response?.data?.success) {
        setEmployee(response?.data?.team);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // Fetch Attendance
  const fetchAttendance = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/attendance/all-attendance`,
        {
          params: {
            month,
            year,
            employeeId,
          },
          headers: {
            Authorization: validToken,
          },
        },
      );

      if (response?.data?.success) {
        setAttendance(response?.data?.attendance);
      } else {
        setAttendance([]);
      }
    } catch (error) {
      console.error(
        "Error while fetching attendance:",
        error?.response?.data?.message,
      );
    }
  };

  useEffect(() => {
    if (validToken && !isLoading && month && year && employeeId) {
      fetchAttendance();
    }
  }, [validToken, isLoading, month, year, employeeId]);

  // Get current month statistic for employee
  const fetchMonthlyStatistic = async () => {
    try {
      const params = {};

      if (month) {
        params.month = `${year}-${month}`;
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
        setAttendanceSummary(response?.data?.attendance);
      };
    } catch (error) {
      console.error("Error while fetching monthly statistic:", error.message);
    };
  };

  useEffect(() => {
    if (employeeId && month && year && validToken && !isLoading) {
      fetchMonthlyStatistic();
    };
  }, [employeeId, month, year, validToken, isLoading]);

  // Function to reset filters to initial values
  const resetFilters = () => {
    setMonth(currentMonth);
    setYear(currentYear);
    setEmployeeId(id);
    fetchAttendance();
    fetchMonthlyStatistic();
  };

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
        <Text style={styles.headerTitle}>Attendance</Text>
        <Pressable style={styles.buttonReset} onPress={resetFilters}>
          <Text style={styles.buttonResetText}>Reset Filter</Text>
        </Pressable>
      </View>

      {/* Filter Section */}
      <View style={styles.filterContainer}>
        <View style={styles.pickerRow}>
          {/* Year Picker */}
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={year}
              onValueChange={itemValue => setYear(itemValue)}
              style={styles.picker}>
              {Array.from({ length: 5 }, (_, index) => {
                const yearOption = currentYear - index;
                return (
                  <Picker.Item
                    key={yearOption}
                    label={String(yearOption)}
                    value={yearOption}
                    style={styles.pickerItem}
                  />
                );
              })}
            </Picker>
          </View>

          {/* Month Picker */}
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={month}
              onValueChange={itemValue => setMonth(itemValue)}
              style={styles.picker}>
              {Array.from({ length: 12 }, (_, index) => (
                <Picker.Item
                  key={index}
                  label={new Date(0, index).toLocaleString("default", {
                    month: "long",
                  })}
                  value={index}
                  style={styles.pickerItem}
                />
              ))}
            </Picker>
          </View>
        </View>
      </View>

      {/* Employee */}
      <View style={{ justifyContent: "center", alignItems: "center", marginBottom: 10 }}>
        <Text style={{ fontSize: 15, fontWeight: "400" }}>
          {employee?.name}
        </Text>
      </View>

      {/* Scrollable Attendance List */}
      <ScrollView style={styles.container}>
        {attendance.length === 0 ? (
          <Text style={styles.emptyText}>
            No attendance records found for {employee?.name} for the selected month and year.
          </Text>
        ) : (
          attendance?.map(item => (
            <View key={item?._id} style={styles.attendanceCard}>
              <Text style={styles.attendanceDate}>
                Date: {formatDate(item?.attendanceDate)}
              </Text>
              <View style={styles.statusContainer}>
                <Text style={styles.statusText}>Status: {item?.status}</Text>
                <View
                  style={[
                    styles.statusBadge,
                    item?.status === "Present" ? styles.present : styles.absent,
                  ]}>
                  <Text style={styles.statusBadgeText}>{item.status}</Text>
                </View>
              </View>
              <Text style={styles.punchInOut}>Punch In: {formatTimeWithAmPm(item?.punchInTime)}</Text>
              <Text style={styles.punchInOut}>
                Punch Out: {formatTimeWithAmPm(item?.punchOutTime)}
              </Text>
              <Text style={styles.hoursWorked}>
                Hours Worked: {formatTimeToHoursMinutes(item?.hoursWorked)}
              </Text>
              <View style={styles.statusContainer}>
                <Text style={styles.statusText}>Late In: {item?.lateIn === "00:00" ? "On Time" : formatTimeToHoursMinutes(item?.lateIn)} </Text>
                <View
                  style={[
                    styles.statusBadge,
                    item?.lateIn === "00:00" ? styles.onTime : styles.late,
                  ]}>
                  <Text style={styles.statusBadgeText}>
                    {item?.lateIn === "00:00" ? "On Time" : "Late"}
                  </Text>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: "#f3f4f6",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  buttonReset: {
    backgroundColor: "#B22222",
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonResetText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "400",
  },
  filterContainer: {
    paddingHorizontal: 5,
    borderRadius: 10,
    marginBottom: 10,
  },
  pickerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  pickerContainer: {
    flex: 1,
    marginHorizontal: 5,
  },
  picker: {
    backgroundColor: "#fff",
  },
  pickerItem: {
    fontSize: 14,
    color: "#333",
  },
  attendanceCard: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
  },
  attendanceDate: {
    fontSize: 14,
    fontWeight: "400",
    color: "#2D6A4F",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statusText: {
    fontSize: 13,
    fontWeight: "400",
    color: "#333",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 5,
    width: 61,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  present: {
    backgroundColor: "green",
  },
  absent: {
    backgroundColor: "#B22222",
  },
  onTime: {
    backgroundColor: "green",
  },
  late: {
    backgroundColor: "#B22222",
  },
  statusBadgeText: {
    fontSize: 12,
    color: "#fff",
  },
  punchInOut: {
    fontSize: 13,
    color: "#555",
  },
  hoursWorked: {
    fontSize: 13,
    fontWeight: "400",
    color: "#2D6A4F",
  },
  emptyText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
});

export default Attendance;