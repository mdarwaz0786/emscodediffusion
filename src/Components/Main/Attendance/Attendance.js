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
  const navigation = useNavigation();

  // Fetch single employee
  const fetchSingleEmployee = async () => {
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

  // Update employeeId if team or id changes and fetch employee
  useEffect(() => {
    if (id) {
      setEmployeeId(id);
      fetchSingleEmployee(id);
    }
  }, [id]);

  useEffect(() => {
    if (validToken && !isLoading && month && year && employeeId) {
      fetchAttendance();
    }
  }, [validToken, isLoading, month, year, employeeId]);

  // Function to reset filters to initial values
  const resetFilters = () => {
    setMonth(currentMonth);
    setYear(currentYear);
    setEmployeeId(id);
    fetchAttendance();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Icon
          name="arrow-left"
          size={23}
          color="#2D6A4F"
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.title}>Attendance Details</Text>
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
      <View style={{ justifyContent: "center", alignItems: "center", marginBottom: 5 }}>
        <Text style={{ fontSize: 18, fontWeight: "600" }}>
          {employee?.name}
        </Text>
      </View>

      {/* Scrollable Attendance List */}
      <ScrollView>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: "#f3f4f6",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    marginTop: 5,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 19,
    fontWeight: "400",
    color: "#2D6A4F",
    textAlign: "center",
  },
  buttonReset: {
    backgroundColor: "#B22222",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonResetText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "400",
  },
  filterContainer: {
    backgroundColor: "#fff",
    paddingHorizontal: 8,
    paddingVertical: 15,
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
    backgroundColor: "#f1f1f1",
  },
  pickerItem: {
    fontSize: 14,
    color: "#333",
  },
  attendanceCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginVertical: 8,
  },
  attendanceDate: {
    fontSize: 16,
    fontWeight: "500",
    color: "#2D6A4F",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 5,
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
    fontSize: 14,
    color: "#555",
    marginVertical: 2,
  },
  hoursWorked: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2D6A4F",
    marginTop: 5,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
  },
});


export default Attendance;
