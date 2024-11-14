import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { API_BASE_URL } from "@env";
import { useAuth } from "../../../Context/auth.context.js";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";

const Attendance = ({ route }) => {
  const id = route?.params?.id;
  const { team, validToken, isLoading } = useAuth();
  const [attendance, setAttendance] = useState([]);
  const [employee, setEmployee] = useState([]);
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);
  const [employeeId, setEmployeeId] = useState(id || team?._id);
  const navigation = useNavigation();

  // Update employeeId if team or id changes
  useEffect(() => {
    setEmployeeId(id || team?._id);
  }, [id, team]);

  // Fetch all employee
  const fetchAllEmoloyee = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/team/all-team`, {
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

  useEffect(() => {
    fetchAllEmoloyee();
  }, []);

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
    if (validToken && !isLoading) {
      fetchAttendance();
    }
  }, [validToken, isLoading, validToken, isLoading, month, year, employeeId]);

  // Function to reset filters to initial values
  const resetFilters = () => {
    setMonth(currentMonth);
    setYear(currentYear);
    setEmployeeId(id || team?._id);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Icon
          name="arrow-left"
          size={30}
          color="#2D6A4F"
          onPress={() => navigation.goBack()}
          style={styles.icon}
        />
        <Text style={styles.title}>Attendance Details</Text>
        <Button
          style={styles.buttonReset}
          title="Reset"
          onPress={resetFilters}
          color="#B22222"
        />
      </View>

      {/* Filter Section */}
      <View style={styles.filterContainer}>
        <View style={styles.pickerRow}>
          {/* Year Picker */}
          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Year:</Text>
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
            <Text style={styles.label}>Month:</Text>
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

          {/* Employee Picker */}
          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Employee:</Text>
            <Picker
              selectedValue={employeeId}
              style={styles.picker}
              onValueChange={value => setEmployeeId(value)}>
              {employee?.map(emp => (
                <Picker.Item
                  key={emp?._id}
                  label={emp?.name}
                  value={emp?._id}
                  style={styles.pickerItem}
                />
              ))}
            </Picker>
          </View>
        </View>
      </View>

      {/* Attendance List */}
      {attendance.length === 0 ? (
        <Text style={styles.emptyText}>
          No attendance records found for the selected month and year.
        </Text>
      ) : (
        attendance?.map(item => (
          <View key={item?._id} style={styles.attendanceCard}>
            <Text style={styles.attendanceDate}>
              Date: {item?.attendanceDate}
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
            <Text style={styles.punchInOut}>Punch In: {item?.punchInTime}</Text>
            <Text style={styles.punchInOut}>
              Punch Out: {item?.punchOutTime}
            </Text>
            <Text style={styles.hoursWorked}>
              Hours Worked: {item?.hoursWorked}
            </Text>
            <View style={styles.statusContainer}>
              <Text style={styles.statusText}>Late In:</Text>
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f3f4f6",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 5,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 22,
    fontWeight: "500",
    color: "#2D6A4F",
    textAlign: "center",
  },
  filterContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  pickerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  pickerContainer: {
    flex: 1,
    marginHorizontal: 5,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: "600",
    color: "#333",
  },
  picker: {
    backgroundColor: "#f1f1f1",
  },
  pickerItem: {
    fontSize: 16,
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
    fontWeight: "600",
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
    backgroundColor: "red",
  },
  onTime: {
    backgroundColor: "#28a745",
  },
  late: {
    backgroundColor: "#dc3545",
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
    marginTop: 20,
  },
});

export default Attendance;
