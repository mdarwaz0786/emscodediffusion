import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useAuth } from "../../Context/auth.context.js";
import { useRefresh } from "../../Context/refresh.context.js";
import Toast from "react-native-toast-message";
import { API_BASE_URL } from "@env";
import formatTimeToHoursMinutes from "../../Helper/formatTimeToHoursMinutes.js";
import formatDate from "../../Helper/formatDate.js";
import axios from "axios";
import updateLocalStorageFields from "./utils/updateLocalStorageFields.js";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProfileScreen = () => {
  const { team, setTeam, validToken } = useAuth();
  const { refreshKey, refreshPage } = useRefresh();
  const id = team?._id;
  const [name, setName] = useState(team?.name);
  const [email, setEmail] = useState(team?.email);
  const [mobile, setMobile] = useState(team?.mobile);
  const [dob, setDob] = useState(team?.dob);
  const [joining, setJoining] = useState(team?.joining);
  const [isDobPickerVisible, setIsDobPickerVisible] = useState(false);
  const [isJoiningPickerVisible, setIsJoiningPickerVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const toggleModal = () => setIsModalVisible(!isModalVisible);

  const showDobPicker = () => setIsDobPickerVisible(true);
  const showJoiningPicker = () => setIsJoiningPickerVisible(true);

  const onDobChange = (event, selectedDate) => {
    setIsDobPickerVisible(false);
    if (selectedDate) setDob(selectedDate.toISOString().split("T")[0]);
  };

  const onJoiningChange = (event, selectedDate) => {
    setIsJoiningPickerVisible(false);
    if (selectedDate) setJoining(selectedDate.toISOString().split("T")[0]);
  };

  const fetchTeamData = async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/team/loggedin-team`,
        { headers: { Authorization: validToken } },
      );

      if (response?.data?.success) {
        setTeam(response?.data?.team);
        await AsyncStorage.setItem(
          "team",
          JSON.stringify(response?.data?.team),
        );
      };
    } catch (error) {
      console.log("Error while fetching employee data:", error.message);
      Toast.show({ type: "error", text1: "Failed to fetch employee data" });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (validToken) {
      fetchTeamData();
    }
  }, [validToken, refreshKey]);

  const handleUpdate = async (id) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/v1/team/update-team/${id}`,
        { name, email, mobile, dob, joining },
        {
          headers: {
            Authorization: validToken,
          },
        }
      );

      if (response?.data?.success) {
        toggleModal();
        updateLocalStorageFields('team', {
          name: name,
          email: email,
          mobile: mobile,
          dob: dob,
          joining: joining,
        });
        fetchTeamData();
        Toast.show({ type: "success", text1: "Profile updated successfully" });
      }
    } catch (error) {
      console.log("Error while updating profile:", error.message);
      Toast.show({ type: "error", text1: "Error while updating profile" });
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    refreshPage();
  };

  return (
    <>
      {
        loading ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" color="#ffb300" />
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.container}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
              />
            }
          >
            <View style={styles.detailsCard}>
              <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>
                  {team?.name ? team.name[0].toUpperCase() : "?"}
                </Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.name}>{team?.name}</Text>
                <Text style={styles.designation}>
                  {team?.designation?.name || "Designation not assigned"}
                </Text>
              </View>
            </View>

            <View style={styles.infoCard}>
              <DetailRow label="Employee ID" value={team?.employeeId} />
              <DetailRow label="Email" value={team?.email} />
              <DetailRow label="Mobile" value={team?.mobile} />
              <DetailRow label="Joining Date" value={formatDate(team?.joining)} />
              <DetailRow label="Date of Birth" value={formatDate(team?.dob)} />
              <DetailRow label="Monthly Salary" value={`₹${team?.monthlySalary}`} />
              <DetailRow
                label="Working Hours/Day"
                value={formatTimeToHoursMinutes(team?.workingHoursPerDay)}
              />
              <DetailRow
                label="Role"
                value={team?.role?.name || "Role not assigned"}
              />
            </View>

            <TouchableOpacity style={styles.editButton} onPress={toggleModal}>
              <Text style={styles.editButtonText}>Update Profile</Text>
            </TouchableOpacity>

            <Modal
              visible={isModalVisible}
              animationType="fade"
              onRequestClose={toggleModal}
              transparent={true}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                  <Text style={styles.modalHeader}>Update Profile</Text>

                  <Text style={styles.label}>Name:</Text>
                  <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                  />

                  <Text style={styles.label}>Email:</Text>
                  <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                  />

                  <Text style={styles.label}>Mobile:</Text>
                  <TextInput
                    style={styles.input}
                    value={mobile}
                    onChangeText={setMobile}
                  />

                  <Text style={styles.label}>Date of Birth:</Text>
                  <TouchableOpacity
                    style={[styles.input, styles.dateInput]}
                    onPress={showDobPicker}
                  >
                    <Text style={{ color: "#777" }}>{dob}</Text>
                  </TouchableOpacity>
                  {isDobPickerVisible && (
                    <DateTimePicker
                      value={dob ? new Date(dob) : new Date()}
                      mode="date"
                      display="default"
                      onChange={onDobChange}
                    />
                  )}

                  <Text style={styles.label}>Joining Date:</Text>
                  <TouchableOpacity
                    style={[styles.input, styles.dateInput]}
                    onPress={showJoiningPicker}
                  >
                    <Text style={{ color: "#777" }}>{joining}</Text>
                  </TouchableOpacity>
                  {isJoiningPickerVisible && (
                    <DateTimePicker
                      value={joining ? new Date(joining) : new Date()}
                      mode="date"
                      display="default"
                      onChange={onJoiningChange}
                    />
                  )}

                  <View style={styles.buttonGroup}>
                    <TouchableOpacity
                      style={styles.saveButton}
                      onPress={() => handleUpdate(id)}
                    >
                      <Text style={styles.buttonText}>Save</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={toggleModal}
                    >
                      <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          </ScrollView>
        )
      }
    </>
  );
};

const DetailRow = ({ label, value }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}:</Text>
    <Text style={styles.detailValue}>{value || "Not available"}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    padding: 10,
  },
  detailsCard: {
    backgroundColor: "#ffffff",
    padding: 10,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    width: "100%",
  },
  avatarContainer: {
    height: 35,
    width: 35,
    borderRadius: 30,
    backgroundColor: "#ffb300",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "500",
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: "500",
    color: "#555",
  },
  designation: {
    fontSize: 14,
    color: "#6c757d",
  },
  infoCard: {
    backgroundColor: "#ffffff",
    padding: 10,
    borderRadius: 10,
    width: "100%",
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  detailLabel: {
    fontSize: 14,
    color: "#333",
  },
  detailValue: {
    fontSize: 14,
    color: "#555",
  },
  editButton: {
    backgroundColor: "#ffb300",
    padding: 10,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },
  editButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-start",
  },
  modalContainer: {
    marginTop: 50,
    backgroundColor: "#f5f5f5",
    padding: 20,
    borderRadius: 10,
    marginHorizontal: 20,
  },
  modalHeader: {
    fontSize: 15,
    fontWeight: "500",
    color: "#333",
    textAlign: "center",
  },
  label: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
  },
  input: {
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 16,
    padding: 10,
    paddingVertical: 7,
    fontSize: 13,
    color: "#555",
    backgroundColor: "#fff",
  },
  dateInput: {
    paddingVertical: 12,
    paddingLeft: 15,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: "#ffb300",
    padding: 10,
    borderRadius: 5,
    width: "45%",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#dc3545",
    padding: 10,
    borderRadius: 5,
    width: "45%",
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "500",
  },
});

export default ProfileScreen;
