import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { API_BASE_URL } from "@env";
import { useAuth } from "../../../Context/auth.context.js";
import { useRefresh } from "../../../Context/refresh.context.js";
import Icon from "react-native-vector-icons/Feather";
import Close from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import formatTimeWithAmPm from "../../../Helper/formatTimeWithAmPm.js";
import formatTimeToHoursMinutes from "../../../Helper/formatTimeToHoursMinutes.js";
import formatDate from "../../../Helper/formatDate.js";
import { Modal, Portal, Button, ActivityIndicator } from "react-native-paper";

const Attendance = ({ route }) => {
  const id = route?.params?.id;
  const { validToken } = useAuth();
  const { refreshKey, refreshPage } = useRefresh();
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
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (id) {
      setMonth(currentMonth);
      setYear(currentYear);
      setEmployeeId(id);
      fetchSingleEmployee(id);
    }
  }, [id]);

  // Fetch single employee
  const fetchSingleEmployee = async (id) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/team/single-team/${id}`,
        {
          headers: {
            Authorization: validToken,
          },
        },
      );

      if (response?.data?.success) {
        setEmployee(response?.data?.team);
      };
    } catch (error) {
      console.log(error.message);
    } finally {
      setRefreshing(false);
    };
  };

  // Fetch Attendance of selected month, year and employee
  const fetchAttendance = async () => {
    try {
      setLoading(true);

      const params = {};

      if (month) {
        const formattedMonth = month.toString().padStart(2, "0");
        params.month = formattedMonth;
      };

      if (employeeId) {
        params.employeeId = employeeId;
      };

      if (year) {
        params.year = year;
      };

      params.sort = "Descending";

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
      } else {
        setAttendance([]);
      };
    } catch (error) {
      console.log(
        "Error while fetching attendance:",
        error?.response?.data?.message,
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    };
  };

  // Get selected month and year statistic for employee
  const fetchMonthlyStatistic = async () => {
    try {
      const params = {};

      if (month) {
        const formattedMonth = month.toString().padStart(2, "0");
        params.month = `${year}-${formattedMonth}`;
      };

      if (employeeId) {
        params.employeeId = employeeId;
      };

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
      console.log("Error while fetching monthly statistic:", error?.response?.data?.message);
    } finally {
      setRefreshing(false);
    };
  };

  useEffect(() => {
    if (employeeId && month && year && validToken) {
      fetchAttendance();
      fetchMonthlyStatistic();
    };
  }, [employeeId, month, year, validToken, refreshKey]);

  // Function to reset filters
  const resetFilters = () => {
    setMonth(currentMonth);
    setYear(currentYear);
    setEmployeeId(id);
    fetchSingleEmployee(id);
    fetchAttendance();
    fetchMonthlyStatistic();
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handleRefresh = () => {
    setRefreshing(true);
    refreshPage();
  };

  const joiningYear = new Date(employee?.joining).getFullYear();

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
        <TouchableOpacity style={styles.buttonReset} onPress={resetFilters}>
          <Text style={styles.buttonResetText}>Reset Filter</Text>
        </TouchableOpacity>
      </View>

      {/* Scrollable Attendance List */}
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        }
      >
        {/* Filter Section */}
        <View style={styles.filterContainer}>
          <View style={styles.pickerRow}>
            {/* Year Picker */}
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={year}
                onValueChange={itemValue => setYear(itemValue)}
                style={styles.picker}>
                {Array.from({ length: currentYear - joiningYear + 1 }, (_, index) => {
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
                style={styles.picker}
              >
                {monthNames?.map((month, index) => (
                  <Picker.Item
                    key={index}
                    label={month}
                    value={index + 1}
                    style={styles.pickerItem}
                  />
                ))}
              </Picker>
            </View>
          </View>
        </View>

        {/* Employee */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
          }}>
          <Text style={{ fontSize: 14, fontWeight: "400", color: "#333" }}>{employee?.name}</Text>
          {/* Summary Button */}
          <TouchableOpacity
            style={{
              paddingVertical: 4,
              paddingHorizontal: 8,
              backgroundColor: "#ffb300",
              borderRadius: 5,
            }}
            onPress={() => setModalVisible(true)}>
            <Text
              style={{
                color: "#fff",
                fontSize: 14,
                fontWeight: "500",
              }}>
              Summary
            </Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="small" color="#ffb300" />
          </View>
        ) : attendance?.length === 0 ? (
          <Text style={{ textAlign: "center", color: "#777" }}>
            Attendance not found.
          </Text>
        ) : (
          attendance?.map(item => (
            <View key={item?._id} style={styles.attendanceCard}>
              <Text style={styles.attendanceDate}>
                Date: {formatDate(item?.attendanceDate)}
              </Text>
              <View style={styles.statusContainer}>
                <Text style={styles.statusText}>Status: {item?.status}</Text>
                <View>
                  <Text style={[
                    item?.status === "Present"
                      ? styles.present
                      : item?.status === "Absent"
                        ? styles.absent
                        : item?.status === "Holiday"
                          ? styles.holiday
                          : item?.status === "Sunday" || item?.status === "Saturday"
                            ? styles.sunday
                            : item?.status === "On Leave"
                              ? styles.onLeave
                              : item?.status === "Comp Off"
                                ? styles.compOff
                                : item?.status === "Half Day"
                                  ? styles.halfDay
                                  : styles.default,
                  ]}>{item?.status}</Text>
                </View>
              </View>
              <Text style={styles.punchInOut}>
                Punch In: {formatTimeWithAmPm(item?.punchInTime)}
              </Text>
              <Text style={styles.punchInOut}>
                Punch Out: {formatTimeWithAmPm(item?.punchOutTime)}
              </Text>
              <Text style={styles.hoursWorked}>
                Hours Worked: {formatTimeToHoursMinutes(item?.hoursWorked)}
              </Text>
              <View style={styles.statusContainer}>
                <Text style={styles.statusText}>
                  Late In:{" "}
                  {item?.lateIn === "00:00"
                    ? "On Time"
                    : item?.lateIn
                      ? formatTimeToHoursMinutes(item?.lateIn)
                      : ""}{" "}
                </Text>
                <View>
                  <Text
                    style={[
                      item?.lateIn === "00:00"
                        ? styles.onTime
                        : styles.late
                    ]}
                  >
                    {item?.lateIn === "00:00"
                      ? "On Time"
                      : item?.lateIn
                        ? "Late"
                        : "-"}
                  </Text>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Modal */}
      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={{
            backgroundColor: "white",
            padding: 15,
            paddingTop: 10,
            marginHorizontal: 30,
            borderRadius: 10,
          }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "400",
              marginBottom: 8,
              textAlign: "center",
              color: "#333",
            }}>
            Attendance Summary
          </Text>
          {attendanceSummary ? (
            <>
              <Text style={{ fontSize: 14, marginBottom: 5, color: "#555" }}>
                Total Sundays: {attendanceSummary?.totalSundays}
              </Text>
              <Text style={{ fontSize: 14, marginBottom: 5, color: "#555" }}>
                Total Holidays: {attendanceSummary?.totalHolidays}
              </Text>
              <Text style={{ fontSize: 14, marginBottom: 5, color: "#555" }}>
                Total Present Days: {attendanceSummary?.employeePresentDays}/
                {attendanceSummary?.companyWorkingDays}
              </Text>
              <Text style={{ fontSize: 14, marginBottom: 5, color: "#555" }}>
                Total Half Days: {attendanceSummary?.employeeHalfDays}
              </Text>
              <Text style={{ fontSize: 14, marginBottom: 5, color: "#555" }}>
                Total Comp Off Days: {attendanceSummary?.employeeCompOffDays}
              </Text>
              <Text style={{ fontSize: 14, marginBottom: 5, color: "#555" }}>
                Total Absent Days: {attendanceSummary?.employeeAbsentDays}
              </Text>
              <Text style={{ fontSize: 14, marginBottom: 5, color: "#555" }}>
                Total Leave Days: {attendanceSummary?.employeeLeaveDays}
              </Text>
              <Text style={{ fontSize: 14, marginBottom: 5, color: "#555" }}>
                Total Late in Days: {attendanceSummary?.employeeLateInDays}
              </Text>
              <Text style={{ fontSize: 14, marginBottom: 5, color: "#555" }}>
                Total Hours Worked: {attendanceSummary?.employeeWorkingHours}/
                {attendanceSummary?.employeeRequiredWorkingHours}
              </Text>
              <Text style={{ fontSize: 14, marginBottom: 5, color: "#555" }}>
                Average Punch In Time:{" "}
                {formatTimeWithAmPm(attendanceSummary?.averagePunchInTime)}
              </Text>
              <Text style={{ fontSize: 14, marginBottom: 5, color: "#555" }}>
                Average Punch Out Time:{" "}
                {formatTimeWithAmPm(attendanceSummary?.averagePunchOutTime)}
              </Text>
              <Text style={{ fontSize: 14, marginBottom: 5, color: "#555" }}>
                Company's Working Hours: {attendanceSummary?.companyWorkingHours}
              </Text>
              <Text style={{ fontSize: 14, marginBottom: 5, color: "#555" }}>
                Company's Working Days: {attendanceSummary?.companyWorkingDays}
              </Text>
            </>
          ) : (
            <Text style={{ fontSize: 14, marginBottom: 10, color: "#555" }}>Attendance summary not found.</Text>
          )}
          <Button
            mode="contained"
            onPress={() => setModalVisible(false)}
            style={{ marginTop: 10, backgroundColor: "#ffb300" }}>
            <Close name="close" size={25} style={{ color: "#fff" }} />
          </Button>
        </Modal>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#fff",
    zIndex: 1000,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "400",
    color: "#000",
  },
  buttonReset: {
    backgroundColor: "#ffb300",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonResetText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "500",
  },
  filterContainer: {
    marginVertical: 10,
  },
  pickerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    columnGap: 10,
  },
  pickerContainer: {
    flex: 1,
  },
  picker: {
    backgroundColor: "#fff",
    color: "#333",
  },
  pickerItem: {
    fontSize: 14,
    color: "#333",
    backgroundColor: "#fff",
  },
  attendanceCard: {
    backgroundColor: "#fff",
    padding: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 12,
  },
  attendanceDate: {
    fontSize: 14,
    fontWeight: "400",
    color: "green",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statusText: {
    fontSize: 14,
    fontWeight: "400",
    color: "#555",
  },
  present: {
    color: "green",
    fontSize: 14,
  },
  absent: {
    color: "red",
    fontSize: 14,
  },
  holiday: {
    color: "#ffb300",
    fontSize: 14,
  },
  sunday: {
    color: "blue",
    fontSize: 14,
  },
  onLeave: {
    color: "purple",
    fontSize: 14,
  },
  default: {
    color: "black",
    fontSize: 14,
  },
  compOff: {
    color: "orange",
    fontSize: 14,
  },
  halfDay: {
    color: "#00ced1",
    fontSize: 14,
  },
  onTime: {
    color: "green",
    fontSize: 14,
  },
  late: {
    color: "red",
    fontSize: 14,
  },
  punchInOut: {
    fontSize: 14,
    color: "#555",
  },
  hoursWorked: {
    fontSize: 14,
    fontWeight: "400",
    color: "#555",
  },
});

export default Attendance;