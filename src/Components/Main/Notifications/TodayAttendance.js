import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import axios from "axios";
import { API_BASE_URL } from "@env";
import { useAuth } from "../../../Context/auth.context.js";
import formatTimeWithAmPm from "../../../Helper/formatTimeWithAmPm.js";
import formatTimeToHoursMinutes from "../../../Helper/formatTimeToHoursMinutes.js";
import { ActivityIndicator } from "react-native-paper";

const TodayAttendance = () => {
  const { validToken } = useAuth();
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch today's attendance
  const fetchTodayAttendance = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/v1/attendance/all-attendance`, {
        headers: {
          Authorization: validToken,
        },
        params: {
          date: new Date().toISOString().split("T")[0],
        },
      });

      if (response?.data?.success) {
        setAttendance(response?.data?.attendance);
      };
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (validToken) {
      fetchTodayAttendance();
    }
  }, [validToken]);

  return (
    <>
      <Text style={styles.title}>Today's Attendance</Text>
      {/* Scrollable Attendance List */}
      <ScrollView style={styles.container}>
        {loading ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="small" color="#ffb300" />
          </View>
        ) : attendance?.length === 0 ? (
          <Text style={{ textAlign: "center", color: "#777" }}>
            Attendance records not found.
          </Text>
        ) : (
          attendance?.map(item => (
            <View key={item?._id} style={styles.attendanceCard}>
              <View style={styles.header}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{item?.employee?.name?.[0]}</Text>
                </View>
                <Text style={styles.name}>{item?.employee?.name}</Text>
              </View>
              <View style={styles.statusContainer}>
                <Text style={styles.statusText}>Status: {item?.status}</Text>
                <View>
                  <Text style={[
                    item?.status === "Present"
                      ? styles.present
                      : item?.status === "Absent"
                        ? styles.absent
                        : styles.holiday,
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
                        : item?.lateIn || item?.status === "Absent"
                          ? styles.late
                          : styles.holiday,
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
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 15,
    fontWeight: "400",
    color: "#333",
    marginTop: 10,
    marginBottom: 10,
    textAlign: "center",
  },
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  name: {
    fontSize: 14,
    fontWeight: '400',
    color: '#000',
    marginLeft: 10,
  },
  avatar: {
    backgroundColor: '#ffb300',
    borderRadius: 15,
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '400',
  },
  attendanceCard: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
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


export default TodayAttendance;
